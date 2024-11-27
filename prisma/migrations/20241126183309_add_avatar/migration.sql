/*
  Warnings:

  - You are about to drop the column `verify_email` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verify_email",
ADD COLUMN     "avatar" TEXT;
