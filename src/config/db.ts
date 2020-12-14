import mongoose from 'mongoose';

export default class Database {

    constructor() {

        mongoose.connect(`${process.env.DB_URI}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then((conn: any) => {
                console.log('connected to db');
            }).catch((error: any) => {
                console.log('error :::::', error)
            });

    }
}