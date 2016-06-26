/// <reference path="../_reference.ts"/>
class StatisticService {

    public static selectedCompetition: Competition = null;
    public static selectedRace: Race = null;
    public static lapResultOrder = ['+time', '+lapNumber'];
    public static selectionOrder = ['+format', '+class', '+type', '+round', '+heat']
    public static raceResult: RaceResult = null;
    public static statisticType: String = "P";
    public static raceIdentificationObjects: RaceIdentificationObject[] = [];
    public static selectedRaceIdentificationObject: RaceIdentificationObject = null;

    public static init() {
        StatisticService.raceIdentificationObjects.length = 0;
        StatisticService.selectedRaceIdentificationObject = null;
        StatisticService.raceResult = null;
        StatisticService.selectedRace = null;
        StatisticService.selectedCompetition = null;
        StatisticService.reloadAngular();
    }

    public static raceFilter(race: RaceIdentificationObject, index, array) {
        if (!StatisticService.selectedCompetition) {
            return false;
        }
        //TODO: maybe add further filters and replace dropdown with a list
        return true;
    }

    public static competitionSelected() {
        if (!StatisticService.selectedCompetition) {
            return [];
        }
        StatisticService.raceIdentificationObjects.length = 0;
        RaceService.races.forEach(function(race) {
            if (race.competitionUUID == StatisticService.selectedCompetition.uuid) {
                race.rounds.forEach(function(round) {
                    round.heats.forEach(function(heat) {
                        if (heat.heatResult && heat.heatResult.results.length > 0) {
                            StatisticService.raceIdentificationObjects.push(new RaceIdentificationObject({
                                format: race.format,
                                'class': race.classs ? race.classs.name : '',
                                round: round.roundNumber,
                                'type': race.type,
                                heat: heat.heatNumber,
                                description: round.description,
                                result: heat.heatResult,
                                heatUUID: heat.uuid,
                                raceUUID: race.uuid
                            }));
                        }
                    });
                });
            }
        });
    }

    public static raceSelected() {
        StatisticService.raceResult = StatisticService.selectedRaceIdentificationObject.result;
    }

    public static confirmDeleteCompetition() {
        for (var idx in RaceService.races) {
            if (RaceService.races[idx].competitionUUID == StatisticService.selectedCompetition.uuid) {
                RaceService.delete(RaceService.races[idx], StatisticService.reloadAngular);
            }
        }
        CompetitionService.delete(StatisticService.selectedCompetition, function() {
            StatisticService.selectedCompetition = null;
            StatisticService.raceResult = null;
            StatisticService.selectedRaceIdentificationObject = null;
            StatisticService.competitionSelected();
            StatisticService.reloadAngular();
        });
    }

    public static confirmDeleteHeat() {
        RaceService.deleteHeat(StatisticService.selectedRaceIdentificationObject.raceUUID, StatisticService.selectedRaceIdentificationObject.heatUUID, function() {
            StatisticService.raceResult = null;
            StatisticService.selectedRaceIdentificationObject = null;
            StatisticService.competitionSelected();
            StatisticService.reloadAngular();
        });
    }

    public static deleteCompetition() {
        ConfirmationService.pleaseConfirm(StatisticService.confirmDeleteCompetition, function() { });
    }

    public static deleteHeat() {
        ConfirmationService.pleaseConfirm(StatisticService.confirmDeleteHeat, function() { });
    }

    public static reloadAngular() {
        angular.element(document.getElementById('statistic')).scope().$apply();
    }

    public static download() {
        var spans = null;
        var cols = 0;
        var filename = "null";
        switch (StatisticService.statisticType) {
            case "P":
                spans = document.getElementById("raceResultStatisticsPilots").getElementsByTagName("span");
                cols = 7;
                filename = "race_history_pilots_(" + new Date().toJSON() + ").csv";
                break;
            case "L":
                spans = document.getElementById("raceResultStatisticsLaps").getElementsByTagName("span");
                cols = 3;
                filename = "race_history_laps_(" + new Date().toJSON() + ").csv";
                break;
        }
        var csv = "";
        csv += "Event:;" + StatisticService.selectedCompetition.description + "\n";
        csv += "Format:;" + StatisticService.selectedRaceIdentificationObject.format + "\n";
        csv += "Class:;" + StatisticService.selectedRaceIdentificationObject.class + "\n";
        csv += "Type:;" + StatisticService.selectedRaceIdentificationObject.type + "\n";
        csv += "Round:;" + StatisticService.selectedRaceIdentificationObject.round + "\n";
        csv += "Heat:;" + StatisticService.selectedRaceIdentificationObject.heat + "\n\n";

        if (StatisticService.selectedRaceIdentificationObject.description) {
            csv += "Description:;" + StatisticService.selectedRaceIdentificationObject.description + "\n";
        }

        csv += "\n";
        for (var idx in spans) {
            if (typeof spans[idx].innerHTML == "undefined") {
                break;
            }
            csv += spans[idx].innerHTML;

            if ((+idx + 1) % cols == 0) {
                csv += "\n";
            }
            else {
                csv += ";";
            }
        }
        var blobdata = new Blob([csv], { type: 'text/csv' });
        filename = filename.replace(" ", "");
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blobdata));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NotificationService.notify(NotificationService.fileDownloadText);
    }
}
