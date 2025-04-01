"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import { GridColDef } from "@mui/x-data-grid";
import { getRace, getRaceResult } from "../../../prisma-queries";
import { useEffect } from "react";
import { useActivePage } from '@toolpad/core/useActivePage';
import { useParams } from "next/navigation";
import { Stack } from "@mui/system";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const columns: GridColDef[] = [
  { field: "title", headerName: "Category", width: 500, editable: false },
  { field: "riderName", headerName: "Rider", width: 500, editable: false },
  { field: "points", headerName: "Points", width: 100, editable: false },
];


export default function ResultsPage() {
  const [rows, setRows] = React.useState([]);
  const [metadata, setMetadata] = React.useState({});
  const params = useParams<{ id: string }>();
  const activePage = useActivePage();

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

  // useEffect(() => {
  //   if (activePage && params.id) {
  //     const title = `Item ${params.id}`;
  //     const path = `${activePage.path}/${params.id}`;
  //     const breadcrumbs = [...activePage.breadcrumbs, { title, path }];
      
  //     activePage.title = title;
  //     activePage.breadcrumbs = breadcrumbs;
  //   }
  // }, [activePage, params.id]);

  return (
    <Paper sx={{ padding: "10px", margin: "10px" }}>
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h4">{metadata.name}</Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Rider</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell width={100}>{row.title}</TableCell>
              <TableCell width={500}>{row.riderName}</TableCell>
              <TableCell width={100}>{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </Stack>
        </Paper>
  );
}
