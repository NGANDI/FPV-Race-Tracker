/// <reference path="../_reference.ts"/>
class RoundResultEntry extends BaseEntity {
    public pilotUUID: string;
    public pilotNumber: string;
    public pilotName: string;
    public rank: number;
    public lapTimes: number[];
    public lapTimesSum: number;
    public deviceId: string;
    public disqualified: boolean;

    constructor(json: any) {
        //TODO: evaluate if roundresultentry could be replaced with raceresultentry
        super(json);
        this.pilotUUID = json.pilotUUID;
        this.rank = json.rank;
        this.lapTimes = json.lapTimes ? json.lapTimes : [];
        this.lapTimesSum = json.lapTimesSum;
        this.pilotName = json.pilotName;
        this.pilotNumber = json.pilotNumber;
        this.deviceId = json.deviceId;
        this.disqualified = json.disqualified ? json.disqualified : false;
    }
}