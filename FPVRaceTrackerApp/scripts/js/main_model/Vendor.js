var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Vendor = (function (_super) {
        __extends(Vendor, _super);
        function Vendor(name) {
            _super.call(this);
            this.name = name;
        }
        return Vendor;
    }(main.StoredObject));
    main.Vendor = Vendor;
})(main || (main = {}));
