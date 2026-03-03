"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { getIcon, suggestIcon, SUGGESTED_ICONS, ICON_NAMES } from "@/lib/icons";
import { Wand2, ChevronDown, Search, X } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  itemTitle?: string;
  itemDescription?: string;
  label?: string;
  fallback?: string;
}

const ICONS_PER_PAGE = 80;

export default function IconPicker({
  value,
  onChange,
  itemTitle = "",
  itemDescription = "",
  label = "Иконка",
  fallback = "FileText",
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const CurrentIcon = getIcon(value, fallback);

  const handleAutoSuggest = useCallback(() => {
    const suggested = suggestIcon(itemTitle, itemDescription, fallback);
    onChange(suggested);
  }, [itemTitle, itemDescription, fallback, onChange]);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  const displayedOtherIcons = useMemo(() => {
    const suggested = new Set(SUGGESTED_ICONS);
    const others = ICON_NAMES.filter((n) => !suggested.has(n));
    return showAll ? others : others.slice(0, ICONS_PER_PAGE);
  }, [showAll]);

  const hasMore = useMemo(() => {
    const suggested = new Set(SUGGESTED_ICONS);
    return ICON_NAMES.filter((n) => !suggested.has(n)).length > ICONS_PER_PAGE;
  }, []);

  const selectIcon = (name: string) => {
    onChange(name);
    setOpen(false);
    setSearch("");
    setShowAll(false);
  };

  return (
    <div className="mb-3 relative" ref={panelRef}>
      <label className="block text-xs text-[#8b9caa] mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 flex-1 bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] hover:border-[#c9a962] transition-colors text-left"
        >
          <CurrentIcon className="w-4 h-4 text-[#c9a962] flex-shrink-0" />
          <span className="flex-1 truncate">{value || "—"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#8b9caa] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleAutoSuggest}
          className="flex items-center gap-1 bg-[#c9a962]/15 text-[#c9a962] hover:bg-[#c9a962]/25 py-2.5 px-2.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
          title="Подобрать по содержимому"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Авто</span>
        </button>
      </div>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#0f2133] border border-[#1e3a51] rounded-xl shadow-2xl max-h-[400px] overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[#1e3a51] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8b9caa] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
              placeholder="Поиск иконки..."
              className="flex-1 bg-transparent text-sm text-[#f5f3f0] placeholder-[#5a6f80] outline-none"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-[#8b9caa] hover:text-[#f5f3f0]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {filteredIcons !== null ? (
              filteredIcons.length === 0 ? (
                <p className="text-xs text-[#8b9caa] text-center py-4">Ничего не найдено</p>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                  {filteredIcons.slice(0, 200).map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => selectIcon(name)}
                        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
                          value === name ? "bg-[#c9a962]/20 ring-1 ring-[#c9a962]/50" : "hover:bg-[#1e3a51]/50"
                        }`}
                        title={name}
                      >
                        <Icon className="w-5 h-5 text-[#c9a962]" />
                        <span className="text-[9px] text-[#8b9caa] truncate w-full text-center leading-tight">{name}</span>
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <>
                <div className="mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8b9caa] font-medium px-1">Рекомендуемые</span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 mb-3">
                  {SUGGESTED_ICONS.map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => selectIcon(name)}
                        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
                          value === name ? "bg-[#c9a962]/20 ring-1 ring-[#c9a962]/50" : "hover:bg-[#1e3a51]/50"
                        }`}
                        title={name}
                      >
                        <Icon className="w-5 h-5 text-[#c9a962]" />
                        <span className="text-[9px] text-[#8b9caa] truncate w-full text-center leading-tight">{name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mb-2 pt-2 border-t border-[#1e3a51]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8b9caa] font-medium px-1">Все иконки</span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                  {displayedOtherIcons.map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => selectIcon(name)}
                        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors ${
                          value === name ? "bg-[#c9a962]/20 ring-1 ring-[#c9a962]/50" : "hover:bg-[#1e3a51]/50"
                        }`}
                        title={name}
                      >
                        <Icon className="w-5 h-5 text-[#c9a962]" />
                        <span className="text-[9px] text-[#8b9caa] truncate w-full text-center leading-tight">{name}</span>
                      </button>
                    );
                  })}
                </div>
                {hasMore && !showAll && (
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="w-full text-center text-xs text-[#c9a962] hover:text-[#ddc488] py-2 mt-2 transition-colors"
                  >
                    Показать все ({ICON_NAMES.length - SUGGESTED_ICONS.length})
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
