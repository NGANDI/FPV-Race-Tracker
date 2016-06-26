/// <reference path="../_reference.ts"/>
class RaceResultService {

    public static calculateRaceResult(raceResult, race: Race, heat: Heat, laps: Lap[]) {
        var maxAmountOfLaps = 0;
        raceResult.length = 0;
        heat.pilots.forEach(function(pilot) {

            var disqualified = false;
            var lapsForPilot = laps.filter(function(lap) {
                return lap.pilotUUID == pilot.uuid;
            });

            if (lapsForPilot.length > maxAmountOfLaps) {
                maxAmountOfLaps = lapsForPilot.length;
            }

            if (lapsForPilot && lapsForPilot.length >= 1) {
                disqualified = lapsForPilot[0].disqualified;
                raceResult.push(new RaceResultEntry({
                    amountOfLaps: lapsForPilot.length - 1, // -1 because of inital passing
                    pilotUUID: pilot.uuid,
                    pilotNumber: pilot.pilotNumber,
                    pilotName: pilot.firstName + " " + pilot.lastName,
                    manualTimingIndex: pilot.manualTimingIndex,
                    deviceId: pilot.deviceId,
                    raceUUID: race.uuid,
                    lastPassing: lapsForPilot[lapsForPilot.length - 1].startTimestamp,
                    totalTime: RaceResultService.calculateTotalRoundTime(lapsForPilot),
                    lastRoundTime: RaceResultService.round(lapsForPilot[lapsForPilot.length - 1].time + (+lapsForPilot[lapsForPilot.length - 1].penalty)),
                    averageRoundTime: RaceResultService.calculateAverageRoundTime(lapsForPilot),
                    bestRoundTime: RaceResultService.calculateBestRoundTime(lapsForPilot),
                    disqualified: disqualified
                }));
            }
        });

        switch (race.format.toUpperCase()) {
            case "COMPETITION":
                var rank = 1;
                for (var lapsNumber = maxAmountOfLaps; lapsNumber > 0; lapsNumber--) {
                    var filteredResults = raceResult.filter(function(result: RaceResultEntry) {
                        return result.amountOfLaps == lapsNumber && !result.disqualified;
                    });
                    filteredResults.sort(function(a: RaceResultEntry, b: RaceResultEntry) {
                        return +a.totalTimeComputed() - +b.totalTimeComputed();
                    });
                    for (var rIdx in filteredResults) {
                        filteredResults[rIdx].rank = rank;
                        rank++;
                    }
                }
                raceResult.sort(function(a: RoundResultEntry, b: RoundResultEntry) {
                    return +a.rank - +b.rank;
                });
                break;
            case "TRAINING":
            case "QUALIFYING":
                var filteredResults = raceResult.filter(function(result: RaceResultEntry) {
                    return !result.disqualified;
                });
                filteredResults.sort(function(a: RaceResultEntry, b: RaceResultEntry) {
                    return +a.bestRoundTimeComputed() - +b.bestRoundTimeComputed();
                });

                var rank = 1;
                for (var rIdx in filteredResults) {
                    filteredResults[rIdx].rank = rank;
                    rank++;
                }
                break;
        }
        RaceService.reloadAngular();
    }

    public static round(value) {
        return Math.floor(1000 * value) / 1000.;
    }

    public static calculateAverageRoundTime(laps: Lap[]) {
        if (laps.length < 2) { return 0; }
        var sum = 0.;
        laps.forEach(function(lap) {
            sum += lap.time + (+lap.penalty);
        });

        return RaceResultService.round(sum / (laps.length - 1)); //initial passing is a "round" too
    }

    public static calculateTotalRoundTime(laps) {
        var sum = 0.;

        laps.forEach(function(lap) {
            sum += lap.time + (+lap.penalty);
        });

        return RaceResultService.round(sum);
    }

    public static calculateBestRoundTime(laps) {
        if (laps.length < 2) { return 0; }

        var best = laps[1].time + (+laps[1].penalty);

        laps.forEach(function(lap) {
            if (lap.time + (+lap.penalty) < best && lap.time > 0.1) {
                best = lap.time + (+lap.penalty);
            };
        });

        return RaceResultService.round(best);
    }
}