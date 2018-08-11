const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49];

function quickSort(arr) {

    if(arr.length<=1) {
        return arr;
    }

    let leftArr = [];
    let rightArr = [];
    let q = arr[0];
    for(let i = 1,l=arr.length; i<l; i++) {
        if(arr[i]>q) {
            rightArr.push(arr[i]);
        }else{
            leftArr.push(arr[i]);
        }
    }

    return [].concat(quickSort(leftArr),[q],quickSort(rightArr));
}

console.log(quickSort(arr));

// 继续看快pain概念和思想，将其和代码联系起来