var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaceIdentificationObject = (function (_super) {
    __extends(RaceIdentificationObject, _super);
    function RaceIdentificationObject(json) {
        _super.call(this, json);
        this.format = json.format,
            this.class = json.class,
            this.round = json.round,
            this.type = json.type,
            this.heat = json.heat,
            this.description = json.description,
            this.heatUUID = json.heatUUID,
            this.raceUUID = json.raceUUID,
            this.result = json.result;
    }
    return RaceIdentificationObject;
}(BaseEntity));
