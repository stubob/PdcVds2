"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSessionContext } from "../contextprovider";
import { Link } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "raceDate",
    headerName: "Date",
    type: "date",
    editable: false,
    valueGetter: (params) => {
      return new Date(params);
    },
  },
  {
    field: "raceName",
    headerName: "Race Name",
    editable: false,
    renderCell: (params) => (
      <Link href={`/results/${params.row.raceId}`}>{params.value}</Link>
    ),
  },
  { field: "raceNation", headerName: "Nation", editable: false },
  { field: "raceCategory", headerName: "Type", editable: false },
  {
    field: "riderName",
    headerName: "Rider Name",
    editable: false,
    renderCell: (params) => (
      <Link href={`/results/${params.row.riderId}`}>{params.value}</Link>
    ),
  },
  { field: "title", headerName: "Position", editable: false },
  { field: "points", headerName: "Points", editable: false },
];
interface TeamResultsPageProps {
  mensResults: any[] | null;
  womensResults: any[] | null;
}

const autosizeOptions = {
  includeHeaders: true,
  includeOutliers: true,
  expand: true,
};

export default function TeamResultsTable({
  mensResults,
  womensResults,
}: TeamResultsPageProps) {
  const { isWomen } = useSessionContext();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (mensResults && womensResults) {
      if (isWomen) {
        setData(womensResults);
      } else {
        setData(mensResults);
      }
    }
  }, [mensResults, womensResults, isWomen]);
  return (
    <DataGrid
      rows={data}
      columns={columns}
      autosizeOptions={autosizeOptions}
      autosizeOnMount={true}
    ></DataGrid>
  );
}
