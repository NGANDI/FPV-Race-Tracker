/// <reference path="../_reference.ts"/>
class Pilot extends BaseEntity {
    public firstName: string;
    public lastName: string;
    public alias: string;
    public phone: string;
    public country: string;
    public email: string;
    public club: string
    public deviceId: string;
    public pilotNumber: number;
    public assignedRaceBand: RaceBand;
    public classs: Classs;
    public onlineRegistrationUUID: String;
    public manualTimingIndex: String;
    
    constructor(json: any) {
        super(json);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.alias = json.alias;
        this.phone = json.phone;
        this.country = json.country;
        this.email = json.email;
        this.club = json.club;
        this.pilotNumber = +json.pilotNumber;
        this.deviceId = json.deviceId;
        this.manualTimingIndex = json.manualTimingIndex;
        
        if (json.classs) {
            var classObj = ClassService.getClassByUUID(json.classs.uuid);
            this.classs = classObj ? classObj : new Classs(json.classs);
        }
        if (json.assignedRaceBand) {
            var raceBandObj = RaceBandService.getRaceBandByUUID(json.assignedRaceBand.uuid);
            this.assignedRaceBand = raceBandObj ? raceBandObj : new RaceBand(json.assignedRaceBand);
        }
    }
}