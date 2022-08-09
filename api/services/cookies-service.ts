import {CookieOptions, TokensExpirations} from "../../shared/types";
import * as dotenv from "dotenv";
dotenv.config({path: '.env.development'})

const isProduction = process.env.NODE_ENV === 'production'

class CookiesService{
    defaultCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        domain: process.env.BASE_DOMAIN!,
        path: '/'
    }

    accessCookieOptions() {
        return {
            ...this.defaultCookieOptions,
            maxAge: TokensExpirations.Access * 1000
        }
    }

    refreshCookieOptions() {
        return {
            ...this.defaultCookieOptions,
            maxAge: TokensExpirations.Refresh * 1000
        }
    }
}


export default new CookiesService()