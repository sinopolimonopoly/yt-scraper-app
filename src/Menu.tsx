import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'; 
import { Button, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Switch } from '@mui/material';

import '@fontsource/roboto';

import { UploadType } from './scripts/apiScripts/playlistIdGetter';

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl, "top of menu")

export default function Menu() {

    const [openConfirm, setOpenConfirm] = useState(false);
    const [input, setInput] = useState("");
    const [selectedTypes, setSelectedTypes] = useState({
        long: false,
        short: false,
        live: false
    });

    const [isToggled, setIsToggled] = useState(true);

    const [chanVideoList, setChanVideoList] = useState<any[]>([]);

    const [channelInfo, setChannelInfo] = useState({
        channel: "",
        handle: "",
        subscribers: 0,
        thumbnail: ""
    })

    const [pListVideoList, setPListVideoList] = useState<any[]>([]);

    const [playlistInfo, setPlaylistInfo] = useState({
        title: "",
        description: "",
        createDate: "",
        channel: "",
        videoCount: 0,
        thumbnail: ""
    })

    const [isVideoErr, setIsVideoErr] = useState(false);
    const [videoErrMsg, setvideoErrMsg] = useState("")

    const [isInfoErr, setIsInfoErr] = useState(false);
    const [infoErrMsg, setInfoErrMsg] = useState("")

    const [loading, setLoading] = useState(false);

    const [openErrDialog, setOpenErrDialog] = useState(false);

    useEffect(() => {
                console.log("VIDEO RESULTS updated", chanVideoList);
                console.log(chanVideoList.length);
                console.log(Array.isArray(chanVideoList));
                console.log(channelInfo);
            }, [chanVideoList]);

    const isFormValid = input.trim() !== "" && Object.values(selectedTypes).some(Boolean);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsToggled(event.target.checked)
    }

    const handleClickOpen = () => {
        setOpenConfirm(true);
        setIsInfoErr(false);
        setIsVideoErr(false);
    }

    const handleClose = () => {
        setOpenConfirm(false);
    }

    const handleChannelClick = async (handle: string, selectedTypes: UploadType[]) => {
        setLoading(true);    
        // Fetch api results
        const chanInfo = await callGetChanInfoScript(handle);

        // Set channel info states
        setChannelInfo({
            channel: chanInfo.result.ChannelName,
            handle: chanInfo.result.Handle,
            subscribers: chanInfo.result.SubCount,
            thumbnail: chanInfo.result.ThumbnailUrl
        });
        setIsInfoErr(chanInfo.error);
        setInfoErrMsg(chanInfo.errorMessage);

        if (chanInfo.error == false) { 

            const vidList = await callGetChanVideosScript(handle, selectedTypes);

            // Set video list states
            setChanVideoList(vidList.result);
            setIsVideoErr(vidList.error);
            setvideoErrMsg(vidList.errorMessage);
        }

        else if (chanInfo.error == true) {
            console.log("CHANNEL INFO ERROR")
            setChanVideoList([]);
            setIsVideoErr(true);
            setvideoErrMsg("Unable to reach channel, so no attempt was made to fetch videos.");
        }
        
        // Close dialogs, end loading
        setOpenConfirm(false);
        setLoading(false);
    }

    const handlePlaylistClick = async (playlistId: string) => {
        setLoading(true);

        const pListInfo = await callGetPlistInfoScript(playlistId);

        setPlaylistInfo({
            title: pListInfo.result.title,
            description: pListInfo.result.description,
            createDate: pListInfo.result.createDate,
            channel: pListInfo.result.channel,
            videoCount: pListInfo.result.videoCount,
            thumbnail: pListInfo.result.thumbnail
        })
        setIsInfoErr(pListInfo.error)
        setInfoErrMsg(pListInfo.errorMessage);

        if (pListInfo.error == false) {
            const pListVidList = await callGetPlistVideoScript(playlistId);

            setPListVideoList(pListVidList.result)
            setIsVideoErr(pListVidList.error);
            setvideoErrMsg(pListVidList.errorMessage);
        }

        else if (pListInfo.error == true) {
            console.log("PLAYLIST INFO ERROR")
            setPListVideoList([]);
            setIsVideoErr(true);
            setvideoErrMsg("Unable to reach playlist, so no attempt was made to fetch videos.");
        }

        setOpenConfirm(false);
        setLoading(false);
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

    const callGetChanVideosScript = async(channelHandle: string, uploadTypes: UploadType[]) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-channel-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelHandle, uploadTypes }),
            });

            const data = await res.json();

            return processGetVideos(data);

            
        } catch (err: any) {
            console.log("FRONT END GET CHANNEL VIDEOS ERROR");
            console.error("ERROR", err);
            return {
                result: [],
                error: true,
                errorMessage: "Network error",
             };
        }
    }

    const processGetVideos = (
        vidResults: {
            result: Record<string, any>,
            error: Boolean,
            errorMessage: string,
        }
    ) => {

        if (vidResults.error == false) {
            const vidIds = Object.keys(vidResults.result);
            const vidData = Object.values(vidResults.result);

            const endResults = vidIds.map((VideoId, index) => ({
                VideoId, ...(vidData[index] as Record<string, any>)
            }));

            return {
                result: endResults,
                error: false,
                errorMessage: ""
            }
        }
 
        else { // If vidResults.error == true
            return {
                result: [],
                error: true,
                errorMessage: vidResults.errorMessage
            }
        }
    }

    const callGetChanInfoScript = async(channelHandle: string) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-channel-info`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelHandle })
            });
            
            const chanInfoResults = await res.json();

            return chanInfoResults


            //console.log(data);
            } catch (err: any) {
            console.log("FRONT END CHANNEL INFO ERROR");
            console.error("ERROR", err);
        }
    }

    const callGetPlistVideoScript = async(playlistId: string) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-playlist-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId })
            })

            const data = await res.json();

            return processGetVideos(data);

        } catch (err: any) {
            console.log("FRONT END GET CHANNEL VIDEOS ERROR");
            console.error("ERROR", err);
            return {
                result: [],
                error: true,
                errorMessage: "Network error",
             };
        }
    }

    const callGetPlistInfoScript = async(playlistId: string) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-playlist-info`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId })
            });
            
            const plistInfoResults = await res.json();

            return plistInfoResults

        } catch (err: any) {
            console.log("FRONT END PLIST INFO ERROR");
            console.error("ERROR", err);
        }
    }

    const downloadCSV = async (filename: string) => {
        const link = document.createElement('a');
        link.href = `${baseUrl}/api/download/${filename}`
        console.log(link.href)
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
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
                        Fetch all videos from a specified channel or playlist
                    </Typography>
                </Grid>

                <Grid size={7} justifyContent="right" display={"flex"}>
                    <TextField fullWidth 
                        id="channel-handle" 
                        label={isToggled ? 'Handle' : 'Playlist ID'}
                        variant="outlined"
                        onChange={(e) => setInput(e.target.value)}
                        sx={{ width: '400px' }}
                    />
                </Grid>

                <Grid size={5} justifyContent="left" display={"flex"}>
                    <FormControlLabel
                        control={<Switch checked={isToggled} onChange={handleSwitchChange} />}
                        label={isToggled ? 'Channel' : 'Playlist'} 
                    />
                </Grid>
                { isToggled ? 
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
                    :
                    <>
                    </>
                }
                <Grid size={12} container justifyContent="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        {loading ? "Loading... " : "Fetch Videos"}
                    </Button>

                    {loading && <CircularProgress/>}
                </Grid>
                
                <Dialog 
                    open={openConfirm} 
                    onClose={handleClose}
                    sx={{ '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        } 
                    }}
                >    
                    { isFormValid ? (
                        <>
                        <DialogTitle>Verify Request</DialogTitle>
                        <DialogContent>
                            {isToggled ? (
                                <>
                                Are you sure you want to fetch results from channel 
                                <br />
                                @<strong>{input}</strong>?
                                </>
                            ) : (
                                <>
                                Are you sure you want to fetch videos from the playlist with the following id: 
                                <br />
                                <strong>{input}</strong>?
                                </>
                            )}
                        </DialogContent>
                        {isToggled ? (
                            <>
                            <Divider />
                            <DialogContent>
                                <>
                                Video Types:
                                <br />
                                {getSelectedTypes().join(' & ')}</>
                            </DialogContent>
                            </> ) : ( <> </> )
                        }
                        </>
                    ) :
                        <> 
                        <DialogTitle>Invalid Request</DialogTitle>
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
                                <Button onClick={() => 
                                    isToggled 
                                    ? handleChannelClick(input.trim(), getSelectedTypes())
                                    : handlePlaylistClick(input.trim())
                                } color="primary">
                                    {isToggled ? 'Fetch Channel Uploads' : 'Fetch Playlist Videos'}
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

                {(isInfoErr || isVideoErr) ? (
                    <>
                    <Dialog 
                        open={isInfoErr || isVideoErr} 
                        onClose={handleClose}
                        sx={{ '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                                fontFamily: 'Roboto, Arial, sans-serif',
                            } 
                        }}
                    >
                        <DialogTitle>Retrieval Error</DialogTitle>
                         <DialogContent>
                            The following error(s) occured
                            <br/>
                            <Divider sx={{my: 1}}/>
                            {isInfoErr && (
                                <>
                                <strong>Channel Information:</strong> {infoErrMsg}
                                </>
                            ) }
                            <br/>
                            {isVideoErr && (
                                <>
                                <strong>Video List Information:</strong> {videoErrMsg}
                                </>
                            ) }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setIsInfoErr(false);
                                setIsVideoErr(false);
                                }} 
                                color="error">
                                    Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>    
                    </>
                ) : (
                    <>
                    </>
                )
                }

                {(chanVideoList.length > 0 || pListVideoList.length > 0) ? (
                    
                    <Grid container spacing={2} alignItems="top" mt={2}>
                    {/* LEFT: Image */}
                        <Grid size={6}>
                            <Box display="flex" justifyContent="flex-end">
                                <Box
                                    component="img"
                                    src={channelInfo.thumbnail}
                                />
                            </Box>
                            
                        </Grid>

                        <Grid size={2}>
                            <Typography variant='h5' mt={2} sx={{ fontWeight:'bold'}}>
                                {channelInfo.channel}
                            </Typography>
                            <Typography variant='h6'>
                                {channelInfo.handle}
                            </Typography>
                            <Typography variant='h6' mt={2}>
                                {channelInfo.subscribers.toLocaleString()} subscribers
                            </Typography>
                        </Grid>

                    </Grid>
                        
                    
                ) : (
                    <>
                    </>
                )}

            <Grid container spacing={3}>
                
                {Array.isArray(chanVideoList) && chanVideoList.length > 0 && (
                    <Grid size={12} container justifyContent="center" mt={2}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Video ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Upload Date</TableCell>
                                    {isToggled ? <TableCell>Video Type</TableCell> : <></>}
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Duration in S</TableCell>
                                    <TableCell>View Count</TableCell>
                                    <TableCell>Like Count</TableCell>
                                    <TableCell>Comment Count</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {chanVideoList.slice(0,10).map((video, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell>{video.VideoId}</TableCell>
                                            <TableCell>{video.Title}</TableCell>
                                            <TableCell>{video.UploadDate}</TableCell>
                                            {isToggled ? <TableCell>{video.VideoType}</TableCell> : <></>}
                                            <TableCell>{video.Duration}</TableCell>
                                            <TableCell>{video.DurationInS.toLocaleString()}</TableCell>
                                            <TableCell>{video.ViewCount.toLocaleString()}</TableCell>
                                            <TableCell>{video.LikeCount.toLocaleString()}</TableCell>
                                            <TableCell>{video.CommentCount.toLocaleString()}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                )}

                {(chanVideoList.length > 0) ? (
                    <Grid size={12} container justifyContent="center" mt={2}>
                        <Button variant="contained" color="primary" onClick={() => downloadCSV(`${input}_output.csv`)}>
                            Download Output
                        </Button>
                    </Grid>
                ) : (
                    <></>
                )}

                
                
            </Grid>
        </div>
    )
}