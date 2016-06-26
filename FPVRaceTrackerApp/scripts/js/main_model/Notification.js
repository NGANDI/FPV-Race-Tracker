var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Notification = (function (_super) {
        __extends(Notification, _super);
        function Notification(text, type, displayTimeInMS) {
            _super.call(this);
            this.text = text;
            this.type = type;
            this.displayTimeInMS = displayTimeInMS;
            this.created = new Date().getTime();
            this.fade = false;
        }
        return Notification;
    }(main.StoredObject));
    main.Notification = Notification;
})(main || (main = {}));
