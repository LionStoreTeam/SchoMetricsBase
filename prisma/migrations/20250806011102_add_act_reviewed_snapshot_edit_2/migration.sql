-- DropForeignKey
ALTER TABLE "public"."ActivityReviewed" DROP CONSTRAINT "ActivityReviewed_activityId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ActivityReviewed" ADD CONSTRAINT "ActivityReviewed_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
