/*
  Warnings:

  - A unique constraint covering the columns `[race_id,sequence]` on the table `race_result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "race_result_race_id_sequence_key" ON "race_result"("race_id", "sequence");
