import { Request, Response, NextFunction } from 'express'
import * as JOI from '@hapi/joi'

const schema = JOI.object().keys({
    user : JOI.object().required(),
    subCategories: JOI.string().allow(''),
    categoryId: JOI.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    productName: JOI.string().required(),
    productCode: JOI.string().required(),
    costPrice : JOI.number().required(),
    openingStock : JOI.number().required(),
    mrp : JOI.string().required(),
    minimumRetailPrice : JOI.number().required(),
    productTax : JOI.number().required(),
    status : JOI.string().required(),
    unit : JOI.number().required(),
    description : JOI.string().required(),
    imageField : JOI.object().allow(null),

})

const genericProductValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if(result.error){
        console.log(result.error)
        return res.status(400).json(result.error);
    } else {
        next();
    }
}

export default genericProductValidation