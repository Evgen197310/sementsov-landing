-- CreateTable
CREATE TABLE "SocialLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Document" ("content", "fileUrl", "id", "slug", "title") SELECT "content", "fileUrl", "id", "slug", "title" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_slug_key" ON "Document"("slug");
CREATE TABLE "new_MediaArticle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,
    CONSTRAINT "MediaArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MediaCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MediaArticle" ("categoryId", "content", "createdAt", "excerpt", "id", "slug", "source", "tags", "title") SELECT "categoryId", "content", "createdAt", "excerpt", "id", "slug", "source", "tags", "title" FROM "MediaArticle";
DROP TABLE "MediaArticle";
ALTER TABLE "new_MediaArticle" RENAME TO "MediaArticle";
CREATE UNIQUE INDEX "MediaArticle_slug_key" ON "MediaArticle"("slug");
CREATE TABLE "new_MediaCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_MediaCategory" ("description", "id", "name", "slug") SELECT "description", "id", "name", "slug" FROM "MediaCategory";
DROP TABLE "MediaCategory";
ALTER TABLE "new_MediaCategory" RENAME TO "MediaCategory";
CREATE UNIQUE INDEX "MediaCategory_slug_key" ON "MediaCategory"("slug");
CREATE TABLE "new_Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Partner" ("description", "email", "id", "name", "order", "website") SELECT "description", "email", "id", "name", "order", "website" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
CREATE TABLE "new_PracticeCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "situation" TEXT NOT NULL DEFAULT '',
    "actions" TEXT NOT NULL DEFAULT '',
    "result" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,
    CONSTRAINT "PracticeCase_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PracticeCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PracticeCase" ("actions", "categoryId", "content", "createdAt", "excerpt", "id", "result", "situation", "slug", "tags", "title") SELECT "actions", "categoryId", "content", "createdAt", "excerpt", "id", "result", "situation", "slug", "tags", "title" FROM "PracticeCase";
DROP TABLE "PracticeCase";
ALTER TABLE "new_PracticeCase" RENAME TO "PracticeCase";
CREATE UNIQUE INDEX "PracticeCase_slug_key" ON "PracticeCase"("slug");
CREATE TABLE "new_PracticeCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "attachments" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_PracticeCategory" ("description", "id", "name", "slug") SELECT "description", "id", "name", "slug" FROM "PracticeCategory";
DROP TABLE "PracticeCategory";
ALTER TABLE "new_PracticeCategory" RENAME TO "PracticeCategory";
CREATE UNIQUE INDEX "PracticeCategory_slug_key" ON "PracticeCategory"("slug");
CREATE TABLE "new_Publication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT 'kuklin',
    "attachments" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Publication" ("content", "createdAt", "id", "section", "slug", "title") SELECT "content", "createdAt", "id", "section", "slug", "title" FROM "Publication";
DROP TABLE "Publication";
ALTER TABLE "new_Publication" RENAME TO "Publication";
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
