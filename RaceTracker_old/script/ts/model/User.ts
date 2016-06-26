/// <reference path="../_reference.ts"/>
class User extends BaseEntity {
    public name: string;
    //    public passwordHash: string;
    public email: string;
    public registered: boolean;
    public calendarKey: string;

    constructor(json: any) {
        super(json);
        this.name = json.name;
        //        this.passwordHash = json.passwordHash;
        this.email = json.email;
        this.registered = json.registered ? json.registered : false;
        this.calendarKey = json.calendarKey ? json.calendarKey : UUIDService.next();
    }
}