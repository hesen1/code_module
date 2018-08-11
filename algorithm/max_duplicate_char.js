const str = 'afjghdfraaaasdenas';
const str1 = 'csskkdf;a;psgk';

function findMaxDuplicateChar(str) {
    if(str.length === 1) {
        return str;
    }
    let maxValue = 1;
    let char = str[0];
    const strDictionary = {};

    for(const c of str) {
        if(!strDictionary.hasOwnProperty(c)) {
            strDictionary[c] = 1;
        } else {
            strDictionary[c] += 1;
            [maxValue, char] = strDictionary[c] > maxValue ? [strDictionary[c], c] : [maxValue, char];
        }
    }
    return char;
}


function findMaxDuplicateChars(str) {
    if(str.length === 1) {
        return str;
    }
    let maxValue = 1;
    let chars = [];
    const strDictionary = {};

    for(const c of str) {
        if(!strDictionary.hasOwnProperty(c)) {
            strDictionary[c] = 1;
        } else {
            strDictionary[c] += 1;
            maxValue = strDictionary[c] > maxValue ? strDictionary[c] : maxValue;
        }
    }
    for(const item in strDictionary) {
        if(strDictionary.hasOwnProperty(item) && strDictionary[item] === maxValue) {
            chars.push(item);
        }
    }
    return chars;
}

console.log(findMaxDuplicateChar(str));
console.log(findMaxDuplicateChars(str1));