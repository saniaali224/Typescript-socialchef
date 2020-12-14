import { Request, Response, NextFunction } from 'express'
import * as JOI from '@hapi/joi'



const schema = JOI.object().keys({
    user: JOI.object().required(),
    franchiseId : JOI.string().allow(''),
    total : JOI.number(),
    discount : JOI.number(),
    shippingCost : JOI.number(),
    supplierId: JOI.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    invoiceNo: JOI.number().required(),
    date: JOI.date().required(),
    netTotal: JOI.number().required(),
    paid: JOI.number().required(),
    billType: JOI.string().required(),
    paymentMethod: JOI.string().required(),
    products: JOI.array().required().items(
        JOI.object().required().keys({
            productId : JOI.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            unitPrice : JOI.number().required(),
            quantity : JOI.number().required(),
            productName : JOI.string(),
            subTotal : JOI.number()
        })
    ),
})

const franchiseProductValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).json(result.error);
    } else {
        next();
    }
}

export default franchiseProductValidation