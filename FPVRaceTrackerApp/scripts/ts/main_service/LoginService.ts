/// <reference path='../main_all.ts' />

module main {
    'use strict';

    export class LoginService {
        getDefaultUser(): User {
            return new User("test");
        }

    }
}