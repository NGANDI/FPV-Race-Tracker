var main;
(function (main) {
    'use strict';
    var NewClubController = (function () {
        function NewClubController(menuService, logService, COUNTRIES, clubService, mainConfigService, $scope, notificationService) {
            this.menuService = menuService;
            this.logService = logService;
            this.COUNTRIES = COUNTRIES;
            this.clubService = clubService;
            this.mainConfigService = mainConfigService;
            this.$scope = $scope;
            this.notificationService = notificationService;
            this.init();
        }
        NewClubController.prototype.init = function () {
            this.clear();
        };
        NewClubController.prototype.delete = function (club) {
            var _this = this;
            this.clubService.deleteClub(club).then(function (e) {
                _this.notificationService.notifyError("deleted");
                _this.clear();
                _this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
            }).catch(function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        NewClubController.prototype.save = function (valid, club) {
            var _this = this;
            this.submitted = true;
            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }
            this.clubService.saveClub(club).then(function (e) {
                _this.notificationService.notifySuccess("saved");
                _this.clear();
                _this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
            }).catch(function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        NewClubController.prototype.clear = function () {
            var _this = this;
            this.mainConfigService.getConfig().then(function (config) {
                _this.club = new main.Club("", config.defaultLocation);
                _this.submitted = false;
            });
        };
        NewClubController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_NEW);
        };
        NewClubController.$inject = [
            'menuService',
            'logService',
            'COUNTRIES',
            'clubService',
            'mainConfigService',
            '$scope',
            'notificationService'
        ];
        return NewClubController;
    }());
    main.NewClubController = NewClubController;
})(main || (main = {}));
