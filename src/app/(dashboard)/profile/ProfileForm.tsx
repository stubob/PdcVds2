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
  Alert,
  Snackbar,
  SnackbarCloseReason,
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
    setOpen(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: event.target.value });
    setOpen(true);
  };

  useEffect(() => {
    if(name && email){
      setUser({ name, email });
    }
  }, [name, email]);

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
  return (
    <main>
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
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
  <Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    User updated
  </Alert>
</Snackbar>
    </main>
  );
}
