/*
  Warnings:

  - Made the column `activityQuantity` on table `ActivityReviewed` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ActivityReviewed" ALTER COLUMN "activityQuantity" SET NOT NULL;
