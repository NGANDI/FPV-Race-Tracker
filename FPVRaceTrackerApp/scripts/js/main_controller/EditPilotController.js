var main;
(function (main) {
    'use strict';
    var EditPilotController = (function () {
        function EditPilotController(pilotService, menuService, logService, $scope, COUNTRIES, clubService, mainConfigService, databaseService, vendorService, notificationService) {
            this.pilotService = pilotService;
            this.menuService = menuService;
            this.logService = logService;
            this.$scope = $scope;
            this.COUNTRIES = COUNTRIES;
            this.clubService = clubService;
            this.mainConfigService = mainConfigService;
            this.databaseService = databaseService;
            this.vendorService = vendorService;
            this.notificationService = notificationService;
            this.init();
        }
        EditPilotController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.clubService.clubs; }, function (clubs) {
                if (!clubs || clubs.length < 0) {
                    _this.clubs = [];
                    return;
                }
                _this.clubs = clubs;
            });
            this.$scope.$watch(function () { return _this.pilotService.watchedPilotToEdit; }, function (pilot) {
                if (!pilot) {
                    return;
                }
                _this.pilot = pilot;
            });
        };
        EditPilotController.prototype.save = function (valid, pilot) {
            var _this = this;
            this.submitted = true;
            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }
            this.pilotService.save(pilot).then(function (e) {
                _this.notificationService.notifySuccess("saved");
                _this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
            }, function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        EditPilotController.prototype.delete = function (pilot) {
            var _this = this;
            this.pilotService.deletePilot(pilot).then(function (e) {
                _this.notificationService.notifySuccess("deleted");
                _this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
            }).catch(function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        EditPilotController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_EDIT);
        };
        EditPilotController.$inject = [
            'pilotService',
            'menuService',
            'logService',
            '$scope',
            'COUNTRIES',
            'clubService',
            'mainConfigService',
            'databaseService',
            'vendorService',
            'notificationService'
        ];
        return EditPilotController;
    }());
    main.EditPilotController = EditPilotController;
})(main || (main = {}));
