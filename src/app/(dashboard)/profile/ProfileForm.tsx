"use client";

import { useEffect, useState } from "react";
import { updateUser } from "../../prisma-queries";
import {
  Typography,
  TextField,
  Button,
  CardContent,
  CardActions,
  Card,
  Stack,
} from "@mui/material";

export default function ProfileForm({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
  const [user, setUser] = useState({ name: "", email: "" });
  const saveUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await updateUser(user);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: event.target.value });
  };

  useEffect(() => {
    if(name && email){
      setUser({ name, email });
    }
  }, [name, email]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={"column"} spacing={2}>
        <TextField label="User Name" value={user.name} onChange={handleNameChange}/>
        <TextField label="Email" value={user.email} 
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        </Stack>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={saveUser}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
