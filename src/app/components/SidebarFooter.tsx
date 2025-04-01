"use client";

import * as React from 'react';
import { Stack, Switch, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { CurrentContext } from '../contextprovider';

interface SidebarFooterProps {
  mini: boolean;
}


const SidebarFooter: React.FC<SidebarFooterProps> = ({ mini }) => {
  const currentYear = new Date().getFullYear();
  const {isWomen, setIsWomen} = useContext(CurrentContext);
  const [timeRemaining, setTimeRemaining] = useState('');

  const handleSwitchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsWomen(!isWomen);
      },
    [setIsWomen, isWomen],
  );

  useEffect(() => {
    const targetDate = new Date(`${currentYear}-06-01T00:00:00`);
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining('Time is up!');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [currentYear]);

  return (
    <Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
      <Typography variant="caption" sx={{ m: 1 }}>Deadline: 2025-06-01</Typography>
      <Typography variant="caption" sx={{ m: 1 }}>Time remaining: {timeRemaining}</Typography>

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Typography>Mens</Typography>
        <Switch value={isWomen} onChange={handleSwitchChange}/>
        <Typography>Womens</Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
      >
        {mini
          ? "© MUI"
          : `© ${currentYear} Made with love by MUI`}
      </Typography>
    </Stack>
  );
};

export default SidebarFooter;