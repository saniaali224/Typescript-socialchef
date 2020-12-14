
import auth from './auth';


import { Request, Response, Application } from 'express';


const index = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        return res.json({ message: 'hello' });
    })
}




const allRoutes = (app: Application) => {
    return {
        root: index(app),
        
        auth: auth(app),
        
    }
}
export default allRoutes