-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaArticle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,
    CONSTRAINT "MediaArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MediaCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MediaArticle" ("categoryId", "content", "createdAt", "excerpt", "id", "slug", "tags", "title") SELECT "categoryId", "content", "createdAt", "excerpt", "id", "slug", "tags", "title" FROM "MediaArticle";
DROP TABLE "MediaArticle";
ALTER TABLE "new_MediaArticle" RENAME TO "MediaArticle";
CREATE UNIQUE INDEX "MediaArticle_slug_key" ON "MediaArticle"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
