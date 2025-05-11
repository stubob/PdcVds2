import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Card } from "@mui/material";
import Leaderboard from "../components/Leaderboard";
import { getMensDraftTeams, getWomensDraftTeams, getCalendarData, getCachedRecentCalendarData, getCachedUpcomingCalendarData, getMensRiders, getWomensRiders } from "../datalayer";
import CalendarTable from "../components/CalendarTable";
import { addDays } from "date-fns";
import RiderTable from "../components/RiderTable";
import { useEffect } from "react";

export default async function HomePage() {
  const mensTeamsPromise =  getMensDraftTeams();
  const womensTeamsPromise =  getWomensDraftTeams();
  const upcomingCalendarPromise = getCachedUpcomingCalendarData();
  const recentCalendarPromise = getCachedRecentCalendarData();
  const mensRiderPromise = getMensRiders();
  const womensRiderPromise = getWomensRiders();

  const [mensTeamData, womensTeamData, upcomingCalendar, recentCalendar, mensRiders, womensRiders] = await Promise.all([mensTeamsPromise, womensTeamsPromise, upcomingCalendarPromise, recentCalendarPromise, mensRiderPromise, womensRiderPromise]);

  return (
    <Grid container spacing={2}>
      <Grid size={{sm: 12, md: 6}}>
        <Card variant="outlined">
          <Typography>Team Leaderboard</Typography>
          <Leaderboard
                      data={mensTeamData ?? []} // Fallback to an empty array if null
                      womensData={womensTeamData ?? []} // Fallback to an empty array if null
          />          
        </Card>
      </Grid>
      <Grid size={{sm: 12, md: 6}}>
        <Card variant="outlined">
        <Typography>Top Riders</Typography>
        <RiderTable mensRiders={mensRiders} womensRiders={womensRiders}/>
        </Card>
      </Grid>
      <Grid size={{sm: 12, md: 6}}>
        <Card variant="outlined">
          <Typography>Latest Races</Typography>
          <CalendarTable calendarData={recentCalendar} />
        </Card>
      </Grid>
      <Grid size={{sm: 12, md: 6}}>
        <Card variant="outlined">
          <Typography>Upcoming Races</Typography>
          <CalendarTable calendarData={upcomingCalendar} />
        </Card>
      </Grid>
    </Grid>
  );
}
