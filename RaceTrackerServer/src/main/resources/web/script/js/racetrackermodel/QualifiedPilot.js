var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QualifiedPilot = (function (_super) {
    __extends(QualifiedPilot, _super);
    function QualifiedPilot(json) {
        _super.call(this, json);
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimeSum = json.lapTimeSum;
        this.amountOfLaps = json.amountOfLaps;
    }
    return QualifiedPilot;
}(Pilot));
