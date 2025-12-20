import { auth } from "@/auth";
import SettingsContent from "./settings-content";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
  }

  // Fallback or merge
  const user = dbUser ? {
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
    substackUrl: dbUser.substackUrl, // Fetch connect status
  } : (session?.user || { name: 'Guest', email: 'guest@example.com', image: null });

  return <SettingsContent user={user as any} />;
}
