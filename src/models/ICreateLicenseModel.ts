import moment from 'moment';

export interface ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
}

export class CreateLicenseModel implements ICreateLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;

    constructor(StartDate: string = moment.utc(new Date()).format('YYYY-MM-DDT00:00:00'), Period: number = 30, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '') {
        this.StartDate = StartDate;
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
    }
}
