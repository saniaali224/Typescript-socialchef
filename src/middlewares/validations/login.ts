import { Request, Response, NextFunction } from 'express'
import * as JOI from '@hapi/joi'

const schema = JOI.object().keys({
    userName: JOI.string().email().required(),
    password: JOI.string().required()
})

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if(result.error){
        return res.status(400).json(result.error);
    } else {
        next();
    }
}

export default loginValidation