/*
  Warnings:

  - Added the required column `password` to the `Update` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Update" ADD COLUMN     "password" TEXT NOT NULL;
