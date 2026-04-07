#!/usr/bin/env python3
"""
Batch AI processing: sends practice cases and publications to Claude API
for content generation/improvement.
"""

import sqlite3
import json
import base64
import re
import time
import sys
import os
import urllib.request
import urllib.error

# ── Config ──────────────────────────────────────────────────────────
DB_PATH = '/var/lib/docker/volumes/sementsov_landing_sementsov-data/_data/prod.db'
FILES_DIR = '/var/lib/docker/volumes/sementsov_landing_sementsov-data/_data/uploads/files'
ANTHROPIC_API_KEY = 'REMOVED_ANTHROPIC_KEY'
MODEL = 'claude-sonnet-4-20250514'

# ── Prompts ─────────────────────────────────────────────────────────
PRACTICE_PROMPT = """You are a content writer for the law firm "МКА «Семенцов и партнёры»" website. Your task is to create website content about judicial practice and court decisions achieved by the law firm.

You will be provided with a court document or legal decision.

Your task is to create structured content based on this document.

Before writing your final response, analyze the document:

<scratchpad>
- Identify the key achievement or favorable outcome
- Note what the court/authority decided
- Identify the main parties involved (client name if visible, courts, opposing party)
- Determine the significance of the decision
- Identify the category: ЕСПЧ (strasburg), гражданская коллегия ВС РФ (civil), экономическая коллегия ВС РФ (ekonom), Председатель ВС РФ Подносова (podnosova)
- Plan the headline and description structure
</scratchpad>

Guidelines:
- The headline (title) should be concise (up to 120 characters), informative, and highlight the positive outcome or achievement for the client. Do NOT start with "Дело о..."
- The excerpt should be 2-3 sentences summarizing the case and its favorable outcome, displayed as a card preview
- The description (content) should be 3-4 paragraphs covering: the background/context, what was at stake, what the court decided, and the significance of this decision
- The result should start with a verb: Отменено, Взыскано, Удовлетворена, Направлено, etc.
- Focus on clarity and accessibility — the content should be understandable to potential clients, not just legal professionals
- Emphasize the law firm's achievement and the favorable outcome
- Write in Russian

Context about the firm:
- МКА «Семенцов и партнёры» specializes in: Supreme Court cases (civil & economic chambers), ECHR (Strasbourg), criminal defense, arbitration, bankruptcy
- Categories: "strasburg" (ЕСПЧ), "civil" (СК по гражданским делам ВС РФ), "ekonom" (СК по экономическим спорам ВС РФ), "podnosova" (определения Председателя ВС РФ Подносовой И.Л.)

Provide your response as strictly valid JSON (no comments outside JSON):

{
  "title": "Краткий заголовок, отражающий достижение",
  "excerpt": "2-3 предложения для превью карточки",
  "content": "Описание в 3-4 абзаца, абзацы разделены \\n\\n",
  "result": "1-2 предложения, начиная с глагола",
  "situation": "1-2 предложения об исходной проблеме",
  "actions": "1-2 предложения о действиях адвокатов",
  "tags": "тег1, тег2, тег3",
  "categorySlug": "civil | ekonom | strasburg | podnosova"
}"""

PUBLICATION_PROMPT = """You are a content editor for the law firm "МКА «Семенцов и партнёры»" website. Your task is to create a concise headline and description for an article or publication.

You will be provided with the text of an article.

Before writing your final response, analyze the article:

<scratchpad>
- Identify the main topic and thesis
- Note the key arguments or points made
- Determine the target audience
- Plan a compelling headline
</scratchpad>

Guidelines:
- The headline should be concise, informative, and capture the essence of the article
- The description (excerpt) should be 2-3 sentences summarizing the article's main points and significance
- Focus on clarity and accessibility
- Write in Russian

Provide your response as strictly valid JSON (no comments outside JSON):

{
  "headline": "Краткий заголовок, передающий суть статьи",
  "description": "2-3 предложения — краткое описание статьи для превью"
}"""


def strip_html(html):
    """Remove HTML tags, decode entities, clean whitespace."""
    text = re.sub(r'<[^>]+>', ' ', html)
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_image_filenames(html):
    """Extract image filenames from HTML content (src="/api/uploads/files/XXX")."""
    matches = re.findall(r'src="/api/uploads/files/([^"]+)"', html)
    return matches


