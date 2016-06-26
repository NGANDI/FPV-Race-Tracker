/// <reference path="../_reference.ts"/>
class WindowConfigService {

    public static resetLiveView() {
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                windowConfig.currentCompetitionUUID = "";
                windowConfig.currentHeatUUID = "";
                windowConfig.currentLivePilotUUID = "";
                windowConfig.showLiveResultList = true;
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: "", currentCompetitionUUID: "", currentHeatUUID: "", showLiveResultList: true });
            }
            WindowConfigService.update(windowConfig);
        });
    }

    public static endRace() {
        document.getElementById('noPilotSelectedForLiveRadioButton').checked = true;
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                windowConfig.currentHeatUUID = "";
                windowConfig.currentLivePilotUUID = "";
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: "", currentHeatUUID: "" });
            }
            WindowConfigService.update(windowConfig);
        });

    }
    public static setCurrentCompetition(uuid: string) {
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                windowConfig.currentCompetitionUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentCompetitionUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    }

    public static setLiveResultListView(flag: boolean) {
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                console.log("retrieved", windowConfig);
                console.log("rflag", flag);
                windowConfig.showLiveResultList = flag;
            }
            else {
                windowConfig = new WindowConfig({ showLiveResultList: flag });
                console.log("create", windowConfig);
                console.log("cflag", flag);
            }
            WindowConfigService.update(windowConfig);
        });
    }

    public static setCurrentLivePilot(uuid: string) {
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                windowConfig.currentLivePilotUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentLivePilotUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    }

    public static setCurrentHeat(uuid: string) {
        WindowConfigService.getWindowConfig(function(windowConfig: WindowConfig) {
            if (windowConfig) {
                windowConfig.currentHeatUUID = uuid;
            }
            else {
                windowConfig = new WindowConfig({ currentHeatUUID: uuid });
            }
            WindowConfigService.update(windowConfig);
        });
    }

    public static createAndReturnWindowConfig() {
        var windowConfig: WindowConfig = new WindowConfig({});
        WindowConfigService.update(windowConfig);
        return windowConfig;
    }


    public static getWindowConfig(callback) {
        DatabaseService.findByUUID(DatabaseService.store_windowConfig, "1", callback);
    }

    public static update(windowConfig) {
        if (windowConfig) {
            DatabaseService.save(DatabaseService.store_windowConfig, windowConfig, function(e) {
            }, function(e) {
                console.log("ex", e);
            });
        }
    }
}