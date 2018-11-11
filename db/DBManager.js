'use strict';

const mongoose = require('mongoose');
// const config = require('config');



module.exports = {
        connect:  () => {
            console.log('connect to db...');

            const options = config.get('MongoDB.options');


            // const aaa = 'mongodb://127.0.0.1:27017/newsdb';


            console.log(options);

            // mongoose.set('useCreateIndex', true);

            // const dbHost = process.env.DB_HOST;
            // const dbPort = process.env.DB_PORT;
            // const dbName = process.env.DB_NAME;
            // const url = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;

            const dbHost = process.env.DB_HOST;
            const dbPort = process.env.DB_PORT;
            const dbName = process.env.DB_NAME;

            const dbUrl = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
            console.log('dbUrl: ', dbUrl);

            // const url = config.get('MongoDB.connectionUrl');
            // console.log('dbUrl: ' + url);





        // mongoose.set('useCreateIndex', true);
        // mongoose.connect(url, options, () => {
        //     console.log('db connected');
        // });
        //
        //
        // const db = mongoose.connection;
        //
        // db.on('error', (error) => {
        //     console.log('db error');
        //     console.log(error);
        // });

         // db.once('open', () => {
         //     console.log('db connected');
         // })



            mongoose.connect(dbUrl, options, () => {
                console.log('db connected');
            });
            mongoose.set('useCreateIndex', true);

            mongoose.connection.on('disconnected', () => {
                console.log('db disconnected');
            });

            mongoose.connection.on('error', (error) => {
                console.log('db error');
                console.log(error);
            });

    }

};

// module.exports = async function connect(url) {
//
//     await mongoose.connection(url);
//
// };