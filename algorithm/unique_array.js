const arr1 = [1,13,24,11,11,14,1,2];

function unique1(arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]' || !Array.isArray(arr)) {
        throw new Error('must be a array');
    }
    const set = new Set(arr);
    return Array.from(set);
}

function unique2(arr) {
    const data = [];
    for (const item of arr) {
        if (data.indexOf(item) === -1) {
            data.push(item);
        }
    }
    return data;
}

console.log(unique2(arr1));

// 冒泡排序是一轮循环，最小的到最前面
// 下沉法是一轮循环，最大的到最后（下）面