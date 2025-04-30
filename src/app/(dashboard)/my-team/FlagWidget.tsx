"use client";

import { Link } from "@mui/material";
import { useSessionContext } from "../../contextprovider";
import { useEffect, useState } from "react";
import { DraftTeam } from "@prisma/client";

interface FlagsWidgetProps {
    mensTeamData: DraftTeam;
    womensTeamData: DraftTeam;
}

export default function FlagsWidget({mensTeamData, womensTeamData}: FlagsWidgetProps) {
    const {isWomen} = useSessionContext();
    const [team, setTeam] = useState<DraftTeam>();

    useEffect(() => {
        if (isWomen) {
            setTeam(womensTeamData);
        } else {
            setTeam(mensTeamData);
        }
    }, [isWomen, mensTeamData, womensTeamData]);

  return (
    <Link href={`/my-team/${team?.id}`}>Flags!</Link>
);
}