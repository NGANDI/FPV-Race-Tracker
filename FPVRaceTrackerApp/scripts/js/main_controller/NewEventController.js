var main;
(function (main) {
    'use strict';
    var NewEventController = (function () {
        function NewEventController(eventService, menuService, COUNTRIES, $scope, notificationService, mainConfigService) {
            this.eventService = eventService;
            this.menuService = menuService;
            this.COUNTRIES = COUNTRIES;
            this.$scope = $scope;
            this.notificationService = notificationService;
            this.mainConfigService = mainConfigService;
            this.init();
        }
        NewEventController.prototype.init = function () {
            this.clear();
            this.selectEventNavigation();
        };
        NewEventController.prototype.save = function (valid, event) {
            var _this = this;
            this.submitted = true;
            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }
            this.eventService.save(event).then(function (e) {
                _this.notificationService.notifySuccess("saved");
                _this.clear();
            }, function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        NewEventController.prototype.clear = function () {
            var _this = this;
            this.mainConfigService.getConfig().then(function (config) {
                _this.event = new main.Event("", config.defaultLocation, "", new Date(), new Date(), "");
                _this.submitted = false;
            });
        };
        NewEventController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_NEW);
        };
        NewEventController.prototype.selectEventNavigation = function () {
            this.selectedNavigation = main.NewEventNavigationButtons.EVENT;
        };
        NewEventController.prototype.selectPilotsNavigation = function () {
            this.selectedNavigation = main.NewEventNavigationButtons.PILOTS;
        };
        NewEventController.prototype.selectRaceNavigation = function () {
            this.selectedNavigation = main.NewEventNavigationButtons.RACE;
        };
        NewEventController.prototype.selectRoundsNavigation = function () {
            this.selectedNavigation = main.NewEventNavigationButtons.ROUNDS;
        };
        NewEventController.prototype.selectHeatsNavigation = function () {
            this.selectedNavigation = main.NewEventNavigationButtons.HEATS;
        };
        NewEventController.prototype.isEventNavigationSelected = function () {
            return this.selectedNavigation == main.NewEventNavigationButtons.EVENT ? 'selected' : '';
        };
        NewEventController.prototype.isPilotsNavigationSelected = function () {
            return this.selectedNavigation == main.NewEventNavigationButtons.PILOTS ? 'selected' : '';
        };
        NewEventController.prototype.isRaceNavigationSelected = function () {
            return this.selectedNavigation == main.NewEventNavigationButtons.RACE ? 'selected' : '';
        };
        NewEventController.prototype.isRoundsNavigationSelected = function () {
            return this.selectedNavigation == main.NewEventNavigationButtons.ROUNDS ? 'selected' : '';
        };
        NewEventController.prototype.isHeatsNavigationSelected = function () {
            return this.selectedNavigation == main.NewEventNavigationButtons.HEATS ? 'selected' : '';
        };
        NewEventController.$inject = [
            'eventService',
            'menuService',
            'COUNTRIES',
            '$scope',
            'notificationService',
            'mainConfigService'
        ];
        return NewEventController;
    }());
    main.NewEventController = NewEventController;
})(main || (main = {}));
