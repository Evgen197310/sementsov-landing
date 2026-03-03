import { icons } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Resolve a Lucide icon component by name.
 * Returns the fallback icon if the name is not found.
 */
export function getIcon(name: string, fallback: string = "FileText"): LucideIcon {
  return (
    (icons as Record<string, LucideIcon>)[name] ||
    (icons as Record<string, LucideIcon>)[fallback] ||
    (icons as Record<string, LucideIcon>).FileText
  );
}

/** All available Lucide icon names, sorted */
export const ICON_NAMES: string[] = Object.keys(icons).sort();

/** Curated subset of icons relevant to a law firm site */
export const SUGGESTED_ICONS: string[] = [
  "Scale", "Shield", "Gavel", "Landmark", "Building2", "FileText",
  "Users", "Banknote", "AlertTriangle", "Search", "Siren", "Target",
  "Clock", "Handshake", "MessageSquare", "FileCheck", "Briefcase",
  "BookOpen", "Lock", "Eye", "Award", "Phone", "Mail",
  "CheckCircle", "ChevronRight", "ArrowRight",
];

interface IconRule {
  keywords: RegExp;
  icon: string;
}

const ICON_RULES: IconRule[] = [
  { keywords: /обыск|следств|дослед|изъят/i, icon: "Search" },
  { keywords: /уголовн|преступл|ук\s*рф|лишен.*свобод/i, icon: "Siren" },
  { keywords: /суд|судебн|процесс|инстанц|апелляц|кассац/i, icon: "Gavel" },
  { keywords: /верховн|вс\s*рф|прецедент/i, icon: "Landmark" },
  { keywords: /банкротств|несостоятельн|конкурсн|реестр.*кредитор/i, icon: "Scale" },
  { keywords: /субсидиарн|ответственност.*руковод|контролирующ/i, icon: "AlertTriangle" },
  { keywords: /защит|безопасн|охран|сохран.*актив/i, icon: "Shield" },
  { keywords: /взыскан|долг|кредит|денег|деньги|комисси|платёж/i, icon: "Banknote" },
  { keywords: /документ|договор|акт|сделк|оспарив/i, icon: "FileText" },
  { keywords: /компани|бизнес|корпоратив|юрлиц|участник/i, icon: "Building2" },
  { keywords: /рейдер|захват/i, icon: "Target" },
  { keywords: /имущество|актив|недвижим|залог/i, icon: "Landmark" },
  { keywords: /акционер|партнёр|доля|миноритар/i, icon: "Users" },
  { keywords: /звон|связ|обсужд|консультац|рассказ/i, icon: "MessageSquare" },
  { keywords: /анализ|оценк|риск|изуча/i, icon: "Search" },
  { keywords: /стратеги|план|этап/i, icon: "Target" },
  { keywords: /время|срок|давност|экономи/i, icon: "Clock" },
  { keywords: /результат|итог|решен|фокус/i, icon: "CheckCircle" },
  { keywords: /проверк|аудит/i, icon: "FileCheck" },
  { keywords: /рукопожат|соглаш|договорён|работа.*на.*результат/i, icon: "Handshake" },
  { keywords: /предупрежден|угроз|опасн|возбужден/i, icon: "AlertTriangle" },
];

export function suggestIcon(title: string, description?: string, fallback: string = "FileText"): string {
  const text = `${title} ${description || ""}`.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.test(text)) {
      return rule.icon;
    }
  }
  return fallback;
}
