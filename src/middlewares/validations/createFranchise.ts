import { Request, Response, NextFunction } from 'express'
import * as JOI from '@hapi/joi'

const schema = JOI.object().keys({
    user: JOI.object().required(),
    franchiseName: JOI.string().required(),
    phone: JOI.string().required(),
    address: JOI.string().required()

});

const createFranchise = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).json(result.error);
    } else {
        next();
    }
}

export default createFranchise