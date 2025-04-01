import { Autocomplete, TextField } from "@mui/material";
import React from "react";

interface RiderSelectProps {
  riders: { id: string; name: string }[];
}

const RiderSelect: React.FC<RiderSelectProps> = ({ riders }) => {
  return (
    <Autocomplete
        autoComplete
      options={riders}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label="Rider" />}
    />
  );
};

export default RiderSelect;