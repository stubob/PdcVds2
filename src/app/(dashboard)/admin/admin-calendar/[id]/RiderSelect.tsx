"use client";
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface RiderSelectProps {
    riderData: { label: string, value: string }[];
    defaultValue?: { label: string, value: string } | null;
    onChange: (selectedRider: { label: string, value: string }) => void;
}

const RiderSelect: React.FC<RiderSelectProps> = ({ riderData, defaultValue, onChange }) => {
    const handleChange = (event: any, value: { label: string, value: string } | null) => {
        if (value) {
            onChange(value);
        }
    };

    return (
        <Autocomplete
            fullWidth={true}
            options={riderData}
            getOptionLabel={(option) => option.label}
            defaultValue={defaultValue || null}
            value={defaultValue || null}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth={true} />}
        />
    );
};

export default RiderSelect;