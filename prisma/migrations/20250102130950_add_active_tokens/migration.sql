-- CreateTable
CREATE TABLE "ActiveTokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveTokens_token_key" ON "ActiveTokens"("token");

-- CreateIndex
CREATE INDEX "ActiveTokens_user_id_idx" ON "ActiveTokens"("user_id");

-- AddForeignKey
ALTER TABLE "ActiveTokens" ADD CONSTRAINT "ActiveTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
