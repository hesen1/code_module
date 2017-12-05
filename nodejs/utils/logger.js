const log4js = require('log4js');
const path = require('path');

const rootdir = require('../config').rootdir;

log4js.configure({
    appenders: {
        default: { type: 'file', filename: path.join(rootdir,'/logs','/default.log') },
        'console': {type: 'console'},
        mongodb: { type: 'file', filename: path.join(rootdir,'/logs','/mongodb.log') },
        app: {type: 'file', filename: path.join(rootdir,'/logs','app.log')},
        auth: {type: 'file', filename: path.join(rootdir,'/logs','auth.log')}
    },
    categories: { 
        default: { appenders: ['default'], level: 'info' },
        mongodb: { appenders: ['mongodb'], level: 'error' },
        app: { appenders: ['app'], level: 'error' },
        'console': {appenders: ['console'], level: 'info'},
        auth: { appenders: ['auth'], level: 'info' },
    },
});

const mongodbLogger = log4js.getLogger('mongodb');
exports.mongodbLogger = mongodbLogger;

const appLogger = log4js.getLogger('app');
exports.appLogger = appLogger;

const debugLogger = log4js.getLogger('console');
debugLogger.level = 'debug';
exports.debugLogger = debugLogger;

exports.infoLogger = log4js.getLogger('console');
exports.authLogger = log4js.getLogger('auth');