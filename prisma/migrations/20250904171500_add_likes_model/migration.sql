-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionId" TEXT,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Like_sessionId_idx" ON "Like"("sessionId");

-- CreateIndex
CREATE INDEX "Like_type_itemId_idx" ON "Like"("type", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_type_itemId_key" ON "Like"("userId", "type", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_sessionId_type_itemId_key" ON "Like"("sessionId", "type", "itemId");
