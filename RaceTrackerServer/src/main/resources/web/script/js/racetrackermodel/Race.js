var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Race = (function (_super) {
    __extends(Race, _super);
    function Race(json) {
        _super.call(this, json);
        this.competitionUUID = json.competitionUUID;
        this.rounds = Race.mapRounds(json.rounds);
        this.type = json.type;
        this.format = json.format;
        this.classs = json.classs ? new Classs(json.classs) : null;
        this.qualificationResults = Race.mapQualificationResults(json.qualificationResults);
    }
    Race.mapRounds = function (rounds) {
        var roundsObjects = [];
        for (var idx in rounds) {
            roundsObjects.push(new Round(rounds[idx]));
        }
        return roundsObjects;
    };
    Race.mapQualificationResults = function (qualificationResults) {
        var qualificationResultObjects = [];
        for (var idx in qualificationResults) {
            qualificationResultObjects.push(new RoundResultEntry(qualificationResults[idx]));
        }
        return qualificationResultObjects;
    };
    return Race;
}(BaseEntity));
