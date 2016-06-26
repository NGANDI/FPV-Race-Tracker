var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Pilot = (function (_super) {
        __extends(Pilot, _super);
        function Pilot(firstName, lastName, alias, country, clubIdx, email, registrationNumber, transponder) {
            _super.call(this);
            this.firstName = firstName;
            this.lastName = lastName;
            this.alias = alias;
            this.country = country;
            this.clubIdx = clubIdx;
            this.email = email;
            this.registrationNumber = registrationNumber;
            this.transponder = transponder;
        }
        return Pilot;
    }(main.StoredObject));
    main.Pilot = Pilot;
})(main || (main = {}));
