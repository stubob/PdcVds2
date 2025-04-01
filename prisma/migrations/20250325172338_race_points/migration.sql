/*
  Warnings:

  - Added the required column `points` to the `race_result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "race_result" ADD COLUMN     "points" INTEGER NOT NULL;
