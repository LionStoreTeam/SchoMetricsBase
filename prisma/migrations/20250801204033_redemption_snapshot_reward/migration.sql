/*
  Warnings:

  - Added the required column `rewardCategory` to the `Redemption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardDesc` to the `Redemption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardPoints` to the `Redemption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardTitle` to the `Redemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Redemption" ADD COLUMN     "rewardCategory" "public"."RewardCategory" NOT NULL,
ADD COLUMN     "rewardDesc" TEXT NOT NULL,
ADD COLUMN     "rewardExpiresAt" TIMESTAMP(3),
ADD COLUMN     "rewardPoints" INTEGER NOT NULL,
ADD COLUMN     "rewardQuantity" INTEGER,
ADD COLUMN     "rewardTitle" TEXT NOT NULL;
