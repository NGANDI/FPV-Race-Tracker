var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaceResultEntry = (function (_super) {
    __extends(RaceResultEntry, _super);
    function RaceResultEntry(json) {
        _super.call(this, json);
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
    RaceResultEntry.prototype.saveOrderedRank = function (rank) {
        this.rank = rank;
    };
    RaceResultEntry.prototype.bestRoundTimeComputed = function () {
        return this.bestRoundTime ? this.bestRoundTime : 999999999;
    };
    RaceResultEntry.prototype.totalTimeComputed = function () {
        return this.totalTime ? this.totalTime : 999999999;
    };
    RaceResultEntry.prototype.customEquals = function (other) {
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
    };
    return RaceResultEntry;
}(BaseEntity));
