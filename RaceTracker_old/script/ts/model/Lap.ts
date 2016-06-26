/// <reference path="../_reference.ts"/>
class Lap extends BaseEntity {
    public raceUUID: string;
    public pilotUUID: string;
    public pilotName: string;
    public lapNumber: number;
    public startTime: number;
    public endTime: number;
    public time: number;
    public penalty: number;
    public totalTime: number;
    public disqualified: boolean;
    public startTimestamp: boolean;

    constructor(json: any) {
        super(json);
        this.raceUUID = json.raceUUID;
        this.pilotUUID = json.pilotUUID;
        this.pilotName = json.pilotName;
        this.lapNumber = +json.lapNumber;
        this.startTime = +json.startTime;
        this.endTime = +json.endTime;
        this.time = +json.time;
        this.penalty = json.penalty ? +json.penalty : 0;
        this.totalTime = +json.totalTime;
        this.startTimestamp = json.startTimestamp;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
}