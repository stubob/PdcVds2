import { auth } from "../../../auth";
import DraftTable from "./DraftTable";
import { fetchUserSession, getMensDraftTeam, getMensRiders, getWomensDraftTeam, getWomensRiders } from "../../datalayer";
import { Typography } from "@mui/material";

export default async function RiderPage(){
  const authSession = await auth();
  const session = await fetchUserSession(authSession);
  if (!session) {
    return (
      <Typography variant="h4" color="error">No session found</Typography>
    );
  }
  const mensTeamDataPromise = getMensDraftTeam(session);
  const womensTeamDataPromise = getWomensDraftTeam(session);
  const mensRidersPromise = getMensRiders();
  const womensRidersPromise = getWomensRiders();

  const [mensTeamData, womensTeamData, mensRiders, womensRiders] = await Promise.all([mensTeamDataPromise, womensTeamDataPromise, mensRidersPromise, womensRidersPromise]);
    return (
        <DraftTable mensDraftTeamData={mensTeamData} womensDraftTeamData={womensTeamData} mensRiderData={mensRiders} womensRiderData={womensRiders} session={session}/>
    );
}