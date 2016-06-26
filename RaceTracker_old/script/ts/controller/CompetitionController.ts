/// <reference path="../_reference.ts"/>
function CompetitionController() {
    this.service = CompetitionService;
    this.pilotService = PilotService;
    this.raceService = RaceService;
    this.classService = ClassService;
    this.cloudSyncService = CloudSyncService;

    this.numbersOnly = /^\d+$/;
}