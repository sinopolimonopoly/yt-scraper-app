import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Grid, Typography, TextField, Checkbox } from '@mui/material';
import { FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Divider } from '@mui/material';
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
    const [result, setResult] = useState({});
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
        const data = await callGetVideosScript(handle, selectedTypes);
        setResult(data);
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
    const callGetVideosScript = async (channelId, uploadTypes) => {
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
            return data;
        }
        catch (err) {
            console.log(baseUrl);
            console.log("FRONT END API ERROR");
            console.error("ERROR", err);
        }
    };
    return (_jsx("div", { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h2', align: 'center', children: "YouTube Channel Scraper" }) }), _jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h4', align: 'center', children: "Enter a channel's handle and select which videos you'd like to retrieve" }) }), _jsx(Grid, { size: 12, justifyContent: "center", display: "flex", children: _jsx(TextField, { fullWidth: true, id: "channel-handle", label: "Handle", variant: "outlined", onChange: (e) => setHandle(e.target.value), sx: { width: '400px' } }) }), _jsx(Grid, { size: 12, container: true, justifyContent: "center", children: _jsx(FormControl, { component: "fieldset", children: _jsxs(FormGroup, { "aria-label": "upload-type", row: true, sx: { justifyContent: "center" }, children: [_jsx(FormControlLabel, { value: "longs", control: _jsx(Checkbox, { checked: selectedTypes.long, onChange: handleCheckboxChange, name: "long" }), label: "Long Form", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "shorts", control: _jsx(Checkbox, { checked: selectedTypes.short, onChange: handleCheckboxChange, name: "short" }), label: "Shorts", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "livestreams", control: _jsx(Checkbox, { checked: selectedTypes.live, onChange: handleCheckboxChange, name: "live" }), label: "Livestreams", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } })] }) }) }), _jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsx(Button, { variant: "contained", color: "primary", onClick: handleClickOpen, children: "Fetch Videos" }) }), _jsxs(Dialog, { open: openConfirm, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        }
                    }, children: [_jsx(DialogTitle, { children: "Verify Request" }), isFormValid ? (_jsxs(_Fragment, { children: [_jsxs(DialogContent, { children: ["Are you sure you want to retrieve the following uploads from channel", _jsx("br", {}), "@", _jsx("strong", { children: handle }), "?"] }), _jsx(Divider, {}), _jsx(DialogContent, { children: getSelectedTypes().join(' & ') })] })) :
                            _jsx(_Fragment, { children: _jsx(DialogContent, { children: "Enter a YouTube channel handle and select an upload type to fetch results" }) }), _jsx(DialogActions, { children: isFormValid ? (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpenConfirm(false), color: "error", children: "Cancel" }), _jsx(Button, { onClick: () => handleClick(handle.trim(), getSelectedTypes()), color: "primary", children: "Fetch Uploads" })] })) : (_jsx(_Fragment, { children: _jsx(Button, { onClick: () => setOpenConfirm(false), children: "Close" }) })) })] })] }) }));
}
