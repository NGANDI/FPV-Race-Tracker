/// <reference path="../_reference.ts"/>
class EditLapsService {
    public static laps: Lap[] = [];
    public static lapResultOrder = ['+lapNumber'];

    public static setLaps(laps) {
        EditLapsService.laps.length = 0;
        Array.prototype.push.apply(EditLapsService.laps, laps);
    }
}