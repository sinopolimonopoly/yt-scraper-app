import React, { useState } from 'react';
import { Button, Grid, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Divider } from '@mui/material';

import '@fontsource/roboto';

import getVideos from './scripts/mainScripts/getVideosMainApp';
import { UploadType } from './scripts/apiScripts/playlistIdGetter';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


export default function Menu() {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [handle, setHandle] = useState("");
    const [selectedTypes, setSelectedTypes] = useState({
        long: false,
        short: false,
        live: false
    });

    const [result, setResult] = useState({});

    const isFormValid = handle.trim() !== "" && Object.values(selectedTypes).some(Boolean);

    const handleClickOpen = () => {
        setOpenConfirm(true);
    }

    const handleClose = () => {
        setOpenConfirm(false);
    }

    const runDaScript = (handle: string, selectedTypes: UploadType[]) => {
        console.log(`Retrieving from channel: ${handle}`);
        console.log(`Upload Types: ${selectedTypes}`)

        //getVideos(handle, selectedTypes);
        setOpenConfirm(false);
    }

    const handleClick = async (handle: string, selectedTypes: UploadType[]) => {
        const data = await callGetVideosScript(handle, selectedTypes);
        setResult(data);
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTypes({
            ...selectedTypes,
            [event.target.name]: event.target.checked
        });
    };

    const getSelectedTypes = () => {
        const labels: Record<string, UploadType> = {
            long: 'videos',
            short: 'shorts',
            live: 'livestreams'
        };

        const selected = Object.entries(selectedTypes)
            .filter(([_, isChecked]) => isChecked)
            .map(([key]) => labels[key as keyof typeof labels]);
        
        return selected;
    }

    const callGetVideosScript = async(channelId: string, uploadTypes: UploadType[]) => {
        try {
            console.log(baseUrl);
            const res = await fetch(`${baseUrl}/api/get-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelId, uploadTypes }),
            });

            const data = await res.json();
            console.log(data);
            return data;
        } catch (err: any) {
            console.log(baseUrl)
            console.log("FRONT END API ERROR");
            console.error("ERROR", err);
        }
    }


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
                <Grid size={12} justifyContent="center" display={"flex"}>
                    <TextField fullWidth 
                        id="channel-handle" 
                        label="Handle" 
                        variant="outlined"
                        onChange={(e) => setHandle(e.target.value)}
                        sx={{ width: '400px' }}
                    />
                </Grid>
                <Grid size={12} container justifyContent="center">
                    <FormControl component="fieldset">
                        <FormGroup aria-label="upload-type" row sx={{ justifyContent: "center"}}>
                            <FormControlLabel
                                value="longs"
                                control={<Checkbox checked={selectedTypes.long} onChange={handleCheckboxChange} name="long"/>}
                                label="Long Form"
                                labelPlacement="bottom"
                                sx={{ alignItems: "center", margin: 2 }}
                            />
                            <FormControlLabel
                                value="shorts"
                                control={<Checkbox checked={selectedTypes.short} onChange={handleCheckboxChange} name="short"/>}
                                label="Shorts"
                                labelPlacement="bottom"
                                sx={{ alignItems: "center", margin: 2 }}
                            />
                            <FormControlLabel
                                value="livestreams"
                                control={<Checkbox checked={selectedTypes.live} onChange={handleCheckboxChange} name="live"/>}
                                label="Livestreams"
                                labelPlacement="bottom"
                                sx={{ alignItems: "center", margin: 2 }}
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid size={12} container justifyContent="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        Fetch Videos
                    </Button>
                </Grid>
                
                <Dialog 
                    open={openConfirm} 
                    onClose={handleClose}
                    sx={{ '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        } 
                    }}
                >    
                    <DialogTitle>Verify Request</DialogTitle>
                    { isFormValid ? (
                    <>
                        <DialogContent>
                            Are you sure you want to retrieve the following uploads from channel 
                            <br />
                            @<strong>{handle}</strong>?
                        </DialogContent>
                        <Divider />
                        <DialogContent>
                            {getSelectedTypes().join(' & ')}
                        </DialogContent>
                    </>
                    ) :
                    <> 
                        <DialogContent>
                            Enter a YouTube channel handle and select an upload type to fetch results
                        </DialogContent>
                    </>
                    }
                    <DialogActions>
                        { isFormValid ? (
                            <>
                                <Button onClick={() => setOpenConfirm(false)} color="error">
                                    Cancel
                                </Button>
                                <Button onClick={() => handleClick(handle.trim(), getSelectedTypes())} color="primary">
                                    Fetch Uploads
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setOpenConfirm(false)}>
                                    Close
                                </Button>
                            </>
                            )
                        }
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    )
}