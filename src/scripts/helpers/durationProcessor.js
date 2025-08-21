"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDuration = processDuration;
function processDuration(rawDuration, vidItem) {
    try {
        var duration = rawDuration.replace("P", "").replace("T", "");
        var daySecs = void 0;
        var hrSecs = void 0;
        var minSecs = void 0;
        var secSecs = void 0;
        var dayIdx = void 0;
        var hrIdx = void 0;
        var minIdx = void 0;
        var secIdx = void 0;
        if (duration.includes("D")) {
            dayIdx = duration.indexOf("D");
            daySecs = Number(duration.slice(0, dayIdx)) * 24 * 60 * 60;
        }
        else {
            daySecs = 0;
            dayIdx = -1;
        }
        if (duration.includes("H")) {
            hrIdx = duration.indexOf("H");
            hrSecs = Number(duration.slice(dayIdx + 1, hrIdx)) * 60 * 60;
        }
        else {
            hrSecs = 0;
            hrIdx = -1;
        }
        if (duration.includes("M")) {
            minIdx = duration.indexOf("M");
            minSecs = Number(duration.slice(hrIdx + 1, minIdx)) * 60;
        }
        else {
            minSecs = 0;
            minIdx = -1;
        }
        if (duration.includes("S")) {
            secIdx = duration.indexOf("S");
            secSecs = Number(duration.slice(minIdx + 1, secIdx));
        }
        else {
            secSecs = 0;
        }
        var durationInS = daySecs + hrSecs + minSecs + secSecs;
        return Number(durationInS);
    }
    catch (error) {
        console.log("~~~~~~~~ Duration Processing Error ~~~~~~~~~~");
        console.error("Video Item: ".concat(vidItem));
        return 0;
    }
}
