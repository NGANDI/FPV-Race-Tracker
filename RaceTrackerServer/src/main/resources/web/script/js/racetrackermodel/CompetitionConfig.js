var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CompetitionConfig = (function (_super) {
    __extends(CompetitionConfig, _super);
    function CompetitionConfig(json) {
        _super.call(this, json);
        this.classs = json.classs;
        this.roundsTraining = json.roundsTraining ? json.roundsTraining : 1;
        this.roundsQualifying = json.roundsQualifying ? json.roundsQualifying : 1;
        this.roundsCompetition = json.roundsCompetition ? json.roundsCompetition : 1;
        this.typeTraining = json.typeTraining ? json.typeTraining : 'Time';
        this.typeQualifying = json.typeQualifying ? json.typeQualifying : 'Time';
        this.typeCompetition = json.typeCompetition ? json.typeCompetition : 'Time';
    }
    return CompetitionConfig;
}(BaseEntity));
