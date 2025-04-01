"use client";

import { useEffect, useState } from "react";
import { getRaceResult, getRace } from "../../../../prisma-queries";
import { Race, RaceResult } from "@prisma/client";
import RaceResultTable from "./RaceResultTable";

export default function RaceAdminPage() {
    const [rows, setRows] = useState<RaceResult[]>([]);
    const [metadata, setMetadata] = useState<Race>();

      useEffect(() => {
        const fetchData = async () => {
          const pathSegments = window.location.pathname.split('/');
          const id = pathSegments[pathSegments.length - 1]; // Get the last part of the pathname
          if (id) {
            const data = await getRaceResult(Number(id));
            setRows(data);
            const metadata = await getRace(Number(id));
            setMetadata(metadata);
          }
        };
        fetchData();
      }, []); // Empty dependency array ensures this runs only once

    return (
        <main>
            <RaceResultTable isWomen={false} raceData={rows} metadata={metadata}/>
        </main>
    );
}
