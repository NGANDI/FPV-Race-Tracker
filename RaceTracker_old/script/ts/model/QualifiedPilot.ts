/// <reference path="../_reference.ts"/>
class QualifiedPilot extends Pilot {
    public rank: number;
    public amountOfLaps: number;
    public lapTimes: number[];
    public lapTimeSum: number;

    constructor(json: any) {
        super(json);
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimeSum = json.lapTimeSum;
        this.amountOfLaps = json.amountOfLaps;
    }
}