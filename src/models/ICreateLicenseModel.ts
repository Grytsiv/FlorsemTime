import moment from 'moment';

export interface ICreateOldLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;
}

export interface ICreateOldLicenseResponse extends ICreateOldLicenseModel {
    Id: number;
}

export interface ICreateLicenseModel extends ICreateOldLicenseModel {
    CompanyId: number;
}

export interface ICreateLicenseResponse extends ICreateLicenseModel {
    Id: number;
}
export class CreateOldLicenseModel implements ICreateOldLicenseModel {
    StartDate: string;
    Period: number;
    CheckUrl: string;
    CardNumber: string;
    CardOwnerName: string;

    constructor(Period: number = 30, CheckUrl: string = '', CardNumber: string = '', CardOwnerName: string = '') {
        this.StartDate = moment(new Date()).add(1,'day').format('YYYY-MM-DDT00:00:00');
        this.Period = Period;
        this.CheckUrl = CheckUrl;
        this.CardNumber = CardNumber;
        this.CardOwnerName = CardOwnerName;
    }
}
export class LastOldLicenseModel implements ICreateOldLicenseResponse {
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

export interface ICreateKhymkorLicenseModel {
  dateTime: string;
  amount: number;
}

export class CreateKhymkorLicenseModel implements ICreateKhymkorLicenseModel {
  dateTime: string;
  amount: number;

  constructor(amount: number = 50) {
    this.dateTime = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    this.amount = amount;
  }
}

export interface ICreateKhymkorLicenseResponse extends ICreateKhymkorLicenseModel {
  id: number;
}

// Common properties for the data object
interface IBaseData {
  type: number;
}

// Data specific to type 0 (e.g., KhymCor)
export interface IBalanceData extends IBaseData {
  type: 0;
  agBalance: number;
  smsBalance: number;
}

// Data-specific to type 1 (e.g., Home Service)
export interface IServiceData extends IBaseData {
  type: 1;
  daysRemained: number;
}

// Discriminated union for the data field
export type TCompanyData = IBalanceData | IServiceData;

// The main interface for the response item
export interface ICompanyResponse {
  title: string;
  data: TCompanyData;
}
