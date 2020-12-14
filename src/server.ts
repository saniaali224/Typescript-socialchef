import app from "./app";
import compression from "compression";
import helmet from "helmet";
import allRoutes from './routes';
import cors from 'cors'
import * as bodyParser from 'body-parser'
import morgan from 'morgan'
import database from './config/db';
import env from 'dotenv';
env.config()
const db = new database();

app.use(helmet()); // set well-known security-related HTTP headers
app.use(compression());

app.disable("x-powered-by");

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit : '50mb'}));


allRoutes(app);


const server = app.listen(8000, () =>
    console.log("Starting ExpressJS server on Port 8000"));

export default server;
