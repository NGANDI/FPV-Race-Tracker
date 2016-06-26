var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var User = (function (_super) {
    __extends(User, _super);
    function User(json) {
        _super.call(this, json);
        this.name = json.name;
        //        this.passwordHash = json.passwordHash;
        this.email = json.email;
        this.registered = json.registered ? json.registered : false;
    }
    return User;
}(BaseEntity));
