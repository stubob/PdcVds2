import * as React from "react";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/system";
import { Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { headers } from "next/headers";
import { getRaceById, getRaceResultById } from "../../../datalayer";

export default async function ResultsPage() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path") ?? '';
    const id = parseInt(pathname.split('/').pop() as string, 10); // Get the last part of the pathname and convert to number
  const data = await getRaceResultById(Number(id));
  const metadata = await getRaceById(Number(id));

  return (
    <Paper sx={{ padding: "10px", margin: "10px" }}>
      <Stack direction={"column"} spacing={2}>
        <Typography variant="h4">{metadata?.name}</Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Rider</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell width={100}>{row.title}</TableCell>
              <TableCell width={500}><Link href={`/riders/${row.riderId}`}>{row.riderName}</Link></TableCell>
              <TableCell width={100}>{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </Stack>
        </Paper>
  );
}
