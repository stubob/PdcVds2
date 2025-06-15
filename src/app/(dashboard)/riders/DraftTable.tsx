"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  Alert,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSessionContext } from "../../contextprovider";
import {
  DraftTeamWithRiders,
  addRiderToTeam,
  createDraftTeam,
  removeRiderFromTeam,
} from "../../prisma-queries";
import RulesWidget from "../../components/RulesWidget";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";
import { DraftTeamRider, Rider } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface RiderPageProps {
  mensDraftTeamData?: DraftTeamWithRiders;
  mensRiderData: Rider[];
  womensDraftTeamData?: DraftTeamWithRiders;
  womensRiderData: Rider[];
  session: any
}

type DraftTeamRiderWithDetails = DraftTeamRider & {
  rider: Rider;
};

export default function DraftTable({ mensDraftTeamData, mensRiderData, womensDraftTeamData, womensRiderData, session }: RiderPageProps) {
  const { isWomen } = useSessionContext();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [team, setTeam] = useState<any>();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let draftTeam = mensDraftTeamData;
      let riderData = mensRiderData;
      if(isWomen){
        draftTeam = womensDraftTeamData;
        riderData = womensRiderData;
      }
      setRiders(riderData);
      if (draftTeam) {
        console.log("Draft Team Data:", draftTeam);
        setTeam(draftTeam);
        setTeamName(draftTeam.name);
        const selectedRiderIds = draftTeam.draftTeamRiders.map(
          (rider) => rider.riderId
        );
        const updatedDraftTeamRiders = draftTeam.draftTeamRiders
        .map((draftRider) => {
          const rider = riderData.find(
            (rider) => rider.id === draftRider.riderId
          );
          return { ...draftRider, ...rider };
        })
        .sort((a, b) => (b.price2025 && a.price2025) ? b.price2025 - a.price2025 : 0); // Sort by price2025 in descending order with null check
        draftTeam.draftTeamRiders = updatedDraftTeamRiders;
        setSelectionModel(selectedRiderIds);
      }else if(session){
        setTeam(undefined);
        setTeamName("");
        setSelectionModel([]);
      }
    };
    fetchData();
  }, [session, isWomen, mensDraftTeamData, mensRiderData, womensDraftTeamData, womensRiderData]);

  const handleCreateTeam = async () => {
    // Add logic to create a team
    createDraftTeam(session.user, teamName, isWomen);
    setTeam({ name: teamName, draftTeamRiders: [], userId: session.user.id, type: isWomen, id: 0, locked: false, score2025: 0, year: '2025' });
    setMessage('Team Created');
    setOpen(true);
  };

  const handleSelectionModelChange = async (newSelectionModel: GridRowSelectionModel) => {
    if (!selectionModel || !team) return;
  
    const addedRiders = newSelectionModel.filter(
      (id) => !selectionModel.includes(id)
    );
    const removedRiders = selectionModel.filter(
      (id) => !newSelectionModel.includes(id)
    );
  
    for (const riderId of addedRiders) {
      const rider = riders.find((rider) => rider.id === riderId);
      if (rider) {
        await addRiderToTeam(session.user, team, rider);
        const newRider: DraftTeamRiderWithDetails = {
          riderId: rider.id,
          teamId: team.id,
          userId: session.user.id,
          id: 0,
          rider: rider,
          active: true,
        };
        setTeam((prevTeam: { draftTeamRiders: DraftTeamRiderWithDetails[] }) => {
          if (!prevTeam) return undefined;
          const updatedRiders = [
            ...prevTeam.draftTeamRiders,
            newRider, // Add the new draft rider
          ].sort((a, b) => (b.rider.price2025 && a.rider.price2025) ? b.rider.price2025 - a.rider.price2025 : 0);
          return {
            ...prevTeam,
            draftTeamRiders: updatedRiders,
          };
        });
      }
    }
    
    // Remove riders from the team
    for (const riderId of removedRiders) {
      const rider = riders.find((rider) => rider.id === riderId);
      if (rider) {
        await removeRiderFromTeam(session.user, team, rider); // Remove rider from the team in the backend
        setTeam((prevTeam: { draftTeamRiders: DraftTeamRiderWithDetails[] }) => {
          if (!prevTeam) return undefined;
          const updatedRiders = prevTeam.draftTeamRiders
            .filter((r) => r.riderId !== riderId) // Remove rider from the local state
            .sort((a, b) => (b.rider.price2025 && a.rider.price2025) ? b.rider.price2025 - a.rider.price2025 : 0);
          return {
            ...prevTeam,
            draftTeamRiders: updatedRiders,
          };
        });
      }
    }
  
    // Update the selection model
    setSelectionModel(newSelectionModel);
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  
    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };

  const columns: GridColDef[] = [
  { field: "name", headerName: "Name", editable: false, renderCell: (params) => <Link href={`/riders/${params.row.id}`}>{params.value}</Link> },
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

  return (
    <main>
      <Grid container spacing={2}>
      <Grid size={session?.id ? 8 : 12}>
        <DataGrid
            sx={{ "& .header-checkbox": { pointerEvents: "none" } }}
            rows={riders}
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
            pageSizeOptions={[10,50,100]}
            checkboxSelection={!!session?.id} // Enable checkboxSelection if session.id exists
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleSelectionModelChange}
            rowSelectionModel={selectionModel}
            disableColumnSelector={true}
            autosizeOptions={autosizeOptions}
            autosizeOnMount={true}
            />
        </Grid>
        {session ? (
          <Stack spacing={2}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
              >
                User updated
              </Alert>
            </Snackbar>
            
            {team ? (
              <>
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
                  {team.draftTeamRiders?.map((rider: DraftTeamRiderWithDetails, index: number) => (
                    <ListItem key={index} disablePadding>
                      {rider.rider.nation ? (
                      <ListItemIcon>
                      <Image
                        src={findFlagUrlByIso3Code(rider.rider.nation)}
                        alt={rider.rider.nation}
                        width={24}
                        height={16}
                        style={{ border: "1px solid grey" }}
                      />
                    </ListItemIcon>
                    ): null}
                      <ListItemText
                        primary={rider.rider.name}
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "text.primary", display: "inline" }}
                          >
                            Cost: {rider.rider.price2025}
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
