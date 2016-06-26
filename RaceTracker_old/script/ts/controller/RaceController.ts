/// <reference path="../_reference.ts"/>
function RaceController() {
    this.service = RaceService;
    this.competitionService = CompetitionService;
    this.classService = ClassService;
    this.raceBandService = RaceBandService;
    this.editLapsService = EditLapsService;

    this.numbersOnly = /^\d+$/;
}