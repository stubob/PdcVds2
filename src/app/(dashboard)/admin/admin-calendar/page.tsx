"use client";

import { Button, Paper, Stack, TextField } from "@mui/material";
import CalendarTable from "../../results/CalendarTable";
import { useState } from "react";
import { createRace } from "../../../prisma-queries";
import { useSessionContext } from "../../../contextprovider";

export default function CalendarAdminPage() {
  const { isWomen } = useSessionContext();
  const [csvData, setCsvData] = useState("");
  const { calendarData, setCalendarData } = useSessionContext();

  const handleUpload = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    const rows = csvData.split("\n");
    rows.forEach((row) => {
      const [date, name, nation, category] = row.split(",");
      const newRace = createRace(
        name,
        nation,
        category,
        new Date(date),
        isWomen
      ).then((newRace) => setCalendarData([...calendarData, newRace]));
    });
  };

  return (
    <Stack direction="column" spacing={2}>
      <CalendarTable editable={true} isWomen={isWomen} />
      <TextField
        multiline
        fullWidth
        placeholder="date,name,nation,category"
        rows={5}
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </Stack>
  );
}
