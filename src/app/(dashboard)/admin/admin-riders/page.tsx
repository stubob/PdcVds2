"use client";

import { Button, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useSessionContext } from "../../../contextprovider";
import AdminRiderTable from "./AdminRiderTable";
import { createRider } from "../../../prisma-queries";

export default function RiderAdminPage() {
  const { isWomen } = useSessionContext();

  const [csvData, setCsvData] = useState("");
  const { riderData, setRiderData } = useSessionContext();

  const handleUpload = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    const rows = csvData.split("\n");
    rows.forEach((row) => {
      const [name, nation, teamKey, age, price2025, score2024] = row.split(";");
      createRider(
        name,
        nation,
        isWomen,
        Number(price2025),
        Number(score2024),
        Number(age),
        teamKey
      ).then((newRider) => setRiderData([...riderData, newRider]));
    });
  };

  return (
    <Stack direction="column" spacing={2}>
      <AdminRiderTable isWomen={isWomen} />
      <TextField
        multiline
        fullWidth
        placeholder="name;nation;team_key;age;price_2025;score_2024"
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
