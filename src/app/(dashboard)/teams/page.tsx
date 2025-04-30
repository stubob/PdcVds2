import TeamTable from "./TeamTable";
import { getMensDraftTeams, getWomensDraftTeams } from "../../datalayer";

export default async function TeamResultsPage() {
  const mensTeamDataPromise = getMensDraftTeams();
  const womensTeamDataPromise = getWomensDraftTeams();
  const [mensTeamData, womensTeamData] = await Promise.all([mensTeamDataPromise, womensTeamDataPromise]);
  
  return (
    <main>
      <TeamTable mensRiders={mensTeamData} womensRiders={womensTeamData} />
    </main>
  );
}
