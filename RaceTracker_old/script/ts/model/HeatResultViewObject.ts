/// <reference path="../_reference.ts"/>
class HeatResultViewObject extends BaseEntity {
    public heatNumber: number;
    public roundNumber: number;
    public roundDescription: string;
    public competitionDescription: string;
    public roundType: string;
    public raceClass: Classs;
    public raceFormat: string;
    public raceResultEntries: RaceResultEntry[];
    public heatTimestamp: Date;

    constructor(json: any) {
        super(json);
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
}