var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var MainConfig = (function (_super) {
        __extends(MainConfig, _super);
        function MainConfig(languageName, defaultLocation) {
            _super.call(this);
            this.languageName = languageName;
            this.defaultLocation = defaultLocation;
        }
        return MainConfig;
    }(main.StoredObject));
    main.MainConfig = MainConfig;
})(main || (main = {}));
