"use client";

import { Alert, Button, Snackbar, SnackbarCloseReason, Stack, TextField } from "@mui/material"
import { useState } from "react";
import { useSessionContext } from "../../../contextprovider";
import { createRiders } from "../../../prisma-queries";
import { Prisma, Rider } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const [csvData, setCsvData] = useState("");
    const { isWomen } = useSessionContext();
    const router = useRouter(); // Use the useRouter hook

      const [open, setOpen] = useState(false);
    
      const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
    const handleUpload = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ): Promise<void> => {
        const riders: Prisma.RiderCreateManyInput[] = csvData.split("\n").map((row) => {
            const [name, nation, teamKey, age, price2025, score2024, price2024] = row.split(";");
            return {
                name,
                nameKey: name.toLowerCase().replace(/\s+/g, "-"),
                nation,
                type: isWomen,
                price2025: Number(price2025),
                score2024: Number(score2024),
                score2025: 0, // Set score2025 to 0
                price2024: Number(price2024),
                age: Number(age),
                teamKey,
            };
          });
        createRiders(riders);
        setOpen(true);
        router.push("/admin/admin-riders"); // Use router.push
    };
    return (
        <Stack spacing={2} direction="column" justifyContent="space-between">
        <TextField
          multiline
          fullWidth
          placeholder="name;nation;teamKey;age;price2025;score2024;price2024"
          rows={5}
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
        />
        <Button fullWidth={true} variant="contained" color="primary" onClick={handleUpload}>
          Upload
        </Button>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
  <Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Riders Updated
  </Alert>
</Snackbar>
      </Stack>
    );
}