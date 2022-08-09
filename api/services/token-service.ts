import jwt from 'jsonwebtoken'
import {UserDocument} from "@shared";
import {
    AccessToken,
    AccessTokenPayload,
    Cookies,
    RefreshToken,
    RefreshTokenPayload,
    Tokens,
    TokensExpirations
} from "../../shared/types";
import {Response} from "express";
import cookiesService from "./cookies-service";
import * as dotenv from "dotenv";

dotenv.config({path: '.env.development'})

export { Response } from 'express'

const ATSecret = process.env.AT_SECRET!
const RTSecret = process.env.RT_SECRET!



class TokenService{

    createTokens(user: UserDocument): Tokens {
        const accessPayload = {userId: user.id}
        const refreshPayload  = {userId: user.id, version: user.tokenVersion}

        const accessToken = this.signAccessToken(accessPayload)
        const refreshToken = this.signRefreshToken(refreshPayload)
        
        return {accessToken, refreshToken}
    }

    refreshTokens(current: RefreshToken, tokenVersion: number): Tokens {
        if (current.version !== tokenVersion) throw 'Token revoke!'

        const accessPayload: AccessTokenPayload = {userId: current.userId}
        const accessToken = this.signAccessToken(accessPayload)

        let refreshPayload: RefreshTokenPayload | undefined
        if (this.isNotExpired(current))
            refreshPayload = {userId: current.userId, version: tokenVersion}

        const refreshToken = refreshPayload && this.signRefreshToken(refreshPayload)

        return {accessToken, refreshToken}
    }

    signAccessToken(payload: AccessTokenPayload){
        return jwt.sign(payload, ATSecret, {expiresIn: TokensExpirations.Access})
    }



    signRefreshToken(payload: RefreshTokenPayload){
        return jwt.sign(payload, RTSecret, {expiresIn: TokensExpirations.Refresh})
    }

    setTokens(res: Response, access: String, refresh?: string){
        res.cookie(Cookies.AccessToken, access, cookiesService.accessCookieOptions())
        if (refresh) res.cookie(Cookies.RefreshToken, refresh, cookiesService.refreshCookieOptions())
    }

    clearTokens(res: Response){
        let opts = {...cookiesService.accessCookieOptions(), maxAge: 0}
        res.cookie(Cookies.AccessToken, '',  opts)
        res.cookie(Cookies.RefreshToken, '', opts)
    }

    verifyRefreshToken(refreshToken: string){
        return jwt.verify(refreshToken, RTSecret) as RefreshToken
    }

    verifyAccessToken(accessToken: string){
        return jwt.verify(accessToken, ATSecret) as AccessToken
    }

    isNotExpired(token: RefreshToken){
        const expiration = new Date(token.exp * 1000)
        const now = new Date()
        const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000
        return secondsUntilExpiration < TokensExpirations.RefreshIfLessThan
    }



}

export default new TokenService()