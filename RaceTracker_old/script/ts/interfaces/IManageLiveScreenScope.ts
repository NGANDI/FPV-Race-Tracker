/// <reference path="../_reference.ts"/>
interface IManageLiveScreenScope extends ng.IScope {
    windowConfig: WindowConfig;
    screens: any[];
    raceService: RaceService;
    allPilotsCheckBoxEnabled: boolean;
    vm: ManageLiveScreenController;
    apply();
}
