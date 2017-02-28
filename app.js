'use strict';

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    async = require('async'),
    db = require('./models'),
    path = require('path'),
    glob = require('glob'),
    pass = require('./auth/passport'),
    morgan = require('morgan'),
    compress = require('compression'),
    methodOverride = require('method-override');

let port = process.env.PORT || 3030;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.use(methodOverride());

app.disable('x-powered-by');

pass.init();

let controllers = glob.sync(path.join(__dirname, '/controllers/*.js'));
controllers.forEach(function (controller) {
    require(controller)(app);
});


app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: 'error'
    });
});

db.sequelize
    .sync()
    .then( ()=>{
        if (!module.parent) {
            app.listen(port, function(){
                console.log(`server starts at localhost:${port}`)
            })
        }
    }).catch( (e)=> {
    throw new Error(e);
});

module.exports = app;
