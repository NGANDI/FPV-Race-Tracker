var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var main;
(function (main) {
    'use strict';
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(name, country, address, dateFrom, dateTo, contactEmail) {
            _super.call(this);
            this.name = name;
            this.country = country;
            this.address = address;
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
            this.contactEmail = contactEmail;
        }
        return Event;
    }(main.StoredObject));
    main.Event = Event;
})(main || (main = {}));
