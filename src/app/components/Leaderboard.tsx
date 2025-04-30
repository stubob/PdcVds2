"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DraftTeamWithUser } from "../prisma-queries";
import { useSessionContext } from "../contextprovider";
import { Link } from "@mui/material";

interface LeaderboardData {
  data?: DraftTeamWithUser[];
  womensData? : DraftTeamWithUser[];
}

export default function Leaderboard({data, womensData}: LeaderboardData) {
    const [teamData, setTeamData] = useState<DraftTeamWithUser[]>([]);
    const { isWomen } = useSessionContext();

    useEffect(() => {
      if (data && womensData) {
        const selectedData = isWomen ? womensData : data;
        const transformedData = selectedData.map((team, index) => ({
          ...team,
          userName: team.user?.name || "Unknown", // Set userName to data.user.name or fallback to "Unknown"
          teamRank: index + 1, // Assign teamRank based on the row index (1-based)
        }));
        setTeamData(transformedData);
      }
    }, [data, isWomen, womensData]);        
  const columns: GridColDef[] = [
    { field: "teamRank", headerName: "Position", type: "string", width: 100, editable: false},
    { field: "name", headerName: "Team Name", type: "string", width: 200, editable: false, renderCell: (params) => <Link href={`/my-team/${params.row.id}`}>{params.value}</Link> },
    { field: "userName", headerName: "User Name", type: "string", width: 200, editable: false},
    { field: "score2025", headerName: "Score", type: "string", width: 100, editable: false },
  ];

  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };
  return <DataGrid rows={teamData} columns={columns}  autosizeOptions={autosizeOptions} autosizeOnMount={true}/>;
}
