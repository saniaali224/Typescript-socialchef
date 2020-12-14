import * as JOI from '@hapi/joi'
import { Request, Response, NextFunction } from 'express'

const schema = JOI.object().keys({
    email: JOI.string().email().required(),
    password: JOI.string().min(8).required(),
    storeName: JOI.string().required(),
    address: JOI.string().required()
});

const signupValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if(result.error) {
        return res.status(400).json(result.error)
    } else {
        next();
    }
}

export default signupValidation;