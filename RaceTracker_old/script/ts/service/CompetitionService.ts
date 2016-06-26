/// <reference path="../_reference.ts"/>
class CompetitionService {
    public static competitions: Competition[] = [];
    public static selectedCompetition: Competition = null;
    public static nameFilter: any = { text: "" };
    public static pilotSelectionOrder: string[] = ['+firstName', '+lastName'];
    public static selectedClassForRaceConfig: Classs = null;
    public static currentCompetitionConfig: CompetitionConfig = null;
    public static pilotToAdd: Pilot = null;
    public static config = { viewOnlineRegistration: false, viewOnlinePilots: false, disableRegButtons: false };
    public static onlinePilots: Pilot[] = [];
    
    //public static host: string = "http://localhost:8080";
    public static host: string = "https://cloud.fpvracetracker.com";
    
    public static registrationLink: String = CompetitionService.host + "/web/onlineRegistration.html?key=";
    public static resultLink: String = CompetitionService.host + "/web/onlineResult.html?key=";
    public static calendarLink: String = CompetitionService.host + "/web/onlineCalendar.html?key=";
    public static eventLink_1_resultKey: String = CompetitionService.host + "/web/onlineEvent.html?showPilots=true&resultKey=";
    public static eventIFrame_1_resultKey: String = CompetitionService.host + "/web/event.html?showPilots=true&resultKey=";
    public static eventLink_2_place: String = "&place=";
    public static eventLink_3_RegistrationKey: String = "&registrationKey=";



    public static registrationIframeCode: String = "<iframe width='410' height='740' src='" + CompetitionService.registrationLink;
    public static resultIframeCode: String = "<iframe width='680' height='520' src='" + CompetitionService.registrationLink;
    static init(callback) {
        DatabaseService.readAll(DatabaseService.store_competitions, function(competitions) {
            try {
                CompetitionService.setCompetitions(competitions);
            }
            catch (e) {
                console.log("e", e);
            }
            if (callback)
                callback();
        });
    }

