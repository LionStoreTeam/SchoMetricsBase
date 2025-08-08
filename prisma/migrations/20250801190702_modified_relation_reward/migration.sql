-- DropForeignKey
ALTER TABLE "public"."Redemption" DROP CONSTRAINT "Redemption_rewardId_fkey";

-- AlterTable
ALTER TABLE "public"."Redemption" ALTER COLUMN "rewardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Redemption" ADD CONSTRAINT "Redemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "public"."Reward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
