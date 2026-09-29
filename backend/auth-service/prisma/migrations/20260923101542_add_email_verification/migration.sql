/*
  Warnings:

  - You are about to drop the column `refreshTokenJti` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshTokenJti",
ADD COLUMN     "verificationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationTokenHash" TEXT;
