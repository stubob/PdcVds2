"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import CalendarTable from "./CalendarTable";
import { useSessionContext } from "../../contextprovider";

export default function CalendarPage() {
  const { isWomen } = useSessionContext();

  return (
    <main>
        <CalendarTable editable={false} isWomen={isWomen} />
    </main>
  );
}
