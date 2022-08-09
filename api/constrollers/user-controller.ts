import {Request, Response} from "express";
import githubService from "../services/github-service";
import userService from "../services/user-service";
import tokenService from "../services/token-service";
import {UserDocument} from "@shared";
import * as dotenv from "dotenv";
import {Cookies} from "../../shared/types";

dotenv.config({path: '.env.development'})

class UserController {
    async github(req: Request, res: Response){
        const {code} = req.body
        const gitHubUser = await githubService.getGitHubUser(code as string)
        let user = await userService.getUserByGitHubId(gitHubUser.id) as UserDocument
        if (!user) user = await userService.createUser(gitHubUser.name, gitHubUser.id)

        const {accessToken, refreshToken} = tokenService.createTokens(user)
        tokenService.setTokens(res, accessToken, refreshToken)
        res.send('vgrwovewovboberv')
        res.redirect(`${process.env.CLIENT_URL}/me`)
    }

    async refresh(req: Request, res: Response){
        try{
            const current = tokenService.verifyRefreshToken(req.cookies[Cookies.RefreshToken])
            const user = await userService.getUserById(current.userId)
            if (!user) throw 'User not found!'

            const {accessToken, refreshToken} = tokenService.refreshTokens(current, user.tokenVersion)
            tokenService.setTokens(res, accessToken, refreshToken)
        }
        catch (e) {
            tokenService.clearTokens(res)
        }

        res.end()
    }

    logout(req: Request, res: Response) {
        tokenService.clearTokens(res)
    }

    async logoutAll(req: Request, res: Response){
        await userService.increaseTokenVersion(res.locals.token.userId)
        tokenService.clearTokens(res)
        res.end()
    }

    async me(req: Request, res: Response){
        const user = await userService.getUserById(res.locals.token.userId)
    }
}


export default new UserController()