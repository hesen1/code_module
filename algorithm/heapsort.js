// 堆排序，概念是用完全二叉树
// 但是实际操作用数组arr就好了，因为有以下两种关系(arr数组，i是数组下标索引):
// 大顶堆： arr[i] >= arr[2i + 1] && arr[2i + 2]
// 小顶堆：arr[i] <= arr[2i + 1] && arr[2i + 2]
// 其中arr[i]、arr[2i + 1]、arr[2i + 2]表示数组对应位置的元素，三个元素组成二叉树的父，左，右一组三个节点
// A：从数组最后一个元素开始，三个为一组，将其最大的元素放在父元素的位置（即i），这样一轮下来最大值就成为数组第一个元素（从高到低）降序排序
// 最后把其和最后一个元素调换就是（从低到高）增序排序
// 重复 A 操作直到数组第一个元素，堆排序就完成了


const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49, 67];

function heapsortWithLoop(arr) {
    for(let i = 0; i < arr.length; i++) {
        for(let j = arr.length - 1 - i; j >= 0; j--) {
            if (2 * j + 1 >= arr.length - i || 2 * j + 2 >= arr.length - i) {
                continue;
            }
            let left = arr[2 * j + 1];
            let right = arr[2 * j + 2];
            if (arr[j] < left) {
                arr[2 * j + 1] = arr[j];
                arr[j] = left;
            }
            if (arr[j] < right) {
                arr[2 * j + 2] = arr[j];
                arr[j] = right;
            }
        }
        let temp = arr[0];
        arr[0] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp
    }
    return arr;
}

console.log(heapsortWithLoop(arr));

function headsortWithRecursion(arr, arrLength) {
    if (!arrLength) {
        return arr;
    }
    for(let i = arrLength - 1; i >= 0; i--) {
        if(2 * i + 1 >= arrLength || 2 * i + 2 >= arrLength) {
            continue;
        }
        let left = arr[2 * i + 1];
        let right = arr[2 * i + 2]
        if (arr[i] > left) {
            arr[2 * i + 1] = arr[i];
            arr[i] = left;
        }
        if (arr[i] > right) {
            arr[2 * i + 2] = arr[i];
            arr[i] = right;
        }
    }
    let temp = arr[0];
    arr[0] = arr[arrLength - 1];
    arr[arrLength - 1] = temp;
    arr = headsortWithRecursion(arr, --arrLength)
    return arr;
}

console.log(headsortWithRecursion(arr, arr.length));