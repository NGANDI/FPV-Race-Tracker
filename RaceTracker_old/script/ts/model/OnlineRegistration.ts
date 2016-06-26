/// <reference path="../_reference.ts"/>
class OnlineRegistration extends BaseEntity {
    public firstName: string;
    public lastName: string;
    public alias: string;
    public phone: string;
    public country: string;
    public email: string;
    public club: string
    public deviceId: string;
    public pilotNumber: number;
    public classes: Classs[];
    public competition: Competition;

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
        this.classes = [];
        if (json.classes) {
            json.classes.forEach((classs: Classs) => {
                var classObj = ClassService.getClassByUUID(classs.uuid);
                this.classes.push(classObj ? classObj : new Classs(json.classs));
            });
        }
        this.competition = json.competition;
    }

    public getPilotObjects(): Pilot[] {
        var pilots = [];
        this.classes.forEach((classs: Classs) => {
            pilots.push(new Pilot({
                firstName: this.firstName,
                lastName: this.lastName,
                alias: this.alias,
                phone: this.phone,
                country: this.country,
                email: this.email,
                club: this.club,
                deviceId: this.deviceId,
                classs: classs
            }));
        });

        return pilots;
    }

}