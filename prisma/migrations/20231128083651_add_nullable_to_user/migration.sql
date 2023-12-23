-- AlterTable
ALTER TABLE "users" ALTER COLUMN "reset_password_token" DROP NOT NULL,
ALTER COLUMN "verification_token" DROP NOT NULL;
