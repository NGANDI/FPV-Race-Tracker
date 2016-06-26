/// <reference path="../_reference.ts"/>
'use strict';

class ManageScreen2Service {

    private static SCREEN2_WINDOW_ID_PREFIX = "FPV_RT_SCREEN2_";

    public static $inject = [
        '$rootScope'
    ];
    constructor(private $rootScope: any) {
        this.loadScreens();
        setInterval(() => this.loadScreens, 5000);
    };

    public loadScreens() {
        chrome.system.display
            .getInfo((screenList) => {
                this.$rootScope.$broadcast('screens:updated', screenList);
            });
    }


    public openScreen2(left: number, top: number, fullscreen: boolean) {
        chrome.app.window.getAll().forEach((window) => {
            if (window.id.indexOf(ManageScreen2Service.SCREEN2_WINDOW_ID_PREFIX) != -1) {
                window.close();
            }
        });
        chrome.app.window.create("screen2.html",
            {
                state: fullscreen ? 'fullscreen' : 'normal',
                id: ManageScreen2Service.SCREEN2_WINDOW_ID_PREFIX + (Math.floor(Math.random() * 1000000000)),
                outerBounds: {
                    left: left,
                    top: top,
                    width: 1024,
                    height: 768
                }
            });
    }
}