"use client";
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Rider } from '@prisma/client';

interface RiderSelectProps {
    riderData: Rider[];
    defaultValue?: Rider | null;
    onChange: (selectedRider: Rider) => void;
}

const RiderSelect: React.FC<RiderSelectProps> = ({ riderData, defaultValue, onChange }) => {
    const [value, setValue] = React.useState<Rider | null>(defaultValue || null);

    const handleChange = (event: React.SyntheticEvent, newValue: Rider | null) => {
      setValue(newValue); // Update the selected value
      onChange(newValue as Rider); // Call the onChange prop with the new value
    };

    return (
        <Autocomplete
          fullWidth
          options={riderData}
          getOptionLabel={(option) => option.name || ""}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth />
          )}
          filterOptions={(options, { inputValue }) =>
            options.filter((option) =>
              option.name.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
        />
      );
    };

export default RiderSelect;