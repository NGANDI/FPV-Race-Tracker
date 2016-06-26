class RaceResultEntry extends BaseEntity {
    public raceUUID: string;
    public round: number;
    public heat: number;
    public pilotUUID: string;
    public pilotNumber: string;
    public pilotName: string;
    public rank: number;
    public amountOfLaps: number;
    public totalTime: number;
    public lastRoundTime: number;
    public bestRoundTime: number;
    public averageRoundTime: number;
    public deviceId: string;
    public disqualified: boolean;
    public lastPassing: number;

    constructor(json: any) {
        super(json);
        this.raceUUID = json.raceUUID;
        this.pilotUUID = json.pilotUUID;
        this.rank = json.rank;
        this.amountOfLaps = json.amountOfLaps;
        this.totalTime = json.totalTime;
        this.lastRoundTime = json.lastRoundTime;
        this.bestRoundTime = json.bestRoundTime;
        this.averageRoundTime = json.averageRoundTime;
        this.pilotName = json.pilotName;
        this.round = json.round;
        this.heat = json.heat;
        this.pilotNumber = json.pilotNumber;
        this.deviceId = json.deviceId;
        this.disqualified = json.disqualified ? json.disqualified : false;
        this.lastPassing = json.lastPassing;
    }

    public saveOrderedRank(rank) {
        this.rank = rank;
    }

    public bestRoundTimeComputed() {
        return this.bestRoundTime ? this.bestRoundTime : 999999999;
    }
    public totalTimeComputed() {
        return this.totalTime ? this.totalTime : 999999999;
    }

    public customEquals(other: RaceResultEntry) {
        if (!this || !other) {
            return false;
        }
        if (this.pilotUUID != other.pilotUUID) {
            return false;
        }
        if (this.amountOfLaps != other.amountOfLaps) {
            return false;
        }
        if (this.totalTime != other.totalTime) {
            return false;
        }
        if (this.lastRoundTime != other.lastRoundTime) {
            return false;
        }
        return true;
    }
}