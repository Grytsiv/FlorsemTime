export interface ICredentials {
    login: string;
    password: string;
}
export class Credentials {
    login: string;
    password: string;
    constructor(login: string = '', password: string = '') {
        this.login = login;
        this.password = password;
    }
}
