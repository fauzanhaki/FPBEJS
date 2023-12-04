-- AlterTable
ALTER TABLE "users" ALTER COLUMN "reset_token" DROP NOT NULL,
ALTER COLUMN "verification_token" DROP NOT NULL;
