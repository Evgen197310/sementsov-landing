"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/team", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Ошибка загрузки"); return; }
      onChange(data.url);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }, [upload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }, [upload]);

  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-1 block">Фото</label>

      {value ? (
        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-[#1e3a51]/50 group">
          <Image src={value} alt="Фото" fill className="object-cover" sizes="128px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
          >
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Заменить</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
            ${dragOver ? "border-[#c9a962] bg-[#c9a962]/10" : "border-[#1e3a51]/50 hover:border-[#c9a962]/50"}
          `}
        >
          {uploading ? (
            <div className="text-[#c9a962] text-sm">Загрузка...</div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-[#5a6f80]" />
              <p className="text-[#8b9caa] text-sm text-center">
                Перетащите фото сюда или <span className="text-[#c9a962]">выберите файл</span>
              </p>
              <p className="text-[#5a6f80] text-xs">JPEG, PNG, WebP до 5 МБ</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
