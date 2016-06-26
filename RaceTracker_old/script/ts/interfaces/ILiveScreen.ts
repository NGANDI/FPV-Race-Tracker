/// <reference path="../_all_liveScreen.ts"/>
interface ILiveScreen extends ng.IScope {
    vm: LiveScreenController;
    windowConfig: WindowConfig;
    raceResults: RaceResultEntry[];
    singleResult: RaceResultEntry;
    currentRace: Race;
    currentRound: Race;
    currentHeat: Heat;
    lapTimerValue: number;
    lapTimerInterval: any;
    showLapTime: boolean;
}
