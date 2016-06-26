var main;
(function (main) {
    'use strict';
    var MenuController = (function () {
        function MenuController(menuService, $interval, $scope) {
            this.menuService = menuService;
            this.$interval = $interval;
            this.$scope = $scope;
            $scope.vm = this;
            menuService.init();
            $scope.vm.now = new Date();
            $interval(function () {
                $scope.vm.now = new Date();
            }, 1000, 0);
        }
        MenuController.prototype.getVersion = function () {
            return this.menuService.getVersion();
        };
        MenuController.prototype.selectEventsMenu = function () {
            this.menuService.selectMenu(main.MenuButton.EVENTS);
        };
        MenuController.prototype.selectRaceMenu = function () {
            this.menuService.selectMenu(main.MenuButton.RACE);
        };
        MenuController.prototype.selectPilotsMenu = function () {
            this.menuService.selectMenu(main.MenuButton.PILOTS);
        };
        MenuController.prototype.selectAccountMenu = function () {
            this.menuService.selectMenu(main.MenuButton.ACCOUNT);
        };
        MenuController.prototype.selectSettingsMenu = function () {
            this.menuService.selectMenu(main.MenuButton.SETTINGS);
        };
        MenuController.prototype.selectClubsMenu = function () {
            this.menuService.selectMenu(main.MenuButton.CLUBS);
        };
        MenuController.prototype.isEventsMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.EVENTS);
        };
        MenuController.prototype.isRaceMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.RACE);
        };
        MenuController.prototype.isPilotsMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.PILOTS);
        };
        MenuController.prototype.isAccountMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.ACCOUNT);
        };
        MenuController.prototype.isSettingsMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.SETTINGS);
        };
        MenuController.prototype.isClubsMenuSelected = function () {
            return this.isMenuButtonSelected(main.MenuButton.CLUBS);
        };
        MenuController.prototype.isEditClubsMenuSelected = function () {
            return this.isClubsMenuSelected() && this.isSubMenuButtonSelected(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_EDIT);
        };
        MenuController.prototype.isEditPilotsMenuSelected = function () {
            return this.isPilotsMenuSelected() && this.isSubMenuButtonSelected(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_EDIT);
        };
        MenuController.prototype.isMenuButtonSelected = function (button) {
            return this.menuService.getSelectedMenu() == button ? 'selected' : '';
        };
        MenuController.prototype.isSubMenuButtonSelected = function (parrent, subButton) {
            return this.menuService.getSelectedSubMenu(parrent) == subButton ? 'selected' : '';
        };
        MenuController.prototype.selectEvents_newEvent = function () {
            this.menuService.selectSubMenu(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_NEW);
        };
        MenuController.prototype.selectEvents_pastEvents = function () {
            this.menuService.selectSubMenu(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_PAST);
        };
        MenuController.prototype.selectEvents_upcomingEvents = function () {
            this.menuService.selectSubMenu(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_UPCOMING);
        };
        MenuController.prototype.isEvents_newEventMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_NEW);
        };
        MenuController.prototype.isEvents_pastEventsMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_PAST);
        };
        MenuController.prototype.isEvents_upcomingEventsMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.EVENTS, main.SubMenuButton.EVENTS_UPCOMING);
        };
        MenuController.prototype.selectPilots_newPilot = function () {
            this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_NEW);
        };
        MenuController.prototype.selectPilots_pilotsList = function () {
            this.menuService.selectSubMenu(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
        };
        MenuController.prototype.isPilots_newPilotMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_NEW);
        };
        MenuController.prototype.isPilots_pilotsListMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_LIST);
        };
        MenuController.prototype.isPilots_editPilotMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.PILOTS, main.SubMenuButton.PILOTS_EDIT);
        };
        MenuController.prototype.selectSettings_language = function () {
            this.menuService.selectSubMenu(main.MenuButton.SETTINGS, main.SubMenuButton.SETTINGS_LANGUAGE);
        };
        MenuController.prototype.isSettings_languageMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.SETTINGS, main.SubMenuButton.SETTINGS_LANGUAGE);
        };
        MenuController.prototype.selectClubs_newClub = function () {
            this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_NEW);
        };
        MenuController.prototype.selectClubs_clubsList = function () {
            this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
        };
        MenuController.prototype.isClubs_newClubMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_NEW);
        };
        MenuController.prototype.isClubs_clubsListMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
        };
        MenuController.prototype.isClubs_editClubMenuSelected = function () {
            return this.isSubMenuButtonSelected(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_EDIT);
        };
        MenuController.$inject = [
            'menuService',
            '$interval',
            '$scope'
        ];
        return MenuController;
    }());
    main.MenuController = MenuController;
})(main || (main = {}));
