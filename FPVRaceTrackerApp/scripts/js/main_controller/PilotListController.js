var main;
(function (main) {
    'use strict';
    var PilotListController = (function () {
        function PilotListController(pilotService, menuService, logService, $scope, $indexedDB) {
            this.pilotService = pilotService;
            this.menuService = menuService;
            this.logService = logService;
            this.$scope = $scope;
            this.$indexedDB = $indexedDB;
            this.init();
        }
        PilotListController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.pilotService.pilots; }, function (pilots) {
                if (!pilots || pilots.length < 0) {
                    _this.pilots = [];
                    return;
                }
                _this.pilots = pilots;
            });
        };
        PilotListController.prototype.showEdit = function (pilot) {
            this.pilotService.watchedPilotToEdit = JSON.parse(JSON.stringify(pilot));
            this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_EDIT);
        };
        PilotListController.prototype.getClub = function (clubIdx) {
            return this.pilotService.getClub(clubIdx);
        };
        PilotListController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
        };
        PilotListController.$inject = [
            'pilotService',
            'menuService',
            'logService',
            '$scope',
            '$indexedDB'
        ];
        return PilotListController;
    }());
    main.PilotListController = PilotListController;
})(main || (main = {}));
