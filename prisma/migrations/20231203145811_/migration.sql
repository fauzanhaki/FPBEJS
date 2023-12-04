/*
  Warnings:

  - You are about to drop the column `total_rating` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "total_rating",
ADD COLUMN     "rata_rating" DOUBLE PRECISION;
