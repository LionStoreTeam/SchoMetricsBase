-- AlterTable
ALTER TABLE "public"."Redemption" ALTER COLUMN "rewardCategory" DROP NOT NULL,
ALTER COLUMN "rewardDesc" DROP NOT NULL,
ALTER COLUMN "rewardPoints" DROP NOT NULL,
ALTER COLUMN "rewardTitle" DROP NOT NULL;
