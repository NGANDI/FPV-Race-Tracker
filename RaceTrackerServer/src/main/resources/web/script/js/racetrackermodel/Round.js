var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Round = (function (_super) {
    __extends(Round, _super);
    function Round(json) {
        _super.call(this, json);
        this.blockingTime = json.blockingTime;
        this.countdown = json.countdown;
        this.duration = json.duration;
        this.roundNumber = json.roundNumber;
        this.timestamp = json.timestamp ? new Date(json.timestamp) : null;
        this.amountOfHeats = json.amountOfHeats;
        this.lapDistance = json.lapDistance;
        this.amountOfQualifiedPilots = json.amountOfQualifiedPilots;
        this.amountOfLaps = json.amountOfLaps;
        this.heats = Round.mapHeats(json.heats);
        this.description = json.description;
        this.competitionResults = Round.mapCompetitionResults(json.competitionResults);
    }
    Round.mapHeats = function (heats) {
        var heatObjects = [];
        for (var idx in heats) {
            heatObjects.push(new Heat(heats[idx]));
        }
        return heatObjects;
    };
    Round.mapCompetitionResults = function (competitionResults) {
        var competitionResultObjects = [];
        for (var idx in competitionResults) {
            competitionResultObjects.push(new RaceResultEntry(competitionResults[idx]));
        }
        return competitionResultObjects;
    };
    return Round;
}(BaseEntity));
