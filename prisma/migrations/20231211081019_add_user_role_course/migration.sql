/*
  Warnings:

  - Added the required column `user_id` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "roles" ADD VALUE 'mentor';

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "video_url" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