    public static buildEventLink() {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.onlineResultKey && CompetitionService.selectedCompetition.onlineRegistrationKey) {
            return CompetitionService.eventLink_1_resultKey
                + CompetitionService.selectedCompetition.onlineResultKey
                + CompetitionService.eventLink_2_place
                + (CompetitionService.selectedCompetition.location ? CompetitionService.selectedCompetition.location : "null")
                + CompetitionService.eventLink_3_RegistrationKey
                + CompetitionService.selectedCompetition.onlineRegistrationKey;
        }
    }
    public static buildPrivateCalendarLink() {
        if (UserService.user && UserService.user.calendarKey) {
            return CompetitionService.calendarLink + UserService.user.calendarKey;
        }
        return CompetitionService.calendarLink + "all";
    }
    public static buildPublicCalendarLink() {
        return CompetitionService.calendarLink + "all";
    }

    public static buildPrivateCalendarIFrame() {
        if (UserService.user && UserService.user.calendarKey) {
            return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + UserService.user.calendarKey + "'></iframe>";
        }
        return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + "all" + "'></iframe>";
    }

    public static buildPublicCalendarIFrame() {
        return "<iframe width='600' height='740' src='" + CompetitionService.calendarLink + "all" + "'></iframe>";
    }

    public static buildOnlineEventIFrame() {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.onlineResultKey && CompetitionService.selectedCompetition.onlineRegistrationKey) {
            return "<iframe width='900' height='1052' src='" + CompetitionService.eventIFrame_1_resultKey
                + CompetitionService.selectedCompetition.onlineResultKey
                + CompetitionService.eventLink_2_place
                + (CompetitionService.selectedCompetition.location ? CompetitionService.selectedCompetition.location : "null")
                + CompetitionService.eventLink_3_RegistrationKey
                + CompetitionService.selectedCompetition.onlineRegistrationKey
                + "all" + "'></iframe>";
        }
    }

    public static toggleEventSettings() {
        if (typeof CompetitionService.selectedCompetition.onlineResultPossible == "undefined" || typeof CompetitionService.selectedCompetition.onlineResultKey == "undefined" || !CompetitionService.selectedCompetition.onlineResultKey || typeof CompetitionService.selectedCompetition.onlineRegistrationPossible == "undefined" || typeof CompetitionService.selectedCompetition.onlineRegistrationKey == "undefined" || !CompetitionService.selectedCompetition.onlineRegistrationKey) {
            if (typeof CompetitionService.selectedCompetition.onlineRegistrationPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineRegistrationPossible = true;
            }
            if (typeof CompetitionService.selectedCompetition.onlineRegistrationKey == "undefined" || !CompetitionService.selectedCompetition.onlineRegistrationKey) {
                CompetitionService.selectedCompetition.onlineRegistrationKey = UUIDService.next();
            }
            if (typeof CompetitionService.selectedCompetition.onlineResultPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineResultPossible = true;
            }
             if (typeof CompetitionService.selectedCompetition.onlineEventPossible == "undefined") {
                CompetitionService.selectedCompetition.onlineResultPossible = false;
            }
            if (typeof CompetitionService.selectedCompetition.onlineResultKey == "undefined" || !CompetitionService.selectedCompetition.onlineResultKey) {
                CompetitionService.selectedCompetition.onlineResultKey = UUIDService.next();
            }
            CompetitionService.update(CompetitionService.selectedCompetition);
        }
        CompetitionService.config.viewOnlineRegistration = !CompetitionService.config.viewOnlineRegistration;
    }

    public static createNewCompetition() {
        CompetitionService.selectedCompetition = new Competition({ description: "My Competition" });
        CompetitionService.autoSelectClassToEditRaceConfig();
    }


    public static classForPilotFilter(config: CompetitionConfig, index: number, array: any[]) {
        if (CompetitionService.selectedCompetition &&
            CompetitionService.pilotToAdd &&
            CompetitionService.selectedCompetition.competitionConfigs &&
            CompetitionService.selectedCompetition.competitionConfigs.length > 0) {
            var available = true;
            CompetitionService.selectedCompetition.pilots.forEach((pilot) => {
                if (pilot.uuid == CompetitionService.pilotToAdd.uuid && config.classs.uuid == pilot.classs.uuid) {
                    available = false;
                }
            });

            return available;
        }
        return false;
    }

    public static pilotFilter(pilot: Pilot, index: number, array: any[]) {
        if (CompetitionService.selectedCompetition) {
            if (
                !CompetitionService.nameFilter.text
                || ("" + pilot.pilotNumber).indexOf(CompetitionService.nameFilter.text) != -1
                || (pilot.firstName + " " + pilot.lastName).toUpperCase().indexOf(CompetitionService.nameFilter.text.toUpperCase()) != -1) {
                return true;
            }
        }
        return false;
    }

    public static competitionSelected() {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.classes.length == 0) {
            CompetitionService.currentCompetitionConfig = null;
            CompetitionService.selectedClassForRaceConfig = null;
        }
        CompetitionService.autoSelectClassToEditRaceConfig();
    }

    public static autoSelectClassToEditRaceConfig() {
        if (CompetitionService.selectedCompetition && CompetitionService.selectedCompetition.classes && CompetitionService.selectedCompetition.classes.length > 0) {
            CompetitionService.selectClassToEditRaceConfig(CompetitionService.selectedCompetition.classes[0]);
        }
    }

    public static sortByPilotNr() {
        CompetitionService.pilotSelectionOrder = ['+pilotNumber'];
    }

    public static sortByName() {
        CompetitionService.pilotSelectionOrder = ['+firstName', '+lastName'];
    }

    public static getNewRace(classs, format) {
        return new Race({
            rounds: [],
            classs: classs,
            format: format,
            competitionUUID: CompetitionService.selectedCompetition.uuid
        });
    }

    public static getNewRound(roundNumber) {
        return new Round({
            countdown: 5,
            duration: 180,
            blockingTime: 5,
            roundNumber: roundNumber,
            amountOfHeats: 1,
            lapDistance: 0,
            timestamp: new Date(),
            amountOfQualifiedPilots: 1,
            heats: [new Heat({ heatNumber: 1 })]
        });
    }

    public static save() {
        CompetitionService.update(CompetitionService.selectedCompetition);
        var races = RaceService.races.filter((race) => {
            return race.competitionUUID == CompetitionService.selectedCompetition.uuid;
        });

        CompetitionService.selectedCompetition.competitionConfigs.forEach((config) => {
            //TODO: for all 3 functions below...
            // * race has allready a result, but we change format
            // * race has allready a result but we delete the round
            // * ...
            var raceTraining = races.filter((race) => {
                return race.format.toUpperCase() == "TRAINING" && race.classs.uuid == config.classs.uuid;
            }).pop();

            if (!raceTraining) {
                raceTraining = CompetitionService.getNewRace(config.classs, "Training");
            }
            raceTraining.type = config.typeTraining;
            while (raceTraining.rounds.length < config.roundsTraining) {
                raceTraining.rounds.push(RaceService.getNewRound(raceTraining.rounds.length + 1));
            }
            while (raceTraining.rounds.length > config.roundsTraining) {
                var found = false;
                raceTraining.rounds.forEach((round) => {
                    round.heats.forEach((heat) => {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceTraining.rounds.pop();
            }
            RaceService.update(raceTraining);


            var raceQualifying = races.filter((race) => {
                return race.format.toUpperCase() == "QUALIFYING" && race.classs.uuid == config.classs.uuid;
            }).pop();

            if (!raceQualifying) {
                raceQualifying = CompetitionService.getNewRace(config.classs, "Qualifying");
            }
            raceQualifying.type = config.typeQualifying;
            while (raceQualifying.rounds.length < config.roundsQualifying) {
                raceQualifying.rounds.push(RaceService.getNewRound(raceQualifying.rounds.length + 1));
            }
            while (raceQualifying.rounds.length > config.roundsQualifying) {
                var found = false;
                raceQualifying.rounds.forEach((round) => {
                    round.heats.forEach((heat) => {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceQualifying.rounds.pop();
            }
            RaceService.update(raceQualifying);

            var raceCompetition = races.filter((race) => {
                return race.format.toUpperCase() == "COMPETITION" && race.classs.uuid == config.classs.uuid;
            }).pop();

            if (!raceCompetition) {
                raceCompetition = CompetitionService.getNewRace(config.classs, "Competition");
            }
            raceCompetition.type = config.typeCompetition;
            while (raceCompetition.rounds.length < config.roundsCompetition) {
                raceCompetition.rounds.push(RaceService.getNewRound(raceCompetition.rounds.length + 1));
            }
            while (raceCompetition.rounds.length > config.roundsCompetition) {
                var found = false;
                //TODO: dont loop all, just check the last
                raceCompetition.rounds.forEach((round) => {
                    round.heats.forEach((heat) => {
                        if (heat.heatResult && heat.heatResult.results && heat.heatResult.results.length > 0) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    break;
                }
                raceCompetition.rounds.pop();
            }
            RaceService.update(raceCompetition);
        });
    }


    public static selectClassToEditRaceConfig(classs: Classs) {
        CompetitionService.selectedClassForRaceConfig = classs;
        CompetitionService.selectedCompetition.competitionConfigs.forEach((config) => {
            if (config.classs.uuid == classs.uuid) {
                CompetitionService.currentCompetitionConfig = config;
            }
        });
    }

    public static customContains(competition: Competition, pilot: Pilot) {
        var pilotIdx = -1;
        if (!competition || !competition.pilots || competition.pilots.length < 1) {
            return pilotIdx;
        }
        for (var idx in competition.pilots) {
            if (competition.pilots[idx].uuid == pilot.uuid && competition.pilots[idx].classs.uuid == pilot.classs.uuid) {
                pilotIdx = idx;
            }
        };
        return pilotIdx;
    }


    public static removeAllPilotsWithClass(classs: Classs) {

        for (var idx = 0, max = CompetitionService.selectedCompetition.pilots.length; idx < max; idx++) {
            var pilot = CompetitionService.selectedCompetition.pilots[idx];
            if (pilot.classs.uuid == classs.uuid) {
                CompetitionService.selectedCompetition.pilots.splice(idx, 1);
                max = CompetitionService.selectedCompetition.pilots.length;
                idx--;
            }
        }
    }

    public static addClass(competition: Competition, classs: Classs) {
        var idx = CompetitionService.classAssigned(competition, classs);
        if (idx > -1) {
            for (var idx2 in competition.competitionConfigs) {
                if (competition.competitionConfigs[idx2].classs.uuid == classs.uuid) {
                    competition.competitionConfigs.splice(idx2, 1);
                    CompetitionService.removeAllPilotsWithClass(classs);
                    break;
                }
            };
            competition.classes.splice(idx, 1);
        }
        else {
            competition.competitionConfigs.push(new CompetitionConfig({ classs: classs }));
            competition.classes.push(classs);
        }
        CompetitionService.autoSelectClassToEditRaceConfig();
    }

    public static typeCompetitionChanged() {
        //TODO: dont allow values <  races with heat results inside (done but not perfectly, because if one result exists, no delete is possible at all)
        CompetitionService.raceConfigChanged();
    }
    public static roundsCompetitionChanged() {
        CompetitionService.raceConfigChanged();
    }
    public static typeQualifyingChanged() {
        CompetitionService.raceConfigChanged();
    }
    public static roundsQualifyingChanged() {
        CompetitionService.raceConfigChanged();
    }
    public static typeTrainingChanged() {
        CompetitionService.raceConfigChanged();
    }
    public static roundsTrainingChanged() {
        CompetitionService.raceConfigChanged();
    }

    public static raceConfigChanged() {
        //        CompetitionService.update(CompetitionService.selectedCompetition);
    }

    public static classAssigned(competition: Competition, classs: Classs) {
        var index = -1;
        if (!competition) {
            return index;
        }
        for (var idx = 0; idx < competition.classes.length; idx++) {
            if (competition.classes[idx].uuid == classs.uuid) {
                index = idx;
            }
        }
        return index;
    }


    public static removePilot(competition: Competition, pilot: Pilot) {
        var index = CompetitionService.customContains(competition, pilot);
        if (index != -1) {
            RaceService.removePilotFromRaceByUUID(pilot.uuid);
            competition.pilots.splice(index, 1);
            return;
        }
    }

    public static selectClassForPilot(pilot: Pilot) {
        CompetitionService.pilotToAdd = pilot;
    }

    public static removeOnlineRegistrationPilot(pilot: Pilot) {
        CompetitionService.config.disableRegButtons = true;
        AjaxService.send(AjaxService.path_removeRegistration + "/" + pilot.onlineRegistrationUUID + "/" + pilot.classs.uuid, null, function(success) {
            CompetitionService.onlinePilots.splice(CompetitionService.onlinePilots.indexOf(pilot), 1);
            CompetitionService.config.disableRegButtons = false;
            CompetitionService.reloadAngular();
        });

    }

    public static addOnlineRegistrationPilot(registeredPilot: Pilot) {
        CompetitionService.config.disableRegButtons = true;
        var localPilot = CompetitionService.pilotAllreadyExists(registeredPilot);
        var pilotAllreadyExists = localPilot ? true : false;
        console.log("allready assigned: " + pilotAllreadyExists, localPilot);
        if (!pilotAllreadyExists) {
            registeredPilot.pilotNumber = PilotService.getNextPilotNumber();
            PilotService.update(registeredPilot);
        }
        CompetitionService.addPilot(CompetitionService.selectedCompetition, (pilotAllreadyExists ? localPilot : registeredPilot), registeredPilot.classs);
        AjaxService.send(AjaxService.path_removeRegistration + "/" + registeredPilot.onlineRegistrationUUID + "/" + registeredPilot.classs.uuid, null, function(success) {
            CompetitionService.onlinePilots.splice(CompetitionService.onlinePilots.indexOf(registeredPilot), 1);
            CompetitionService.config.disableRegButtons = false;
            CompetitionService.reloadAngular();
        });
    }

    public static pilotAllreadyExists(pilot: Pilot) {
        var found = null;
        PilotService.pilots.forEach((p: Pilot) => {
            if (pilot && pilot.email && p && p.email && pilot.email.trim().toUpperCase() == p.email.trim().toUpperCase()) {
                found = p;
            }
        });
        return found;
    }

    public static isClassAvailableInCompetition(c: Classs): boolean {
        var found = false;
        CompetitionService.selectedCompetition.classes.forEach((classs) => {
            if (classs.uuid == c.uuid) {
                found = true;
            }
        });
        return found;
    }

    public static showOnlinePilots() {
        CompetitionService.config.disableRegButtons = false;
        CompetitionService.onlinePilots.length = 0;
        AjaxService.send(AjaxService.path_getOnlinePilots + "/" + CompetitionService.selectedCompetition.uuid, null, function(registrations) {
            registrations.forEach((registration: OnlineRegistration) => {
                new OnlineRegistration(registration).getPilotObjects().forEach((pilot: Pilot) => {
                    var p: Pilot = new Pilot(pilot);
                    p.onlineRegistrationUUID = registration.uuid;
                    CompetitionService.onlinePilots.push(p);
                });
            });

            CompetitionService.config.viewOnlinePilots = true;
            CompetitionService.reloadAngular();
        });
    }

    public static hideOnlinePilots() {
        CompetitionService.config.viewOnlinePilots = false;
    }

    public static cancelAddPilot() {
        CompetitionService.pilotToAdd = null;
    }

    public static addPilot(competition: Competition, pilot: Pilot, classs: Classs) {

        if (!classs) {
            return;
        }
        if (!pilot.pilotNumber || pilot.pilotNumber < 1) {
            NotificationService.notify("Pilot Number missing!");
            return;
        }
        if (!competition.pilots.every(function(p) { return p.pilotNumber != pilot.pilotNumber || p.uuid == pilot.uuid; })) {
            NotificationService.notify("Pilot Number allready taken!");
            return;
        }
        if (pilot.classs && pilot.classs.uuid && competition.pilots.some(function(p) { return p.classs.uuid == classs.uuid && p.uuid == pilot.uuid; })) {
            return;
        }
        if (!competition.classes.some(function(competitionClass) { return competitionClass.uuid == classs.uuid })) {
            NotificationService.notify("The chosen Class is not available in your Event!");
            return;
        }
        var pilotCopy = new Pilot(pilot);
        pilotCopy.classs = classs;
        competition.pilots.push(pilotCopy);
        CompetitionService.cancelAddPilot();
    }

    public static update(competition: Competition) {
        if (!competition.description || competition.description.length < 1) {
            return;
        }
        DatabaseService.save(DatabaseService.store_competitions, competition, function(x) {
            if (CompetitionService.competitions.indexOf(competition) == -1) {
                CompetitionService.competitions.push(competition);
                CompetitionService.selectedCompetition = competition;
                CompetitionService.reloadAngular();
            }
        }, function(x) {
            NotificationService.notify("Event error!");
        });
        NotificationService.notify("Event saved!");
    }

    public static delete(competition: Competition, callback) {
        DatabaseService.delete(DatabaseService.store_competitions, competition, function() {
            if (CompetitionService.competitions.indexOf(competition) == -1) {
                return;
            }
            CompetitionService.competitions.splice(CompetitionService.competitions.indexOf(competition), 1);
            callback();
            CompetitionService.reloadAngular();
            NotificationService.notify("Event deleted!");
        }, function() {
            NotificationService.notify("Event delete error!");
        });
    }

    public static setCompetitions(competitions: Competition[]) {
        for (var competitionNewIdx in competitions) {
            var found = false;
            for (var competitionOldIdx in CompetitionService.competitions) {
                if (CompetitionService.competitions[competitionOldIdx].uuid == competitions[competitionNewIdx].uuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                CompetitionService.competitions.push(new Competition(competitions[competitionNewIdx]));
            }
        }
        if (CompetitionService.competitions.length > 0) {
            var youngestCompetition = CompetitionService.competitions[0];
            for (var idx in CompetitionService.competitions) {
                if (CompetitionService.competitions[idx].dateFrom > youngestCompetition.dateFrom) {
                    youngestCompetition = CompetitionService.competitions[idx];
                }
            }
            CompetitionService.selectedCompetition = youngestCompetition;
            if (youngestCompetition.classes && youngestCompetition.classes.length > 0) {
                CompetitionService.selectClassToEditRaceConfig(youngestCompetition.classes[0]);
            }
        }

        if (CompetitionService.competitions.length == 0) {
            DatabaseFillingService.fillDefaultCompetitions(function() {
                CompetitionService.init(null);
                RaceService.init(null);
            });
        }
        CompetitionService.reloadAngular();
        RaceService.updateDefaultCompetitionValue();
    }

    public static reloadAngular() {
        angular.element(document.getElementById('events')).scope().$apply();
    }
}