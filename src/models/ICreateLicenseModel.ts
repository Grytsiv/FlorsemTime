import moment from 'moment';

export interface ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
}

export interface ICreateLicenseResponse extends ICreateLicenseModel {
    Id: string;
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
