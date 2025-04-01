"use client";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CalendarCell from "../../components/CalenderCell";
import { countries, findFlagUrlByCountryName } from "country-flags-svg";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useSessionContext } from "../../contextprovider";

interface CalendarPageProps {
  isWomen: boolean;
  editable: boolean;
}

export default function CalendarTable({
  isWomen,
  editable,
}: CalendarPageProps) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { session, riderData, calendarData } = useSessionContext();
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if(!session) return;
      const data = calendarData
        .filter((event) => event.type === isWomen)
        .map((event) => ({
          ...event,
          winner: event.raceResult?.[0]?.rider.name || '',
        }));
      setRows(data);

      const filteredRiders = riderData.filter((rider) => rider.type === isWomen);
      setRiders(filteredRiders.map((rider: any) => ({ id: rider.id, name: rider.name })));
    };

    fetchData();
  }, [isWomen, session, riderData, calendarData]);

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      width: 100,
      editable: editable,
      valueGetter: (params) => {
        return new Date(params);
      },
    },
    { field: "name", headerName: "Name", width: 500, editable: editable },
    {
      field: "nation",
      headerName: "Nation",
      width: 100,
      editable: editable,
      type: editable ? "singleSelect" : "string",
      valueOptions: editable ? countries.map((country) => country.name) : undefined,
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
      width: 150,
      editable: editable,
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
      width: 150,
      editable: false,
      renderCell: (params) => <CalendarCell {...params} urlBase={editable ? "/admin/admin-calendar" : "/results"} />,
      sortable: false,
      filterable: false,
  }

  ];
  if (editable) {
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: "primary.main",
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    });
  }else{
    columns.push(
      {
        field: "winner",
        headerName: "Winner",
        width: 150,
        editable: false,
        type: "string",
      }
    )
  }

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
      />
    </main>
  );
}
