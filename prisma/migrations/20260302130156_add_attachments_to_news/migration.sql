-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsArticle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT 'news',
    "attachments" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_NewsArticle" ("content", "createdAt", "excerpt", "id", "section", "slug", "title") SELECT "content", "createdAt", "excerpt", "id", "section", "slug", "title" FROM "NewsArticle";
DROP TABLE "NewsArticle";
ALTER TABLE "new_NewsArticle" RENAME TO "NewsArticle";
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
