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
}
export const netInfoDefault = {
    details: {
        ipAddress: '',
        isConnectionExpensive: false,
        subnet: '',
    },
    isConnected: false,
    isInternetReachable: null,
    type: NetInfoStateType.unknown,
};
export class NetInfoClass implements INetInfo {
    details: any | null;
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: NetInfoStateType;

    constructor(
        details: any | null = {ipAddress: '', isConnectionExpensive: false, subnet: ''},
        isConnected: boolean = false,
        isInternetReachable: boolean | null = null,
        type: NetInfoStateType = NetInfoStateType.unknown
    ) {
        this.details = details;
        this.isConnected = isConnected;
        this.isInternetReachable = isInternetReachable;
        this.isInternetReachable = isInternetReachable;
        this.type = type;
    }
}
