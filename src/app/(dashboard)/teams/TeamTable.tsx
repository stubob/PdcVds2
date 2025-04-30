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
        setData(isWomen ? womensRiders : mensRiders);
    }
  }, [isWomen, mensRiders, womensRiders]);
  const columns: GridColDef[] = [
    { field: "teamRank", headerName: "Rank", width: 100, editable: false },
    { field: "name", headerName: "Team Name", width: 500, editable: false, renderCell: (params) => <Link href={`/my-team/${params.row.id}`}>{params.value}</Link> },
    { field: "userName", headerName: "User Name", width: 500, editable: false },
    { field: "score2025", headerName: "Score", width: 100, editable: false },
];    
return (
    <main>
      <DataGrid
        rows={data}
        columns={columns}
      />
    </main>
  );
}
