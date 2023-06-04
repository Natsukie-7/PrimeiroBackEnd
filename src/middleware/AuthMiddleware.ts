import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
interface IPayLoad {
    sub: string
}

class AuthMiddleware {
    auth(request:Request, response:Response, next: NextFunction) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'token missing'
            })
        }
        const [, token] = authHeader.split(' ')
        let secretKey:string | undefined = process.env.ACCESS_KEY_TOKEN
        if (!secretKey) {
            throw new Error('Theres no token key')
        }

        try {
            const { sub } = verify(token, secretKey) as IPayLoad;
            request.user_id = sub;

            return next()
        } catch (error) {
            response.status(401).json({
                code: "token.expired",
                message: 'Token Expired'
            })
        }
    }
}

export { AuthMiddleware }