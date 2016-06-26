/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class NewPilotController {

        private pilot: Pilot;
        private clubs: Club[];
        public submitted: boolean;

        public static $inject = [
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

        constructor(
            private pilotService: PilotService,
            private menuService: MenuService,
            private logService: LogService,
            private $scope: any,
            private COUNTRIES: string[],
            private clubService: ClubService,
            private mainConfigService: MainConfigService,
            private databaseService: DatabaseService,
            private vendorService: VendorService,
            private notificationService: NotificationService
        ) {
            this.init();
        }

        private init() {
            this.clear();
            this.$scope.$watch(() => this.clubService.clubs, (clubs) => {
                if (!clubs || clubs.length < 0) {
                    this.clubs = [];
                    return;
                }
                this.clubs = clubs;
            });
        }

        private save(valid: boolean, pilot: Pilot) {
            this.submitted = true;

            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }

            this.pilotService.save(pilot).then((e) => {
                this.notificationService.notifySuccess("saved");
                this.clear();
                this.menuService.selectSubMenu(MenuButton.PILOTS, SubMenuButton.PILOTS_LIST);
            }, (reason) => {
                this.notificationService.notifyError("oops");
            });
        }

        private clear() {
            this.mainConfigService.getConfig().then((config: MainConfig) => {
                var defaultVendorIdx = null;
                if (this.vendorService.vendors.length > 0) {
                    defaultVendorIdx = this.vendorService.vendors[0].idx;
                }
                this.pilot = new Pilot("", "", "", config.defaultLocation, null, "", "", new Transponder(defaultVendorIdx, ""));
                this.submitted = false;
            });
        }

        private isVisible() {
            return this.menuService.isVisible(MenuButton.PILOTS, SubMenuButton.PILOTS_NEW);
        }

    }
}