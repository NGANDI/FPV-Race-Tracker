/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class MenuController {

        private now: Date;

        public static $inject = [
            'menuService',
            '$interval',
            '$scope'
        ];

        constructor(
            private menuService: MenuService,
            private $interval: any,
            private $scope: any
        ) {
            $scope.vm = this;
            menuService.init();

            $scope.vm.now = new Date();
            $interval(() => {
                $scope.vm.now = new Date();
            }, 1000, 0);
        }

        private getVersion() {
            return this.menuService.getVersion();
        }

        private selectEventsMenu() {
            this.menuService.selectMenu(MenuButton.EVENTS);
        }
        private selectRaceMenu() {
            this.menuService.selectMenu(MenuButton.RACE);
        }
        private selectPilotsMenu() {
            this.menuService.selectMenu(MenuButton.PILOTS);
        }
        private selectAccountMenu() {
            this.menuService.selectMenu(MenuButton.ACCOUNT);
        }
        private selectSettingsMenu() {
            this.menuService.selectMenu(MenuButton.SETTINGS);
        }
        private selectClubsMenu() {
            this.menuService.selectMenu(MenuButton.CLUBS);
        }

        private isEventsMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.EVENTS);
        }
        private isRaceMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.RACE);
        }
        private isPilotsMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.PILOTS);
        }
        private isAccountMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.ACCOUNT);
        }
        private isSettingsMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.SETTINGS);
        }
        private isClubsMenuSelected() {
            return this.isMenuButtonSelected(MenuButton.CLUBS);
        }
        private isEditClubsMenuSelected() {
            return this.isClubsMenuSelected() && this.isSubMenuButtonSelected(MenuButton.CLUBS, SubMenuButton.CLUBS_EDIT);
        }
        private isEditPilotsMenuSelected() {
            return this.isPilotsMenuSelected() && this.isSubMenuButtonSelected(MenuButton.PILOTS, SubMenuButton.PILOTS_EDIT);
        }

        private isMenuButtonSelected(button: MenuButton) {
            return this.menuService.getSelectedMenu() == button ? 'selected' : '';
        }

        private isSubMenuButtonSelected(parrent: MenuButton, subButton: SubMenuButton) {
            return this.menuService.getSelectedSubMenu(parrent) == subButton ? 'selected' : '';
        }

        private selectEvents_newEvent() {
            this.menuService.selectSubMenu(MenuButton.EVENTS, SubMenuButton.EVENTS_NEW);
        }
        private selectEvents_pastEvents() {
            this.menuService.selectSubMenu(MenuButton.EVENTS, SubMenuButton.EVENTS_PAST);
        }
        private selectEvents_upcomingEvents() {
            this.menuService.selectSubMenu(MenuButton.EVENTS, SubMenuButton.EVENTS_UPCOMING);
        }

        private isEvents_newEventMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.EVENTS, SubMenuButton.EVENTS_NEW);
        }
        private isEvents_pastEventsMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.EVENTS, SubMenuButton.EVENTS_PAST);
        }
        private isEvents_upcomingEventsMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.EVENTS, SubMenuButton.EVENTS_UPCOMING);
        }

        private selectPilots_newPilot() {
            this.menuService.selectSubMenu(MenuButton.PILOTS, SubMenuButton.PILOTS_NEW);
        }
        private selectPilots_pilotsList() {
            this.menuService.selectSubMenu(MenuButton.PILOTS, SubMenuButton.PILOTS_LIST);
        }

        private isPilots_newPilotMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.PILOTS, SubMenuButton.PILOTS_NEW);
        }
        private isPilots_pilotsListMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.PILOTS, SubMenuButton.PILOTS_LIST);
        }
        private isPilots_editPilotMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.PILOTS, SubMenuButton.PILOTS_EDIT);
        }

        private selectSettings_language() {
            this.menuService.selectSubMenu(MenuButton.SETTINGS, SubMenuButton.SETTINGS_LANGUAGE);
        }

        private isSettings_languageMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.SETTINGS, SubMenuButton.SETTINGS_LANGUAGE);
        }

        private selectClubs_newClub() {
            this.menuService.selectSubMenu(MenuButton.CLUBS, SubMenuButton.CLUBS_NEW);
        }
        private selectClubs_clubsList() {
            this.menuService.selectSubMenu(MenuButton.CLUBS, SubMenuButton.CLUBS_LIST);
        }

        private isClubs_newClubMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.CLUBS, SubMenuButton.CLUBS_NEW);
        }
        private isClubs_clubsListMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.CLUBS, SubMenuButton.CLUBS_LIST);
        }
        private isClubs_editClubMenuSelected() {
            return this.isSubMenuButtonSelected(MenuButton.CLUBS, SubMenuButton.CLUBS_EDIT);
        }
    }
}