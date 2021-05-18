/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
