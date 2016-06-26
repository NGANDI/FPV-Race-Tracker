/// <reference path="../_reference.ts"/>
'use strict';

class DisplayService {

    public static SCREEN2_WINDOW_ID_PREFIX = "FPV_RT_SCREEN2_";
    public static LIVE_WINDOW_ID_PREFIX = "FPV_RT_LIVE_";

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


    public openScreen(left: number, top: number, fullscreen: boolean, windowID: string) {
        chrome.app.window.getAll().forEach((window) => {
            if (window.id.indexOf(windowID) != -1) {
                window.close();
            }
        });
        var fileName = "";
        switch (windowID) {
            case DisplayService.SCREEN2_WINDOW_ID_PREFIX:
                fileName = "screen2.html";
                break;
            case DisplayService.LIVE_WINDOW_ID_PREFIX:
                fileName = "liveScreen.html";
                break;
        }

        chrome.app.window.create(fileName, {
            state: fullscreen ? 'fullscreen' : 'normal',
            id: windowID + (Math.floor(Math.random() * 1000000000)),
            outerBounds: {
                left: left,
                top: top,
                width: 1024,
                height: 768
            }
        });
    }
}