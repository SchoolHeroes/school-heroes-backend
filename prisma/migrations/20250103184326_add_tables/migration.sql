/*
  Warnings:

  - You are about to drop the `ActiveToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActiveToken" DROP CONSTRAINT "ActiveToken_user_id_fkey";

-- DropTable
DROP TABLE "ActiveToken";

-- CreateTable
CREATE TABLE "activeToken" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activeToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activeToken_token_key" ON "activeToken"("token");

-- AddForeignKey
ALTER TABLE "activeToken" ADD CONSTRAINT "activeToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
