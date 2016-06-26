var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RoundResultEntry = (function (_super) {
    __extends(RoundResultEntry, _super);
    function RoundResultEntry(json) {
        //TODO: evaluate if roundresultentry could be replaced with raceresultentry
        _super.call(this, json);
        this.pilotUUID = json.pilotUUID;
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimesSum = json.lapTimesSum;
        this.pilotName = json.pilotName;
        this.pilotNumber = json.pilotNumber;
        this.deviceId = json.deviceId;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
    return RoundResultEntry;
}(BaseEntity));
