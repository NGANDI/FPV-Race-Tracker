var main;
(function (main) {
    'use strict';
    var EditClubController = (function () {
        function EditClubController(menuService, logService, COUNTRIES, clubService, mainConfigService, $scope, notificationService) {
            this.menuService = menuService;
            this.logService = logService;
            this.COUNTRIES = COUNTRIES;
            this.clubService = clubService;
            this.mainConfigService = mainConfigService;
            this.$scope = $scope;
            this.notificationService = notificationService;
            this.init();
        }
        EditClubController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.clubService.watchedClubToEdit; }, function (club) {
                if (!club) {
                    return;
                }
                _this.club = club;
            });
        };
        EditClubController.prototype.delete = function (club) {
            var _this = this;
            this.clubService.deleteClub(club).then(function (e) {
                _this.notificationService.notifySuccess("deleted");
                _this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
            }).catch(function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        EditClubController.prototype.save = function (valid, club) {
            var _this = this;
            this.submitted = true;
            if (!valid) {
                this.notificationService.notifyWarn("formNotValid");
                return;
            }
            this.clubService.saveClub(club).then(function (e) {
                _this.notificationService.notifySuccess("saved");
                _this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
            }).catch(function (reason) {
                _this.notificationService.notifyError("oops");
            });
        };
        EditClubController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_EDIT);
        };
        EditClubController.$inject = [
            'menuService',
            'logService',
            'COUNTRIES',
            'clubService',
            'mainConfigService',
            '$scope',
            'notificationService'
        ];
        return EditClubController;
    }());
    main.EditClubController = EditClubController;
})(main || (main = {}));
