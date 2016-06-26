/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class VendorService {

        public vendors: Vendor[];

        public static $inject = [
            'logService',
            'databaseService'
        ];

        constructor(
            private logService: LogService,
            private databaseService: DatabaseService
        ) {
            this.vendors = [];
            this.findAll();
        }

        public findAll() {
            this.databaseService.getAll(DBStore.VENDORS).then((e) => {
                this.vendors = e;
            }).catch((reason) => {
                this.logService.error("VendorService findAll", reason, null);
                this.vendors = [];
            });
        }
    }
}
