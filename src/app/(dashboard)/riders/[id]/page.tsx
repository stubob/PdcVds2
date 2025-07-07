import { Card, CardContent, Grid2 as Grid, Stack, Table, TableBody, TableRow, Typography } from "@mui/material";
import Image from "next/image";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import { headers } from "next/headers";
import RiderResultsTable from "./RiderResultsTable";
import { getRiderById } from "../../../datalayer";

export default async function RidersPage() {

    const headerList = await headers();
    const pathname = headerList.get("x-current-path") ?? '';
    const id = parseInt(pathname.split('/').pop() as string, 10); // Get the last part of the pathname and convert to number
    const data = await getRiderById(id);

    return (
        <Grid container spacing={2}>
            <Grid size={2}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                            <Typography variant="h6">Name:</Typography>            
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.name}</Typography>    
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="h6">Age:</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.age}</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="h6">Nation:</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.nation && <Image src={findFlagUrlByIso3Code(data?.nation)} alt={data?.nation} width={24} height={16} style={{ border: "1px solid black" }} />}</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="h6">Team:</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.teamKey}</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="h6">Points 2025:</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.score2025}</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="h6">Points 2024:</Typography>
                            </Grid>
                            <Grid size={6}>
                            <Typography variant="body1">{data?.score2024}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>

                </Card>
            </Grid>
            <Grid size={10}>
                <Stack direction="column" spacing={2}>
                <Typography variant="h4">Results</Typography>
                <RiderResultsTable data={data?.results} />
                </Stack>
            </Grid>
        </Grid>
    )
}