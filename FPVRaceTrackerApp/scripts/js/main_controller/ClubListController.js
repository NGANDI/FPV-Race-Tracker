var main;
(function (main) {
    'use strict';
    var ClubListController = (function () {
        function ClubListController(menuService, logService, clubService, $scope) {
            this.menuService = menuService;
            this.logService = logService;
            this.clubService = clubService;
            this.$scope = $scope;
            this.init();
        }
        ClubListController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.clubService.clubs; }, function (clubs) {
                if (!clubs || clubs.length < 0) {
                    _this.clubs = [];
                    return;
                }
                _this.clubs = clubs;
            });
        };
        ClubListController.prototype.showEdit = function (club) {
            this.clubService.watchedClubToEdit = JSON.parse(JSON.stringify(club));
            this.menuService.selectSubMenu(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_EDIT);
        };
        ClubListController.prototype.isVisible = function () {
            return this.menuService.isVisible(main.MenuButton.CLUBS, main.SubMenuButton.CLUBS_LIST);
        };
        ClubListController.$inject = [
            'menuService',
            'logService',
            'clubService',
            '$scope'
        ];
        return ClubListController;
    }());
    main.ClubListController = ClubListController;
})(main || (main = {}));
