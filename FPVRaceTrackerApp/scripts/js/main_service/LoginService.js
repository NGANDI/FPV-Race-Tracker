var main;
(function (main) {
    'use strict';
    var LoginService = (function () {
        function LoginService() {
        }
        LoginService.prototype.getDefaultUser = function () {
            return new main.User("test");
        };
        return LoginService;
    }());
    main.LoginService = LoginService;
})(main || (main = {}));
