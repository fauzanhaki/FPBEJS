/*
  Warnings:

  - You are about to drop the column `ranting` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `rata_rating` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ranting_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ranting_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "ranting",
DROP COLUMN "rata_rating",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nilai_Ranting" DOUBLE PRECISION,
ADD COLUMN     "ranting_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ranting" (
    "id" SERIAL NOT NULL,
    "total_ranting" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ranting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_ranting_id_key" ON "reviews"("ranting_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ranting_id_fkey" FOREIGN KEY ("ranting_id") REFERENCES "ranting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
