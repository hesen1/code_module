const arr = [55, 26, 69, 5, 3];

let newArr = arr.map((value, index, arr) => {
    return value * 2;
});

// [ 110, 52, 138, 10, 6 ] [ 55, 26, 69, 5, 3 ]
// console.log(newArr, arr);


let reduceV = arr.reduce((preValue, currentValue, index, arr) => {
    return preValue + currentValue;
});

// 158
// console.log(reduceV);


let filterArr = arr.filter((currentValue, index, arr) => {
    return currentValue > 26;
});

// [ 55, 69 ] [ 55, 26, 69, 5, 3 ]
// console.log(filterArr, arr);


let sortArr = arr.sort((a, b) => {
    // 负数是升序，正数是降序， 0随便
    return a - b;
});

// [ 3, 5, 26, 55, 69 ] [ 3, 5, 26, 55, 69 ]
console.log(sortArr, arr);
