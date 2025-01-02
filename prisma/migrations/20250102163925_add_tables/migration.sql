/*
  Warnings:

  - You are about to drop the `ActiveTokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActiveTokens" DROP CONSTRAINT "ActiveTokens_user_id_fkey";

-- DropTable
DROP TABLE "ActiveTokens";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "method" "AuthMethod" NOT NULL,
    "google_id" TEXT,
    "apple_id" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
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
    "verification_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "active_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_google_id_key" ON "user"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_apple_id_key" ON "user"("apple_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_token_key" ON "user"("verification_token");

-- CreateIndex
CREATE INDEX "user_google_id_idx" ON "user"("google_id");

-- CreateIndex
CREATE INDEX "user_apple_id_idx" ON "user"("apple_id");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "active_token_token_key" ON "active_token"("token");

-- CreateIndex
CREATE INDEX "active_token_user_id_idx" ON "active_token"("user_id");

-- AddForeignKey
ALTER TABLE "active_token" ADD CONSTRAINT "active_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
