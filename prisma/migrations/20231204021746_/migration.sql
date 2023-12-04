/*
  Warnings:

  - You are about to drop the column `nilai_Ranting` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "nilai_Ranting",
ADD COLUMN     "nilai" DOUBLE PRECISION;
