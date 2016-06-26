var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Pilot = (function (_super) {
    __extends(Pilot, _super);
    function Pilot(json) {
        _super.call(this, json);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.alias = json.alias;
        this.phone = json.phone;
        this.country = json.country;
        this.email = json.email;
        this.club = json.club;
        this.pilotNumber = +json.pilotNumber;
        this.deviceId = json.deviceId;
        if (json.classs) {
            this.classs = new Classs(json.classs);
        }
        if (json.assignedRaceBand) {
            this.assignedRaceBand = new RaceBand(json.assignedRaceBand);
        }
    }
    return Pilot;
}(BaseEntity));
