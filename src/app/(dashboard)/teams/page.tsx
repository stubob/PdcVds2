"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getDraftTeams } from "../../prisma-queries";
import { useSessionContext } from "../../contextprovider";

export default function TeamResultsPage() {

    const { session, isWomen } = useSessionContext();
    const [teams, setTeams] = useState([]);

    const columns: GridColDef[] = [
        { field: "id", headerName: "Rank", width: 100, editable: true },
        { field: "name", headerName: "Team Name", width: 500, editable: true },
        { field: "userName", headerName: "User Name", width: 500, editable: true },
        { field: "score2025", headerName: "Score", width: 100, editable: true },
    ];    
    useEffect(() => {
        const fetchData = async () => {
            const teams = await getDraftTeams(isWomen);
            setTeams(teams);
        };
        fetchData();
        return () => {
            // Cleanup logic here
        };
    }, [isWomen]);
    return (
        <main>
            <DataGrid rows={teams} columns={columns} pageSize={50} />
        </main>
    );
}