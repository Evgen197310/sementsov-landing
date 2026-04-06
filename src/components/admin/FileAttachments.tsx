"use client";

import { useState, useRef } from "react";
import { Paperclip, Trash2, Upload, FileText, Image, Video } from "lucide-react";

export interface AttachmentItem {
  url: string;
  originalName: string;
  size: number;
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
  if (["png", "jpg", "jpeg"].includes(ext)) return <Image className="w-4 h-4 text-blue-400" />;
  if (["mp4", "mov", "avi"].includes(ext)) return <Video className="w-4 h-4 text-purple-400" />;
  if (["pdf"].includes(ext)) return <FileText className="w-4 h-4 text-red-400" />;
  return <FileText className="w-4 h-4 text-[#c9a962]" />;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  max?: number;
}

export function FileAttachments({ value, onChange, max = 5 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const items = parseAttachments(value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    const remaining = max - items.length;
    if (remaining <= 0) {
      setError(`Максимум ${max} файлов`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    setUploading(true);
    setError("");

    try {
      const res = await fetch("/api/upload/files", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка загрузки");
        return;
      }
      const updated = [...items, ...data];
      onChange(JSON.stringify(updated));
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated.length ? JSON.stringify(updated) : "");
  };

  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-2 block flex items-center gap-1.5">
        <Paperclip className="w-3.5 h-3.5" />
        Вложения ({items.length}/{max})
      </label>

      {items.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg px-3 py-2">
              <FileIcon name={item.originalName} />
              <div className="flex-1 min-w-0">
                <div className="text-[#f5f3f0] text-xs truncate">{item.originalName}</div>
                <div className="text-[#5a6f80] text-[10px]">{formatSize(item.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1 text-[#5a6f80] hover:text-red-400 flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length < max && (
        <label className="flex items-center gap-2 cursor-pointer text-[#c9a962] text-xs hover:text-[#ddc488] transition-colors">
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Загрузка..." : "Добавить файл"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.avi,.mp4,.mov"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export { parseAttachments };
