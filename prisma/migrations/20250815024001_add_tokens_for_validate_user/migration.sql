/*
  Warnings:

  - You are about to drop the `ValidationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ValidationToken" DROP CONSTRAINT "ValidationToken_userId_fkey";

-- DropTable
DROP TABLE "public"."ValidationToken";

-- CreateTable
CREATE TABLE "public"."validation_tokens_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validation_tokens_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "validation_tokens_user_token_key" ON "public"."validation_tokens_user"("token");
