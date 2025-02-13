enum NetInfoStateType {
    unknown = 'unknown',
    none = 'none',
    cellular = 'cellular',
    wifi = 'wifi',
    bluetooth = 'bluetooth',
    ethernet = 'ethernet',
    wimax = 'wimax',
    vpn = 'vpn',
    other = 'other',
}
export interface INetInfo {
    details: any | null;
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: NetInfoStateType;

    isEqual(other: INetInfo): boolean;
}
export class NetInfoClass implements INetInfo {
  details: any | null;
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: NetInfoStateType;

  constructor(
    details: any | null = {
      ipAddress: '',
      isConnectionExpensive: false,
      subnet: '',
    },
    isConnected: boolean = false,
    isInternetReachable: boolean | null = null,
    type: NetInfoStateType = NetInfoStateType.unknown,
  ) {
    this.details = details;
    this.isConnected = isConnected;
    this.isInternetReachable = isInternetReachable;
    this.isInternetReachable = isInternetReachable;
    this.type = type;
  }

  isEqual(other: INetInfo): boolean {
    return (
        JSON.stringify(this.details) === JSON.stringify(other.details) &&
        this.isConnected === other.isConnected &&
        this.isInternetReachable === other.isInternetReachable &&
        this.type === other.type
    );
  }
}
