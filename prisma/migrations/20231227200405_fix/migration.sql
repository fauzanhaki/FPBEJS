/*
  Warnings:

  - You are about to drop the column `date` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `duration` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `rating` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "about" TEXT,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "no_telp" DROP NOT NULL,
ALTER COLUMN "profile_picture" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "name" TEXT,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
