import { Stack } from "@mui/material";
import { getAllRiders, getDraftTeamById } from "../../../prisma-queries";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";
import { headers } from "next/headers";
import RiderTable from "../../../components/RiderTable";

export default async function ResultsPage() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path") ?? '';
  const id = parseInt(pathname[pathname.length - 1], 10); // Get the last part of the pathname and convert to number
  const team = await getDraftTeamById(Number(id));
  const riders = await getAllRiders();

  return (
    <main>
      <Stack direction="column" spacing={2}>
        <Stack direction={"row"} spacing={2}>
        {team?.draftTeamRiders.map((rider) => {
          return rider ? (
            <Image
              key={rider.rider.id}
              src={findFlagUrlByIso3Code(rider.rider.nation)}
              alt={rider.rider.nation}
              width={24}
              height={16}
              style={{ border: "1px solid black" }}
            />
          ) : null;
        })}
        </Stack>
        <RiderTable mensDraftTeamData={team} womensDraftTeamData={team} mensRiders={riders} womensRiders={riders} />
      </Stack>
    </main>
  );
}
