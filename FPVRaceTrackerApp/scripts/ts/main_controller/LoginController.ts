/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LoginController {

        private user: User;

        public static $inject = [
            'loginService'
        ];

        constructor(
            private loginService: LoginService
        ) {
            this.user = loginService.getDefaultUser();
        }

        login() {
            this.user = this.loginService.getDefaultUser();
        }
    }
}