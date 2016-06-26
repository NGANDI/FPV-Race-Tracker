/// <reference path="../../_reference.ts"/>
class CompetitionSyncRequest extends BaseSyncRequest {

    public data: Competition[];
 
    constructor(user:User, data: Competition[]) {
        super(user);
        this.data = data;
    }
}