"use client";

import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CalendarCell from "./CalenderCell";
import { findFlagUrlByCountryName } from "country-flags-svg";
import Image from "next/image";
import { useSessionContext } from "../contextprovider";
import { Race } from "@prisma/client";
import { Link } from "@mui/material";
import { RaceWithResults } from "../prisma-queries";

interface CalendarTableProps {
  calendarData: RaceWithResults[];
}

export default function CalendarTable({ calendarData }: CalendarTableProps) {
  const { isWomen } = useSessionContext();
  const [rows, setRows] = useState<RaceWithResults[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (calendarData) {
      const data = calendarData
        .filter((event) => event.type === isWomen)
        .map((event) => ({
          ...event,
          winner: event.raceResult?.[0]?.rider.name || '',
        }));

      if (isMounted) {
        setRows(data);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [calendarData, isWomen]);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      editable: false,
      valueGetter: (params) => {
        return new Date(params);
      },
    },
    { field: "name", headerName: "Name", editable: false },
    {
      field: "nation",
      headerName: "Nation",
      editable: false,
      type: "string",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={findFlagUrlByCountryName(params.value)}
            alt={params.value}
            width={24}
            height={16}
            style={{ border: "1px solid grey" }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      editable: false,
      type: "singleSelect",
      valueOptions: [
        "Grand Tour-Stage",
        "Grand Tour-Final",
        "Monuments and Worlds",
        "Top Stage Races-Stage",
        "Top Stage Races-Final",
        "Top Classics",
        "Best of the Rest-Stage",
        "Best of the Rest-Final",
        "Best of the Rest",
        "Minor Races (SSRs)",
        "Minor Races (SSRs)-Stage",
        "Minor Races (SSRs)-Final",
        "National Championships",
        "",
      ],
    },
    {
      field: "results",
      headerName: "Results",
      editable: false,
      renderCell: (params) => <CalendarCell {...params} urlBase={"/results"} />,
      sortable: false,
      filterable: false,
  },
  {
    field: "winner",
    headerName: "Winner",
    editable: false,
    type: "string",
    renderCell: (params) => <Link href={`/riders/${params.row.id}`}>{params.value}</Link> },
  ];

  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };
    return (
    <main>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autosizeOptions={autosizeOptions}
        autosizeOnMount={true}
      />
    </main>
  );
}
