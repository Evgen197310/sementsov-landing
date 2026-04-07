"use client";

import { useState, useRef } from "react";
import { Upload, Sparkles, FileText, Image, X, Loader2 } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  onResult: (data: Record<string, any>) => void;
}

export default function AiDropZone({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSet(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  };

  const validateAndSet = (f: File) => {
    const name = f.name.toLowerCase();
    const valid = name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc") ||
      name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
    if (!valid) {
      setError("Поддерживаются PDF, DOCX, JPG, PNG");
      return;
    }
    if (f.size > 120 * 1024 * 1024) {
      setError("Файл слишком большой (макс. 120 МБ)");
      return;
    }
    setFile(f);
    setError("");
    setProvider(null);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setGenerating(true);
    setError("");
    setProvider(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai-generate", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        let msg = `Ошибка ${res.status}`;
        try { msg = JSON.parse(text).error || msg; } catch { /* ok */ }
        throw new Error(msg);
      }
      const json = await res.json();
      setProvider(json.provider);
      onResult(json.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdf")) return <FileText className="w-8 h-8 text-red-400" />;
    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) return <Image className="w-8 h-8 text-blue-400" />;
    return <FileText className="w-8 h-8 text-[#c9a962]" />;
  };

  return (
    <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#c9a962]" />
        <h3 className="text-sm font-semibold text-[#c9a962]">AI-генерация дела</h3>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          file
            ? "border-[#c9a962]/50 bg-[#c9a962]/5"
            : "border-[#1e3a51] hover:border-[#c9a962]/30 bg-[#0b1c2b]/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            {getFileIcon()}
            <div className="text-left">
              <div className="text-sm text-[#f5f3f0] font-medium">{file.name}</div>
              <div className="text-xs text-[#5a6f80]">{(file.size / 1024).toFixed(0)} КБ</div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setProvider(null); }}
              className="text-[#5a6f80] hover:text-red-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-[#5a6f80] mx-auto mb-2" />
            <p className="text-sm text-[#8b9caa]">Перетащите PDF, DOCX или изображение</p>
            <p className="text-xs text-[#5a6f80] mt-1">AI проанализирует документ и заполнит поля</p>
          </>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-2.5 rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Анализирую документ…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Сгенерировать карточку дела</>
          )}
        </button>
      )}

      {provider && (
        <p className="text-xs text-[#5a6f80] text-center mt-2">
          Использован: {provider === "claude" ? "Claude (Anthropic)" : "GPT-4o (OpenAI)"}
        </p>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
