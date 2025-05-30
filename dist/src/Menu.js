import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import '@fontsource/roboto';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export default function Menu() {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [handle, setHandle] = useState("");
    const [selectedTypes, setSelectedTypes] = useState({
        long: false,
        short: false,
        live: false
    });
    const [videoList, setvideoList] = useState([]);
    const [isVideoErr, setIsVideoErr] = useState(false);
    const [videoErrMsg, setvideoErrMsg] = useState("");
    const [channelInfo, setChannelInfo] = useState({
        channel: "",
        handle: "",
        subscribers: 0,
        thumbnail: ""
    });
    const [isChannelErr, setIsChannelErr] = useState(false);
    const [channelErrMsg, setChannelErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log("VIDEO RESULTS updated", videoList);
        console.log(videoList.length);
        console.log(Array.isArray(videoList));
        console.log(channelInfo);
    }, [videoList]);
    const isFormValid = handle.trim() !== "" && Object.values(selectedTypes).some(Boolean);
    const handleClickOpen = () => {
        setOpenConfirm(true);
    };
    const handleClose = () => {
        setOpenConfirm(false);
    };
    const handleClick = async (handle, selectedTypes) => {
        setLoading(true);
        // Fetch api results
        const chanInfo = await callGetChannelInfoScript(handle);
        // Set channel info states
        setChannelInfo({
            channel: chanInfo.result.ChannelName,
            handle: chanInfo.result.Handle,
            subscribers: chanInfo.result.SubCount,
            thumbnail: chanInfo.result.ThumbnailUrl
        });
        setIsChannelErr(chanInfo.error);
        setChannelErrMsg(chanInfo.errorMessage);
        if (chanInfo.error == false) {
            const vidList = await callGetVideosScript(handle, selectedTypes);
            // Set video list states
            setvideoList(vidList.result);
            setIsVideoErr(vidList.error);
            setvideoErrMsg(vidList.errorMessage);
        }
        else if (chanInfo.error == true) {
            console.log("WE HIT A ERROR");
            setvideoList([]);
            setIsVideoErr(true);
            setvideoErrMsg("Unable to reach channel, so no attempt was made to fetch videos.");
        }
        // Close dialogs, end loading
        setOpenConfirm(false);
        setLoading(false);
    };
    const handleCheckboxChange = (event) => {
        setSelectedTypes({
            ...selectedTypes,
            [event.target.name]: event.target.checked
        });
    };
    const getSelectedTypes = () => {
        const labels = {
            long: 'videos',
            short: 'shorts',
            live: 'livestreams'
        };
        const selected = Object.entries(selectedTypes)
            .filter(([_, isChecked]) => isChecked)
            .map(([key]) => labels[key]);
        return selected;
    };
    const callGetVideosScript = async (channelHandle, uploadTypes) => {
        try {
            console.log(baseUrl);
            const res = await fetch(`${baseUrl}/api/get-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelHandle, uploadTypes }),
            });
            const data = await res.json();
            return processGetVideos(data);
        }
        catch (err) {
            console.log(baseUrl);
            console.log("FRONT END GET VIDEOS ERROR");
            console.error("ERROR", err);
            return {
                result: [],
                error: true,
                errorMessage: "Network error",
            };
        }
    };
    const processGetVideos = (vidResults) => {
        if (vidResults.error == false) {
            const vidIds = Object.keys(vidResults.result);
            const vidData = Object.values(vidResults.result);
            const endResults = vidIds.map((VideoId, index) => ({
                VideoId, ...vidData[index]
            }));
            return {
                result: endResults,
                error: false,
                errorMessage: ""
            };
        }
        else { // If vidResults.error == true
            return {
                result: [],
                error: true,
                errorMessage: "Video retrieval error"
            };
        }
    };
    const callGetChannelInfoScript = async (channelHandle) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-channel-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelHandle })
            });
            const infoResults = await res.json();
            return infoResults;
            //console.log(data);
        }
        catch (err) {
            console.log(baseUrl);
            console.log("FRONT END CHANNEL INFO ERROR");
            console.error("ERROR", err);
        }
    };
    const downloadCSV = async (filename) => {
        const link = document.createElement('a');
        link.href = `http://localhost:3001/api/download/${filename}`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    return (_jsxs("div", { children: [_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h2', align: 'center', children: "YouTube Channel Scraper" }) }), _jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h4', align: 'center', children: "Enter a channel's handle and select which videos you'd like to retrieve" }) }), _jsx(Grid, { size: 12, justifyContent: "center", display: "flex", children: _jsx(TextField, { fullWidth: true, id: "channel-handle", label: "Handle", variant: "outlined", onChange: (e) => setHandle(e.target.value), sx: { width: '400px' } }) }), _jsx(Grid, { size: 12, container: true, justifyContent: "center", children: _jsx(FormControl, { component: "fieldset", children: _jsxs(FormGroup, { "aria-label": "upload-type", row: true, sx: { justifyContent: "center" }, children: [_jsx(FormControlLabel, { value: "longs", control: _jsx(Checkbox, { checked: selectedTypes.long, onChange: handleCheckboxChange, name: "long" }), label: "Long Form", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "shorts", control: _jsx(Checkbox, { checked: selectedTypes.short, onChange: handleCheckboxChange, name: "short" }), label: "Shorts", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "livestreams", control: _jsx(Checkbox, { checked: selectedTypes.live, onChange: handleCheckboxChange, name: "live" }), label: "Livestreams", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } })] }) }) }), _jsxs(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: [_jsx(Button, { variant: "contained", color: "primary", onClick: handleClickOpen, children: loading ? "Loading... " : "Fetch Videos" }), loading && _jsx(CircularProgress, {})] }), _jsxs(Dialog, { open: openConfirm, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                                fontFamily: 'Roboto, Arial, sans-serif',
                            }
                        }, children: [isFormValid ? (_jsxs(_Fragment, { children: [_jsx(DialogTitle, { children: "Verify Request" }), _jsxs(DialogContent, { children: ["Are you sure you want to retrieve the following uploads from channel", _jsx("br", {}), "@", _jsx("strong", { children: handle }), "?"] }), _jsx(Divider, {}), _jsx(DialogContent, { children: getSelectedTypes().join(' & ') })] })) :
                                _jsxs(_Fragment, { children: [_jsx(DialogTitle, { children: "Invalid Request" }), _jsx(DialogContent, { children: "Enter a YouTube channel handle and select an upload type to fetch results" })] }), _jsx(DialogActions, { children: isFormValid ? (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpenConfirm(false), color: "error", children: "Cancel" }), _jsx(Button, { onClick: () => handleClick(handle.trim(), getSelectedTypes()), color: "primary", children: "Fetch Uploads" })] })) : (_jsx(_Fragment, { children: _jsx(Button, { onClick: () => setOpenConfirm(false), children: "Close" }) })) })] })] }), (isChannelErr || isVideoErr) ? (_jsx(_Fragment, { children: _jsxs(Dialog, { open: openConfirm, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        }
                    }, children: [_jsx(DialogTitle, { children: "Retrieval Error" }), _jsxs(DialogContent, { children: ["The following error(s) occured:", isChannelErr && (`\nChannel Information: ${channelErrMsg}`), isVideoErr && (`\nVideo List: ${videoErrMsg}`)] })] }) })) : (_jsx(_Fragment, {})), (videoList.length > 0) ? (_jsxs(Grid, { container: true, spacing: 2, alignItems: "top", mt: 2, children: [_jsx(Grid, { size: 6, children: _jsx(Box, { display: "flex", justifyContent: "flex-end", children: _jsx(Box, { component: "img", src: channelInfo.thumbnail }) }) }), _jsxs(Grid, { size: 2, children: [_jsx(Typography, { variant: 'h5', mt: 2, sx: { fontWeight: 'bold' }, children: channelInfo.channel }), _jsx(Typography, { variant: 'h6', children: channelInfo.handle }), _jsxs(Typography, { variant: 'h6', mt: 2, children: [channelInfo.subscribers.toLocaleString(), " subscribers"] })] })] })) : (_jsx(_Fragment, {})), _jsxs(Grid, { container: true, spacing: 3, children: [Array.isArray(videoList) && videoList.length > 0 && (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Video ID" }), _jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Upload Date" }), _jsx(TableCell, { children: "Video Type" }), _jsx(TableCell, { children: "Duration" }), _jsx(TableCell, { children: "Duration in S" }), _jsx(TableCell, { children: "View Count" }), _jsx(TableCell, { children: "Like Count" }), _jsx(TableCell, { children: "Comment Count" })] }) }), _jsx(TableBody, { children: videoList.slice(0, 10).map((video, index) => {
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: video.VideoId }), _jsx(TableCell, { children: video.Title }), _jsx(TableCell, { children: video.UploadDate }), _jsx(TableCell, { children: video.VideoType }), _jsx(TableCell, { children: video.Duration }), _jsx(TableCell, { children: video.DurationInS.toLocaleString() }), _jsx(TableCell, { children: video.ViewCount.toLocaleString() }), _jsx(TableCell, { children: video.LikeCount.toLocaleString() }), _jsx(TableCell, { children: video.CommentCount.toLocaleString() })] }));
                                    }) })] }) })), (videoList.length > 0) ? (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsx(Button, { variant: "contained", color: "primary", onClick: () => downloadCSV(`${handle}_output.csv`), children: "Download Output" }) })) : (_jsx(_Fragment, {}))] })] }));
}
