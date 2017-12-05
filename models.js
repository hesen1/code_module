const path = require('path');

const MongodbModel = require('./mongodbModel').MongodbModel;
const readFile = require('../utils/readFile');
const rootdir = require('../config').rootdir;

function getAllModels() {
    const allModels = {};
    const files = readFile.readDirSync('/schema');
    for (let file of files) {
        let filePath = path.join(rootdir,'/schema',file);
        let schema = path.basename(filePath, '.json');
        allModels[schema] = new MongodbModel(schema);
    }
    return allModels;
}



module.exports = getAllModels();