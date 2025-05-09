import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link, Stack, Typography } from "@mui/material";
import RiderTable from "../../components/RiderTable";
import { fetchUserSession, getDraftTeamResults, getMensDraftTeam, getWomensDraftTeam } from "../../datalayer";
import TeamResultsTable from "../../components/TeamResultsTable";
import FlagsWidget from "./FlagWidget";
import { auth } from "../../../auth";

export default async function MyTeamPage() {
  const authSession = await auth();
  const session = await fetchUserSession(authSession);
  if (!session) {
    return (
      <Typography variant="h6">
        You must be logged in to view your team.
      </Typography>
    );
  }
  const mensDraftTeamData= await getMensDraftTeam(session);
  const womensDraftTeamData = await getWomensDraftTeam(session);
  let mensTeamResults = null;
  let womensTeamResults = null;

  if (mensDraftTeamData?.id) {
    mensTeamResults = await getDraftTeamResults(mensDraftTeamData.id);
  }

  if (womensDraftTeamData?.id) {
    womensTeamResults = await getDraftTeamResults(womensDraftTeamData.id);
  }

  return (
    <Stack direction="column" spacing={2}>
  <div>
        <FlagsWidget mensTeamData={mensDraftTeamData} womensTeamData={womensDraftTeamData} />
        <RiderTable mensDraftTeamData={mensDraftTeamData} womensDraftTeamData={womensDraftTeamData} />
        </div>
      <Typography variant="h4">Results</Typography>
      <TeamResultsTable mensResults={mensTeamResults} womensResults={womensTeamResults} />
    </Stack>
  );
}
