module.exports = (app) => {
    app.use((req, res, next) => {
        console.log('middleware: ' + req.method, req.url);
        res.header('Cache-Control', 'public, max-age=120');
        next();
    });

    // // catch 404
    // app.use((req, res, next) => {
    //     const error = new Error('File NOT Found');
    //     error.status = 404;
    //     next(error);
    // });
    //
    // // error handling
    // app.use((error, req, res, next) => {
    //     res.status(error.status | 500);
    //     res.json('error', {
    //         message: error.message,
    //         error: {}
    //     });
    // });

};