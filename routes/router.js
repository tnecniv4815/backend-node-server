



//



// app.use('/article', articleController);



// router.use('/article', require('./articles'));
// router.use('/animals', require('./animals'));
// router.use('/cars', require('./cars'));
// router.use('/user', require('./user') );

// var user = require('./user') (router);

//
// const user = require('./user');





const express = require('express');

/*
const rootRouter = (app) => {

    const router = express.Router();

    app.use('/', router);



// middleware
    router.use((req, res, next) => {
        console.log('middleware: ' + req.method, req.url);

        next();
    });

    // const authController = require('./../controllers/AuthController');

    // router.get('/', (req, res) => {
    //     res.send('Home page')
    // });
    //
    // router.get('/about', (req, res) => {
    //     res.send('Learn about us')
    // });

    const articlesRouter = require('./articles');
    const usersRouter = require('./user') (app, router);
    const carsRouter = require('./cars');
    const animalsRouter = require('./animals');

    // app.use('/article', router);
    app.use('/user', router);

    // router.use('/list', )



    // app.use('/article', articlesRouter);
    // app.use('/user', usersRouter);
    // app.use('/cars', carsRouter);
    // app.use('/animals', animalsRouter);
};
*/

const rootRouter = (app) => {

    // console.log(app);

    const router = express.Router();



    const articlesRouter = require('./articles');
    const userRouter = require('./user');

    articlesRouter(app, router);
    userRouter(app, router);

    app.use('/', router);
    // app.use('/article', router);

    // app.use('/article', articlesRouter);

    // router.use((req, res, next) => {
    //     console.log('middleware: ' + req.method, req.url);
    //
    //     next();
    // });

    // const articlesRouter = require('./articles');
    //
    // router.use('/', (req, res) => {
    //     console.log('middleware: ' + req.method, req.url);
    //
    //     res.send('root');
    // });

    // router.use('/article', articlesRouter(router));

};

//

// router.use('/article', articlesRouter);

module.exports = rootRouter;






