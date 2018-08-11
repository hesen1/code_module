const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49];

function insertion_sort(arr) {
    for(let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        for (let j = i; j > 0; j--) {
            if (arr[j - 1] > arr[j]) {
                // let temp = arr[j]; 正确，temp可以写在这儿，但是是arr[j]
                arr[j] = arr[j - 1];
                arr[j - 1] = temp;
            }
        }
    }
    return arr;
}

console.log(insertion_sort(arr));

/**
 * [45, 22, 69, 66, 5, 7, 9, 89, 23, 49]
 * 插人排序是取得的下标x处，依次把x下标的值与小于x（即在x下标前的值）比较，小或大（看需求）就两两交换。
 * 然后从x-1与x-2处又比较，知道开始下标0为止。
 * 到零后，将x+1的值取出重复之前的操作。
 *  最坏时间复杂度	O(n^{2})
    最优时间复杂度	O(n)
    平均时间复杂度	O(n^{2})
    最坏空间复杂度	总共  O(n) ，需要辅助空间 O(1)
 */