/// <reference path="../_all.ts"/>
interface IResultsScreen extends ng.IScope {
    windowConfig: WindowConfig;
    races: Race[];
    currentRace: Race;
    heatResults: HeatResultViewObject[];
    upcomingHeats: UpcomingHeatViewObject[];
    vm: Screen2Controller;
}
