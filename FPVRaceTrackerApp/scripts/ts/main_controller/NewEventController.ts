/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class NewEventController {

        private selectedNavigation: NewEventNavigationButtons;

        private event: Event;
        private submitted: boolean;

        public static $inject = [
            'eventService',
            'menuService',
            'COUNTRIES',
            '$scope',
            'notificationService',
            'mainConfigService'
        ];

        constructor(
            private eventService: EventService,
            private menuService: MenuService,
            private COUNTRIES: string[],
            private $scope: any,
            private notificationService: NotificationService,
            private mainConfigService: MainConfigService
        ) {
            this.init();
        }

        private init() {
            this.clear();
            this.selectEventNavigation();
        }

        private save(valid: boolean, event: Event) {
            this.submitted = true;

            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }

            this.eventService.save(event).then((e) => {
                this.notificationService.notifySuccess("saved");
                this.clear();
            }, (reason) => {
                this.notificationService.notifyError("oops");
            });
        }

        private clear() {
            this.mainConfigService.getConfig().then((config: MainConfig) => {
                this.event = new Event("", config.defaultLocation, "", new Date(), new Date(), "");
                this.submitted = false;
            });
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.EVENTS, SubMenuButton.EVENTS_NEW);
        }

        private selectEventNavigation() {
            this.selectedNavigation = NewEventNavigationButtons.EVENT;
        }
        private selectPilotsNavigation() {
            this.selectedNavigation = NewEventNavigationButtons.PILOTS;
        }
        private selectRaceNavigation() {
            this.selectedNavigation = NewEventNavigationButtons.RACE;
        }
        private selectRoundsNavigation() {
            this.selectedNavigation = NewEventNavigationButtons.ROUNDS;
        }
        private selectHeatsNavigation() {
            this.selectedNavigation = NewEventNavigationButtons.HEATS;
        }

        private isEventNavigationSelected() {
            return this.selectedNavigation == NewEventNavigationButtons.EVENT ? 'selected' : '';
        }

        private isPilotsNavigationSelected() {
            return this.selectedNavigation == NewEventNavigationButtons.PILOTS ? 'selected' : '';
        }

        private isRaceNavigationSelected() {
            return this.selectedNavigation == NewEventNavigationButtons.RACE ? 'selected' : '';
        }
        
        private isRoundsNavigationSelected() {
            return this.selectedNavigation == NewEventNavigationButtons.ROUNDS ? 'selected' : '';
        }
        
        private isHeatsNavigationSelected() {
            return this.selectedNavigation == NewEventNavigationButtons.HEATS ? 'selected' : '';
        }
    }
}