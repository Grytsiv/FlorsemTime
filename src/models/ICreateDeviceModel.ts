export interface ICreateDeviceModel {
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
    Width: number,
    Height: number,
    ComputerName: string;
    UserDomainName: string;
    UserName: string;
    LanMac: string;
    WLanMac: string;
    UniqueId: string;
    StatusId: number
}
export class CreateDeviceModel implements ICreateDeviceModel {
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

    constructor(
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
    ) {
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
    }
}
