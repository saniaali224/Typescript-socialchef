import { Request, Response, NextFunction } from 'express'
import * as JOI from '@hapi/joi'

const schema = JOI.object().keys({
    user: JOI.object().required(),
    id: JOI.string().regex(/^[0-9a-fA-F]{24}$/).required(),

})

const idValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if(result.error){
        return res.status(400).json(result.error);
    } else {
        next();
    }
}

export default idValidation