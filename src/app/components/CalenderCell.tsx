"use client";

import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { SportsScore } from "@mui/icons-material";

interface CalendarCellProps extends GridRenderCellParams {
  urlBase: string;
}
const CalendarCell: React.FC<CalendarCellProps> = ({ urlBase, ...params }) => {
  const rowId = params.row.id;
  return (
      <Button variant="text" href={`${urlBase}/${rowId}`}>
        <SportsScore fontSize="medium" />
      </Button>
  );
};

export default CalendarCell;