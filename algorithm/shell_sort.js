Array.prototype.shell_sort = function() {
	let gap, i, j;
    let temp;
    // >>= 1 先右移一位，将结果赋值给左边变量
    for (gap = this.length >> 1; gap > 0; gap >>= 1){
        // console.log(gap);
        for (i = gap; i < this.length; i++) {
            temp = this[i];
            // console.log(i, temp)
            for (j = i - gap; j >= 0 && this[j] > temp; j -= gap)
                this[j + gap] = this[j];
            this[j + gap] = temp;
            // console.log(this[j], this[j + gap], [i, j, gap]);
            // console.log(this);
        }
    }
};

const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49];
const arr1 = [56, 5, 23]
Array.prototype.shell_sort.call(arr);
console.log(arr);