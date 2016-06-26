var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HeatListViewObject = (function (_super) {
    __extends(HeatListViewObject, _super);
    function HeatListViewObject(json) {
        _super.call(this, json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.roundUUID = json.roundUUID;
        this.raceUUID = json.raceUUID;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
    }
    return HeatListViewObject;
}(BaseEntity));
