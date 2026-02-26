"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

interface Props {
  currentUser: { id: string; username: string; role: string };
}

export default function UsersPageClient({ currentUser }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [error, setError] = useState("");
  const [superadminCount, setSuperadminCount] = useState(0);
  const [passwordModal, setPasswordModal] = useState<{ userId: string; username: string } | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      setSuperadminCount(data.filter((u: User) => u.role === "superadmin").length);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleAdd = async () => {
    setError("");
    if (!newUsername || !newPassword) { setError("Заполните все поля"); return; }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
    });
    if (res.ok) {
      setShowAdd(false);
      setNewUsername("");
      setNewPassword("");
      setNewRole("admin");
      await loadUsers();
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка");
    }
  };

  const handleToggleRole = async (user: User) => {
    const newUserRole = user.role === "superadmin" ? "admin" : "superadmin";
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, role: newUserRole }),
    });
    if (res.ok) {
      await loadUsers();
    } else {
      const data = await res.json();
      alert(data.error || "Ошибка");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Удалить пользователя ${user.username}?`)) return;
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    if (res.ok) {
      await loadUsers();
    } else {
      const data = await res.json();
      alert(data.error || "Ошибка");
    }
  };

  const openPasswordModal = (user: User) => {
    setPasswordModal({ userId: user.id, username: user.username });
    setNewUserPassword("");
    setConfirmUserPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!newUserPassword) { setPasswordError("Введите новый пароль"); return; }
    if (newUserPassword.length < 4) { setPasswordError("Пароль должен быть не менее 4 символов"); return; }
    if (newUserPassword !== confirmUserPassword) { setPasswordError("Пароли не совпадают"); return; }
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: passwordModal!.userId, password: newUserPassword }),
    });
    if (res.ok) {
      setPasswordSuccess("Пароль успешно изменён");
      setTimeout(() => setPasswordModal(null), 1500);
    } else {
      const data = await res.json();
      setPasswordError(data.error || "Ошибка");
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const canToggleRole = (user: User) => {
    if (user.id === currentUser.id) return false;
    if (user.role === "superadmin" && superadminCount <= 1) return false;
    return true;
  };

  const canDelete = (user: User) => {
    if (user.id === currentUser.id) return false;
    if (user.role === "superadmin" && superadminCount <= 1) return false;
    return true;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0b1c2b 0%, #1e3a51 50%, #0b1c2b 100%)" }}>
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0b1c2b]/95 backdrop-blur-md border-b border-[#c9a962]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-[#c9a962] font-bold text-sm" style={{ fontFamily: "Playfair Display, serif" }}>
              ← АДМИН-ПАНЕЛЬ
            </a>
            <span className="text-[#efebe8] text-sm font-medium">Управление пользователями</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7f97a5]">{currentUser.username}</span>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">Выйти</button>
          </div>
        </div>
      </div>

      <div className="pt-14 max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
            Пользователи
          </h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-2 px-5 rounded-full text-sm transition-all"
          >
            + Добавить
          </button>
        </div>

        {/* Add user form */}
        {showAdd && (
          <div className="bg-[#0f2435]/80 backdrop-blur-md rounded-2xl p-6 border border-[#1e3a51]/50 mb-6">
            <h3 className="text-lg font-semibold text-[#efebe8] mb-4">Новый пользователь</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#7f97a5] mb-1">Логин</label>
                <input
                  className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] focus:border-[#c9a962] focus:outline-none"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[#7f97a5] mb-1">Пароль</label>
                <input
                  type="password"
                  className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] focus:border-[#c9a962] focus:outline-none"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[#7f97a5] mb-1">Роль</label>
                <select
                  className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] focus:border-[#c9a962] focus:outline-none"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                >
                  <option value="admin">Админ</option>
                  <option value="superadmin">Суперадмин</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex gap-3">
              <button onClick={handleAdd} className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-2 px-5 rounded-full text-sm">
                Создать
              </button>
              <button onClick={() => { setShowAdd(false); setError(""); }} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Users list */}
        <div className="space-y-3">
          {users.map(user => (
            <div
              key={user.id}
              className="bg-[#0f2435]/60 backdrop-blur-md rounded-xl p-4 border border-[#1e3a51]/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.role === "superadmin" ? "bg-[#c9a962]/20 text-[#c9a962]" : "bg-[#1e3a51]/40 text-[#7f97a5]"
                }`}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[#efebe8] font-medium text-sm flex items-center gap-2">
                    {user.username}
                    {user.id === currentUser.id && (
                      <span className="text-[10px] text-[#c9a962] bg-[#c9a962]/10 px-1.5 py-0.5 rounded">вы</span>
                    )}
                  </div>
                  <div className="text-xs text-[#7f97a5]">
                    {user.role === "superadmin" ? "Суперадмин" : "Админ"} · {new Date(user.created_at).toLocaleDateString("ru")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPasswordModal(user)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#7f97a5]/50 text-[#7f97a5] hover:bg-[#7f97a5]/10 transition-colors"
                >
                  Сменить пароль
                </button>
                {canToggleRole(user) && (
                  <button
                    onClick={() => handleToggleRole(user)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      user.role === "superadmin"
                        ? "border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                        : "border-[#c9a962]/50 text-[#c9a962] hover:bg-[#c9a962]/10"
                    }`}
                  >
                    {user.role === "superadmin" ? "Забрать суперадмин" : "Дать суперадмин"}
                  </button>
                )}
                {canDelete(user) && (
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-xs px-3 py-1.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Password change modal */}
        {passwordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setPasswordModal(null)}>
            <div className="bg-[#0f2435] border border-[#1e3a51] rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[#1e3a51]/50">
                <h2 className="text-lg font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                  Сменить пароль: {passwordModal.username}
                </h2>
                <button onClick={() => setPasswordModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1e3a51] text-[#7f97a5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm text-[#7f97a5] mb-1.5">Новый пароль</label>
                  <input
                    type="password"
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] focus:border-[#c9a962] focus:outline-none"
                    value={newUserPassword}
                    onChange={e => setNewUserPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#7f97a5] mb-1.5">Подтвердите пароль</label>
                  <input
                    type="password"
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] focus:border-[#c9a962] focus:outline-none"
                    value={confirmUserPassword}
                    onChange={e => setConfirmUserPassword(e.target.value)}
                  />
                </div>
                {passwordError && <p className="text-red-400 text-sm mb-3">{passwordError}</p>}
                {passwordSuccess && <p className="text-green-400 text-sm mb-3">{passwordSuccess}</p>}
                <div className="flex gap-3">
                  <button onClick={handleChangePassword} className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-2 px-5 rounded-full text-sm">
                    Сохранить
                  </button>
                  <button onClick={() => setPasswordModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
