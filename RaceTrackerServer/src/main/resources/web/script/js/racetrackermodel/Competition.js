var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Competition = (function (_super) {
    __extends(Competition, _super);
    function Competition(json) {
        _super.call(this, json);
        this.description = json.description;
        this.dateFrom = json.dateFrom ? new Date(json.dateFrom) : null;
        this.dateTo = json.dateTo ? new Date(json.dateTo) : null;
        this.onlineRegistrationEnd = json.onlineRegistrationEnd ? new Date(json.onlineRegistrationEnd) : null;
        this.location = json.location;
        this.pilots = Competition.mapPilots(json.pilots);
        this.classes = Competition.mapClasses(json.classes);
        this.competitionConfigs = Competition.mapCompetitionConfigs(json.competitionConfigs);
        this.onlineRegistrationPossible = (typeof json.onlineRegistrationPossible == "undefined") ? true : json.onlineRegistrationPossible;
        this.onlineRegistrationKey = json.onlineRegistrationKey ? json.onlineRegistrationKey : '';
        this.onlineResultPossible = (typeof json.onlineResultPossible == "undefined") ? true : json.onlineResultPossible;
        this.onlineResultKey = json.onlineResultKey ? json.onlineResultKey : '';
    }
    Competition.mapCompetitionConfigs = function (configs) {
        var competitionConfigs = [];
        for (var idx in configs) {
            competitionConfigs.push(new CompetitionConfig(configs[idx]));
        }
        return competitionConfigs;
    };
    Competition.mapClasses = function (classes) {
        var classObjects = [];
        for (var idx in classes) {
            classObjects.push(new Classs(classes[idx]));
        }
        return classObjects;
    };
    Competition.mapPilots = function (pilots) {
        var pilotObjects = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    };
    return Competition;
}(BaseEntity));
