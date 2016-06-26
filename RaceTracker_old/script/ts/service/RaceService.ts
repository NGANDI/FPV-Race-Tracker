/// <reference path="../_reference.ts"/>
class RaceService {
    public static pilotToScan: Pilot = null;
    public static CURRENT_STATUS = {
        startInProgress: false,
        deviceNotReady: true,
        raceStarted: false,
        readDevice: false,
        raceCloseable: false,
        maxRoundsReached: false,
        showTotalQualificationResult: false
    };
    public static CURRENT_RACE_LAPS: Lap[] = [];
    public static races: Race[] = [];
    public static newCompetition: Competition = new Competition({});
    public static selectedCompetition: Competition = null;
    public static raceTypes = ["Time", "Laps"];
    public static raceFormats = ["Training", "Qualifying", "Competition"];
    public static orderByBestRound: String[] = ["+bestRoundTimeComputed()"];
    public static orderByAmountOfRounds: String[] = ['-amountOfLaps', '+totalTimeComputed()'];
    public static resultOrder: String[] = ["-amountOfLaps"];
    public static raceResult: RaceResultEntry[] = [];
    public static raceDurationInterval = null;
    public static heatCountdownInterval = null;
    public static pilotSelectionOrder: String[] = ['+firstName', '+lastName'];
    public static availableRoundNumbers: number[] = [1];
    public static currentRoundNumber: number = 1;
    public static selectedClass: Classs;
    public static selectedFormat: string = RaceService.raceFormats[0];
    public static countdownTimer: Timer;
    public static durationTimer: Timer;
    public static currentRace: Race = null;
    public static currentRound: Round = null;
    public static previousRound: Round = null;
    public static currentHeat: Heat = null;
    public static currentCompetitionUUID: string = "";
    public static qualificationResultOfCurrentRace: RoundResultEntry[] = [];
    public static pilotToMove: Pilot = null;
    public static pilotToMoveOrigin: Heat = null;
    public static heatToEdit: Heat = null;
    public static finishedPilotsInLapHeat: Pilot[] = [];
    public static resultToEdit = null;
    public static heatForPenalty: Heat = null;
    public static currentRaceResult: RaceResult = null;

    public static getCurrentRace(): Race {
        return RaceService.currentRace;
    }

    public static toggleShowTotalQualificationResult() {
        RaceService.CURRENT_STATUS.showTotalQualificationResult = !RaceService.CURRENT_STATUS.showTotalQualificationResult;
    }

