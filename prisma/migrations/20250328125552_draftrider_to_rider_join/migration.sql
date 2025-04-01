-- AddForeignKey
ALTER TABLE "draft_team_riders" ADD CONSTRAINT "draft_team_riders_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
