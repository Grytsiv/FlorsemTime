import {ICreateLicenseResponse, LastLicenseModel} from './ICreateLicenseModel.ts';

export interface ICompanyModel {
    Id: number,
    Name: string,
    Address: string,
    Phone: string,
    Email: string,
    StatusId: number,
    StatusName: string,
    CreatedBy: number,
    CreatedDate: string,
    ModifiedBy: number,
    ModifiedDate: string
}
export class CompanyModel implements ICompanyModel {
    Id: number;
    Name: string;
    Address: string;
    Phone: string;
    Email: string;
    StatusId: number;
    StatusName: string;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number;
    ModifiedDate: string;

    constructor(
        Id: number = -1,
        Name: string = '',
        Address: string = '',
        Phone: string = '',
        Email: string = '',
        StatusId: number = -1,
        StatusName: string = '',
        CreatedBy: number = -1,
        CreatedDate: string = '',
        ModifiedBy: number = -1,
        ModifiedDate: string = '',
    ) {
        this.Id = Id;
        this.Name = Name;
        this.Address = Address;
        this.Phone = Phone;
        this.Email = Email;
        this.StatusId = StatusId;
        this.StatusName = StatusName;
        this.CreatedBy = CreatedBy;
        this.CreatedDate = CreatedDate;
        this.ModifiedBy = ModifiedBy;
        this.ModifiedDate = ModifiedDate;
    }
}
export interface IMergedCompanyModel {
    company: ICompanyModel;
    payment: ICreateLicenseResponse;
}
export class MergedCompanyModel implements IMergedCompanyModel {
    company: ICompanyModel;
    payment: ICreateLicenseResponse;

    constructor(
        company: ICompanyModel = new CompanyModel(),
        payment: ICreateLicenseResponse = new LastLicenseModel(),
    ) {
        this.company = company;
        this.payment = payment;
    }
}
