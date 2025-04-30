"use client";

import { Link } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RaceResult } from "@prisma/client";

interface RiderResultsTableProps {
    data: RaceResult[] | undefined;
}

export default function RiderResultsTable({ data }: RiderResultsTableProps) {
const columns: GridColDef[] = [
    {field: "raceDate", headerName: "Date", type: "date", editable: false, valueGetter: (params) => {
        return new Date(params);
      },
    },
    {field: "raceName", headerName: "Name", editable: false, renderCell: (params) => <Link href={`/results/${params.row.raceId}`}>{params.value}</Link> },
    {field: "raceNation", headerName: "Nation", editable: false},
    {field: "raceCategory", headerName: "Type", editable: false},
    {field: "title", headerName: "Position", editable: false},
    {field: "points", headerName: "Points", editable: false},
];

const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };

return (
    <DataGrid rows={data} columns={columns} autosizeOnMount={true} autosizeOptions={autosizeOptions} />
)
}