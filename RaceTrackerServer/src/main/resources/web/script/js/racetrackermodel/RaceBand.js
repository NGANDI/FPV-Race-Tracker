var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RaceBand = (function (_super) {
    __extends(RaceBand, _super);
    function RaceBand(json) {
        _super.call(this, json);
        this.value = json.value;
    }
    return RaceBand;
}(BaseEntity));
