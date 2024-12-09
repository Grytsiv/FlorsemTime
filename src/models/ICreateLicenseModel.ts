import moment from 'moment';

export interface ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
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

    constructor(Period: number = 30, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '') {
        this.StartDate = moment.utc(new Date()).format('YYYY-MM-DDT00:00:00');
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
    }
}

export class LastLicenseModel implements ICreateLicenseResponse {
    Id: number;
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;

    constructor(Id: number = -1, StartDate: string = '', Period: number = -1, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '') {
        this.Id = Id;
        this.StartDate = StartDate;
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
    }
}
