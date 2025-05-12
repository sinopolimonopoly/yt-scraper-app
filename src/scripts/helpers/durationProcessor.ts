
export function processDuration(rawDuration: string, vidItem: any) {
    try {
        let duration = rawDuration.replace("P","").replace("T","");

        let daySecs: number;
        let hrSecs: number;
        let minSecs: number;
        let secSecs: number;

        let dayIdx: number;
        let hrIdx: number;
        let minIdx: number;
        let secIdx: number;

        if (duration.includes("D")) {
            dayIdx = duration.indexOf("D")
            daySecs = Number(duration.slice(0, dayIdx)) * 24 * 60 * 60 
        }

        else {
            daySecs = 0
            dayIdx = -1
        }

        if (duration.includes("H")) {
            hrIdx = duration.indexOf("H")
            hrSecs = Number(duration.slice(dayIdx+1, hrIdx)) * 60 * 60 
        }

        else {
            hrSecs = 0
            hrIdx = -1
        }

        if (duration.includes("M")) {
            minIdx = duration.indexOf("M")
            minSecs = Number(duration.slice(hrIdx+1, minIdx)) * 60 
        }

        else {
            minSecs = 0
            minIdx = -1
        }

        if (duration.includes("S")) {
            secIdx = duration.indexOf("S")
            secSecs = Number(duration.slice(minIdx+1, secIdx)) 
        }

        else {
            secSecs = 0
        }

        let durationInS = daySecs + hrSecs + minSecs + secSecs

        return durationInS
    }

    catch (error) {
        console.log("~~~~~~~~ Duration Processing Error ~~~~~~~~~~")
        console.error(`Video Item: ${vidItem}`)
    }
}