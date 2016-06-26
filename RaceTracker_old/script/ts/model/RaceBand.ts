/// <reference path="../_reference.ts"/>
class RaceBand extends BaseEntity {
    public value: string;

    constructor(json: any) {
        super(json);
        this.value = json.value;
    }
}