"use client";
import { Alert, Button, Snackbar, SnackbarCloseReason, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { createRaces } from "../../../../prisma-queries";
import { useSessionContext } from "../../../../contextprovider";
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
    
    const handleUpload = async () => {
        // Step 1: Parse CSV data into an array of race objects
        const races = csvData.split("\n").map((row) => {
          const [date, name, nation, category] = row.split(";");
          return {
            name,
            nameKey: name.toLowerCase().replace(/\s+/g, "_"),
            nation,
            category,
            date: new Date(date),
            type: isWomen,
          };
        });
      
        try {
          // Step 2: Call newRaces with the array of race objects
          const newRacesResult = await createRaces(races);
      
          // Step 3: Update rows using apiRef.current.updateRows
          // await fetchCalendarData();
          console.log("Races successfully uploaded and rows updated:", newRacesResult);
          router.push("/admin/calendar/admin-calendar"); // Use router.push
          setOpen(true);
        } catch (error) {
          console.error("Error uploading races:", error);
        }
      };    
    return (
        <Stack direction={"column"} spacing={2}>
            <TextField
        multiline
        fullWidth
        placeholder="date;name;nation;category"
        rows={5}
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
  <Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Calendar Updated
  </Alert>
</Snackbar>
        </Stack>
    );
}