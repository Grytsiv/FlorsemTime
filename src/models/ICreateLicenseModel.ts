import moment from 'moment';

export interface ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
    CompanyId: number;
}

export interface ICreateLicenseResponse extends ICreateLicenseModel {
    Id: number;
}

export class CreateLicenseModel implements ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
    CompanyId: number;

    constructor(Period: number = 30, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '', CompanyId: number = -1) {
        this.StartDate = moment(new Date()).add(1,'day').format('YYYY-MM-DDT00:00:00');
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
        this.CompanyId = CompanyId;
    }
}

export class LastLicenseModel implements ICreateLicenseResponse {
    Id: number;
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
    CompanyId: number;

    constructor(Id: number = -1, StartDate: string = '', Period: number = -1, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '', CompanyId: number = -1) {
        this.Id = Id;
        this.StartDate = StartDate;
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
        this.CompanyId = CompanyId;
    }
}
