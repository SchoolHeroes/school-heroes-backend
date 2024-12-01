/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verification_token" TEXT,
ADD COLUMN     "verify_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
UPDATE "User" SET "updatedAt" = NOW(); 
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

