var main;
(function (main) {
    'use strict';
    var NewPilotController = (function () {
        function NewPilotController(pilotService, menuService, logService, $scope, COUNTRIES, clubService, mainConfigService, databaseService, vendorService, notificationService) {
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
        NewPilotController.prototype.init = function () {
            var _this = this;
            this.clear();
            this.$scope.$watch(function () { return _this.clubService.clubs; }, function (clubs) {
                if (!clubs || clubs.length < 0) {
                    _this.clubs = [];
                    return;
                }
                _this.clubs = clubs;
            });
        };
        NewPilotController.prototype.save = function (valid, pilot) {
            var _this = this;
            this.submitted = true;
            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }
            this.pilotService.save(pilot).then(function (e) {
                _this.notificationService.notifySuccess("saved");
                _this.clear();
                _this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
            }, function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        NewPilotController.prototype.clear = function () {
            var _this = this;
            this.mainConfigService.getConfig().then(function (config) {
                var defaultVendorIdx = null;
                if (_this.vendorService.vendors.length > 0) {
                    defaultVendorIdx = _this.vendorService.vendors[0].idx;
                }
                _this.pilot = new main.Pilot("", "", "", config.defaultLocation, null, "", "", new main.Transponder(defaultVendorIdx, ""));
                _this.submitted = false;
            });
        };
        NewPilotController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_NEW);
        };
        NewPilotController.$inject = [
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
        return NewPilotController;
    }());
    main.NewPilotController = NewPilotController;
})(main || (main = {}));
