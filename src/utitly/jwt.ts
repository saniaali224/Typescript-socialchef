import * as JWT from 'jsonwebtoken'
import constants from '../config/constants';
import env from 'dotenv';
env.config();

const jwt = (user: any) => {
    return JWT.sign({
        userId: user.id,
        email: user.email,
        userType: user.userType
    }, `${process.env.jwtSecret}`, { expiresIn: 300 * 300 });
};

const adminJwt = (user: any) => {
    return JWT.sign({
        storeId: user.storeId.id,
        userId: user.id,
        email: user.email,
        roleId: user.role.id
    }, `${process.env.jwtSecret}`, { expiresIn: 300 * 300 });
};


export {
    jwt,
    adminJwt
}