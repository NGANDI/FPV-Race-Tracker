/// <reference path="../../_reference.ts"/>
class RaceBandSyncRequest extends BaseSyncRequest {

    public data: RaceBand[];

    constructor(user: User, data: RaceBand[]) {
        super(user);
        this.data = data;
    }

}