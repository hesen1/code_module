const mongoose = require('mongoose');
const readFile = require('../utils/readFile');


const Schema = mongoose.Schema;

/**
 * 获取model对象 构造函数需要schema名
 */
class MongodbModel {
    constructor(schema) {
        this.dirname = '/schema';
        this.filename = `/${schema}.json`;
        this.schema = this._getSchema();
        this.model = mongoose.model(schema,this.schema);
    }

    _getSchema() {
        try{
            const schema = readFile.readFileSync(this.dirname,this.filename);
            this.keys = Object.keys(schema);
            return new Schema(schema);
        }
        catch(err){
            throw err
        }
    }
}
exports.MongodbModel = MongodbModel;