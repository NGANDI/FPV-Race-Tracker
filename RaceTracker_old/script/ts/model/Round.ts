/// <reference path="../_reference.ts"/>
class Round extends BaseEntity {
    public roundNumber: number;
    public amountOfHeats: number;
    public description: string;
    public blockingTime: number;
    public countdown: number;
    public duration: number;
    public overtime: number;
    public amountOfLaps: number;
    public lapDistance: number;
    public amountOfQualifiedPilots: number;
    public heats: Heat[];
    public timestamp: Date;
    public competitionResults: RaceResultEntry[];


    constructor(json: any) {
        super(json);
        this.blockingTime = json.blockingTime;
        this.countdown = json.countdown;
        this.duration = json.duration;
        this.roundNumber = json.roundNumber;
        this.overtime = json.overtime;
        var date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.timestamp = json.timestamp ? new Date(json.timestamp) : date;
        this.amountOfHeats = json.amountOfHeats;
        this.lapDistance = json.lapDistance;
        this.amountOfQualifiedPilots = json.amountOfQualifiedPilots;
        this.amountOfLaps = json.amountOfLaps;
        this.heats = Round.mapHeats(json.heats);
        this.description = json.description;
        this.competitionResults = Round.mapCompetitionResults(json.competitionResults);
    }

    public static mapHeats(heats) {
        var heatObjects: Heat[] = [];
        for (var idx in heats) {
            heatObjects.push(new Heat(heats[idx]));
        }
        return heatObjects;
    }

    public static mapCompetitionResults(competitionResults) {
        var competitionResultObjects: RaceResultEntry[] = [];
        for (var idx in competitionResults) {
            competitionResultObjects.push(new RaceResultEntry(competitionResults[idx]));
        }
        return competitionResultObjects;
    }
}