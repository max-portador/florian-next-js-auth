import {Request, Response, NextFunction} from "express";
import {Cookies} from "../../shared/types";
import tokenService from "../services/token-service";

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = tokenService.verifyAccessToken(req.cookies[Cookies.AccessToken])

    if (!token){
        res.status(401)
        return next(new Error('Unauthorized!'))
    }

    res.locals.token = token
    next()
}