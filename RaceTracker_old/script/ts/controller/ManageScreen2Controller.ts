/// <reference path="../_reference.ts"/>
'use strict';

class ManageScreen2Controller {

    public static $inject = [ 
        '$scope',
        'DisplayService'
    ];

    constructor(
        private $scope: IManageScreen2Scope,
        private displayService: DisplayService
        ) {
        $scope.screens = [];
        $scope.vm = this;

        $scope.$on('screens:updated', (event, data) => {
            this.updateScreens(event, data);
        });
    }

    updateScreens(event, data) {
        this.$scope.screens = data;
        angular.element(document.getElementById('screen2')).scope().$apply();
    }

    showScreen2(screen) {
        this.displayService.openScreen(screen.workArea.left, screen.workArea.top, true, DisplayService.SCREEN2_WINDOW_ID_PREFIX);
    }
}