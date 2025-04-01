"use client";

import { Button, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { auth } from "../../../auth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser, updateUser } from "../../prisma-queries";
import { useSessionContext } from "../../contextprovider";

export default function ProfilePage() {
    const [user, setUser] = useState({ name: "", email: "" });
    const { session } = useSessionContext();

    useEffect(() => {
        const fetchData = async () => {
          if(session) {
              setUser({ name: session.name || "", email: session.email || "" });
          }
        };
        fetchData();
    }, [session]);
        
  
    const saveUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      await updateUser(user);
    };
  
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUser({ ...user, name: event.target.value });
    };
  
  return (
    <main>
      <Paper sx={{ padding: "10px", margin: "10px" }}>
      <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="h6">User Name</Typography>
          </Grid>
          <Grid size={6}>
          <TextField value={user.name} onChange={handleNameChange}></TextField>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">Email</Typography>
          </Grid>
          <Grid size={6}>
            <TextField slotProps={{
            input: {
              readOnly: true,
            }}} value={user.email}></TextField>
          </Grid>
          <Button variant="contained" color="primary" onClick={saveUser}>
            Save
          </Button>
        </Grid>
      </Paper>
    </main>
  );
};
