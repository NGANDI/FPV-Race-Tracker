var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaceResult = (function (_super) {
    __extends(RaceResult, _super);
    function RaceResult(json) {
        _super.call(this, json);
        this.results = RaceResult.mapRaceResults(json.results);
        this.laps = RaceResult.mapLaps(json.laps);
        this.timestamp = json.timestamp ? new Date(json.timestamp) : null;
    }
    RaceResult.mapRaceResults = function (raceResults) {
        var raceResultObjects = [];
        for (var idx in raceResults) {
            raceResultObjects.push(new RaceResultEntry(raceResults[idx]));
        }
        return raceResultObjects;
    };
    RaceResult.mapLaps = function (laps) {
        var lapObjects = [];
        for (var idx in laps) {
            lapObjects.push(new Lap(laps[idx]));
        }
        return lapObjects;
    };
    return RaceResult;
}(BaseEntity));
