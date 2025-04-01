/*
  Warnings:

  - You are about to drop the column `position` on the `race_result` table. All the data in the column will be lost.
  - Added the required column `title` to the `race_result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "race_result" DROP COLUMN "position",
ADD COLUMN     "title" TEXT NOT NULL;
