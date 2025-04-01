/*
  Warnings:

  - A unique constraint covering the columns `[rider_id,user_id,team_id]` on the table `draft_team_riders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "draft_team_riders_rider_id_user_id_team_id_key" ON "draft_team_riders"("rider_id", "user_id", "team_id");
