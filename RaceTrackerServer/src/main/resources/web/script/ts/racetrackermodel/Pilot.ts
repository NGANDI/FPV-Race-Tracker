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
        if (json.classs) {
            this.classs = new Classs(json.classs);
        }
        if (json.assignedRaceBand) {
            this.assignedRaceBand = new RaceBand(json.assignedRaceBand);
        }
    }
}