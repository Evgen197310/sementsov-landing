import { FileText, Image, Video, Download } from "lucide-react";

interface AttachmentItem {
  url: string;
  originalName?: string;
  name?: string;
  size: number;
}

function displayName(item: AttachmentItem): string {
  return item.originalName || item.name || item.url.split("/").pop() || "file";
}

function parseAttachments(raw: string): AttachmentItem[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg"].includes(ext)) return <Image className="w-5 h-5 text-blue-400" />;
  if (["mp4", "mov", "avi"].includes(ext)) return <Video className="w-5 h-5 text-purple-400" />;
  if (["pdf"].includes(ext)) return <FileText className="w-5 h-5 text-red-400" />;
  return <FileText className="w-5 h-5 text-[#c9a962]" />;
}

export function PublicAttachments({ attachments }: { attachments: string }) {
  const items = parseAttachments(attachments);
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-[#c9a962] text-sm font-semibold mb-3 flex items-center gap-2">
        <Download className="w-4 h-4" />
        Прикреплённые файлы
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            download={displayName(item)}
            className="flex items-center gap-3 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg px-4 py-3 hover:border-[#c9a962]/30 transition-colors group"
          >
            <FileIcon name={displayName(item)} />
            <div className="flex-1 min-w-0">
              <div className="text-[#f5f3f0] text-sm truncate group-hover:text-[#c9a962] transition-colors">
                {displayName(item)}
              </div>
              <div className="text-[#5a6f80] text-xs">{formatSize(item.size)}</div>
            </div>
            <Download className="w-4 h-4 text-[#5a6f80] group-hover:text-[#c9a962] transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
