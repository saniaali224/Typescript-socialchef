import { Request, Response, NextFunction } from 'express'
import * as JWT from 'jsonwebtoken'
import constants from '../../config/constants'


const verify = (req: Request, res: Response, next: NextFunction) => {
    let authentication = req.headers.authorization;
    if (authentication) {
        let accessToken = (authentication as string).split(' ')[1];
        JWT.verify(accessToken, `${process.env.jwtSecret}`, (err: any, decode: any) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.body.user = decode;
            next();
        });
    } else {
        return res.status(401).json({ message: 'No token supplied' });
    }
}

export default verify