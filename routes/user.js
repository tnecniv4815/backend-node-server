// var express = require('express');
// var router = express.Router();
//
// var _ = require('lodash');
//
// router.get('/list', (req, res) => {
//     res.status(200).send('user list');
// });
//
// router.post('/register', (req, res) => {
//     const displayName = req.body.displayName;
//     const username = req.body.username;
//     const password = req.body.password;
//     const confirmPassword = req.body.confirmPassword;
//
//     console.log('displayName: ' + displayName);
//     console.log('username: ' + username);
//     console.log('password: ' + password);
//     console.log('confirmPassword: ' + confirmPassword);
//
//
//     if (password === confirmPassword) {
//         const result = {
//             code: 200,
//             message: 'ok'
//         };
//
//         res.json(result);
//     } else {
//         res.status(400).send('wrong password');
//     }
//
//
//
// });
//
// // module.exports = router;
//

const User = require('./../schema/User');

module.exports = (app, router) => {
    // app.use('/user', router);

    // router.get('/list', (req, res) => {
    //     res.status(200).send('user list');
    // });

    const userController = require('./../controllers/UserController');

    app.post('/user/register', userController.register);
    app.get('/user/login', userController.login);

    app.get('/user/list', async (req, res, next) => {
        console.log('list_all_user');

        const existUser = await User.findOne({email: 'ross@example.com'}).exec();

        console.log(existUser);

        res.send(existUser);


    });


};