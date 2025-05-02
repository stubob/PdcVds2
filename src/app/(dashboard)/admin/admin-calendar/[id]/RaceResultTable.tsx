"use client";

import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Race, RaceResult, Rider } from "@prisma/client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import {
  createRaceResult,
  updateDraftScores,
  updateRaceResult,
  updateRiderScore,
} from "../../../../prisma-queries";
import RiderSelect from "./RiderSelect";

interface RaceResultProps {
  raceData: RaceResult[];
  metadata: Race;
  mensRiderData: any[];
  womensRiderData: any[];
}

export default function RaceResultTable({
  raceData,
  metadata,
  mensRiderData,
  womensRiderData,
}: RaceResultProps) {
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [rows, setRows] = useState<TemplateType[]>([]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [editable, setEditable] = useState(true);

  const handleRiderChange = (sequence: number, selectedRider: Rider) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.sequence === sequence) {
          // Update the selected rider in the row
          return { ...row, selectedRider };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    const allRowsHaveSelectedRiders = rows.every((row) => row.selectedRider);
    setIsSaveEnabled(allRowsHaveSelectedRiders);
  }, [rows]);


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", editable: false, type: "number" },
    { field: "sequence", headerName: "Position", editable: false },
    { field: "title", headerName: "Title", editable: false },
    { field: "selectedRider", headerName: "Rider", editable: false, type: 'string', renderCell: (params) => {
      return params.row.selectedRider?.name || "No Rider Selected";
    }
  },
    {
      field: "rider",
      headerName: "Rider",
      type: 'singleSelect',
      valueFormatter: (value: Rider) => value?.name,
      renderCell: (params) => (
        <RiderSelect
          riderData={filteredRiders}
          defaultValue={
            filteredRiders.find((rider) => rider.id === params.row.selectedRider?.id) ||
            null
          }
          onChange={(selectedRider) =>
            handleRiderChange(params.row.sequence, selectedRider)
          }
        />
      ),
    },
    { field: "points", headerName: "Points", editable: false },
  ];

  type TemplateType = {
    id?: number;
    title: string;
    sequence: number;
    points: number;
    selectedRider?: Rider | null;
  };

  const HOUR_RECORD_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "Special", sequence: 1, points: 100 },
    ], []);
  const NATIONAL_CHAMP_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "National Champion", sequence: 1, points: 100 },
    ], []);
  const MINOR_RACE_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 100 },
      { title: "2", sequence: 2, points: 70 },
      { title: "3", sequence: 3, points: 50 },
      { title: "4", sequence: 4, points: 30 },
      { title: "5", sequence: 5, points: 15 },
    ], []);
  const MINOR_RACE_STAGE_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 25 },
    ], []);
  const MINOR_RACE_FINAL_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 100 },
      { title: "2", sequence: 2, points: 70 },
      { title: "3", sequence: 3, points: 50 },
      { title: "4", sequence: 4, points: 30 },
      { title: "5", sequence: 5, points: 15 },
    ], []);
  const BEST_OF_THE_REST_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 150 },
      { title: "2", sequence: 2, points: 125 },
      { title: "3", sequence: 3, points: 100 },
      { title: "4", sequence: 4, points: 80 },
      { title: "5", sequence: 5, points: 60 },
      { title: "6", sequence: 6, points: 50 },
      { title: "7", sequence: 7, points: 40 },
      { title: "8", sequence: 8, points: 30 },
      { title: "9", sequence: 9, points: 20 },
      { title: "10", sequence: 10, points: 10 },
    ], []);
  const BEST_OF_THE_REST_STAGE_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 40 },
      { title: "2", sequence: 2, points: 20 },
      { title: "3", sequence: 3, points: 10 },
    ], []);
  const BEST_OF_THE_REST_FINAL_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 150 },
      { title: "2", sequence: 2, points: 125 },
      { title: "3", sequence: 3, points: 100 },
      { title: "4", sequence: 4, points: 80 },
      { title: "5", sequence: 5, points: 60 },
      { title: "6", sequence: 6, points: 50 },
      { title: "7", sequence: 7, points: 40 },
      { title: "8", sequence: 8, points: 30 },
      { title: "9", sequence: 9, points: 20 },
      { title: "10", sequence: 10, points: 10 },
    ], []);

  const TOP_CLASSICS_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 250 },
      { title: "2", sequence: 2, points: 200 },
      { title: "3", sequence: 3, points: 180 },
      { title: "4", sequence: 4, points: 160 },
      { title: "5", sequence: 5, points: 140 },
      { title: "6", sequence: 6, points: 120 },
      { title: "7", sequence: 7, points: 100 },
      { title: "8", sequence: 8, points: 90 },
      { title: "9", sequence: 9, points: 80 },
      { title: "10", sequence: 10, points: 70 },
      { title: "11", sequence: 11, points: 60 },
      { title: "12", sequence: 12, points: 50 },
      { title: "13", sequence: 13, points: 40 },
      { title: "14", sequence: 14, points: 30 },
      { title: "15", sequence: 15, points: 15 },
    ], []);

  const TOP_STAGE_RACES_STAGE_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 50 },
      { title: "2", sequence: 2, points: 25 },
      { title: "3", sequence: 3, points: 10 },
      { title: "Leader Jersey", sequence: 4, points: 6 },
    ], []);

  const TOP_STAGE_RACES_FINAL_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 250 },
      { title: "2", sequence: 2, points: 200 },
      { title: "3", sequence: 3, points: 180 },
      { title: "4", sequence: 4, points: 160 },
      { title: "5", sequence: 5, points: 140 },
      { title: "6", sequence: 6, points: 120 },
      { title: "7", sequence: 7, points: 100 },
      { title: "8", sequence: 8, points: 90 },
      { title: "9", sequence: 9, points: 80 },
      { title: "10", sequence: 10, points: 70 },
      { title: "11", sequence: 11, points: 60 },
      { title: "12", sequence: 12, points: 50 },
      { title: "13", sequence: 13, points: 40 },
      { title: "14", sequence: 14, points: 30 },
      { title: "15", sequence: 15, points: 15 },
      { title: "Points Jersey 1", sequence: 16, points: 60 },
      { title: "Points Jersey 2", sequence: 17, points: 40 },
      { title: "Points Jersey 3", sequence: 18, points: 20 },
      { title: "Mountains Jersey 1", sequence: 19, points: 60 },
      { title: "Mountains Jersey 2", sequence: 20, points: 40 },
      { title: "Mountains Jersey 3", sequence: 21, points: 20 },
      { title: "Youth Jersey 1", sequence: 22, points: 60 },
      { title: "Youth Jersey 2", sequence: 23, points: 40 },
      { title: "Youth Jersey 3", sequence: 24, points: 20 },
    ], []);

  const GRAND_TOUR_STAGE_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 100 },
      { title: "2", sequence: 2, points: 40 },
      { title: "3", sequence: 3, points: 30 },
      { title: "4", sequence: 4, points: 20 },
      { title: "5", sequence: 5, points: 10 },
      { title: "Intermediate Leader Jersey", sequence: 6, points: 20 },
      { title: "Intermediate Points Jersey", sequence: 7, points: 10 },
      { title: "Intermediate Mountain Jersey", sequence: 8, points: 10 },
      { title: "Intermediate Other Jersey", sequence: 9, points: 10 },
    ], []);

  const GRAND_TOUR_FINAL_LEADER_JERSEY_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 600 },
      { title: "2", sequence: 2, points: 450 },
      { title: "3", sequence: 3, points: 375 },
      { title: "4", sequence: 4, points: 325 },
      { title: "5", sequence: 5, points: 300 },
      { title: "6", sequence: 6, points: 275 },
      { title: "7", sequence: 7, points: 250 },
      { title: "8", sequence: 8, points: 225 },
      { title: "9", sequence: 9, points: 200 },
      { title: "10", sequence: 10, points: 175 },
      { title: "11", sequence: 11, points: 150 },
      { title: "12", sequence: 12, points: 135 },
      { title: "13", sequence: 13, points: 120 },
      { title: "14", sequence: 14, points: 105 },
      { title: "15", sequence: 15, points: 90 },
      { title: "16", sequence: 16, points: 75 },
      { title: "17", sequence: 17, points: 60 },
      { title: "18", sequence: 18, points: 45 },
      { title: "19", sequence: 19, points: 30 },
      { title: "20", sequence: 20, points: 15 },
      { title: "1", sequence: 21, points: 120 },
      { title: "2", sequence: 22, points: 90 },
      { title: "3", sequence: 23, points: 60 },
      { title: "4", sequence: 24, points: 40 },
      { title: "5", sequence: 25, points: 20 },
      { title: "1", sequence: 26, points: 60 },
      { title: "2", sequence: 27, points: 40 },
      { title: "3", sequence: 28, points: 20 },
      { title: "1", sequence: 29, points: 60 },
      { title: "2", sequence: 30, points: 40 },
      { title: "3", sequence: 31, points: 20 },
    ], []);
  const MONUMENTS_AND_WORLDS_TEMPLATE: TemplateType[] = useMemo(
    () => [
      { title: "1", sequence: 1, points: 350 },
      { title: "2", sequence: 2, points: 300 },
      { title: "3", sequence: 3, points: 275 },
      { title: "4", sequence: 4, points: 250 },
      { title: "5", sequence: 5, points: 225 },
      { title: "6", sequence: 6, points: 200 },
      { title: "7", sequence: 7, points: 175 },
      { title: "8", sequence: 8, points: 150 },
      { title: "9", sequence: 9, points: 125 },
      { title: "10", sequence: 10, points: 100 },
      { title: "11", sequence: 11, points: 90 },
      { title: "12", sequence: 12, points: 80 },
      { title: "13", sequence: 13, points: 70 },
      { title: "14", sequence: 14, points: 60 },
      { title: "15", sequence: 15, points: 50 },
      { title: "16", sequence: 16, points: 40 },
      { title: "17", sequence: 17, points: 30 },
      { title: "18", sequence: 18, points: 20 },
      { title: "19", sequence: 19, points: 10 },
      { title: "20", sequence: 20, points: 5 },
    ], []);

  useEffect(() => {
    const initData = async () => {
      if (metadata) {
        let template: TemplateType[] = [];
        switch (metadata?.category) {
          case "Other":
            template = HOUR_RECORD_TEMPLATE;
            break;
          case "National Championship":
            template = NATIONAL_CHAMP_TEMPLATE;
            break;
          case "Minor Races(SSRs)":
            template = MINOR_RACE_TEMPLATE;
            break;
          case "Best of the Rest":
            template = BEST_OF_THE_REST_TEMPLATE;
            break;
          case "Best of the Rest-Stage":
            template = BEST_OF_THE_REST_STAGE_TEMPLATE;
            break;
          case "Best of the Rest-Final":
            template = BEST_OF_THE_REST_FINAL_TEMPLATE;
            break;
          case "Top Classics":
            template = TOP_CLASSICS_TEMPLATE;
            break;
          case "Top Stage Races-Stage":
            template = TOP_STAGE_RACES_STAGE_TEMPLATE;
            break;
          case "Top Stage Races-Final":
            template = TOP_STAGE_RACES_FINAL_TEMPLATE;
            break;
          case "Grand Tour-Stage":
            template = GRAND_TOUR_STAGE_TEMPLATE;
            break;
          case "Grand Tour-Final":
            template = GRAND_TOUR_FINAL_LEADER_JERSEY_TEMPLATE;
            break;
          case "Monuments and Worlds":
            template = MONUMENTS_AND_WORLDS_TEMPLATE;
            break;
          default:
            return;
        }
        if (raceData.length > 0) {
          raceData.forEach((row) => {
            const templateRow = template.find((t) => t.sequence === row.sequence);
            if (templateRow) {
              templateRow.selectedRider = mensRiderData.find((rider) => rider.id === row.riderId);
            }
          });
          setEditable(false);
        }
        setRows(template);

      }
      setFilteredRiders(metadata?.type ? womensRiderData : mensRiderData);
    };
    initData();
  }, [metadata,
    raceData,
    mensRiderData,
    womensRiderData,
    BEST_OF_THE_REST_FINAL_TEMPLATE,
    BEST_OF_THE_REST_STAGE_TEMPLATE,
    BEST_OF_THE_REST_TEMPLATE,
    TOP_STAGE_RACES_STAGE_TEMPLATE,
    TOP_STAGE_RACES_FINAL_TEMPLATE,
    GRAND_TOUR_STAGE_TEMPLATE,
    GRAND_TOUR_FINAL_LEADER_JERSEY_TEMPLATE,
    MONUMENTS_AND_WORLDS_TEMPLATE,
    HOUR_RECORD_TEMPLATE,
    NATIONAL_CHAMP_TEMPLATE,
    MINOR_RACE_TEMPLATE,
    TOP_CLASSICS_TEMPLATE]);

  const handleSave = async () => {
    for (const row of rows) {
      if (row.selectedRider) {
        const newRow = await createRaceResult({
          title: row.title,
          riderId: row.selectedRider?.id ?? 0, // Use 0 if riderId is undefined
          sequence: row.sequence,
          points: row.points,
          raceId: metadata.id,
        });
        await updateRiderScore(row.selectedRider.id, row.points);
        await updateDraftScores(row.selectedRider.id, row.points);
      }
    }
    setEditable(false);
  };

  const handleReset = async () => {
    for (const row of rows) {
      if (row.selectedRider) {
        await updateRaceResult({
          id: row.id ?? 0,
          title: row.title,
          riderId: row.selectedRider?.id ?? 0, // Use 0 if riderId is undefined
          sequence: row.sequence,
          points: -row.points,
          raceId: metadata.id,
        });
        await updateRiderScore(row.selectedRider.id, -row.points);
        await updateDraftScores(row.selectedRider.id, -row.points);
      }
    }
      setRows((prevRows) =>
    prevRows.map((row) => ({
      ...row,
      selectedRider: null, // Clear the selectedRider field
    })));
    setEditable(true);

  };

  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{metadata?.name}</Typography>
        <Typography variant="subtitle1">
          {metadata?.date
            ? new Date(metadata.date).toLocaleDateString("en-US")
            : ""}
        </Typography>
        <DataGrid
          columns={columns}
          rows={rows}
          disableColumnFilter={true}
          disableColumnSorting={true}
          autosizeOnMount={true}
          autosizeOptions={autosizeOptions}
          getRowId={(row) => row.sequence}
          columnVisibilityModel={{ id: false, sequence: false, selectedRider: !editable, rider: editable }}
          editMode="row"
        />
      </CardContent>
      <CardActions>
        { editable ? (
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!isSaveEnabled}>
          Save
        </Button>
        ) : (
        <Button variant="contained" color="primary" onClick={handleReset}>
          Reset
        </Button>
        )}
      </CardActions>
    </Card>
  );
}
