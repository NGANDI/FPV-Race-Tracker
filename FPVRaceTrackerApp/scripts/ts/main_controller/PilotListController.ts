/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class PilotListController {

        private pilots: Pilot[];

        public static $inject = [
            'pilotService',
            'menuService',
            'logService',
            '$scope',
            '$indexedDB'
        ];

        constructor(
            private pilotService: PilotService,
            private menuService: MenuService,
            private logService: LogService,
            private $scope: any,
            private $indexedDB: any
        ) {
            this.init();
        }

        private init() {
            this.$scope.$watch(() => this.pilotService.pilots, (pilots) => {
                if (!pilots || pilots.length < 0) {
                    this.pilots = [];
                    return;
                }
                this.pilots = pilots;
            });
        }

        private showEdit(pilot: Pilot) {
            this.pilotService.watchedPilotToEdit = JSON.parse(JSON.stringify(pilot));
            this.menuService.selectSubMenu(MenuButton.PILOTS, SubMenuButton.PILOTS_EDIT);
        }

        private getClub(clubIdx: number) {
            return this.pilotService.getClub(clubIdx);
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.PILOTS, SubMenuButton.PILOTS_LIST);
        }

    }
}