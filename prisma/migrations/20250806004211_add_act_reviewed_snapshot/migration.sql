-- CreateTable
CREATE TABLE "public"."ActivityReviewed" (
    "id" TEXT NOT NULL,
    "activityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "activityTitle" TEXT,
    "activityDesc" TEXT,
    "activityDate" TIMESTAMP(3),
    "activityPoints" INTEGER,
    "activityQuantity" DOUBLE PRECISION,
    "activityUnit" TEXT,
    "activityType" "public"."ActivityType",
    "activityStatus" "public"."ActivityStatus",

    CONSTRAINT "ActivityReviewed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ActivityReviewed" ADD CONSTRAINT "ActivityReviewed_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
