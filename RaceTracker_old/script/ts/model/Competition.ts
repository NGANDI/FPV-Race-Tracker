/// <reference path="../_reference.ts"/>
class Competition extends BaseEntity {
    public description: string;
    public location: string;
    public dateFrom: Date;
    public dateTo: Date;
    public pilots: Pilot[];
    public classes: Classs[];
    public competitionConfigs: CompetitionConfig[];
    public onlineRegistrationEnd: Date;
    public onlineRegistrationPossible: boolean;
    public onlineRegistrationKey: string;
    public onlineResultPossible: boolean;
    public onlineResultKey: string;
    public onlineEventPossible: boolean;

    constructor(json: any) {
        super(json);
        this.description = json.description;
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.dateFrom = json.dateFrom ? new Date(json.dateFrom) : date;
        this.dateTo = json.dateTo ? new Date(json.dateTo) : date;
        this.onlineRegistrationEnd = json.onlineRegistrationEnd ? new Date(json.onlineRegistrationEnd) : date;
        this.location = json.location;
        this.pilots = Competition.mapPilots(json.pilots);
        this.classes = Competition.mapClasses(json.classes);
        this.competitionConfigs = Competition.mapCompetitionConfigs(json.competitionConfigs);
        this.onlineRegistrationPossible = (typeof json.onlineRegistrationPossible == "undefined") ? true : json.onlineRegistrationPossible;
        this.onlineRegistrationKey = json.onlineRegistrationKey ? json.onlineRegistrationKey : UUIDService.next();
        this.onlineResultPossible = (typeof json.onlineResultPossible == "undefined") ? true : json.onlineResultPossible;
        this.onlineResultKey = json.onlineResultKey ? json.onlineResultKey : UUIDService.next();
        this.onlineEventPossible = (typeof json.onlineEventPossible == "undefined") ? false : json.onlineEventPossible;
    }


    public static mapCompetitionConfigs(configs) {
        var competitionConfigs: CompetitionConfig[] = [];
        for (var idx in configs) {
            competitionConfigs.push(new CompetitionConfig(configs[idx]));
        }
        return competitionConfigs;
    }

    public static mapClasses(classes) {
        var classObjects: Classs[] = [];
        for (var idx in classes) {
            classObjects.push(new Classs(classes[idx]));
        }
        return classObjects;
    }

    public static mapPilots(pilots) {
        var pilotObjects: Pilot[] = [];
        for (var idx in pilots) {
            pilotObjects.push(new Pilot(pilots[idx]));
        }
        return pilotObjects;
    }
}