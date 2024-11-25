/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apple_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
ADD COLUMN     "apple_id" TEXT,
ADD COLUMN     "google_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_apple_id_key" ON "User"("apple_id");
