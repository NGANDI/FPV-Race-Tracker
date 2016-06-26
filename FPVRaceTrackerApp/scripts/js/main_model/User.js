var main;
(function (main) {
    'use strict';
    var User = (function () {
        function User(username) {
            this.username = username;
        }
        return User;
    }());
    main.User = User;
})(main || (main = {}));
