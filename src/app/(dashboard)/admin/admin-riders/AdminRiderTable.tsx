"use client";

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { countries, findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";
import { useSessionContext } from "../../../contextprovider";
import { deleteRider, updateRider } from "../../../prisma-queries";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { Rider } from "@prisma/client";
import { Save, Cancel, Edit } from "@mui/icons-material";

interface RiderPageProps {
  mensRiderData: Rider[];
  womensRiderData: Rider[];
}

export default function RiderPage({
  mensRiderData,
  womensRiderData,
}: RiderPageProps) {
  const [rows, setRows] = useState<Rider[]>([]);
  const { isWomen } = useSessionContext();
  const riderData: Rider[] = isWomen ? womensRiderData : mensRiderData;
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const apiRef = useGridApiRef();

  const handleSaveClick = (id: GridRowId) => () => {
    const row = apiRef.current.getRowWithUpdatedValues(id, "");
    if (row) {
      updateRider(row as Rider);
      const updatedRow = { ...apiRef.current.getRow(id), _action: "update" };
      apiRef.current.updateRows([updatedRow]);
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }
  }
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true  } });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteRider(id as number);
    apiRef.current.updateRows([{ id: id, _action: 'delete' }]);
  };

  const processRowUpdate = (newRow: Rider) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, headerClassName: "header-checkbox" },
    { field: "name", headerName: "Name", editable: true },
    {
      field: "nation",
      headerName: "Nation",
      editable: true,
      type: "singleSelect",
      valueOptions: countries.map((country) => country.iso3),
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
    { field: "teamKey", headerName: "Team",editable: true },
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
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: ({ id }) => {
        if(rowModesModel[id]?.mode === GridRowModes.Edit) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Save />}
              label="Save"
              color="inherit"
              onClick={handleSaveClick(id)}
              />,
            <GridActionsCellItem
              key={id}
              icon={<Cancel />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"/>
          ];
        }else {
          return [
            <GridActionsCellItem
              key={id}
              icon={<Edit />}
              label="Edit"
              onClick={handleEditClick(id)}
              color="inherit"/>,
            <GridActionsCellItem
              key={id}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        }
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (riderData) {
        setRows(riderData);
      }
    };
    fetchData();
  }, [riderData]);

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
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          rowHeight={25}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnSelector={true}
          autosizeOnMount={true}
          autosizeOptions={autosizeOptions}
          apiRef={apiRef}
          columnVisibilityModel={{ id: false }}
          editMode="row"
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          rowModesModel={rowModesModel}
  
        />
    </main>
  );
}
