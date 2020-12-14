import { Request, Response, NextFunction } from 'express'
import StoreUser from '../../models/storeUser';


const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    const storeUser: any = await StoreUser.findById(req.body.user.userId)
        .populate('storeId')
        .populate('franchiseId')
        .populate('role');

    if (storeUser.role.roleName === 'store admin') {
        if (storeUser.isDeleted || storeUser.storeId.isDeleted) {
            return res.status(401).json({ msg: 'User or Store is soft deleted' });
        }
        req.body.user = storeUser;
        return next();
    }

    if (storeUser.isDeleted || storeUser.storeId.isDeleted || storeUser.franchiseId.isDeleted) {
        return res.status(401).json({ msg: 'User , Store or Franchise is soft deleted' });
    } else {
        req.body.user = storeUser;
        next();
    }

}


export default softDelete