def read_file_as_base64(filename):
    """Read a file from the uploads directory and return base64 encoded content."""
    filepath = os.path.join(FILES_DIR, filename)
    if not os.path.exists(filepath):
        print(f"    WARNING: File not found: {filepath}")
        return None
    with open(filepath, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def get_media_type(filename):
    """Get MIME type from filename."""
    ext = filename.lower().rsplit('.', 1)[-1]
    return {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'png': 'image/png', 'webp': 'image/webp',
        'pdf': 'application/pdf',
    }.get(ext, 'application/octet-stream')


def call_claude(system_prompt, user_content):
    """Call Claude API with given system prompt and user content blocks."""
    data = json.dumps({
        'model': MODEL,
        'max_tokens': 4096,
        'system': system_prompt,
        'messages': [{'role': 'user', 'content': user_content}],
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=data,
        headers={
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"    API Error {e.code}: {error_body[:300]}")
        raise

    text_block = next((b for b in body.get('content', []) if b.get('type') == 'text'), None)
    if not text_block or not text_block.get('text'):
        raise ValueError("Claude returned empty response")
    return text_block['text']


def extract_json(text):
    """Extract JSON object from Claude's response (handles scratchpad + JSON)."""
    # Try to find JSON after </scratchpad> or <output> tags
    for marker in ['</scratchpad>', '</output>', '<output>']:
        idx = text.find(marker)
        if idx >= 0:
            text = text[idx + len(marker):]
            break

    # Try code block first
    m = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if m:
        return json.loads(m.group(1).strip())

    # Try raw JSON object
    m = re.search(r'\{[\s\S]*\}', text)
    if m:
        return json.loads(m.group(0))

    raise ValueError(f"No JSON found in response: {text[:200]}")


def process_practice_case(case_id, title, content, attachments_json):
    """Process a single practice case through Claude."""
    print(f"\n  Processing practice #{case_id}: {title[:60]}")

    # Parse attachments
    attachments = []
    try:
        attachments = json.loads(attachments_json) if attachments_json else []
    except:
        pass

    # Determine what to send to Claude
    user_content = []

    # 1. Check for PDF attachments
    pdf_atts = [a for a in attachments
                if (a.get('originalName', '') or a.get('url', '')).lower().endswith('.pdf')]
    if pdf_atts:
        pdf_filename = pdf_atts[0].get('originalName', '') or pdf_atts[0]['url'].split('/')[-1]
        pdf_b64 = read_file_as_base64(pdf_filename)
        if pdf_b64:
            user_content.append({
                'type': 'document',
                'source': {'type': 'base64', 'media_type': 'application/pdf', 'data': pdf_b64},
            })
            print(f"    → Sending PDF: {pdf_filename}")

    # 2. Check for inline images (scans) in content
    if content:
        image_files = extract_image_filenames(content)
        # Send up to 5 images to avoid token limits
        for img_file in image_files[:5]:
            img_b64 = read_file_as_base64(img_file)
            if img_b64:
                mt = get_media_type(img_file)
                user_content.append({
                    'type': 'image',
                    'source': {'type': 'base64', 'media_type': mt, 'data': img_b64},
                })
        if image_files:
            print(f"    → Sending {min(len(image_files), 5)} inline images")

    # 3. Check for image attachments
    img_atts = [a for a in attachments
                if re.search(r'\.(jpg|jpeg|png)$', a.get('originalName', '') or a.get('url', ''), re.I)]
    for att in img_atts:
        fname = att.get('originalName', '') or att['url'].split('/')[-1]
        img_b64 = read_file_as_base64(fname)
        if img_b64:
            mt = get_media_type(fname)
            user_content.append({
                'type': 'image',
                'source': {'type': 'base64', 'media_type': mt, 'data': img_b64},
            })
            print(f"    → Sending image attachment: {fname}")

    # 4. Add text content if available
    text_content = strip_html(content) if content else ""
    if text_content and len(text_content) > 50:
        user_content.append({
            'type': 'text',
            'text': f'<document>\n{text_content}\n</document>\n\nПроанализируй документ и создай карточку дела в формате JSON.',
        })
        print(f"    → Sending text content: {len(text_content)} chars")
    elif user_content:
        # We have images/PDFs but no useful text
        user_content.append({
            'type': 'text',
            'text': 'Проанализируй этот документ и создай карточку дела в формате JSON согласно инструкции.',
        })
    else:
        print(f"    SKIP: No content to process")
        return None

    response_text = call_claude(PRACTICE_PROMPT, user_content)
    result = extract_json(response_text)
    print(f"    ✓ Generated: title=\"{result.get('title', '')[:60]}\"")
    return result


def process_publication(article_id, title, content, table='NewsArticle'):
    """Process a single publication/news through Claude."""
    print(f"\n  Processing {table} #{article_id}: {title[:60]}")

    text = strip_html(content) if content else ""
    if len(text) < 100:
        print(f"    SKIP: Content too short ({len(text)} chars)")
        return None

    # Truncate very long texts
    if len(text) > 30000:
        text = text[:30000] + "..."

    user_content = f'<document>\n{text}\n</document>\n\nСоздай заголовок и описание для этой статьи в формате JSON.'

    response_text = call_claude(PUBLICATION_PROMPT, [{'type': 'text', 'text': user_content}])
    result = extract_json(response_text)
    print(f"    ✓ Generated: headline=\"{result.get('headline', '')[:60]}\"")
    return result


def main():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # ═══ PRACTICE CASES ═══
    print("=" * 60)
    print("PROCESSING PRACTICE CASES")
    print("=" * 60)

    cur.execute("SELECT id, title, content, attachments FROM PracticeCase ORDER BY id")
    cases = cur.fetchall()

    practice_results = {}
    for case_id, title, content, attachments in cases:
        try:
            result = process_practice_case(case_id, title, content, attachments)
            if result:
                practice_results[case_id] = result
                time.sleep(2)  # Rate limiting
        except Exception as e:
            print(f"    ERROR: {e}")
            time.sleep(5)

    # Update DB for practice cases
    print("\n" + "=" * 60)
    print("UPDATING PRACTICE CASES IN DB")
    print("=" * 60)

    for case_id, data in practice_results.items():
        # Keep existing content if it has images, otherwise use AI content
        cur.execute("SELECT content FROM PracticeCase WHERE id=?", (case_id,))
        existing_content = cur.fetchone()[0] or ""
        has_images = '<img' in existing_content

        new_content = existing_content if has_images else data.get('content', existing_content)
        # If AI generated content and we have images, prepend AI text before images
        if has_images and data.get('content'):
            # Put AI description before the image gallery
            ai_text = data['content'].replace('\n\n', '</p>\n<p>')
            new_content = f"<p>{ai_text}</p>\n{existing_content}"

        cur.execute("""
            UPDATE PracticeCase SET
                title = ?,
                excerpt = ?,
                content = ?,
                result = ?,
                situation = ?,
                actions = ?,
                tags = ?
            WHERE id = ?
        """, (
            data.get('title', ''),
            data.get('excerpt', ''),
            new_content,
            data.get('result', ''),
            data.get('situation', ''),
            data.get('actions', ''),
            data.get('tags', ''),
            case_id,
        ))
        print(f"  ✓ Updated practice #{case_id}: {data.get('title', '')[:60]}")

    conn.commit()

    # ═══ PUBLICATIONS ═══
    print("\n" + "=" * 60)
    print("PROCESSING PUBLICATIONS")
    print("=" * 60)

    cur.execute("SELECT id, title, content FROM Publication ORDER BY id")
    pubs = cur.fetchall()
    for pub_id, title, content in pubs:
        try:
            result = process_publication(pub_id, title, content, 'Publication')
            if result:
                cur.execute("UPDATE Publication SET title=? WHERE id=?",
                            (result.get('headline', title), pub_id))
                print(f"  ✓ Updated publication #{pub_id}")
                time.sleep(2)
        except Exception as e:
            print(f"    ERROR: {e}")
            time.sleep(5)

    conn.commit()

    # ═══ NEWS ═══
    print("\n" + "=" * 60)
    print("PROCESSING NEWS ARTICLES")
    print("=" * 60)

    cur.execute("SELECT id, title, content FROM NewsArticle ORDER BY id")
    news = cur.fetchall()
    for news_id, title, content in news:
        try:
            result = process_publication(news_id, title, content, 'NewsArticle')
            if result:
                cur.execute("UPDATE NewsArticle SET excerpt=? WHERE id=?",
                            (result.get('description', ''), news_id))
                print(f"  ✓ Updated news #{news_id} excerpt")
                time.sleep(2)
        except Exception as e:
            print(f"    ERROR: {e}")
            time.sleep(5)

    conn.commit()
    conn.close()

    print("\n" + "=" * 60)
    print(f"DONE. Practice: {len(practice_results)}, Publications: {len(pubs)}, News: {len(news)}")
    print("=" * 60)


if __name__ == '__main__':
    main()
