/// <reference path="../_reference.ts"/>
class WindowConfig extends BaseEntity {
    public currentCompetitionUUID: string;
    public liveScreenBackgroundColorCode: string;
    public currentHeatUUID: string;
    public currentLivePilotUUID: string;
    public showLiveResultList: boolean;

    constructor(json: any) {
        super({ uuid: ""+1 });
        this.currentCompetitionUUID = json.currentCompetitionUUID;
        this.liveScreenBackgroundColorCode = json.liveScreenBackgroundColorCode ? json.liveScreenBackgroundColorCode : '#00ff00';
        this.currentHeatUUID = json.currentHeatUUID;
        this.currentLivePilotUUID = json.currentLivePilotUUID;
        this.showLiveResultList = (typeof json.showLiveResultList == "undefined") ? true : json.showLiveResultList;
    }
}