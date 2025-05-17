import * as React from 'react';
import { Button, Grid, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';

export default function Menu() {
    return (
        <div>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Typography variant='h2' align='center'>
                        YouTube Channel Scraper
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <Typography variant='h4' align='center'>
                        Enter a channel's handle and select which videos you'd like to retrieve
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <TextField fullWidth id="channel-handle" label="Outlined" variant="outlined"/>
                </Grid>
                <FormControl component="fieldset">
                    <FormGroup aria-label="upload-type" row>
                        <FormControlLabel
                            value="bottom"
                            control={<Checkbox />}
                            label="Long Form"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="asdadsasd"
                            control={<Checkbox />}
                            label="Shorts"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="asdadsasd"
                            control={<Checkbox />}
                            label="Livestream"
                            labelPlacement="bottom"
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
        </div>
    )
}