"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import { useSessionContext } from "../contextprovider";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";
import { Card, Link, Stack, Typography } from "@mui/material";
import { DraftTeam, Rider } from "@prisma/client";
import { DraftTeamWithRiders } from "../prisma-queries";

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    rows: GridRowModel[];
    team: DraftTeamWithRiders;
  }
}
export function TeamFooter(
  props: NonNullable<GridSlotsComponentsProps["footer"]>
) {
  const totalScore =
    props.rows?.reduce((acc, row) => acc + (row.score2025 as number), 0) || 0;
  const totalPrice =
    props.rows?.reduce((acc, row) => acc + (row.price2025 as number), 0) || 0;
  let averageAge =
    props.rows && props.rows.length > 0
      ? props.rows.reduce((acc, row) => acc + (row.age as number), 0) /
        props.rows.length
      : 0;
  averageAge = parseFloat(averageAge.toFixed(1));
  return (
    <Card variant="outlined">
      <Stack direction="row" spacing={2}>
        <Typography variant="h6">Total score: {totalScore}</Typography>
        <Typography variant="h6">Total price: {totalPrice}</Typography>
        <Typography variant="h6">Average age: {averageAge}</Typography>
      </Stack>
    </Card>
  );
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    editable: false,
    renderCell: (params) => (
      <Link href={`/riders/${params.row.id}`}>{params.value}</Link>
    ),
  },
  {
    field: "nation",
    headerName: "Nation",
    editable: false,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Image
          src={findFlagUrlByIso3Code(params.value)}
          alt={params.value}
          width={24}
          height={16}
          style={{ border: "1px solid grey" }}
        />
        {params.value}
      </div>
    ),
  },
  { field: "teamKey", headerName: "Team", editable: false },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    editable: false,
  },
  {
    field: "price2025",
    headerName: "Price",
    type: "number",
    editable: false,
  },
  {
    field: "score2025",
    headerName: "Score",
    type: "number",
    editable: false,
  },
  {
    field: "score2024",
    headerName: "Score 2024",
    type: "number",
    editable: false,
  },
];

interface RiderPageProps {
  mensDraftTeamData?: DraftTeamWithRiders;
  womensDraftTeamData?: DraftTeamWithRiders;
  mensRiders?: Rider[];
  womensRiders?: Rider[];
}

export default function RiderTable({
  mensDraftTeamData,
  womensDraftTeamData,
  mensRiders,
  womensRiders,
}: RiderPageProps) {
  const { isWomen } = useSessionContext();
  const [rows, setRows] = useState<Rider[]>([]);
  const [team, setTeam] = useState<DraftTeamWithRiders>();

  useEffect(() => {
    const fetchData = async () => {
      let draftTeam: DraftTeamWithRiders | undefined = mensDraftTeamData;
      if (mensDraftTeamData && !isWomen) {
        setTeam(mensDraftTeamData);
        draftTeam = mensDraftTeamData;
      } else if (womensDraftTeamData && isWomen) {
        draftTeam = womensDraftTeamData;
        setTeam(womensDraftTeamData);
      }
      if (draftTeam) {
        let riders = draftTeam.draftTeamRiders.map(
          (draftTeamRider) => draftTeamRider.rider
        );
        setRows(riders);
      }
      if (mensRiders && !isWomen) {
        setRows(mensRiders);
      } else if (womensRiders && isWomen) {
        setRows(womensRiders);
      }
    };
    fetchData();
  }, [
    isWomen,
    mensDraftTeamData,
    womensDraftTeamData,
    mensRiders,
    womensRiders,
  ]);

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
        disableColumnSelector={true}
        autosizeOptions={autosizeOptions}
        autosizeOnMount={true}
        slots={team ? { footer: TeamFooter } : {}}
        slotProps={team ? { footer: { rows: rows, team: team } } : {}}
      />
    </main>
  );
}
