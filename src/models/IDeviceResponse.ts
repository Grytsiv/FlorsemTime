import {ICreateDeviceModel} from './ICreateDeviceModel.ts';
export interface IDeviceResponse extends ICreateDeviceModel{
    Id: string;
    StatusId: number;
    StatusName: string;
}
export class DeviceResponse implements IDeviceResponse {
    Id: string;
    Idiom: string;
    Name: string;
    Model: string;
    VersionString: string;
    VersionName: string;
    VersionCode: string;
    BundleId: string;
    Platform: string;
    DeviceType: string;
    Manufacturer: string;
    Description: string;
    Width: number;
    Height: number;
    ComputerName: string;
    UserDomainName: string;
    UserName: string;
    LanMac: string;
    WLanMac: string;
    UniqueId: string;
    StatusId: number;
    StatusName: string;

    constructor(
        Id: string = '',
        Idiom: string = '',
        Name: string = '',
        Model: string = '',
        VersionString: string = '',
        VersionName: string = '',
        VersionCode: string = '',
        BundleId: string = '',
        Platform: string = '',
        DeviceType: string = '',
        Manufacturer: string = '',
        Description: string = '',
        Width: number = 0,
        Height: number = 0,
        ComputerName: string = '',
        UserDomainName: string = '',
        UserName: string = '',
        LanMac: string = '',
        WLanMac: string = '',
        UniqueId: string = '',
        StatusId: number = 1,
        StatusName: string = '',
    ) {
        this.Id = Id;
        this.Idiom = Idiom;
        this.Name = Name;
        this.Model = Model;
        this.VersionString = VersionString;
        this.VersionName = VersionName;
        this.VersionCode = VersionCode;
        this.BundleId = BundleId;
        this.Platform = Platform;
        this.DeviceType = DeviceType;
        this.Manufacturer = Manufacturer;
        this.Description = Description;
        this.Width = Width;
        this.Height = Height;
        this.ComputerName = ComputerName;
        this.UserDomainName = UserDomainName;
        this.UserName = UserName;
        this.LanMac = LanMac;
        this.WLanMac = WLanMac;
        this.UniqueId = UniqueId;
        this.StatusId = StatusId;
        this.StatusName = StatusName;
    }
}

