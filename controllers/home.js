'use strict'
const express = require('express'),
    router = express.Router(),
    db = require('../models'),
    path = require('path'),
    auth = require('../auth/passport');

module.exports = function (app) {
    app.use('/api', router);
};

router.post('/register', auth.registration)

router.post('/login', auth.login)

router.get('/profile', auth.instance, (req, res)=>{
    res.status(200).send(req.user)
})
