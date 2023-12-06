/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `details_transactions` table. All the data in the column will be lost.
  - Added the required column `payment_method_id` to the `details_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "details_transactions_course_id_key";

-- DropIndex
DROP INDEX "details_transactions_transaction_id_key";

-- DropIndex
DROP INDEX "transactions_user_id_key";

-- AlterTable
ALTER TABLE "details_transactions" DROP COLUMN "paymentMethod",
ADD COLUMN     "payment_method_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateTable
CREATE TABLE "payment_method" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "crated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "details_transactions" ADD CONSTRAINT "details_transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE CASCADE ON UPDATE CASCADE;
