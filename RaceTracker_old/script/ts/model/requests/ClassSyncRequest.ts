/// <reference path="../../_reference.ts"/>
class ClassSyncRequest extends BaseSyncRequest {

    public data: Classs[];

    constructor(user: User, data: Classs[]) {
        super(user);
        this.data = data;
    }
}