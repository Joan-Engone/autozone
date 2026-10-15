-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "margin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "sellerPaidAt" TIMESTAMP(3),
ADD COLUMN     "sellerPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shippingFee" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "seller_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_log" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus",
    "message" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_profile_userId_key" ON "seller_profile"("userId");

-- CreateIndex
CREATE INDEX "order_log_orderId_createdAt_idx" ON "order_log"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "seller_profile" ADD CONSTRAINT "seller_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_log" ADD CONSTRAINT "order_log_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
