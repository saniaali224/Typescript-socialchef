import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/user';
import { adminJwt, jwt } from '../utitly/jwt';



const signUp = async (req: Request, res: Response) => {
    try {

        const user: any = await new User({
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            profileName: req.body.profileName
        })
        user.save().then((result: any) => {
            const token: any = jwt(user);
            return res.status(200).json({ msg: 'signUp successfull', token: token, user: result });
        }).catch((err: any) => {
            return res.status(404).json({ msg: 'signUp unsuccessfull', err });
        });



    }


    catch (error) {
        console.log('eror::::', error);
        res.status(404).json({ msg: error.message });
    }
};
const login = async (req: Request, res: Response) => {
    try {
        if (!req.body.storeId || !req.body.email || !req.body.password) {
            return res.status(403).json({ msg: 'fields Missing' })
        }
        const user: any = await User.findOne({
            userName: req.body.userName,
           
        })

        if (!user) {
            return res.status(404).json({ msg: 'No user found' });
        }

        const isEqual: any = await bcrypt.compare(req.body.password, user.password);
        if (!isEqual) {
            return res.status(401).json({ msg: 'Wrong password' });
        }


        const token: any = jwt(user);
        return res.status(200).json({ msg: 'login successfull', token: token, user: user });



    } catch (error) {
        console.log('eror::::', error);
        res.status(404).json({ msg: error.message });
    }
};

export {
    login,
    signUp,
}