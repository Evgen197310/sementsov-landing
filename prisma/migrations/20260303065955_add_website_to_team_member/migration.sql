-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '',
    "specialization" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "education" TEXT NOT NULL DEFAULT '',
    "experience" TEXT NOT NULL DEFAULT '',
    "photo" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_TeamMember" ("bio", "education", "experience", "id", "name", "order", "photo", "position", "slug", "specialization") SELECT "bio", "education", "experience", "id", "name", "order", "photo", "position", "slug", "specialization" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