    public static downloadTimetable() {
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n\n\n";

        var upcomingHeats: UpcomingHeatViewObject[] = [];
        RaceService.races.forEach(function(race) {
            if (race.competitionUUID == RaceService.currentRace.competitionUUID) {
                race.rounds.forEach(function(round) {
                    round.heats.forEach(function(heat) {
                        csv += "Format;Class;Type;Round;Heat;Start Time;Description\n";
                        csv += RaceService.currentRace.format + ";";
                        csv += RaceService.currentRace.classs.name + ";";
                        csv += RaceService.currentRace.type + ";";
                        csv += round.roundNumber + ";";
                        csv += heat.heatNumber + ";";
                        csv += heat.startTime + ";";
                        csv += round.description ? round.description : "" + ";";
                        if (heat.pilots && heat.pilots.length > 0) {
                            csv += "\n\n";
                            csv += ";Pilot Nr;Pilot;Race Band,Transponder ID\n";
                            heat.pilots.forEach((pilot) => {
                                csv += ";";
                                csv += pilot.pilotNumber + ";";
                                csv += pilot.firstName + " " + pilot.lastName + ";";
                                csv += pilot.assignedRaceBand.value + ";";
                                csv += pilot.deviceId + ";";
                                csv += "\n";
                            });
                        } else {
                            csv += "\nNo pilots assigned!\n";
                        }
                        csv += "\n\n";
                    })
                });
            }
        });
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "race_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    }

    static init(callback) {
        if (RaceService.CURRENT_STATUS.startInProgress || RaceService.CURRENT_STATUS.raceStarted || RaceService.CURRENT_STATUS.raceCloseable) {
            return;
        }
        RaceService.updateDefaultCompetitionValue();
        DatabaseService.readAll(DatabaseService.store_races, function(result) {
            RaceService.setRaces(result);
            if (callback)
                callback();
        });
        if (!SERIAL_ENABLED) {
            RaceService.CURRENT_STATUS.deviceNotReady = false;
        }

    }

    public static toogleHeatMenu(heat: Heat) {
        if (RaceService.heatToEdit == heat) {
            RaceService.heatToEdit = null;
            return;
        }
        RaceService.heatToEdit = heat;
    }

    public static getMostLapsInfo() {
        var mostLaps = 0;
        RaceService.raceResult.forEach(function(result: RaceResultEntry) {
            if (result.amountOfLaps > mostLaps) {
                mostLaps = result.amountOfLaps;
            }
        });
        return mostLaps;
    }

    public static allPreviousHeatsAreFinished() {
        var allPreviousHeatsFinished = true;
        RaceService.currentRace.rounds.forEach((round) => {
            if (round.roundNumber < RaceService.currentRound.roundNumber) {
                round.heats.forEach((heat) => {
                    if (!heat.heatResult) {
                        allPreviousHeatsFinished = false;
                    }
                });
            }
        });
        return allPreviousHeatsFinished;
    }
    public static isEditableRound() {
        var roundNumber = 1;
        RaceService.currentRace.rounds.forEach((round) => {
            round.heats.forEach((heat) => {
                if (heat.heatResult) {
                    roundNumber = round.roundNumber;
                }
            });
        });
        return roundNumber <= RaceService.currentRound.roundNumber;
    }

    public static restartHeat() {
        RaceService.heatToEdit.heatResult = null;
        RaceService.calculateCurrentQualificationResults();
        RaceService.reloadQualificationResults();
        RaceService.update(RaceService.currentRace);
        RaceService.toogleHeatMenu(null);
    }

    public static simulateHeat() {
        RaceService.startHeat(RaceService.heatToEdit, true);
        RaceService.toogleHeatMenu(null);
    }

    public static closeHeat() {
        RaceService.heatToEdit.heatResult = new RaceResult({ results: [], laps: [] });
        RaceService.calculateCurrentQualificationResults();
        RaceService.reloadQualificationResults();
        RaceService.update(RaceService.currentRace);
        RaceService.toogleHeatMenu(null);
    }

    public static roundNumberHelperCurrent() {
        if (RaceService.currentRoundNumber) {
            return new Array(RaceService.currentRoundNumber - 1);
        }
        return [];
    }

    public static roundNumberHelper() {
        if (RaceService.currentRace && RaceService.currentRace.rounds.length) {
            return new Array(RaceService.currentRace.rounds.length);
        }
        return [];
    }

    public static heatResultExistsInCurrentRound() {

        if (RaceService.currentRound)
            return RaceService.currentRound.heats.some(function(heat) {
                if (heat.heatResult) return true;
                return false;
            });

        return false;
    }

    public static findCurrentRace() {
        if (!RaceService.selectedCompetition || !RaceService.selectedClass) {
            return;
        }
        RaceService.races.forEach(function(race) {
            if (race.competitionUUID == RaceService.currentCompetitionUUID) {
                if (race.format == RaceService.selectedFormat) {
                    if (race.classs && race.classs.uuid == RaceService.selectedClass.uuid) {
                        RaceService.currentRace = race;
                    }
                }
            }
        });
        if (!RaceService.currentRace) {
            return;
        }
        RaceService.availableRoundNumbers.length = 0;
        for (var i = 0; i < RaceService.currentRace.rounds.length; i++) {
            RaceService.availableRoundNumbers.push(i + 1);
        }
        if (RaceService.availableRoundNumbers.length > 0) {
            RaceService.currentRoundNumber = 1;
            RaceService.roundSelected();
        }
        RaceService.reloadQualificationResults();
        RaceService.reloadPreviousRound();
    }

    public static reloadQualificationResults() {
        RaceService.qualificationResultOfCurrentRace.length = 0;
        Array.prototype.push.apply(RaceService.qualificationResultOfCurrentRace, RaceService.getResultsFromQualification());
    }

    public static reloadPreviousRound() {
        RaceService.previousRound = null;
        RaceService.currentRace.rounds.forEach(function(round: Round) {
            if (round.roundNumber == RaceService.currentRound.roundNumber - 1) {
                RaceService.previousRound = round;
            }
        });
    }

    public static roundSelected() {
        var found = false;
        RaceService.currentRace.rounds.forEach(function(round) {
            if (round.roundNumber == RaceService.currentRoundNumber) {
                RaceService.currentRound = round;
                found = true;
            }
        });
        if (!found) {
            RaceService.currentRound = RaceService.getNewRound(RaceService.currentRoundNumber);
        }
        RaceService.reloadQualificationResults();
        RaceService.reloadPreviousRound();
    }

    public static saveRound() {
        RaceService.update(RaceService.currentRace);
        NotificationService.notify("Saved!");
    }

    public static classChanged() {
        RaceService.findCurrentRace();
    }

    public static formatChanged() {
        RaceService.findCurrentRace();
    }

    public static competitionChanged() {
        if (RaceService.selectedCompetition) {
            RaceService.currentCompetitionUUID = RaceService.selectedCompetition.uuid;
            RaceService.selectedClass = (RaceService.selectedCompetition.classes && RaceService.selectedCompetition.classes.length > 0) ? RaceService.selectedCompetition.classes[0] : null;
            WindowConfigService.setCurrentCompetition(RaceService.selectedCompetition.uuid);
        }
        else {
            RaceService.currentCompetitionUUID = "";
            WindowConfigService.setCurrentCompetition("");
            WindowConfigService.setCurrentHeat("");
        }
        RaceService.findCurrentRace();
    }

    public static heatsPerRoundChanged() {
        if (RaceService.currentRound.heats.length == RaceService.currentRound.amountOfHeats) {
            return;
        }
        if (RaceService.currentRound.heats.length > RaceService.currentRound.amountOfHeats) {
            RaceService.currentRound.heats.splice(RaceService.currentRound.amountOfHeats);
        }
        while (RaceService.currentRound.heats.length < RaceService.currentRound.amountOfHeats) {
            RaceService.currentRound.heats.push(new Heat({ heatNumber: RaceService.currentRound.heats.length + 1 }));
        }
    }

    public static updateDefaultCompetitionValue() {
        if (CompetitionService.competitions.length > 0) {
            var youngestCompetition = CompetitionService.competitions[0];
            for (var idx in CompetitionService.competitions) {
                if (CompetitionService.competitions[idx].dateFrom > youngestCompetition.dateFrom) {
                    youngestCompetition = CompetitionService.competitions[idx];
                }
            }
            RaceService.selectedCompetition = youngestCompetition;
            RaceService.competitionChanged();
            RaceService.reloadAngular();
        }
    }

    public static sortByPilotNr() {
        RaceService.pilotSelectionOrder = ['+pilotNumber'];
    }

    public static sortByName() {
        RaceService.pilotSelectionOrder = ['+firstName', '+lastName'];
    }

    public static pilotFilter(pilot: Pilot, index, array) {
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats) {
            return false;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRace.format.toUpperCase() != "TRAINING" && RaceService.currentRound.heats[idx].pilots[pIdx].uuid == pilot.uuid) {
                    return false;
                }
            }
        }
        if (pilot.classs && RaceService.selectedClass && pilot.classs.uuid != RaceService.selectedClass.uuid) {
            if (RaceService.currentRace.format.toUpperCase() != "TRAINING") {
                return false;
            }
        }
        if (CompetitionService.nameFilter.text && ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) == -1
            && (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) == -1) {
            return false;
        }

        if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING" && RaceService.currentRound.roundNumber > 1) {
            var result = RaceService.qualificationResultOfCurrentRace.filter(function(result: RoundResultEntry) {
                return result.pilotUUID == pilot.uuid;
            });
            if (!result || result.length != 1) {
                return false;
            }
            if (result[0].lapTimes.length != RaceService.currentRound.roundNumber - 1) {
                return false;
            }
            if (result[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                return false;
            }
        }

        if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {

            if (RaceService.currentRound.roundNumber == 1) {
                if (RaceService.qualificationResultOfCurrentRace.length == 0) {
                    //no qualification done, all pilots can participate
                    return true;
                }
                var result = RaceService.qualificationResultOfCurrentRace.filter(function(result: RoundResultEntry) {
                    return result.pilotUUID == pilot.uuid;
                });
                if (!result || result.length != 1) {
                    return false;
                }
                if (result[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                    return false;
                }
            }

            if (RaceService.previousRound && RaceService.currentRound.roundNumber > 1) {
                var entry = RaceService.previousRound.competitionResults.filter(function(entry: RaceResultEntry) {
                    return entry.pilotUUID == pilot.uuid;
                });
                if (!entry || entry.length != 1) {
                    return false;
                }
                if (entry[0].rank > RaceService.currentRound.amountOfQualifiedPilots) {
                    return false;
                }
            }
        }

        return true;
    }

    public static getResultsFromQualification() {
        var qualificationRace: Race = null;
        for (var idx = 0; idx < RaceService.races.length; idx++) {
            if (RaceService.currentRace.competitionUUID == RaceService.races[idx].competitionUUID
                && RaceService.races[idx].format.toUpperCase() == "QUALIFYING"
                && RaceService.races[idx].classs
                && RaceService.races[idx].classs.name == RaceService.currentRace.classs.name) {
                return RaceService.races[idx].qualificationResults;
            }
        };
        if (!qualificationRace) {
            return [];
        }
    }

    public static qualificationFilter(pilot: Pilot, index, array) {
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats) {
            return false;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRound.heats[idx].pilots[pIdx].uuid == pilot.uuid) {
                    return false;
                }
            }
        }
        if (pilot.classs && RaceService.selectedClass && pilot.classs.uuid != RaceService.selectedClass.uuid) {
            return false;
        }
        if (CompetitionService.nameFilter.text && ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) == -1
            && (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) == -1) {
            return false;
        }

        return true;
    }

    public static removePilotFromRaceByUUID(uuid: string) {

        if (!RaceService.currentRound) {
            return;
        }
        for (var idx in RaceService.currentRound.heats) {
            for (var pIdx in RaceService.currentRound.heats[idx].pilots) {
                if (RaceService.currentRound.heats[idx].pilots[pIdx].uuid == uuid) {
                    RaceService.currentRound.heats[idx].pilots.splice(pIdx, 1);
                }
                return;
            }
        }
    }

    public static fillHeats() {
        CompetitionService.nameFilter.text = "";
        if (!RaceService.currentRace || !RaceService.currentRound || !RaceService.currentRound.heats || !RaceService.selectedCompetition) {
            return;
        }

        //dont mix up rounds with allready finished heats
        for (var idx in RaceService.currentRound.heats) {
            if (RaceService.currentRound.heats[idx].heatResult) {
                return;
            }
        }

        for (var idx in RaceService.currentRound.heats) {
            RaceService.currentRound.heats[idx].pilots.length = 0;
        }

        RaceService.addPilots();
    }

    public static setPilotsTimingIndex(pilots: Pilot[]) {
        for (var idx = 0; idx < pilots.length; idx++) {
            pilots[idx].manualTimingIndex = "" + (idx + 1);
        };
    }

    public static clickPilot(heat: Heat, pilot: Pilot) {
        RaceService.pilotToMove = pilot;
        RaceService.pilotToMoveOrigin = heat;
    }

    public static cancelMovePilot() {
        RaceService.pilotToMove = null;
        RaceService.pilotToMoveOrigin = null;

    }

    public static movePilot(heat: Heat) {
        if (RaceService.pilotToMoveOrigin) {
            RaceService.pilotToMoveOrigin.pilots.splice(RaceService.pilotToMoveOrigin.pilots.indexOf(RaceService.pilotToMove), 1);
            RaceService.setPilotsTimingIndex(RaceService.pilotToMoveOrigin.pilots);
        }
        if (heat) {
            var qualifiedPilot = new QualifiedPilot(RaceService.pilotToMove);
            if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
                RaceService.currentRace.qualificationResults.forEach(function(qualificationResult) {
                    if (qualificationResult.pilotUUID == qualifiedPilot.uuid) {
                        qualifiedPilot.lapTimeSum = qualificationResult.lapTimesSum;
                        qualifiedPilot.lapTimes.length = 0;
                        for (var ltIdx in qualificationResult.lapTimes) {
                            qualifiedPilot.lapTimes.push(qualificationResult.lapTimes[ltIdx]);
                        }
                        qualifiedPilot.rank = qualificationResult.rank;
                    }
                });
            }
            else if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.currentRound.competitionResults.forEach(function(competitionResult) {
                    if (competitionResult.pilotUUID == qualifiedPilot.uuid) {
                        qualifiedPilot.lapTimeSum = competitionResult.totalTime;
                        qualifiedPilot.lapTimes.length = 0;
                        qualifiedPilot.rank = competitionResult.rank;
                    }
                });
            }

            heat.pilots.push(qualifiedPilot);
            RaceService.reAssignRaceBandsToCurrentRound();
            RaceService.setPilotsTimingIndex(heat.pilots);
        }
        RaceService.pilotToMove = null;
        RaceService.pilotToMoveOrigin = null;
    }

    public static shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    public static isHeatFull(heat: Heat) {
        return heat.pilots.length >= RaceBandService.raceBands.length || (RaceService.pilotToMove && heat.pilots.some((p: Pilot) => {
            return RaceService.pilotToMove.uuid == p.uuid || RaceService.pilotToMove.deviceId == p.deviceId;
        }));
    }

    public static reAssignRaceBandsToCurrentRound() {
        RaceService.currentRound.heats.forEach((heat) => {
            for (var idx = 0; idx < heat.pilots.length; idx++) {
                if (RaceBandService.raceBands[idx]) {
                    heat.pilots[idx].assignedRaceBand = RaceBandService.raceBands[idx];
                }
            }
        });

    }

    public static addPilots() {
        var pilots = RaceService.selectedCompetition.pilots.filter(RaceService.pilotFilter);
        var amountOfRaceBands = RaceBandService.raceBands.length;
        RaceService.shuffle(pilots);
        var pilot = null;

        if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
            if (RaceService.currentRound.roundNumber == 1) {
                if (RaceService.qualificationResultOfCurrentRace && RaceService.qualificationResultOfCurrentRace.length > 0) {
                    for (var resultIndex in RaceService.qualificationResultOfCurrentRace) {
                        var qualifiedPilot: QualifiedPilot = null;
                        pilots.forEach(function(p) {
                            if (p.uuid == RaceService.qualificationResultOfCurrentRace[resultIndex].pilotUUID) {
                                qualifiedPilot = new QualifiedPilot(p);
                                qualifiedPilot.lapTimeSum = RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimesSum;
                                qualifiedPilot.lapTimes.length = 0;
                                qualifiedPilot.rank = RaceService.qualificationResultOfCurrentRace[resultIndex].rank;
                            }
                        });
                        if (!qualifiedPilot || RaceService.qualificationResultOfCurrentRace[resultIndex].disqualified) {
                            continue;
                        }
                        var heatIndex = (RaceService.qualificationResultOfCurrentRace[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                        var heat = RaceService.currentRound.heats[heatIndex];
                        if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                            heat.pilots.push(qualifiedPilot);
                        }
                    }
                }
                else {
                    for (var pilotIndex in pilots) {
                        pilot = pilots[pilotIndex];
                        var minAmountOfPilotsInHeats = 9999999;
                        RaceService.currentRound.heats.forEach(function(heat) {
                            if (heat.pilots.length < minAmountOfPilotsInHeats) {
                                minAmountOfPilotsInHeats = heat.pilots.length;
                            }
                        });
                        var freeHeats = RaceService.currentRound.heats.filter(function(heat) {
                            return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some((p: Pilot) => {
                                return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                            });
                        });
                        for (var hIdx in freeHeats) {
                            var heat = freeHeats[hIdx];
                            if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                                heat.pilots.push(pilot);
                                break;
                            }
                        }
                    }
                }
            }
            else if (RaceService.currentRound.roundNumber > 1) {
                for (var resultIndex in RaceService.previousRound.competitionResults) {
                    var qualifiedPilot: QualifiedPilot = null;
                    pilots.forEach(function(p) {
                        if (p.uuid == RaceService.previousRound.competitionResults[resultIndex].pilotUUID) {
                            qualifiedPilot = new QualifiedPilot(p);
                            qualifiedPilot.lapTimeSum = RaceService.previousRound.competitionResults[resultIndex].totalTime;
                            qualifiedPilot.amountOfLaps = RaceService.previousRound.competitionResults[resultIndex].amountOfLaps;
                            qualifiedPilot.rank = RaceService.previousRound.competitionResults[resultIndex].rank;
                        }
                    });
                    if (!qualifiedPilot || RaceService.previousRound.competitionResults[resultIndex].disqualified) {
                        continue;
                    }
                    var heatIndex = (RaceService.previousRound.competitionResults[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                    var heat = RaceService.currentRound.heats[heatIndex];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(qualifiedPilot);
                    }
                }
            }
        }
        else if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
            if (RaceService.currentRound.roundNumber == 1) {
                for (var pilotIndex in pilots) {
                    pilot = pilots[pilotIndex];
                    var minAmountOfPilotsInHeats = 9999999;
                    RaceService.currentRound.heats.forEach(function(heat) {
                        if (heat.pilots.length < minAmountOfPilotsInHeats) {
                            minAmountOfPilotsInHeats = heat.pilots.length;
                        }
                    });
                    var freeHeats = RaceService.currentRound.heats.filter(function(heat) {
                        return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some((p: Pilot) => {
                            return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                        });
                    });
                    for (var hIdx in freeHeats) {
                        var heat = freeHeats[hIdx];
                        if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                            heat.pilots.push(pilot);
                            break;
                        }
                    }
                }
            }
            else if (RaceService.currentRound.roundNumber > 1) {
                for (var resultIndex in RaceService.qualificationResultOfCurrentRace) {
                    var qualifiedPilot: QualifiedPilot = null;
                    pilots.forEach(function(p) {
                        if (p.uuid == RaceService.qualificationResultOfCurrentRace[resultIndex].pilotUUID) {
                            qualifiedPilot = new QualifiedPilot(p);
                            qualifiedPilot.lapTimeSum = RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimesSum;
                            qualifiedPilot.lapTimes.length = 0;
                            for (var ltIdx in RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimes) {
                                qualifiedPilot.lapTimes.push(RaceService.qualificationResultOfCurrentRace[resultIndex].lapTimes[ltIdx]);
                            }
                            qualifiedPilot.rank = RaceService.qualificationResultOfCurrentRace[resultIndex].rank;
                        }
                    });
                    if (!qualifiedPilot || RaceService.qualificationResultOfCurrentRace[resultIndex].disqualified) {
                        continue;
                    }
                    var heatIndex = (RaceService.qualificationResultOfCurrentRace[resultIndex].rank - 1) % RaceService.currentRound.heats.length;
                    var heat = RaceService.currentRound.heats[heatIndex];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(qualifiedPilot);
                    }
                }
            }
        }
        else if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            for (var pilotIndex in pilots) {
                pilot = pilots[pilotIndex];
                var minAmountOfPilotsInHeats = 9999999;
                RaceService.currentRound.heats.forEach(function(heat) {
                    if (heat.pilots.length < minAmountOfPilotsInHeats) {
                        minAmountOfPilotsInHeats = heat.pilots.length;
                    }
                });
                var freeHeats = RaceService.currentRound.heats.filter(function(heat) {
                    return heat.pilots.length == minAmountOfPilotsInHeats && !heat.pilots.some((p: Pilot) => {
                        return pilot.uuid == p.uuid || pilot.deviceId == p.deviceId;
                    });
                });
                for (var hIdx in freeHeats) {
                    var heat = freeHeats[hIdx];
                    if (heat.pilots && heat.pilots.length < amountOfRaceBands) {
                        heat.pilots.push(pilot);
                        break;
                    }
                }
            }
        }
        RaceService.setPilotsTimingIndex(heat.pilots);
        RaceService.reAssignRaceBandsToCurrentRound();
    }

    public static showRaceResult() {
        document.getElementById("raceResult").classList.remove("removed");
        document.getElementById("addPilotsList").classList.add("removed");
        document.getElementById("configureRace-container").classList.add("mini");
    }

    public static hideRaceResult() {
        document.getElementById("addPilotsList").classList.remove("removed");
        document.getElementById("raceResult").classList.add("removed");
        document.getElementById("configureRace-container").classList.remove("mini");
    }

    public static close() {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            RaceService.setRaceStopable();
            RaceService.stopRace();
        }
        RaceService.CURRENT_STATUS.raceCloseable = false;
        RaceService.hideRaceResult();
        RaceSimulationService.stopSimulation();
    }

    public static setRaceStopable() {
        setTimeout(function() {
            RaceService.durationTimer.setTimerStopable();
            RaceService.reloadAngular();
            console.log("STOP");
        }, RaceService.currentRound.overtime*1000);
    }

    public static stopRace() {
        RaceService.CURRENT_STATUS.raceStarted = false;
        RaceSimulationService.stopSimulation();
    }

    public static resultClicked(result, heat) {
        RaceService.resultToEdit = result;
        EditLapsService.setLaps(heat.heatResult.laps.filter((lap: Lap) => {
            return lap.pilotUUID == result.pilotUUID;
        }));
        RaceService.heatForPenalty = heat;
        console.dir(RaceService.resultToEdit);
        console.dir(RaceService.heatForPenalty.heatResult.results);
    }

    public static savePenalty() {
        RaceResultService.calculateRaceResult(RaceService.heatForPenalty.heatResult.results, RaceService.currentRace, RaceService.heatForPenalty, RaceService.heatForPenalty.heatResult.laps);
        if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
            RaceService.calculateCurrentQualificationResults();
        } else if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
            RaceService.calculateCurrentCompetitionResults();
        }
        RaceService.update(RaceService.currentRace);
        RaceService.cancelEditResult();
    }

    public static cancelEditResult() {
        RaceService.resultToEdit = null;
        EditLapsService.setLaps([]);
        RaceService.heatForPenalty = null;
    }

    public static disqualify() {
        RaceService.heatForPenalty.heatResult.laps.forEach((lap) => {
            if (RaceService.resultToEdit.pilotUUID == lap.pilotUUID) {
                lap.disqualified = !lap.disqualified;
            }
        });
        RaceService.savePenalty();
        //TODO:  show disqualified on UI
    }

    public static setRaceResult() {
        if (RaceService.raceResult && RaceService.CURRENT_RACE_LAPS && RaceService.CURRENT_RACE_LAPS.length > 0) {
            RaceService.currentRaceResult.results = RaceService.raceResult;

            RaceService.currentRaceResult.laps = RaceService.CURRENT_RACE_LAPS.filter(function(lap) {
                return +lap.time > 0;
            })
            RaceService.currentHeat.heatResult = RaceService.currentRaceResult;
            if (RaceService.currentRace.format.toUpperCase() == "QUALIFYING") {
                RaceService.calculateCurrentQualificationResults();
            }
            if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.calculateCurrentCompetitionResults();
            }
            RaceService.update(RaceService.currentRace);
        }
        RaceService.reloadAngular();
    }

    public static finish() {
        setTimeout(function() {
            TTSService.speakNow("Heat finished!");
        }, 5000);
        RaceService.stopRace();
        WindowConfigService.endRace();
        RaceService.reloadAngular();
        console.log("heat finished");
        //        RaceService.setRaceResult();

    }

    public static calculateCurrentQualificationResults() {
        RaceService.currentRace.qualificationResults.length = 0;
        RaceService.currentRace.rounds.forEach(function(round) {
            round.heats.filter(function(h) {
                return h.heatResult != null;
            }).forEach(function(heat) {
                heat.heatResult.results.forEach(function(heatResultEntry) {
                    var found = false;
                    for (var idx in RaceService.currentRace.qualificationResults) {
                        var qualiResultEntry = RaceService.currentRace.qualificationResults[idx];
                        if (qualiResultEntry.pilotUUID == heatResultEntry.pilotUUID) {
                            found = true;
                            qualiResultEntry.lapTimes.push(heatResultEntry.bestRoundTime);
                            qualiResultEntry.lapTimesSum += +heatResultEntry.bestRoundTime;
                        }
                    }
                    if (!found) {
                        var result = new RoundResultEntry({
                            pilotUUID: heatResultEntry.pilotUUID,
                            pilotNumber: heatResultEntry.pilotNumber,
                            pilotName: heatResultEntry.pilotName,
                            lapTimes: [heatResultEntry.bestRoundTime],
                            lapTimesSum: heatResultEntry.bestRoundTime,
                            transponderId: heatResultEntry.deviceId,
                            disqualified: heatResultEntry.disqualified
                        });
                        RaceService.currentRace.qualificationResults.push(result);
                    }
                });


            });
        });
        var rank = 1;
        for (var round = RaceService.currentRace.rounds.length; round > 0; round--) {
            var filteredResults = RaceService.currentRace.qualificationResults.filter(function(result) {
                return result.lapTimes.length == round && !result.disqualified;
            });
            filteredResults.sort(function(a: RoundResultEntry, b: RoundResultEntry) {
                return +a.lapTimesSum - +b.lapTimesSum;
            });

            for (var rIdx in filteredResults) {
                filteredResults[rIdx].rank = rank;
                rank++;
            }
        }
        RaceService.currentRace.qualificationResults.sort(function(a: RoundResultEntry, b: RoundResultEntry) {
            return +a.rank - +b.rank;
        });
    }

    public static calculateCurrentCompetitionResults() {
        RaceService.currentRound.competitionResults.length = 0;
        RaceService.currentRound.heats.filter(function(h) {
            return h.heatResult != null;
        }).forEach(function(heat) {
            heat.heatResult.results.forEach(function(heatResultEntry) {
                if (!heatResultEntry.disqualified) {
                    RaceService.currentRound.competitionResults.push(JSON.parse(JSON.stringify(heatResultEntry)));
                }
            });
        });

        RaceService.currentRound.competitionResults.sort(function(a: RaceResultEntry, b: RaceResultEntry) {
            return +a.rank - +b.rank;
        });

        var rank = 1;
        for (var idx in RaceService.currentRound.competitionResults) {
            RaceService.currentRound.competitionResults[idx].rank = rank;
            rank++;
        }
    }

    public static getRaceStatus() {
        return RaceService.CURRENT_STATUS;
    }

    public static readyToStartHeat(simulation: boolean) {

        if (!RaceService.currentRound.countdown || +RaceService.currentRound.countdown < 5) {
            NotificationService.notify("Please set a valid countdown value above 5 seconds!");
            return false;
        }
        if ((!RaceService.currentHeat.pilots || RaceService.currentHeat.pilots.length < 1) && RaceService.currentRace.format.toUpperCase() != 'TRAINING') {
            NotificationService.notify("Please add pilots to your heat!");
            return false;
        }

        if (RaceService.currentRound.roundNumber > 1) {
            if (!RaceService.currentRound.amountOfQualifiedPilots || +RaceService.currentRound.amountOfQualifiedPilots < 1) {
                NotificationService.notify("Please select a valid amount of qualified pilots per round!");
                return false;
            }
        }
        if (!RaceService.currentRound.blockingTime || +RaceService.currentRound.blockingTime < 1) {
            NotificationService.notify("Please set a valid blocking time!");
            return false;
        }

        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            if (!RaceService.currentRound.duration || +RaceService.currentRound.duration < 1) {
                NotificationService.notify("Please set a valid race duration!");
                return false;
            }
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            //            if (RaceService.currentRound.overTime == null || +RaceService.currentRound.overTime < 0) {
            //                NotificationService.notify("Please set a overtime!");
            //                return false;
            //            }
            if (!RaceService.currentRound.amountOfLaps || +RaceService.currentRound.amountOfLaps < 1) {
                NotificationService.notify("Please set a number of laps!");
                return false;
            }
        }

        if (RaceService.getRaceStatus().raceStarted || RaceService.getRaceStatus().raceCloseable) {
            return false;
        }

        RaceService.currentHeat.pilots.forEach((pilot) => {
            if (!pilot.deviceId || pilot.deviceId.length < 1) {
                NotificationService.notify("Please make sure all pilots have transponder IDs!");
                return false;
            }
        });

        return true;
    }

    public static startHeat(heat: Heat, simulation: boolean) {
        RaceService.currentHeat = heat;
        WindowConfigService.setCurrentHeat(RaceService.currentHeat.uuid);
        RaceService.finishedPilotsInLapHeat.length = 0;
        if (RaceService.CURRENT_STATUS.startInProgress || !RaceService.readyToStartHeat(simulation)) {
            return;
        }
        RaceService.CURRENT_STATUS.startInProgress = true;
        RaceService.currentRound.timestamp = new Date();
        RaceService.currentRound.countdown = Math.floor(RaceService.currentRound.countdown);
        document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML = "" + RaceService.currentRound.countdown;

        RaceService.setPilotsTimingIndex(RaceService.currentHeat.pilots);
        heat.pilots.forEach((p) => {
            console.log(p.firstName + " " + p.manualTimingIndex);
        });

        RaceService.heatCountdownInterval = setInterval(function() {
            var countdownValue: any = +document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML - 1;
            if (countdownValue < 1) {
                clearInterval(RaceService.heatCountdownInterval);
                countdownValue = "GO";
            }
            else {
                //TTSService.speakStartHeatCountdown("" + countdownValue);
            }
            document.getElementsByClassName("startHeat" + heat.uuid)[0].classList.add("show");
            document.getElementsByClassName("startHeat" + heat.uuid)[0].innerHTML = countdownValue;
            setTimeout(function() {
                document.getElementsByClassName("startHeat" + heat.uuid)[0].classList.remove("show");
            }, 800);
        }, 1000);
        RaceService.currentHeat.exactStartTime = new Date().getTime() + (RaceService.currentRound.countdown * 1000);
        RaceService.saveRound();

        DatabaseService.replaceContent(DatabaseService.store_liveResults, [], function(e) { });
        RaceService.countdownTimer = new Timer().startTimer(RaceService.currentRound.countdown * 1000, function() {
            RaceService.CURRENT_STATUS.startInProgress = false;
            clearInterval(RaceService.heatCountdownInterval);

            RaceService.CURRENT_RACE_LAPS.length = 0;
            RaceService.raceResult = [];
            RaceService.currentRaceResult = new RaceResult({});

            if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
                RaceService.currentRound.duration = 999999;
            }
            RaceService.durationTimer = new Timer().startTimer(RaceService.currentRound.duration * 1000, RaceService.finish, true, RaceService.reloadAngular);

            if (!simulation) {
                SerialConnectionService.resetTrackingDevice();
            }

            RaceService.CURRENT_STATUS.maxRoundsReached = false;
            RaceService.CURRENT_STATUS.raceStarted = true;
            RaceService.CURRENT_STATUS.raceCloseable = true;


            if (RaceService.currentRace.format.toUpperCase() == "COMPETITION") {
                RaceService.resultOrder = RaceService.orderByAmountOfRounds;
            }
            else {
                RaceService.resultOrder = RaceService.orderByBestRound;
            }
            RaceService.showRaceResult();
            RaceService.reloadAngular();
            if (simulation) {
                RaceSimulationService.simulateHeat(heat, RaceService.currentRound.duration);
            }
        }, false, null);
    }



    public static getNewRaceAndSetCurrent() {
        RaceService.currentRound = RaceService.getNewRound(1);
        return new Race({
            rounds: [],
            classs: RaceService.selectedClass,
            format: RaceService.selectedFormat,
            competitionUUID: RaceService.selectedCompetition.uuid
        });
    }

    public static getNewRace() {
        return new Race({
            rounds: [],
            classs: RaceService.selectedClass,
            format: RaceService.selectedFormat,
            competitionUUID: RaceService.selectedCompetition.uuid
        });
    }

    public static getNewRound(roundNumber: number) {
        return new Round({
            countdown: 5,
            duration: 180,
            blockingTime: 5,
            roundNumber: roundNumber,
            amountOfHeats: 1,
            lapDistance: 0,
            overtime: 30,
            timestamp: new Date(),
            amountOfQualifiedPilots: 1,
            heats: [new Heat({ heatNumber: 1 })],
            "type": RaceService.raceTypes[0]
        });
    }

    public static isReady() {
        return SerialConnectionService.isReady() && RaceService.currentRace && RaceService.currentRace.type && RaceService.currentRace.format;
    }
    
    public static downloadQualificationResult() {
        var spans = document.getElementById("qualificationResultTable").getElementsByTagName("span");
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n";
        csv += "Format:;" + RaceService.currentRace.format + "\n";
        csv += "Class:;" + RaceService.currentRace.classs.name + "\n";
        csv += "Type:;" + RaceService.currentRace.type + "\n";

        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            csv += "Race Duration:;" + RaceService.currentRound.duration + "\n";
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            csv += "Amount Of Laps:;" + RaceService.currentRound.amountOfLaps + "\n";
        }
        if (RaceService.currentRound.lapDistance > 0) {
            csv += "Lap Distance:;" + RaceService.currentRound.lapDistance + "\n";
        }
        if (RaceService.currentRound.description) {
            csv += "Description:;" + RaceService.currentRound.description + "\n";
        }

        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            
            if (spans[idx].innerHTML.indexOf("[") > -1) {
                csv += "\n";
            }
            csv += spans[idx].innerText+";";
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "qualification_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    }

    public static download() {
        var spans = document.getElementById("raceResult").getElementsByTagName("span");
        var csv = "";
        csv += "Event:;" + RaceService.selectedCompetition.description + "\n";
        csv += "Format:;" + RaceService.currentRace.format + "\n";
        csv += "Class:;" + RaceService.currentRace.classs.name + "\n";
        csv += "Type:;" + RaceService.currentRace.type + "\n";
        csv += "Round:;" + RaceService.currentRound.roundNumber + "\n";
        csv += "Heat:;" + RaceService.currentHeat.heatNumber + "/" + RaceService.currentRound.amountOfHeats + "\n\n";

        if (RaceService.currentRace.type.toUpperCase() == "TIME") {
            csv += "Race Duration:;" + RaceService.currentRound.duration + "\n";
        }
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            csv += "Amount Of Laps:;" + RaceService.currentRound.amountOfLaps + "\n";
        }
        if (RaceService.currentRound.lapDistance > 0) {
            csv += "Lap Distance:;" + RaceService.currentRound.lapDistance + "\n";
        }
        if (RaceService.currentRound.description) {
            csv += "Description:;" + RaceService.currentRound.description + "\n";
        }

        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            csv += spans[idx].innerHTML;

            if ((+idx + 1) % 7 == 0) {
                csv += "\n";
            }
            else {
                csv += ";";
            }
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        var filename = "race_result_(" + new Date().toJSON() + ").csv";
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    }

    public static devicePassed(info: string[], manualTiming: boolean) {
        //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
        if (RaceService.CURRENT_STATUS.readDevice && SerialConnectionService.isReady() && !manualTiming) {
            if (info[2]) {
                SoundService.playBeep();
                RaceService.pilotToScan.deviceId = info[2];
                PilotService.scanTimer.value = 0;
                RaceService.CURRENT_STATUS.readDevice = false;
                PilotService.update(RaceService.pilotToScan);
                RaceService.reloadAngular();
            }
        } else if (RaceService.CURRENT_STATUS.raceStarted) {
            if (info[0].indexOf("%") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0") != -1) {
                //reset: 1, 37, 9, HW_ID, 9, 48, 9, 48, 13, 10
                //pass: 1, 64, 9, HW_ID, 9, TRANSPONDER_ID, 9, SECS.MSS, 13, 10
                return; //just the device reset response
            }
            SoundService.playBeep();
            var pilot = null;
            if (manualTiming) {
                pilot = RaceService.getCompetingPilotToManualTimingIndex(info[2]);
            } else {
                pilot = RaceService.getCompetingPilotToDeviceId(info[2]);
            }
            if (pilot != null) {
                RaceService.generateLap(pilot, info[3]);
            }
            else {
            }
        } else if (!manualTiming && !SerialConnectionService.isReady() && info[0].indexOf("%") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0") != -1 && info.length == 4) {
            SoundService.playBeep();
            SerialConnectionService.DEVICE = SerialConnectionService.DEVICE_TO_VERIFY;
            RaceService.CURRENT_STATUS.deviceNotReady = false;
            NotificationService.notify("USB device connected.");
        }
    }

    public static generateLap(pilot: Pilot, timestamp: string) {

        if (!pilot || RaceService.CURRENT_STATUS.raceStarted == false) {
            return;
        }
        var laps = RaceService.CURRENT_RACE_LAPS.filter(function(lap: Lap) {
            return lap.pilotUUID == pilot.uuid;
        });


        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            if (RaceService.finishedPilotsInLapHeat.indexOf(pilot) != -1) {
                //Type: Laps ... a pilot allready finished line
                return;
            }
            if (RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.finishedPilotsInLapHeat.push(pilot);
            }
        }

        var lastEndTime: number = 0.0;
        laps.forEach(function(lap: Lap) {
            if (+lap.endTime > lastEndTime) {
                lastEndTime = +lap.endTime;
            }
        });

        //RaceService check needs to be done before next if( lastEndTime = 0.0 for competition ) because otherwise first round can be messed up!
        if (laps.length > 0 && (+timestamp) < (lastEndTime + (+RaceService.currentRound.blockingTime))) {
            NotificationService.notify("blocked round: blocking time!");
            return;
        }

        //needs to be done after blocking time check, see comment for blocking time check!
        if (laps.length == 1 && RaceService.currentRace.format.toUpperCase() === "COMPETITION") {
            lastEndTime = 0.0;
        }

        var time = (laps.length == 0) ? 0. : Math.floor(1000. * (+timestamp - lastEndTime)) / 1000.;
        var lap = new Lap({
            raceUUID: RaceService.currentRace.uuid,
            pilotUUID: pilot.uuid,
            pilotName: "[" + pilot.pilotNumber + "] " + pilot.firstName + " " + pilot.lastName,
            lapNumber: laps.length,
            startTime: lastEndTime,
            endTime: timestamp,
            time: time,
            totalTime: time,
            startTimestamp: new Date().getTime()
        });
        RaceService.CURRENT_RACE_LAPS.push(lap);
        if (RaceService.currentRace.type.toUpperCase() == "LAPS") {
            if (laps.length >= RaceService.currentRound.amountOfLaps && !RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.CURRENT_STATUS.maxRoundsReached = true;
                RaceService.finishedPilotsInLapHeat.push(pilot);
            }
            if (RaceService.CURRENT_STATUS.maxRoundsReached) {
                RaceService.setRaceStopable();
            }
        }
        RaceResultService.calculateRaceResult(RaceService.raceResult, RaceService.currentRace, RaceService.currentHeat, RaceService.CURRENT_RACE_LAPS);
        RaceService.setRaceResult();
        DatabaseService.replaceContent(DatabaseService.store_liveResults, RaceService.raceResult, function(e) { });
        if (lap.time > 0) {
            TTSService.pilotPassedGate(pilot.firstName + " " + pilot.lastName, laps.length, lap.time);
        }
    }

    public static mockPilotPassing(pilot, time) {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            RaceService.generateLap(pilot, time);
        }
    }

    public static mockTransponderPassing(deviceId, time) {
        if (RaceService.CURRENT_STATUS.raceStarted) {
            //<01>@<09>204<09>XXXXXXX<09>SECS.MSS<13><10>
            //info[0].indexOf("%") != -1 && info[1].indexOf("20") != -1 && info[2].indexOf("0") != -1 && info[3].indexOf("0")
            RaceService.devicePassed(["%", "204", "" + deviceId, "" + time], false);
        }
    }

    public static mockRace() {
        for (var i: number = 0; i < 10; i++) {
            RaceService.currentHeat.pilots.forEach(function(p) {
                if (Math.random() < 0.5) {
                    RaceService.generateLap(p, "" + (10 * i + (1 - Math.random())));
                }
            });
        }
    }

    public static getCompetingPilotToDeviceId(deviceId: string) {
        for (var idx in RaceService.currentHeat.pilots) {
            if (RaceService.currentHeat.pilots[idx].deviceId == deviceId) {
                return RaceService.currentHeat.pilots[idx];
            }
        }
        if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            var pilot: Pilot = new Pilot({
                uuid: "MOCK_" + deviceId,
                firstName: "Pilot",
                lastName: deviceId,
                deviceId: deviceId,
                pilotNumber: 0
            });
            RaceService.currentHeat.pilots.push(pilot);
            return pilot;
        }
        return null;
    }

    public static getCompetingPilotToManualTimingIndex(index: string) {
        for (var idx in RaceService.currentHeat.pilots) {
            if (RaceService.currentHeat.pilots[idx].manualTimingIndex == index) {
                return RaceService.currentHeat.pilots[idx];
            }
        }
        if (RaceService.currentRace.format.toUpperCase() == "TRAINING") {
            var pilot: Pilot = new Pilot({
                uuid: "MOCK_" + index,
                firstName: "Pilot",
                lastName: index,
                deviceId: index,
                manualTimingIndex: index,
                pilotNumber: 0
            });
            RaceService.currentHeat.pilots.push(pilot);
            return pilot;
        }
        return null;
    }

    public static update(race: Race) {
        DatabaseService.save(DatabaseService.store_races, race, function(x) {
            if (RaceService.races.indexOf(race) == -1) {
                RaceService.races.push(race);
            }
        }, function(e) {
            console.log("ex", e);
        });
    }

    public static delete(race, callback) {
        try {
            DatabaseService.delete(DatabaseService.store_races, race, function() {
                RaceService.races.splice(RaceService.races.indexOf(race), 1);
                callback();
                RaceService.reloadAngular();
                NotificationService.notify("Race deleted!");
            }, function() {
            });
        } catch (ex) {
        }
    }
    public static deleteHeat(raceUUID, heatUUID, callback) {
        try {
            RaceService.races.forEach(function(race) {
                if (race.uuid == raceUUID) {
                    race.rounds.forEach(function(round) {
                        round.heats.forEach(function(heat) {
                            if (heat.uuid == heatUUID) {
                                heat.heatResult = null;
                                RaceService.update(race);
                                callback();
                                return;
                            }
                        });
                    });
                }
            });
        } catch (ex) {
            return;
        }
    }

    public static setRaces(races) {
        RaceService.races.length = 0;
        Array.prototype.push.apply(RaceService.races, races);
        RaceService.findCurrentRace();
        RaceService.reloadAngular();
    }

    public static reloadAngular() {
        if (!angular.element(document.getElementById('races')).scope().$$phase) {
            angular.element(document.getElementById('races')).scope().$apply();
        }
        else {
            console.log("reload angular failed!!!");
            setTimeout(RaceService.reloadAngular, 200);
        }
    }
}