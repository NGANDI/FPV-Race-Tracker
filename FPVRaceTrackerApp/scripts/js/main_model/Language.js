var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Language = (function (_super) {
        __extends(Language, _super);
        function Language(name, json, editable) {
            _super.call(this);
            this.name = name;
            this.json = json;
            this.editable = editable;
        }
        return Language;
    }(main.StoredObject));
    main.Language = Language;
})(main || (main = {}));
