-- CreateTable
CREATE TABLE "BankingRecord" (
    "id" SERIAL NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankingRecord_pkey" PRIMARY KEY ("id")
);
