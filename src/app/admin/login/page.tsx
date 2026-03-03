"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка авторизации");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1c2b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Lock className="w-10 h-10 text-[#c9a962] mx-auto mb-4" />
          <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
            Админ-панель
          </h1>
          <p className="text-[#8b9caa] text-sm mt-1">МКА «Семенцов и Партнёры»</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
