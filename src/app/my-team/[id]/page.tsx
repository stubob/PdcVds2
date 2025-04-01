"use client";

import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { getDraftTeamById } from "../../prisma-queries";
import { findFlagUrlByIso3Code } from "country-flags-svg";
import Image from "next/image";

export default function ResultsPage() {
    const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const pathSegments = window.location.pathname.split("/");
      const id = parseInt(pathSegments[pathSegments.length - 1], 10); // Get the last part of the pathname and convert to number
      const teamData = await getDraftTeamById(id);
      setTeam(teamData.draftTeamRiders);
    };
    fetchData();
  }, []);
  return (
    <main>
      <Stack direction="row" spacing={2}>
        {team.map((draftTeamRider) => {
          const rider = draftTeamRider.rider;
          return rider ? (
            <Image
              key={rider.id}
              src={findFlagUrlByIso3Code(rider.nation)}
              alt={rider.nation}
              width={24}
              height={16}
              style={{ border: "1px solid black" }}
            />
          ) : null;
        })}
      </Stack>
    </main>
  );
}
