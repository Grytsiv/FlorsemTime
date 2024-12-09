export interface ILoginResponse {
    Id: number;
    Login: string;
    Password: string;
    Name: string;
    Surname: string;
    Address: string;
    Phone: string;
    Email: string;
    RoleId: number;
    RoleName: string;
    StatusId: number;
    StatusName: string;
    Bookkeeper: number;
    SupervisorId: number;
    CreatedBy: number;
    ModifiedBy: number;
    CreatedDate: string;
    ModifiedDate: string;
    LastActivityTime: string;
    Token: string;
}
export class User implements ILoginResponse {
    Id: number;
    Login: string;
    Password: string;
    Name: string;
    Surname: string;
    Address: string;
    Phone: string;
    Email: string;
    RoleId: number;
    RoleName: string;
    StatusId: number;
    StatusName: string;
    Bookkeeper: number;
    SupervisorId: number;
    CreatedBy: number;
    ModifiedBy: number;
    CreatedDate: string;
    ModifiedDate: string;
    LastActivityTime: string;
    Token: string;
    constructor(
        Id: number = -1,
        Login: string = '',
        Password: string = '',
        Name: string = '',
        Surname: string = '',
        Address: string = '',
        Phone: string = '',
        Email: string = '',
        RoleId: number = -1,
        RoleName: string = '',
        StatusId: number = -1,
        StatusName: string = '',
        Bookkeeper: number = -1,
        SupervisorId: number = -1,
        CreatedBy: number = -1,
        ModifiedBy: number = -1,
        CreatedDate: string = '',
        ModifiedDate: string = '',
        LastActivityTime: string = '',
        Token: string = '',
    ) {
        this.Id = Id;
        this.Login = Login;
        this.Password = Password;
        this.Name = Name;
        this.Surname = Surname;
        this.Address = Address;
        this.Phone = Phone;
        this.Email = Email;
        this.RoleId = RoleId;
        this.RoleName = RoleName;
        this.StatusId = StatusId;
        this.StatusName = StatusName;
        this.Bookkeeper = Bookkeeper;
        this.SupervisorId = SupervisorId;
        this.CreatedBy = CreatedBy;
        this.ModifiedBy = ModifiedBy;
        this.CreatedDate = CreatedDate;
        this.ModifiedDate = ModifiedDate;
        this.LastActivityTime = LastActivityTime;
        this.Token = Token;
    }
}
