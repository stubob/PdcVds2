"use client";
import { Link } from "@mui/material";
import {
  GridColDef,
  DataGrid,
} from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useSessionContext } from "../../contextprovider";
import { DraftTeamWithUser } from "../../prisma-queries";

interface TeamTableProps {
  mensRiders?: DraftTeamWithUser[] | null;
  womensRiders?: DraftTeamWithUser[] | null;
}

export default function TeamTable({ mensRiders, womensRiders }: TeamTableProps) {
  const [data, setData] = useState<DraftTeamWithUser[]>([]);
  const { isWomen } = useSessionContext();

  useEffect(() => {
    if(mensRiders && womensRiders) {
        const selectedData = isWomen ? womensRiders : mensRiders;
        // Map data to include userName field
        const transformedData = selectedData.map((team) => ({
          ...team,
          userName: team.user?.name || "Unknown", // Extract user.name or fallback to "Unknown"
        }));
        setData(transformedData);
    }
  }, [isWomen, mensRiders, womensRiders]);
  const columns: GridColDef[] = [
    { field: "teamRank", headerName: "Rank", width: 100, editable: false },
    { field: "name", headerName: "Team Name", width: 500, editable: false, renderCell: (params) => <Link href={`/my-team/${params.row.id}`}>{params.value}</Link> },
    { field: "userName", headerName: "User Name", width: 500, editable: false },
    { field: "score2025", headerName: "Score", width: 100, editable: false },
];

const autosizeOptions = {
  includeHeaders: true,
  includeOutliers: true,
  expand: true,
};
return (
    <main>
      <DataGrid
        rows={data}
        columns={columns}
        rowHeight={25}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnSelector={true}
        autosizeOnMount={true}
        autosizeOptions={autosizeOptions}
    />
    </main>
  );
}
