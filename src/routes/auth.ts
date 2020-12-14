import { signUp,login } from '../controllers/auth'
import { Application } from 'express';
// import {loginValidation} from '../middlewares/validations';

const auth = (app: Application) => {
    const prefix = '/auth';


    app.post(prefix + '/signUp',  signUp);


    app.post(prefix + '/login',  login);

}

export default auth;