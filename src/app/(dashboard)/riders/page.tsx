"use client";

import { Paper } from "@mui/material";
import RiderTable from "./RiderTable";
import { useSessionContext } from "../../contextprovider";

export default function RiderPage(){
    const { isWomen } = useSessionContext();

    return (
      <main>
        <RiderTable isWomen={isWomen}/>
      </main>
    );
}