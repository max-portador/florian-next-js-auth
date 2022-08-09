export enum Cookies {
    AccessToken = 'access',
    RefreshToken = 'refresh'
}

export interface CookieOptions {
    httpOnly: boolean
    secure: boolean
    sameSite: 'strict' | 'lax'
    domain: string
    path: string
}