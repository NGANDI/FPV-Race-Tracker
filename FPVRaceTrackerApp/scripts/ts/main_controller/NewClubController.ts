/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class NewClubController {

        private club: Club;
        public submitted: boolean;

        public static $inject = [
            'menuService',
            'logService',
            'COUNTRIES',
            'clubService',
            'mainConfigService',
            '$scope',
            'notificationService'
        ];

        constructor(
            private menuService: MenuService,
            private logService: LogService,
            private COUNTRIES: string[],
            private clubService: ClubService,
            private mainConfigService: MainConfigService,
            private $scope: any,
            private notificationService: NotificationService
        ) {
            this.init();
        }

        private init() {
            this.clear();
        }

        private delete(club: Club) {
            this.clubService.deleteClub(club).then((e) => {
                this.notificationService.notifyError("deleted");
                this.clear();
                this.menuService.selectSubMenu(MenuButton.CLUBS, SubMenuButton.CLUBS_LIST);
            }).catch((reason) => {
                this.notificationService.notifyError("oops");
            });
        }

        private save(valid: boolean, club: Club) {
            this.submitted = true;

            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }

            this.clubService.saveClub(club).then((e) => {
                this.notificationService.notifySuccess("saved");
                this.clear();
                this.menuService.selectSubMenu(MenuButton.CLUBS, SubMenuButton.CLUBS_LIST);
            }).catch((reason) => {
                this.notificationService.notifyError("oops");
            });
        }

        private clear() {
            this.mainConfigService.getConfig().then((config: MainConfig) => {
                this.club = new Club("", config.defaultLocation);
                this.submitted = false;
            });
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.CLUBS, SubMenuButton.CLUBS_NEW);
        }
    }
}