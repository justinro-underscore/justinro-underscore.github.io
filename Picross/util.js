/**
 * Gets the ID of a cell at a position
 * @param {number|Array<number>} x The x coordinate of the cell, or an array containing [x, y]
 * @param {number} y The y coordinate of the cell
 * @returns The ID of the cell
 */
function getCellId(x, y) {
  let xVal = x;
  let yVal = y;
  if (x instanceof Array) {
    xVal = x[0];
    yVal = x[1];
  }
  return `${CLASS_CELL}-${xVal}-${yVal}`;
}

/**
 * Gets the ID of the span of a specific numbers value
 * @param {boolean} rowCol If true, numbers row. Otherwise, numbers column
 * @param {number} index The row index of the numbers if row numbers. Column index if column numbers
 * @param {number} numberIndex The index of the number inside the numbers row/column
 * @returns The ID of the numbers value
 */
function getNumbersId(rowCol, index, numberIndex) {
  const prefix = rowCol ? CLASS_NUMBERS_ROW : CLASS_NUMBERS_COL;
  return `${prefix}-${index}-${numberIndex}`;
}

/**
 * For debug use only
 * Prints the final numbers prediction with colors into the console
 * @param {Array<number>} prediction The prediction array
 * @param {string} prefix Prefix to the console log
 */
function printFinalNumbersPrediction(prediction, prefix = '') {
  let str = `${prefix} [`;
  let styles = [];
  for (let i = 0; i < prediction.length; i++) {
    const num = prediction[i];
    if (num === NCV_INIT_X) {
      // Means an X is already placed here
      str += '%cX';
      styles.push('color: black');
    }
    else if (num === NCV_X) {
      // Means an X should be placed here
      str += '%cX';
      styles.push('color: blue');
    }
    else if (num === NCV_NONE) {
      // Means this could either be filled or an X
      str += '%c?';
      styles.push('color: gray');
    }
    else {
      // Means this should be filled
      const rawNum = num >> 1;
      str += `%c${rawNum}`;
      styles.push(`color: ${num % 2 === 0 ? 'blue' : 'black'}`);
    }

    if (i < finalNumbersPrediction.length - 1) {
      str += '%c, ';
      styles.push('');
    }
  }
  str += '%c]';
  styles.push('');
  console.log(str, ...styles);
}

// function testNumbersPrediction() {
//   // const nums = [1, 1, 3];
//   // let arr = new Array(9).fill(NCV_X);
//   // arr[7] = NCV_INIT_FILLED;
//   // arr[1] = NCV_INIT_FILLED;
//   // arr[3] = NCV_INIT_X;
//   // const nums = [1, 2, 1];
//   // let arr = new Array(7).fill(NCV_X);
//   // const nums = [3];
//   // let arr = new Array(4).fill(NCV_X);
//   // const nums = [0];
//   // let arr = new Array(4).fill(NCV_X);
//   // arr[1] = NCV_INIT_FILLED;
//   // arr[1] = NCV_INIT_X;
//   // const nums = [3];
//   // let arr = new Array(4).fill(NCV_X);
//   // arr[1] = NCV_INIT_FILLED;
//   // arr[1] = NCV_INIT_X;

//   // calcNumbersPrediction(nums, arr);

//   const nums = [1, 1];
//   const arr1 = [NCV_X, NCV_X, NCV_X, NCV_X, NCV_X];
//   const arr2 = [NCV_INIT_FILLED, NCV_X, NCV_X, NCV_X, NCV_X];
//   const arr3 = [NCV_INIT_FILLED, NCV_INIT_X, NCV_X, NCV_X, NCV_X];
//   const arr4 = [NCV_X, NCV_INIT_FILLED, NCV_X, NCV_X, NCV_X];
//   const arr5 = [NCV_INIT_X, NCV_INIT_FILLED, NCV_X, NCV_X, NCV_X];
//   const arr6 = [NCV_X, NCV_INIT_FILLED, NCV_INIT_X, NCV_X, NCV_X];
//   const arr7 = [NCV_INIT_X, NCV_INIT_FILLED, NCV_INIT_X, NCV_X, NCV_X];

//   const arr8 = [NCV_INIT_FILLED, NCV_INIT_FILLED, NCV_X, NCV_X, NCV_X];
//   const arr9 = [NCV_X, NCV_X, NCV_INIT_X, NCV_INIT_X, NCV_INIT_FILLED];
//   const arr10 = [NCV_X, NCV_X, NCV_INIT_X, NCV_INIT_X, NCV_X];
//   const arr11 = [NCV_X, NCV_INIT_FILLED, NCV_INIT_X, NCV_INIT_X, NCV_X];
//   const arr12 = [NCV_INIT_X, NCV_INIT_FILLED, NCV_INIT_X, NCV_INIT_X, NCV_X];
//   const arr13 = [NCV_INIT_FILLED, NCV_X, NCV_INIT_X, NCV_INIT_X, NCV_X];
//   const arr14 = [NCV_X, NCV_INIT_FILLED, NCV_X, NCV_INIT_FILLED, NCV_X];

//   calcNumbersPrediction(nums, arr1);
//   calcNumbersPrediction(nums, arr2);
//   calcNumbersPrediction(nums, arr3);
//   calcNumbersPrediction(nums, arr4);
//   calcNumbersPrediction(nums, arr5);
//   calcNumbersPrediction(nums, arr6);
//   calcNumbersPrediction(nums, arr7);
//   calcNumbersPrediction(nums, arr8);
//   calcNumbersPrediction(nums, arr9);
//   calcNumbersPrediction(nums, arr10);
//   calcNumbersPrediction(nums, arr11);
//   calcNumbersPrediction(nums, arr12);
//   calcNumbersPrediction(nums, arr13);
//   calcNumbersPrediction(nums, arr14);
// }

/**
 * Converts the given array of Internal Cell Values (the array directly from the game board)
 * to Numbers Calculation Values (the values that are used in the numbers prediction calculation)
 * @param {Array<string>} arr The array to convert, in Internal Cell Values
 * @returns A converted array, now in Numbers Calculation Values
 */
function convertICVToNCV(arr) {
  return arr.map(val => val === CV_FILLED ? NCV_INIT_FILLED :
    val === CV_X_ED ? NCV_INIT_X : NCV_X);
}

/**
 * Returns the intersection of two arrays
 * If the values at index i are the same, then that value stays
 * If the values at index i are different, then use default value
 * @param {Array<*>} arr1 Array 1
 * @param {Array<*>} arr2 Array 2
 * @param {*} defaultVal The default value to use when elements aren't equal. Defaults to null
 * @returns The intersection of the two arrays
 */
function intersect(arr1, arr2, defaultVal = null) {
  return arr1.map((val, i) => val === arr2[i] ? val : defaultVal);
}
