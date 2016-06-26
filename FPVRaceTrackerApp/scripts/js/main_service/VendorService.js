var main;
(function (main) {
    'use strict';
    var VendorService = (function () {
        function VendorService(logService, databaseService) {
            this.logService = logService;
            this.databaseService = databaseService;
            this.vendors = [];
            this.findAll();
        }
        VendorService.prototype.findAll = function () {
            var _this = this;
            this.databaseService.getAll(main.DBStore.VENDORS).then(function (e) {
                _this.vendors = e;
            }).catch(function (reason) {
                _this.logService.error("VendorService findAll", reason, null);
                _this.vendors = [];
            });
        };
        VendorService.$inject = [
            'logService',
            'databaseService'
        ];
        return VendorService;
    }());
    main.VendorService = VendorService;
})(main || (main = {}));
