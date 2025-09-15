-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionId" TEXT,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Bookmark_userId_type_idx" ON "Bookmark"("userId", "type");

-- CreateIndex
CREATE INDEX "Bookmark_sessionId_type_idx" ON "Bookmark"("sessionId", "type");

-- CreateIndex
CREATE INDEX "Bookmark_type_itemId_idx" ON "Bookmark"("type", "itemId");
