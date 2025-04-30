import { Check, Error } from "@mui/icons-material";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { lockDraftTeam } from "../prisma-queries";
import { useSession } from "next-auth/react";
import { Rider } from "@prisma/client";

interface RulesWidgetProps {
  isWomen: boolean;
  team: any;
}

export default function RulesWidget({ isWomen, team }: RulesWidgetProps) {
    const { data: session } = useSession();
    const [numRiders, setNumRiders] = useState<boolean>(false);
    const [total, setTotal] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [restricted, setRestricted] = useState<boolean>(false);
    const [doubleRestricted, setDoubleRestricted] = useState<boolean>(false);
    const [checkValid, setCheckValid] = useState<boolean>(false);
  
  useEffect(() => {
    setTotalPrice(team.draftTeamRiders.reduce(
        (total: number, rider: Rider) => total + rider.price2025,
        0
      ));
    if (isWomen) {
      setNumRiders(team.draftTeamRiders.length != 15);
      setTotal(totalPrice > 150);
      setDoubleRestricted(
        team.draftTeamRiders.filter((rider: Rider) => rider.price2025 >= 24).length > 1
      );
      setRestricted(
        team.draftTeamRiders.filter((rider: Rider) => rider.price2025 >= 18).length > 3
      );
    } else {
      setNumRiders(team.draftTeamRiders.length != 25);
      setTotal(totalPrice > 150);
      setDoubleRestricted(
        team.draftTeamRiders.filter((rider: Rider) => rider.price2025 >= 24).length > 1
      );
      setRestricted(
        team.draftTeamRiders.filter((rider: Rider) => rider.price2025 >= 18).length > 3
      );
      setCheckValid(numRiders && total && restricted && doubleRestricted);
    }
  }, [team, isWomen]);

  const handleSubmitTeam = async () => {
    const confirmed = window.confirm(
      "Are you sure? You will not be able to change your team after submitting."
    );
    if (confirmed && session?.user?.id) {
      // Add logic to submit a team
      lockDraftTeam(session.user.id, team);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Total Price: {totalPrice}</Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{numRiders ? <Error color="error" /> : <Check color="success" />}</ListItemIcon>
            <ListItemText primary={`Riders: = ${isWomen ? 15 : 25}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{total ? <Error color="error" /> : <Check color="success" />}</ListItemIcon>
            <ListItemText primary={`Cost: <= ${isWomen ? 150 : 150}`} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{restricted ? <Error color="error" /> : <Check color="success" />}</ListItemIcon>
            <ListItemText
              primary={`Restricted Riders(+18): <= ${isWomen ? 3 : 3}`}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {doubleRestricted ? <Error color="error" /> : <Check color="success" />}
            </ListItemIcon>
            <ListItemText
              primary={`Double Restriced Riders(+24): <= ${isWomen ? 1 : 1}`}
            />
          </ListItemButton>
        </ListItem>
      </List>
      {!team.locked ? (
        <Button variant="contained" color="primary" disabled={!checkValid} onClick={handleSubmitTeam}>
          Save Team
        </Button>
      ) : (
        <></>
      )}
    </Stack>
  );
}
