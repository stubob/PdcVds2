"use client";

import { Link } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RaceResult } from "@prisma/client";
import { useEffect, useState } from "react";
import { RaceWithResults, ResultsWithRace } from "../../../prisma-queries";

interface RiderResultsTableProps {
    data: ResultsWithRace[] | undefined;
}

export default function RiderResultsTable({ data }: RiderResultsTableProps) {
  const [results, setResults] = useState<any[]>([]);
const columns: GridColDef[] = [
    {field: "raceDate", headerName: "Date", type: "date", editable: false, valueGetter: (params) => {
        return new Date(params);
      },
    },
    {field: "raceName", headerName: "Race", editable: false, renderCell: (params) => <Link href={`/results/${params.row.raceId}`}>{params.value}</Link> },
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

  useEffect(() => {
    if(data){
      const flattenedResults = data.map((result) => ({
        id: result.id, // Ensure each row has a unique ID
        raceDate: result.race.date|| null,
        raceName: result.race.name || "",
        raceNation: result.race.nation || "",
        raceCategory: result.race.category || "",
        title: result.title || "",
        points: result.points || 0,
        raceId: result.raceId || null, // For linking purposes
      }));
      setResults(flattenedResults);
    }
  }
  , [data]);

return (
    <DataGrid rows={results} columns={columns} autosizeOnMount={true} autosizeOptions={autosizeOptions} />
)
}