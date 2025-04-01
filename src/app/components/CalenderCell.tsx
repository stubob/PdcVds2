"use client";

import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { SportsScore } from "@mui/icons-material";

const CalendarCell: React.FC<GridRenderCellParams<any, string>> = (params) => {
  const rowId = params.row.id;
  const urlBase = params.urlBase;
  return (
      <Button variant="text" href={`${urlBase}/${rowId}`}>
        <SportsScore fontSize="medium" />
      </Button>
  );
};

export default CalendarCell;