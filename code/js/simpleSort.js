/**
 *选择排序
 *0~n取最小数放到0的位置
 *1~n取最小数放到1的位置
 *...
*/
function selectionSort(arr){
  if (arr.length < 2) return
  for(var i=0; i<arr.length; i++){
      let minNum = arr[i]
      for(var j=i+1; j<arr.length; j++){
          if (arr[j] < minNum){
              minNum = arr[j]
              swap(j, i,arr)
          }
      }
  }
}

/**
 *冒泡排序
 * 0~n
 * 0~n-1
 * 0~n-2
 * 对比相邻的数，如果右侧相邻数大于左侧，则交换，直到最大的数放到最后
 */
function popSort(arr){
  if (arr.length < 2) return
  for(var i=arr.length - 1;i>=0;i--){
      for(var j=1;j<=i;j++){
          if (arr[j] < arr[j-1]){
              swap(j,j-1,arr);
          }
      }
  }
}

/**
 * 插入排序
 * 0-0
 * 0-1 1,0位置比较大小交换
 * 0-1-2 2,1 1,0比较大小交换
 * 0-1-2-3 3,2 2,1 1,0比较大小交换
 * 保证每次的有序
 */
function insertionSort(arr){
  for(var i=0;i<arr.length;i++){
      for(var j=i;j>0;j--){
          if (arr[j] < arr[j-1]){
              swap(j,j-1,arr);
          }else{
              break
          }
      }
  }
}

/**
 * 归并排序
 * 递归
 * 将数组一分为二（保证两侧是有序的）
 * 确定左指针与右指针，右指针从中数加一开始
 * 对比左指针与右指针的数，较大一方丢到新数组中并指针++，继续比较
 * 直到一方指针越界，另一方数组统一并到新数组中
 */
function mergeSort(arr,L,R){
    if (L=== R){
        return
    }
    const mid = L + ((R - L) >> 1)
    mergeSort(arr,L,mid)
    mergeSort(arr,mid + 1,R)
    merge(arr,L,R,mid)
}

function merge(arr,L,R,mid) {
    let helpArr = []
    let p1 = L
    let p2 = mid + 1

    while (p1 <= mid && p2 <= R) {
        if (arr[p1] < arr[p2] || arr[p1] === arr[p2]) {
            helpArr.push(arr[p1])
            p1++
        }else if (arr[p1] > arr[p2]) {
            helpArr.push(arr[p2])
            p2++
        }
    }

    if (p1 > mid){
        helpArr = helpArr.concat(arr.slice(p2,R + 1))
    }else if(p2 > R){
        helpArr = helpArr.concat(arr.slice(p1,mid + 1))
    }

    for (i = 0; i < helpArr.length; i++) {
        arr[L+i] = helpArr[i]
    }
}
function swap(i,j,arr){
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

const arr = [4,3]
popSelection(arr)
console.log(arr)