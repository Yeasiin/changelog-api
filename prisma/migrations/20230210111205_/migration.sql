/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_userId_key" ON "Project"("userId");
