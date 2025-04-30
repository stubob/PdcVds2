"use client";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { countries, findFlagUrlByCountryName } from "country-flags-svg";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useSessionContext } from "../../../contextprovider";
import CalendarCell from "../../../components/CalenderCell";
import { deleteRace, updateRace } from "../../../prisma-queries";
import { Race } from "@prisma/client";
import { Save } from "@mui/icons-material";

interface AdminCalendarTableProps {
  calendarData: any[];
}

export default function AdminCalendarTable({calendarData}: AdminCalendarTableProps) {
  const [rows, setRows] = useState<Race[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { isWomen } = useSessionContext();
  const apiRef = useGridApiRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = calendarData
        .filter((event) => event.type === isWomen)
        .map((event) => ({
          ...event,
          winner: event.raceResult?.[0]?.rider.name || "",
        }));
      setRows(data);
    };

    fetchData();
  }, [isWomen, calendarData]);

  const handleSaveClick = (id: GridRowId) => () => {
    const row = apiRef.current.getRow(id);
    if (row) {
      updateRace(row);
      const updatedRow = { ...row, _action: "update" };
      apiRef.current.updateRows([updatedRow]);
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteRace(id as number);
    apiRef.current.updateRows([{ id: id, _action: 'delete' }]);
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      editable: true,
      valueGetter: (params) => {
        return new Date(params);
      },
    },
    { field: "name", headerName: "Name", editable: true },
    {
      field: "nation",
      headerName: "Nation",
      editable: true,
      type: "singleSelect",
      valueOptions: countries.map((country) => country.name),
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
      editable: true,
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
      renderCell: (params) => (
        <CalendarCell {...params} urlBase={"/admin/admin-calendar"} />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<Save/>}
            label="Save"
            color="inherit"
            onClick={handleSaveClick(id)}
            />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // const fetchCalendarData = async () => {
  //   try {
  //     const updatedData = await getCalendarData(); // Replace with your actual API call
  //     apiRef.current.setRows(updatedData); // Update the rows in the DataGrid
  //     console.log("Calendar data successfully reloaded.");
  //   } catch (error) {
  //     console.error("Error fetching calendar data:", error);
  //   }
  // };


  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true,
  };


  return (
    <main>
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
        rowHeight={30}
        keepNonExistentRowsSelected
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnSelector={true}
        autosizeOnMount={true}
        autosizeOptions={autosizeOptions}
        apiRef={apiRef}
        //processRowUpdate={processRowUpdate}
      />
    </main>
  );
}
