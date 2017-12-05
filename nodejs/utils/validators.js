
/**
 * 判断对象是否为string 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isString(obj) {
    return typeof obj === 'string' ? true : false;
}
exports.isString = isString;

/**
 * 判断对象是否为number 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isNumber(obj) {
    return typeof obj === 'number' ? true : false;
}
exports.isNumber = isNumber;

/**
 * 判断对象是否为undefined 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isUndefined(obj) {
    return typeof obj === 'undefined' ? true : false;
}
exports.isUndefined = isUndefined;

/**
 * 判断对象是否为array 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;
}
exports.isArray = isArray;

/**
 * 判断对象是否为object 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
}
exports.isObject = isObject;

/**
 * 判断对象是否为function 必选 返回boolean
 * @param {*} obj 要判断的对象
 */
function isFunction(obj) {
    return typeof obj === 'function' ? true : false;
}
exports.isFunction = isFunction;

/**
 * 验证手机号是否符合
 * @param {String} phone 11位电话号码
 */
function isPhone(phone) {
    if (!phone || !isString(phone) || phone.length !== 11)
        return false;
    const reg = new RegExp(/^1[3|4|5|8][0-9]\d{8}$/);

    return reg.test(phone);
}
exports.isPhone = isPhone;

/**
 * 判断tags是不是合法的标签
 * @param {string | array} tags 要判断的电影标签
 */
function isValidTags(tags) {
    if (!tags || (!isString(tags) && !isArray(tags)))
        return false;
    tags = [].concat(tags);

    const validTags = ['热门','最新','经典','华语','欧美','韩国','日本','动作','喜剧','爱情','科幻','悬疑','恐怖','文艺',];
    for (const taste of tags) {
        if (validTags.indexOf(taste) === -1)
            return false;
    }
    return true;
}
exports.isValidTags = isValidTags;
