-- CreateTable
CREATE TABLE "public"."ValidationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "ValidationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ValidationToken_userId_idx" ON "public"."ValidationToken"("userId");

-- CreateIndex
CREATE INDEX "ValidationToken_expiresAt_idx" ON "public"."ValidationToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."ValidationToken" ADD CONSTRAINT "ValidationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
