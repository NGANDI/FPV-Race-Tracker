var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lap = (function (_super) {
    __extends(Lap, _super);
    function Lap(json) {
        _super.call(this, json);
        this.raceUUID = json.raceUUID;
        this.pilotUUID = json.pilotUUID;
        this.pilotName = json.pilotName;
        this.lapNumber = +json.lapNumber;
        this.startTime = +json.startTime;
        this.endTime = +json.endTime;
        this.time = +json.time;
        this.penalty = json.penalty ? +json.penalty : 0;
        this.totalTime = +json.totalTime;
        this.startTimestamp = json.startTimestamp;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
    return Lap;
}(BaseEntity));
