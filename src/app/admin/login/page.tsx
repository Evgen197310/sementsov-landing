"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка входа");
      }
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0b1c2b 0%, #1e3a51 50%, #0b1c2b 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-[#efebe8] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Семенцов и Партнёры
          </h1>
          <p className="text-[#c9a962] text-sm uppercase tracking-widest">
            Панель администратора
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0f2435]/80 backdrop-blur-md rounded-2xl p-8 border border-[#1e3a51]/50"
        >
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm text-[#7f97a5] mb-2">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3 text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors"
              placeholder="Введите логин"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-[#7f97a5] mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3 text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-900/30 border border-red-500/50 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a962]/30 disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
