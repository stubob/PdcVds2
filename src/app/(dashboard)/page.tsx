"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Grid from "@mui/material/Grid2";
import { Card } from "@mui/material";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <Card variant="outlined">
          <Typography>Team Leaderboard</Typography>
        </Card>
      </Grid>
      <Grid size={6}>
        <Card variant="outlined">
          <Typography>Rider Points</Typography>
        </Card>
      </Grid>
      <Grid size={6}>
        <Card variant="outlined">
          <Typography>Latest Races</Typography>
        </Card>
      </Grid>
      <Grid size={6}>
        <Card variant="outlined">
          <Typography>Upcoming Races</Typography>
        </Card>
      </Grid>
      {session?.user && (
        <>
          <Grid size={6}>
            <Card variant="outlined">
              <Typography>My Team Latest Results</Typography>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card variant="outlined">
              <Typography>???</Typography>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
}
