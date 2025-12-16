export interface ILoginResponse {
    id: number;
    name: string;
    phone: string;
    city: string;
    token: string;
}
export class User implements ILoginResponse {
    id: number;
    name: string;
    phone: string;
    city: string;
    token: string;
    constructor(
        id: number = -1,
        name: string = '',
        phone: string = '',
        city: string = '',
        token: string = '',
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.token = token;
    }
}
