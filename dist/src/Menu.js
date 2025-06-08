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
import { Switch } from '@mui/material';
import '@fontsource/roboto';
const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl, "top of menu");
export default function Menu() {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [input, setInput] = useState("");
    const [selectedTypes, setSelectedTypes] = useState({
        long: false,
        short: false,
        live: false
    });
    const [isToggled, setIsToggled] = useState(true);
    const [recentSearch, setRecentSearch] = useState("");
    const [chanVideoList, setChanVideoList] = useState([]);
    const [channelInfo, setChannelInfo] = useState({
        channel: "",
        handle: "",
        subscribers: 0,
        thumbnail: ""
    });
    const [pListVideoList, setPListVideoList] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({
        title: "",
        description: "",
        createDate: "",
        channel: "",
        videoCount: 0,
        thumbnail: ""
    });
    const [isVideoErr, setIsVideoErr] = useState(false);
    const [videoErrMsg, setvideoErrMsg] = useState("");
    const [isInfoErr, setIsInfoErr] = useState(false);
    const [infoErrMsg, setInfoErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [openErrDialog, setOpenErrDialog] = useState(false);
    useEffect(() => {
        console.log("VIDEO RESULTS updated", chanVideoList);
        console.log(chanVideoList.length);
        console.log(Array.isArray(chanVideoList));
        console.log(channelInfo);
        console.log(channelInfo.thumbnail);
        console.log(playlistInfo.thumbnail);
    }, [chanVideoList]);
    const isFormValid = input.trim() !== "" && (Object.values(selectedTypes).some(Boolean) || !isToggled);
    const handleSwitchChange = (event) => {
        setIsToggled(event.target.checked);
    };
    const handleClickOpen = () => {
        setOpenConfirm(true);
        setIsInfoErr(false);
        setIsVideoErr(false);
    };
    const handleClose = () => {
        setOpenConfirm(false);
    };
    const handleChannelClick = async (handle, selectedTypes) => {
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
            setRecentSearch("channel");
        }
        else if (chanInfo.error == true) {
            console.log("CHANNEL INFO ERROR");
            setChanVideoList([]);
            setIsVideoErr(true);
            setvideoErrMsg("Unable to reach channel, so no attempt was made to fetch videos.");
        }
        // Close dialogs, end loading
        setOpenConfirm(false);
        setLoading(false);
    };
    const handlePlaylistClick = async (playlistId) => {
        setLoading(true);
        const pListInfo = await callGetPlistInfoScript(playlistId);
        setPlaylistInfo({
            title: pListInfo.result.title,
            description: pListInfo.result.description,
            createDate: pListInfo.result.createDate,
            channel: pListInfo.result.channel,
            videoCount: pListInfo.result.videoCount,
            thumbnail: pListInfo.result.thumbnail
        });
        setIsInfoErr(pListInfo.error);
        setInfoErrMsg(pListInfo.errorMessage);
        if (pListInfo.error == false) {
            const pListVidList = await callGetPlistVideoScript(playlistId, pListInfo.result.channel);
            setChanVideoList(pListVidList.result);
            setIsVideoErr(pListVidList.error);
            setvideoErrMsg(pListVidList.errorMessage);
            setRecentSearch("playlist");
        }
        else if (pListInfo.error == true) {
            console.log("PLAYLIST INFO ERROR");
            setPListVideoList([]);
            setIsVideoErr(true);
            setvideoErrMsg("Unable to reach playlist, so no attempt was made to fetch videos.");
        }
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
    const callGetChanVideosScript = async (channelHandle, uploadTypes) => {
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
        }
        catch (err) {
            console.log("FRONT END GET CHANNEL VIDEOS ERROR");
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
                errorMessage: vidResults.errorMessage
            };
        }
    };
    const callGetChanInfoScript = async (channelHandle) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-channel-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelHandle })
            });
            const chanInfoResults = await res.json();
            return chanInfoResults;
            //console.log(data);
        }
        catch (err) {
            console.log("FRONT END CHANNEL INFO ERROR");
            console.error("ERROR", err);
        }
    };
    const callGetPlistVideoScript = async (playlistId, channel) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-playlist-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId, channel })
            });
            const data = await res.json();
            return processGetVideos(data);
        }
        catch (err) {
            console.log("FRONT END GET CHANNEL VIDEOS ERROR");
            console.error("ERROR", err);
            return {
                result: [],
                error: true,
                errorMessage: "Network error",
            };
        }
    };
    const callGetPlistInfoScript = async (playlistId) => {
        try {
            const res = await fetch(`${baseUrl}/api/get-playlist-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId })
            });
            const plistInfoResults = await res.json();
            return plistInfoResults;
        }
        catch (err) {
            console.log("FRONT END PLIST INFO ERROR");
            console.error("ERROR", err);
        }
    };
    const downloadCSV = async (filename) => {
        const link = document.createElement('a');
        link.href = `${baseUrl}/api/download/${filename}`;
        console.log(link.href);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    return (_jsxs("div", { children: [_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h2', align: 'center', children: "YouTube Channel Scraper" }) }), _jsx(Grid, { size: 12, children: _jsx(Typography, { variant: 'h4', align: 'center', children: "Fetch all videos from a specified channel or playlist" }) }), _jsx(Grid, { size: 7, justifyContent: "right", display: "flex", children: _jsx(TextField, { fullWidth: true, id: "channel-handle", label: isToggled ? 'Handle' : 'Playlist ID', variant: "outlined", onChange: (e) => setInput(e.target.value), sx: { width: '400px' } }) }), _jsx(Grid, { size: 5, justifyContent: "left", display: "flex", children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: isToggled, onChange: handleSwitchChange }), label: isToggled ? 'Channel' : 'Playlist' }) }), isToggled ?
                        _jsx(Grid, { size: 12, container: true, justifyContent: "center", children: _jsx(FormControl, { component: "fieldset", children: _jsxs(FormGroup, { "aria-label": "upload-type", row: true, sx: { justifyContent: "center" }, children: [_jsx(FormControlLabel, { value: "longs", control: _jsx(Checkbox, { checked: selectedTypes.long, onChange: handleCheckboxChange, name: "long" }), label: "Long Form", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "shorts", control: _jsx(Checkbox, { checked: selectedTypes.short, onChange: handleCheckboxChange, name: "short" }), label: "Shorts", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } }), _jsx(FormControlLabel, { value: "livestreams", control: _jsx(Checkbox, { checked: selectedTypes.live, onChange: handleCheckboxChange, name: "live" }), label: "Livestreams", labelPlacement: "bottom", sx: { alignItems: "center", margin: 2 } })] }) }) })
                        :
                            _jsx(_Fragment, {}), _jsxs(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: [_jsx(Button, { variant: "contained", color: "primary", onClick: handleClickOpen, children: loading ? "Loading... " : "Fetch Videos" }), loading && _jsx(CircularProgress, {})] }), _jsxs(Dialog, { open: openConfirm, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                                fontFamily: 'Roboto, Arial, sans-serif',
                            }
                        }, children: [isFormValid ? (_jsxs(_Fragment, { children: [_jsx(DialogTitle, { children: "Verify Request" }), _jsx(DialogContent, { children: isToggled ? (_jsxs(_Fragment, { children: ["Are you sure you want to fetch results from channel", _jsx("br", {}), "@", _jsx("strong", { children: input }), "?"] })) : (_jsxs(_Fragment, { children: ["Are you sure you want to fetch videos from the playlist with the following id:", _jsx("br", {}), _jsx("strong", { children: input }), "?"] })) }), isToggled ? (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(DialogContent, { children: _jsxs(_Fragment, { children: ["Video Types:", _jsx("br", {}), getSelectedTypes().join(' & ')] }) })] })) : (_jsx(_Fragment, { children: " " }))] })) :
                                _jsxs(_Fragment, { children: [_jsx(DialogTitle, { children: "Invalid Request" }), _jsx(DialogContent, { children: "Enter a YouTube channel handle and select an upload type to fetch results" })] }), _jsx(DialogActions, { children: isFormValid ? (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setOpenConfirm(false), color: "error", children: "Cancel" }), _jsx(Button, { onClick: () => isToggled
                                                ? handleChannelClick(input.trim(), getSelectedTypes())
                                                : handlePlaylistClick(input.trim()), color: "primary", children: isToggled ? 'Fetch Channel Uploads' : 'Fetch Playlist Videos' })] })) : (_jsx(_Fragment, { children: _jsx(Button, { onClick: () => setOpenConfirm(false), children: "Close" }) })) })] })] }), (isInfoErr || isVideoErr) ? (_jsx(_Fragment, { children: _jsxs(Dialog, { open: isInfoErr || isVideoErr, onClose: handleClose, sx: { '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
                            fontFamily: 'Roboto, Arial, sans-serif',
                        }
                    }, children: [_jsx(DialogTitle, { children: "Retrieval Error" }), _jsxs(DialogContent, { children: ["The following error(s) occured", _jsx("br", {}), _jsx(Divider, { sx: { my: 1 } }), isInfoErr && (_jsxs(_Fragment, { children: [_jsx("strong", { children: "Channel Information:" }), " ", infoErrMsg] })), _jsx("br", {}), isVideoErr && (_jsxs(_Fragment, { children: [_jsx("strong", { children: "Video List Information:" }), " ", videoErrMsg] }))] }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => {
                                    setIsInfoErr(false);
                                    setIsVideoErr(false);
                                }, color: "error", children: "Cancel" }) })] }) })) : (_jsx(_Fragment, {})), (chanVideoList.length > 0 || pListVideoList.length > 0) ? (_jsxs(Grid, { container: true, spacing: 2, alignItems: "top", mt: 2, children: [_jsx(Grid, { size: 6, children: _jsx(Box, { display: "flex", justifyContent: "flex-end", children: _jsx(Box, { component: "img", src: recentSearch == "channel" ? channelInfo.thumbnail : playlistInfo.thumbnail, sx: { width: 100, height: 100 } }) }) }), _jsxs(Grid, { size: 4, children: [_jsx(Typography, { variant: 'h5', mt: 2, sx: { fontWeight: 'bold' }, children: recentSearch == "channel" ? channelInfo.channel : playlistInfo.title }), _jsx(Typography, { variant: 'h6', children: recentSearch == "channel" ? channelInfo.handle : `by ${playlistInfo.channel}` }), _jsx(Typography, { variant: 'h6', mt: 1, children: recentSearch == "channel" ? `${channelInfo.subscribers.toLocaleString()} subscribers` : `${playlistInfo.videoCount} videos` }), recentSearch == "playlist" ?
                                _jsx(_Fragment, { children: " " }) : (_jsx(Typography, { variant: 'h6', children: `Created ${playlistInfo.createDate}` }))] })] })) : (_jsx(_Fragment, {})), _jsxs(Grid, { container: true, spacing: 3, children: [Array.isArray(chanVideoList) && chanVideoList.length > 0 && (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Video ID" }), _jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Upload Date" }), recentSearch == "channel" ? _jsx(TableCell, { children: "Video Type" }) : _jsx(_Fragment, {}), _jsx(TableCell, { children: "Duration" }), _jsx(TableCell, { children: "Duration in S" }), _jsx(TableCell, { children: "View Count" }), _jsx(TableCell, { children: "Like Count" }), _jsx(TableCell, { children: "Comment Count" })] }) }), _jsx(TableBody, { children: chanVideoList.slice(0, 10).map((video, index) => {
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: video.VideoId }), _jsx(TableCell, { children: video.Title }), _jsx(TableCell, { children: video.UploadDate }), isToggled ? _jsx(TableCell, { children: video.VideoType }) : _jsx(_Fragment, {}), _jsx(TableCell, { children: video.Duration }), _jsx(TableCell, { children: video.DurationInS }), _jsx(TableCell, { children: video.ViewCount }), _jsx(TableCell, { children: video.LikeCount }), _jsx(TableCell, { children: video.CommentCount })] }));
                                    }) })] }) })), (chanVideoList.length > 0) ? (_jsx(Grid, { size: 12, container: true, justifyContent: "center", mt: 2, children: _jsx(Button, { variant: "contained", color: "primary", onClick: () => downloadCSV(recentSearch == "channel" ? `${input}_output.csv` : `${playlistInfo.channel.split(" ").join("_")}_playlist.csv`), children: "Download Output" }) })) : (_jsx(_Fragment, {}))] })] }));
}
