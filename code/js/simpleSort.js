// 选择排序
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

// 冒泡排序
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

// 插入排序
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

function swap(i,j,arr){
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

const arr = [4,3]
popSelection(arr)
console.log(arr)