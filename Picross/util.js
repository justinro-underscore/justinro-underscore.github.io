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
