/// <reference path="../../_reference.ts"/>
class RaceSyncRequest extends BaseSyncRequest {

    public data: Race[];

    constructor(user: User, data: Race[]) {
        super(user);
        this.data = data;
    }
}