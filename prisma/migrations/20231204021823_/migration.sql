/*
  Warnings:

  - You are about to drop the column `nilai` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "nilai",
ADD COLUMN     "nilai_Ranting" DOUBLE PRECISION;
