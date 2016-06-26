var main;
(function (main) {
    'use strict';
    var MenuService = (function () {
        function MenuService() {
            this.selectedSubMenus = [];
        }
        MenuService.prototype.init = function () {
            this.setVersion();
            this.selectMenu(main.MenuButton.EVENTS);
            this.selectedSubMenus[main.MenuButton.EVENTS] = main.SubMenuButton.EVENTS_NEW;
            this.selectedSubMenus[main.MenuButton.PILOTS] = main.SubMenuButton.PILOTS_NEW;
            this.selectedSubMenus[main.MenuButton.SETTINGS] = main.SubMenuButton.SETTINGS_LANGUAGE;
            this.selectedSubMenus[main.MenuButton.CLUBS] = main.SubMenuButton.CLUBS_NEW;
        };
        MenuService.prototype.setVersion = function () {
            try {
                this.version = chrome.runtime.getManifest().version;
            }
            catch (ex) {
                this.version = "unknown";
            }
        };
        MenuService.prototype.isVisible = function (menuButton, subMenuButton) {
            return this.getSelectedMenu() == menuButton && this.getSelectedSubMenu(menuButton) == subMenuButton;
        };
        MenuService.prototype.getVersion = function () {
            return this.version;
        };
        MenuService.prototype.selectMenu = function (button) {
            this.selectedMenu = button;
        };
        MenuService.prototype.getSelectedMenu = function () {
            return this.selectedMenu;
        };
        MenuService.prototype.selectSubMenu = function (parrent, button) {
            this.selectedSubMenus[parrent] = button;
        };
        MenuService.prototype.getSelectedSubMenu = function (parrent) {
            return this.selectedSubMenus[parrent];
        };
        return MenuService;
    }());
    main.MenuService = MenuService;
})(main || (main = {}));
