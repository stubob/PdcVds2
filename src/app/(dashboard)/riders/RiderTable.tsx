"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
} from "@mui/x-data-grid";
import {
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CurrentContext, useSessionContext } from "../../contextprovider";
import {
  addRiderToTeam,
  createDraftTeam,
  getAllRiders,
  getDraftTeam,
  getUser,
  removeRiderFromTeam,
} from "../../prisma-queries";
import { useSession } from "next-auth/react";
import RulesWidget from "./RulesWidget";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";

const columns: GridColDef[] = [
  { ...GRID_CHECKBOX_SELECTION_COL_DEF, headerClassName: "header-checkbox" },
  { field: "name", headerName: "Name", width: 500, editable: false },
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
  { field: "teamKey", headerName: "Team", width: 200, editable: false },
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
  isWomen: boolean;
}

export default function RiderPage({ isWomen }: RiderPageProps) {
  const { session, riderData } = useSessionContext();
  const [rows, setRows] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    draftTeamRiders: [],
    id: Number,
    year: "",
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const [teamName, setTeamName] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      if(session && riderData){
        const filteredData = riderData.filter((rider) => rider.type === isWomen);
        setRows(filteredData);
        const team = await getDraftTeam(session, isWomen);
        if (team) {
          const selectedRiderIds = team.draftTeamRiders.map(
            (rider) => rider.riderId
          );
          const updatedDraftTeamRiders = team.draftTeamRiders.map(
            (draftRider) => {
              const rider = riderData.find(
                (rider) => rider.id === draftRider.riderId
              );
              return { ...draftRider, ...rider };
            }
          );
          team.draftTeamRiders = updatedDraftTeamRiders;

          setSelectionModel(selectedRiderIds);
          setTeam(team);
        }
      }
    };
    fetchData();
  }, [isWomen, session, riderData]);

  const handleCreateTeam = async () => {
    // Add logic to create a team
    createDraftTeam(session, team, isWomen);
    setTeam({ name: team, draftTeamRiders: [] });
  };

  const handleSelectionModelChange = async (newSelectionModel) => {
    if (!selectionModel) return;

    const addedRiders = newSelectionModel.filter(
      (id) => !selectionModel.includes(id)
    );
    const removedRiders = selectionModel.filter(
      (id) => !newSelectionModel.includes(id)
    );

    for (const riderId of addedRiders) {
      const rider = riderData.find((rider) => rider.id === riderId);
      await addRiderToTeam(session, team, rider);
      setTeam((prevTeam) => ({
        ...prevTeam,
        draftTeamRiders: [...prevTeam.draftTeamRiders, rider],
      }));
    }

    for (const riderId of removedRiders) {
      const rider = riderData.find((rider) => rider.id === riderId);
      await removeRiderFromTeam(session, team, rider);
      setTeam((prevTeam) => ({
        ...prevTeam,
        draftTeamRiders: prevTeam.draftTeamRiders.filter(
          (rider) => rider.id !== riderId
        ),
      }));
    }

    setSelectionModel(newSelectionModel);
  };

  return (
    <main>
      <Grid container spacing={2}>
        <Grid size={8}>
          <DataGrid
            sx={{ "& .header-checkbox": { pointerEvents: "none" } }}
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
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleSelectionModelChange}
            rowSelectionModel={selectionModel}
            disableColumnSelector={true}
            />
        </Grid>
        {session ? (
          <Stack spacing={2}>
            {team ? (
              <>
                <Link href={`/my-team/${team.id}`}>Flags!</Link>
                <TextField
                  label="Team Name"
                  variant="outlined"
                  value={team.name || ""}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <List>
                  {team.draftTeamRiders?.map((rider: any, index: number) => (
                    <ListItem key={index} disablePadding>
                      {rider.nation ? (
                      <ListItemIcon>
                      <Image
                        src={findFlagUrlByIso3Code(rider.nation)}
                        alt={rider.nation}
                        width={24}
                        height={16}
                        style={{ border: "1px solid grey" }}
                      />
                    </ListItemIcon>
                    ): null}
                      <ListItemText
                        primary={rider.name}
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "text.primary", display: "inline" }}
                          >
                            Cost: {rider.price2025}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <RulesWidget isWomen={isWomen} team={team} />
              </>
            ) : (
              <>
                <TextField
                  label="Team Name"
                  variant="outlined"
                  value={teamName || ""}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateTeam}
                >
                  Create Team
                </Button>
              </>
            )}
          </Stack>
        ) : (
          <></>
        )}
      </Grid>
    </main>
  );
}
