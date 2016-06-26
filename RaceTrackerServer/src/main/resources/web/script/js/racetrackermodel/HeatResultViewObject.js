var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HeatResultViewObject = (function (_super) {
    __extends(HeatResultViewObject, _super);
    function HeatResultViewObject(json) {
        _super.call(this, json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.competitionDescription = json.competitionDescription;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
        this.raceResultEntries = json.raceResultEntries ? json.raceResultEntries : [];
        this.heatTimestamp = json.heatTimestamp ? new Date(json.heatTimestamp) : null;
    }
    return HeatResultViewObject;
}(BaseEntity));
