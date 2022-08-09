export interface AccessTokenPayload{
    userId: string
}

export interface RefreshTokenPayload{
    userId: string
    version: number
}

export enum TokensExpirations{
    Access = 5 * 60,
    Refresh= 7 * 24 * 3600,
    RefreshIfLessThan = 4 * 24 * 60 * 60,
}

export interface Tokens {
    accessToken: string,
    refreshToken: string | undefined
}

export interface AccessToken extends AccessTokenPayload {
    exp: number
}

export interface RefreshToken extends RefreshTokenPayload {
    exp: number
}