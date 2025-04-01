"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";
import { useSessionContext } from "../../../contextprovider";

interface RiderPageProps {
  isWomen: boolean;
}

export default function RiderPage({ isWomen }: RiderPageProps) {
  const { riderData } = useSessionContext();
  const [rows, setRows] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    draftTeamRiders: [],
    id: Number,
    year: "",
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const [teamName, setTeamName] = useState("");

  const columns: GridColDef[] = [
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, headerClassName: "header-checkbox" },
    { field: "name", headerName: "Name", width: 500, editable: true },
    {
      field: "nation",
      headerName: "Nation",
      editable: true,
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
    { field: "teamKey", headerName: "Team", width: 200, editable: true },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      editable: true,
    },
    {
      field: "price2025",
      headerName: "Price",
      type: "number",
      editable: true,
    },
    {
      field: "score2024",
      headerName: "Score 2024",
      type: "number",
      editable: true,
    },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      if(riderData){
        const filteredData = riderData.filter((rider) => rider.type === isWomen);
        setRows(filteredData);
      }
    };
    fetchData();
  }, [isWomen, riderData]);

  return (
    <main>
      <Grid container spacing={2}>
        <Grid size={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            rowHeight={25}
            keepNonExistentRowsSelected
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            rowSelectionModel={selectionModel}
            disableColumnSelector={true}
            />
        </Grid>
      </Grid>
    </main>
  );
}
