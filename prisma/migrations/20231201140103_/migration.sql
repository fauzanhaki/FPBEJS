/*
  Warnings:

  - The `ranting` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total_ranting` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "ranting",
ADD COLUMN     "ranting" INTEGER,
DROP COLUMN "total_ranting",
ADD COLUMN     "total_ranting" INTEGER;
