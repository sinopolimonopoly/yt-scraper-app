import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/material';
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
    const [results, setResults] = useState([]);
    const [channelInfo, setChannelInfo] = useState({
        channel: "",
        handle: "",
        subscribers: "",
        thumbnail: ""
    });
    useEffect(() => {
        console.log("Results updated", results);
        console.log(results.length);
        console.log(Array.isArray(results));
    }, [results]);
    const isFormValid = handle.trim() !== "" && Object.values(selectedTypes).some(Boolean);
    const handleClickOpen = () => {
        setOpenConfirm(true);
    };
    const handleClose = () => {
        setOpenConfirm(false);
    };
    const runDaScript = (handle, selectedTypes) => {
        console.log(`Retrieving from channel: ${handle}`);
        console.log(`Upload Types: ${selectedTypes}`);
        //getVideos(handle, selectedTypes);
        setOpenConfirm(false);
    };
    const handleClick = async (handle, selectedTypes) => {
        console.log("before channel info");
        callGetChannelInfoScript(handle);
        console.log("after channel info");
        const data = await callGetVideosScript(handle, selectedTypes);
        setResults((data ?? []));
        setOpenConfirm(false);
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
            const vidIds = Object.keys(data);
            const vidData = Object.values(data);
            const vidResults = vidIds.map((VideoId, index) => ({
                VideoId, ...vidData[index]
            }));
            return vidResults;
        }
        catch (err) {
            console.log(baseUrl);
            console.log("FRONT END GET VIDEOS ERROR");
            console.error("ERROR", err);
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
            const data = await res.json();
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
    return (_jsxs("div", { children: [_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h2', align: 'center', children: "YouTube Channel Scraper" }) }), _jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h4', align: 'center', children: "Enter a channel's handle and select which videos you'd like to retrieve" }) }), _jsx(Grid, { size: 12, justifyContent: "center", display: "flex", children: _jsx(TextField, { fullWidth: true, id: "channel-handle", label: "Handle", variant: "outlined", onChange: (e) => setHandle(e.target.value), sx: { width: '400px' } }) }), _jsx(Grid, { size: 12, container: true, justifyContent: "center", children: _jsx(FormControl, { component: "fieldset", children: _jsxs(FormGroup, { "aria-label": "upload-type", row: true, sx: { justifyContent: "center" }, children: [_jsx(FormControlLabel, { value: "longs", control: _jsx(Checkbox, { checked: selectedTypes.long, onChange: handleCheckboxChange, name: "long" }), label: "Long Form", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "shorts", control: _jsx(Checkbox, { checked: selectedTypes.short, onChange: handleCheckboxChange, name: "short" }), label: "Shorts", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "livestreams", control: _jsx(Checkbox, { checked: selectedTypes.live, onChange: handleCheckboxChange, name: "live" }), label: "Livestreams", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } })] }) }) }), _jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsx(Button, { variant: "contained", color: "primary", onClick: handleClickOpen, children: "Fetch Videos" }) }), _jsxs(Dialog, { open: openConfirm, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                                fontFamily: 'Roboto, Arial, sans-serif',
                            }
                        }, children: [_jsx(DialogTitle, { children: "Verify Request" }), isFormValid ? (_jsxs(_Fragment, { children: [_jsxs(DialogContent, { children: ["Are you sure you want to retrieve the following uploads from channel", _jsx("br", {}), "@", _jsx("strong", { children: handle }), "?"] }), _jsx(Divider, {}), _jsx(DialogContent, { children: getSelectedTypes().join(' & ') })] })) :
                                _jsx(_Fragment, { children: _jsx(DialogContent, { children: "Enter a YouTube channel handle and select an upload type to fetch results" }) }), _jsx(DialogActions, { children: isFormValid ? (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpenConfirm(false), color: "error", children: "Cancel" }), _jsx(Button, { onClick: () => handleClick(handle.trim(), getSelectedTypes()), color: "primary", children: "Fetch Uploads" })] })) : (_jsx(_Fragment, { children: _jsx(Button, { onClick: () => setOpenConfirm(false), children: "Close" }) })) })] })] }), (results.length > 0) ? (_jsxs(Grid, { container: true, spacing: 2, alignItems: "top", mt: 2, children: [_jsx(Grid, { size: 6, children: _jsx(Box, { display: "flex", justifyContent: "flex-end", children: _jsx(Box, { component: "img", src: "https://yt3.ggpht.com/F-ULo6Ryi7IHofqMHzF7qEieFsfhIuRI8Tv7VVqinU2tjaob6LMtLVEVEAn0hpzqp7amUKyS=s176-c-k-c0x00ffffff-no-rj" }) }) }), _jsxs(Grid, { size: 2, children: [_jsx(Typography, { variant: 'h5', mt: 2, sx: { fontWeight: 'bold' }, children: "Channel name" }), _jsx(Typography, { variant: 'h6', children: "Handle" }), _jsx(Typography, { variant: 'h6', mt: 2, children: "Subscribers" })] })] })) : (_jsx(_Fragment, {})), _jsxs(Grid, { container: true, spacing: 3, children: [Array.isArray(results) && results.length > 0 && (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Video ID" }), _jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Upload Date" }), _jsx(TableCell, { children: "Video Type" }), _jsx(TableCell, { children: "Duration" }), _jsx(TableCell, { children: "Duration in S" }), _jsx(TableCell, { children: "View Count" }), _jsx(TableCell, { children: "Like Count" }), _jsx(TableCell, { children: "Comment Count" })] }) }), _jsx(TableBody, { children: results.slice(0, 10).map((video, index) => {
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: video.VideoId }), _jsx(TableCell, { children: video.Title }), _jsx(TableCell, { children: video.UploadDate }), _jsx(TableCell, { children: video.VideoType }), _jsx(TableCell, { children: video.Duration }), _jsx(TableCell, { children: video.DurationInS }), _jsx(TableCell, { children: video.ViewCount }), _jsx(TableCell, { children: video.LikeCount }), _jsx(TableCell, { children: video.CommentCount })] }));
                                    }) })] }) })), (results.length > 0) ? (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsx(Button, { variant: "contained", color: "primary", onClick: () => downloadCSV(`${handle}_output.csv`), children: "Download Output" }) })) : (_jsx(_Fragment, {}))] })] }));
}
