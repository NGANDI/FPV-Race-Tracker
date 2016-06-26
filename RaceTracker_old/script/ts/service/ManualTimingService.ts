/// <reference path="../_reference.ts"/>
class ManualTimingService {

    public static init() {
        document.addEventListener("keypress", ManualTimingService.keyInput, true);
    }

    public static keyInput(e) {
        if (e.keyCode >= "0".charCodeAt(0) && e.keyCode <= "9".charCodeAt(0) && RaceService.CURRENT_STATUS.raceStarted) {
            var key: number = +String.fromCharCode(e.keyCode);
            var fakeSerialMessage: string[] = ["%", "MANUAL", "" + key, "" + ((new Date().getTime() - RaceService.currentHeat.exactStartTime) / 1000)]
            console.log("TIME: ", fakeSerialMessage);
            RaceService.devicePassed(fakeSerialMessage, true);
        }
        return false;
    }
}

