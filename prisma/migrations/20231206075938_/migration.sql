/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `details_transactions` table. All the data in the column will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `details_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "details_transactions" DROP CONSTRAINT "details_transactions_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_fkey";

-- AlterTable
ALTER TABLE "details_transactions" DROP COLUMN "transaction_id",
ADD COLUMN     "total_harga" DOUBLE PRECISION,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "paymentStatus" DROP NOT NULL;

-- DropTable
DROP TABLE "transactions";

-- AddForeignKey
ALTER TABLE "details_transactions" ADD CONSTRAINT "details_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
