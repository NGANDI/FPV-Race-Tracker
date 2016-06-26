var main;
(function (main) {
    'use strict';
    var LoginController = (function () {
        function LoginController(loginService) {
            this.loginService = loginService;
            this.user = loginService.getDefaultUser();
        }
        LoginController.prototype.login = function () {
            this.user = this.loginService.getDefaultUser();
        };
        LoginController.$inject = [
            'loginService'
        ];
        return LoginController;
    }());
    main.LoginController = LoginController;
})(main || (main = {}));
