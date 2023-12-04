/*
  Warnings:

  - You are about to drop the column `total_ranting` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "total_ranting",
ADD COLUMN     "total_rating" DOUBLE PRECISION,
ALTER COLUMN "ranting" SET DATA TYPE DOUBLE PRECISION;
