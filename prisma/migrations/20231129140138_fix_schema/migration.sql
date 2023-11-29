/*
  Warnings:

  - You are about to drop the column `level_id` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `level` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `is_premium` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "levels" AS ENUM ('beginner', 'intermediate', 'advanced');

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_level_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "level_id",
ADD COLUMN     "level" "levels" NOT NULL,
DROP COLUMN "is_premium",
ADD COLUMN     "is_premium" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_id",
ADD COLUMN     "role" "roles" NOT NULL,
ALTER COLUMN "reset_password_token" DROP NOT NULL,
ALTER COLUMN "verification_token" DROP NOT NULL;

-- DropTable
DROP TABLE "levels";

-- DropTable
DROP TABLE "roles";

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");
