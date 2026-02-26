import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllTeam, getAllServices, getAllCases, getAbout, getAllAdvantages, getContacts, getHero } from "@/lib/db";
import AdminPageClient from "./AdminPageClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const team = getAllTeam();
  const services = getAllServices();
  const cases = getAllCases();
  const aboutData = getAbout();
  const advantages = getAllAdvantages();
  const contacts = getContacts();
  const hero = getHero();

  return (
    <AdminPageClient
      user={user}
      initialData={{
        team,
        services,
        cases,
        about: aboutData || null,
        advantages,
        contacts: contacts || null,
        hero: hero || null,
      }}
    />
  );
}
