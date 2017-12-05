const fs = require('fs');
const path = require('path');
const util = require('util');
const validators = require('./validators');
const rootdir = require('../config').rootdir;

/**
 * 异步读取文件内容 callback=>(err,data) or promise
 * @param {String} dirname 文件路径，可以包含文件名，也可不包含，必选
 * @param {String} filename 文件名 可选
 * @param {function} callback 回调函数
 */
function readFile(dirname,filename,callback) {
    filename = filename || '';
    if (!validators.isString(dirname) || !validators.isString(filename))
        return callback(new TypeError('参数类型不正确!'),null);

    filename = path.join(rootdir,dirname,filename);

    if(!fs.existsSync(filename)) 
        return callback(new Error('文件不存在！',null));

    fs.readFile(filename,function(err, data){
        if(err) return callback(err,null);
        callback(null,JSON.parse(data));
    });
}
exports.readFile = util.promisify(readFile);

/**
 * 同步读取文件内容 
 * @param {String} dirname 文件路径，可以包含文件名，也可不包含，必选
 * @param {String} filename 文件名 可选
 */
function readFileSync(dirname,filename) {
    filename = filename || '';
    if (!validators.isString(dirname) || !validators.isString(filename))
        throw TypeError('参数类型不正确!');

    filename = path.join(rootdir,dirname,filename);

    if(!fs.existsSync(filename)) 
        throw Error('文件不存在！');

    return JSON.parse(fs.readFileSync(filename));
}
exports.readFileSync = readFileSync;

/**
 * 同步读取目录下所有文件名 返回数组
 * @param {String} dir 目录名 必选
 * @param {Object} options options 可选
 */
function readDirSync(dir,options) {
    if (!dir && !validators.isString(dir))
        throw TypeError('参数类型不正确!');
    
    const dirPath = path.join(rootdir,dir);
    options = options || {encoding: 'utf8'};

    if (!fs.existsSync(dirPath))
        throw Error('目录不存在！');
    return fs.readdirSync(dirPath,options);
}
exports.readDirSync = readDirSync;

/**
 * 同步读取目录下所有文件内容 返回object {filename: content}
 * @param {*} dir 目录名 必选
 * @param {*} extname 文件后缀名 必选
 * @param {*} options options 可选
 */
function readDirFilesSync(dir,extname,options) {
    if (!dir && !validators.isString(dir))
        throw TypeError('参数类型不正确!');

    if (!extname && !validators.isString(extname))
        throw TypeError('参数类型不正确!');

    const files = readDirSync(dir, options);
    const filesData = {};

    for (let file of files) {
        let filePath = path.join(rootdir,dir,file);
        filesData[path.basename(filePath, extname)] = readFileSync(dir,file);
    }
    return filesData;
}
exports.readDirFilesSync = readDirFilesSync;