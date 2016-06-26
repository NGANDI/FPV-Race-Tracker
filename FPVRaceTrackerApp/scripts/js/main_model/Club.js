var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Club = (function (_super) {
        __extends(Club, _super);
        function Club(name, country) {
            _super.call(this);
            this.name = name;
            this.country = country;
        }
        return Club;
    }(main.StoredObject));
    main.Club = Club;
})(main || (main = {}));
