-- AddForeignKey
ALTER TABLE "race_result" ADD CONSTRAINT "race_result_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
