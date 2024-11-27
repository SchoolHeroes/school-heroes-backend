-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('email', 'google', 'apple');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('child', 'speaker');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "method" "AuthMethod" NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "token" TEXT,
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "birthday" TEXT,
    "activity" TEXT,
    "company" TEXT,
    "address" TEXT,
    "telegram" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "educational_institution" TEXT,
    "passions" TEXT,
    "points" INTEGER,
    "verify_email" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");
