/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class MenuService {

        private version: string;
        private selectedMenu: MenuButton;
        private selectedSubMenus: SubMenuButton[] = [];

        public init() {
            this.setVersion();
            this.selectMenu(MenuButton.EVENTS);
            this.selectedSubMenus[MenuButton.EVENTS] = SubMenuButton.EVENTS_NEW;
            this.selectedSubMenus[MenuButton.PILOTS] = SubMenuButton.PILOTS_NEW;
            this.selectedSubMenus[MenuButton.SETTINGS] = SubMenuButton.SETTINGS_LANGUAGE;
            this.selectedSubMenus[MenuButton.CLUBS] = SubMenuButton.CLUBS_NEW;
        }

        private setVersion() {
            try {
                this.version = chrome.runtime.getManifest().version;
            }
            catch (ex) {
                this.version = "unknown";
            }
        }

        public isVisible(menuButton: MenuButton, subMenuButton: SubMenuButton) {
            return this.getSelectedMenu() == menuButton && this.getSelectedSubMenu(menuButton) == subMenuButton;
        }

        public getVersion() {
            return this.version;
        }

        public selectMenu(button: MenuButton) {
            this.selectedMenu = button;
        }

        public getSelectedMenu() {
            return this.selectedMenu;
        }

        public selectSubMenu(parrent: MenuButton, button: SubMenuButton) {
            this.selectedSubMenus[parrent] = button;
        }

        public getSelectedSubMenu(parrent: MenuButton) {
            return this.selectedSubMenus[parrent];
        }
    }
}