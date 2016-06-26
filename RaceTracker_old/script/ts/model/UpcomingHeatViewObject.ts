/// <reference path="../_reference.ts"/>
class UpcomingHeatViewObject extends BaseEntity {
    public heatNumber: number;
    public roundNumber: number;
    public roundDescription: string;
    public roundType: string;
    public raceClass: Classs;
    public raceFormat: string;
    public pilots: Pilot;
    public heatTimestamp: Date;

    constructor(json: any) {
        super(json);
        this.heatNumber = json.heatNumber;
        this.roundNumber = json.roundNumber;
        this.roundDescription = json.roundDescription;
        this.roundType = json.roundType;
        this.raceFormat = json.raceFormat;
        this.raceClass = json.raceClass;
        this.pilots = json.pilots ? json.pilots : [];
        this.heatTimestamp = json.heatTimestamp;
    }
}