var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var LogEntry = (function (_super) {
        __extends(LogEntry, _super);
        function LogEntry(date, level, reporter, errorMessage, json) {
            _super.call(this);
            this.date = date;
            this.level = level;
            this.reporter = reporter;
            this.errorMessage = errorMessage;
            this.json = json;
        }
        return LogEntry;
    }(main.StoredObject));
    main.LogEntry = LogEntry;
})(main || (main = {}));
