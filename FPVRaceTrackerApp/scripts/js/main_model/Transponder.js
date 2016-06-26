var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Transponder = (function (_super) {
        __extends(Transponder, _super);
        function Transponder(vendorIdx, identifier) {
            _super.call(this);
            this.vendorIdx = vendorIdx;
            this.identifier = identifier;
        }
        return Transponder;
    }(main.StoredObject));
    main.Transponder = Transponder;
})(main || (main = {}));
