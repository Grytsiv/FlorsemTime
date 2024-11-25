export interface ILoginResponse {
    Id: string;
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
