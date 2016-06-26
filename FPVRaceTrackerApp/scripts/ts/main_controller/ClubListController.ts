/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class ClubListController {

        private clubs: Club[];

        public static $inject = [
            'menuService',
            'logService',
            'clubService',
            '$scope'
        ];

        constructor(
            private menuService: MenuService,
            private logService: LogService,
            private clubService: ClubService,
            private $scope: any
        ) {
            this.init();
        }

        private init() {
            this.$scope.$watch(() => this.clubService.clubs, (clubs) => {
                if (!clubs || clubs.length < 0) {
                    this.clubs = [];
                    return;
                }
                this.clubs = clubs;
            });
        }

        private showEdit(club: Club) {
            this.clubService.watchedClubToEdit = JSON.parse(JSON.stringify(club));
            this.menuService.selectSubMenu(MenuButton.CLUBS, SubMenuButton.CLUBS_EDIT);
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.CLUBS, SubMenuButton.CLUBS_LIST);
        }
    }
}