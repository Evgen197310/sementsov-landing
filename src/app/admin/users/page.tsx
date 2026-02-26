import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import UsersPageClient from "./UsersPageClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "superadmin") redirect("/admin");

  return <UsersPageClient currentUser={user} />;
}
