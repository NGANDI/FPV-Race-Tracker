/// <reference path="../_reference.ts"/>
'use strict';

class ManageLiveScreenController {

    public static $inject = [
        '$scope',
        'DisplayService'
    ];

    constructor(
        private $scope: IManageLiveScreenScope,
        private displayService: DisplayService
    ) {
        $scope.screens = [];
        $scope.vm = this;
        $scope.raceService = RaceService;
        $scope.allPilotsCheckBoxEnabled = true;

        $scope.$on('screens:updated', (event, data) => {
            this.updateScreens(event, data);
        });
    }

    updateScreens(event, data) {
        this.$scope.screens = data;
        angular.element(document.getElementById('liveScreen')).scope().$apply();
    }

    showLiveScreen(screen) {
        this.displayService.openScreen(screen.workArea.left, screen.workArea.top, true, DisplayService.LIVE_WINDOW_ID_PREFIX);
    }

    allPilotsCheckBoxChanged() {
        WindowConfigService.setLiveResultListView(this.$scope.allPilotsCheckBoxEnabled);
    }

    selectedPilotChanged(pilotUUID: string) {
        WindowConfigService.setCurrentLivePilot(pilotUUID);
    }
}