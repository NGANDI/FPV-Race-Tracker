class Classs extends BaseEntity {
    public name: string;

    constructor(json: any) {
        super(json);
        this.name = json.name;
    }
}