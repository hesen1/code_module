const mongoose = require('mongoose');
const util = require('util');

const readFile = require('../utils/readFile');
const validators = require('../utils/validators');
const logger = require('../utils/logger');
const models = require('../database/models');

const url = readFile.readFileSync('/config','/mongodb.json').url;
const options = {
    poolSize: 10,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    useMongoClient: true
}

mongoose.Promise = global.Promise;
mongoose.connect(url,options,function(err){
    if (err)
        logger.mongodbLogger.error(err); // TODO: 写入日志
});

/**
 * 根据搜索条件找到对应的一条数据, callback 或者 promise
 * @param {String} schema  schema名 必选
 * @param {Object} searchCondition 搜索条件 可选
 * @param {String} selectFields 选择字段 可选
 * @param {Function} callback 回调函数=>(err,result)
 */
function findOne(schema,searchCondition,selectFields,callback) {
    if(!schema || !validators.isString(schema))
        return callback(new TypeError('invalid argments'),null);

    searchCondition = searchCondition || {};
    if(!searchCondition || !validators.isObject(searchCondition))
        return callback(new TypeError('invalid argments'),null);

    const obj = models[schema];
    const model = obj.model;
    selectFields = selectFields || obj.keys.join(' ');

    model.findOne(searchCondition,selectFields,function(err,result){ // selectField 无值时，有错
        if (err){
            logger.mongodbLogger.error(err);
            return callback(err,null);
        }
        callback(null,result);
    });
}
exports.findOne = util.promisify(findOne);

/**
 * 新建一个或多个文档
 * @param {String} schema schema名 必选
 * @param {Object | Array} docs 文档数据 必选
 * @param {Function} callback 回调函数=>(err,docs)
 */
function create(schema,docs,callback) {
    if (!schema || !validators.isString(schema))
        return callback(new TypeError('invalid argments',null));

    if (!docs || !validators.isObject(docs) && !validators.isArray(docs))
        return callback(new TypeError('invalid argments',null));

    const model = models[schema].model;
    model.create(docs, function(err,docs){
        if (err){
            logger.mongodbLogger.error(err);
            return callback(err,null);
        }
        callback(null,docs);
    });
}
exports.create = util.promisify(create);

/**
 * 根据条件删除对应文档
 * @param {String} schema schema名 必选
 * @param {Object} conditions 筛选条件 必选
 * @param {Function} callback 回调函数=>(err,assistArg) assistArg就等于'success',辅助参数
 */
function deleteOne(schema,conditions,callback) {
    if (!schema || !validators.isString(schema))
        return callback(new TypeError('invalid argments',null));

    if (!conditions || !validators.isObject(conditions))
        return callback(new TypeError('invalid argments',null));

    const model = models[schema].model;
    model.deleteOne(conditions,function(err,assistArg){
        if (err) {
            logger.mongodbLogger.error(err);
            return callback(err,null);
        }
        callback(null,'success');
    });
}
exports.deleteOne = util.promisify(deleteOne);

/**
 * 根据条件更新某个文档
 * @param {String} schema schema名 必选
 * @param {Object} conditions 筛选条件 必选
 * @param {Object} updateData 更新数据 必选
 * @param {Object} options api选项
 * @param {Function} callback 回调函数=>(err,raw) raw包含更新状态
 */
function updateOne(schema,conditions,updateData,options,callback) {
    if (!schema || !validators.isString(schema))
        return callback(new TypeError('invalid argments',null));

    if (!conditions || !validators.isObject(conditions))
        return callback(new TypeError('invalid argments',null));
    
    if (!updateData || !validators.isObject(updateData))
        return callback(new TypeError('invalid argments',null));

    options = options || {safe: true};
    const model = models[schema].model;
    model.updateOne(conditions,updateData,options,function(err,raw){
        if (err) {
            logger.mongodbLogger.error(err);
            return callback(err,null);
        }
        callback(null,raw);
    });
}
exports.updateOne = util.promisify(updateOne);


/**
 * 更具条件查询文档返回指定数据
 * @param {String} schema schema名 必选
 * @param {Object} conditions 筛选条件 必选
 * @param {String} fields 选择字段 可选
 * @param {Object} options 数据返回操作，常用skip、limit、sort
 * @param {Function} callback 回调函数=>(err,results) results返回的数据数组
 */
function find(schema,conditions,fields,options,callback) {
    if (!schema || !validators.isString(schema))
        return callback(new TypeError('invalid argments',null));

    if (!conditions || !validators.isObject(conditions))
        return callback(new TypeError('invalid argments',null));

    const obj = models[schema];
    const model = obj.model;
    fields = fields || obj.keys.join(' ');
    options = options || {sort:{_id:1}};

    model.find(conditions,fields,options,function(err,results){
        if (err) {
            logger.mongodbLogger.error(err);
            return callback(err,null);
        }
        callback(null,results);
    });
}
exports.find = util.promisify(find);
