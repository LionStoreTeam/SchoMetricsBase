/*
  Warnings:

  - You are about to drop the column `status` on the `Redemption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Redemption" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."RedemptionStatus";
