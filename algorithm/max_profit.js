const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49];

console.log(Math.max(...arr) - Math.min(...arr));


function getMaxProfit(arr) {

    var minPrice = arr[0];
    var maxProfit = 0;

    for (var i = 0; i < arr.length; i++) {
        var currentPrice = arr[i];

        minPrice = Math.min(minPrice, currentPrice);

        var potentialProfit = currentPrice - minPrice; // 计算当前值与最小值的差值

        maxProfit = Math.max(maxProfit, potentialProfit); // 如果当前差值大于目前最大差值，则保持当前差值
    }

    return maxProfit;
}
console.log(getMaxProfit(arr));