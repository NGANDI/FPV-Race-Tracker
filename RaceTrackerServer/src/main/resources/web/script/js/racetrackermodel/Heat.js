var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Heat = (function (_super) {
    __extends(Heat, _super);
    function Heat(json) {
        _super.call(this, json);
        this.pilots = Heat.mapPilots(json.pilots);
        this.heatNumber = json.heatNumber;
        this.heatResult = json.heatResult ? new RaceResult(json.heatResult) : null;
        this.exactStartTime = json.exactStartTime;
        this.startTime = json.startTime ? new Date(json.startTime) : null;
    }
    Heat.mapPilots = function (pilots) {
        var pilotObjects = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    };
    return Heat;
}(BaseEntity));
