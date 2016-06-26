/// <reference path="../../_reference.ts"/>
class PilotSyncRequest extends BaseSyncRequest {

    public data: Pilot[];

    constructor(user: User, data: Pilot[]) {
        super(user);
        this.data = data;
    }
}