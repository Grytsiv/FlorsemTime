export interface IRefreshResult {
    accessToken: string;
    accessTokenExpirationDate: string;
    additionalParameters?: { [name: string]: string };
    idToken: string;
    refreshToken: string | null;
    tokenType: string;
}
