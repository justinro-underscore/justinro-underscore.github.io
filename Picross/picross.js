// TODO Replace most instances of for loop with forEach

// The position of the selected cell
let selectedPos;
// The solution to the puzzle
let solution;
// How the game board looks currently
let gameBoard;
// The width of the game board
let gameBoardWidth;
// The height of the game board
let gameBoardHeight;
// The numbers values for each row
let rowValues;
// The numbers values for each column
let colValues;
// Defines if the game is over or not
let gameOver;
// Defines the numbers prediction after calculation
// Had to make this global scope because it must be up to date through all recursion instances
var finalNumbersPrediction;
// Defines the current action being taken
let currInternalAction;

/**
 * Runs when the page loads, initializes game
 */
function onLoad() {
  bindListeners();
  loadLevel(1);
}

/**
 * Loads the specified level into the game board
 * @param {number} index The index of the level to play 
 */
function loadLevel(index) {
  // Get data and set initial values for variables
  solution = levels[index];
  gameBoardHeight = solution.length;
  gameBoardWidth = solution[0].length;
  gameBoard = new Array(gameBoardHeight);
  for (let i = 0; i < gameBoardHeight; i++) {
    gameBoard[i] = new Array(gameBoardWidth);
    for (let j = 0; j < gameBoardWidth; j++) {
      gameBoard[i][j] = CV_NONE;
    }
  }

  // Get the row and column values for the board
  colValues = new Array(gameBoardWidth);
  rowValues = new Array(gameBoardHeight);
  // Loop through twice, first for row values, second for column values
  // TODO Clean this up
  for (let rowCol = 0; rowCol < 2; rowCol++) {
    let row = rowCol === 0;

    for (let i = 0; i < (row ? gameBoardHeight : gameBoardWidth); i++) {
      let vals = [];
      let count = 0;
      for (let j = 0; j < (row ? gameBoardWidth : gameBoardHeight); j++) {
        if ((row ? solution[i][j] : solution[j][i])[3] === 1) {
          count++;
        }
        else if (count > 0) {
          vals.push(count);
          count = 0;
        }
      }
      if (vals.length === 0 || count > 0) {
        vals.push(count);
      }

      if (row) {
        rowValues[i] = vals;
      }
      else {
        colValues[i] = vals;
      }
    }
  }

  // Create game table
  createGameTable();

  // Prefill the cells so we have an easy starting place
  prefillCells();

  // Go through and set the numbers colors
  for (let row = 0; row < gameBoardHeight; row++) {
    calcNumbersPredictionFromRowCol(true, row);
  }
  for (let col = 0; col < gameBoardWidth; col++) {
    calcNumbersPredictionFromRowCol(false, col);
  }

  // Set first selected cell
  selectedPos = [0, 0];
  const selectedId = getCellId(selectedPos);
  document.getElementById(selectedId).classList.add(CLASS_CELL_SELECTED);

  // Start the game
  gameOver = false;
}

/**
 * Creates the game table using level values
 */
function createGameTable() {
  // Get game board reference
  const gameBoard = document.getElementById(ID_GAME_BOARD);

  // Create the table
  const gameTable = document.createElement(ELEM_TABLE);
  gameTable.setAttribute(ATTR_ID, ID_GAME_TABLE);

  // Start by adding the column numbers
  const colValuesRowElem = document.createElement(ELEM_TABLE_ROW);
  // Add placeholder cell
  colValuesRowElem.appendChild(document.createElement(ELEM_TABLE_CELL));
  // Add column numbers
  for (let col = 0; col < gameBoardWidth; col++) {
    const colValuesElem = document.createElement(ELEM_TABLE_CELL);
    const colValuesArr = colValues[col];
    for (let i = 0; i < colValuesArr.length; i++) {
      const valueElem = document.createElement(ELEM_DIV);
      valueElem.innerText = colValuesArr[i];
      valueElem.setAttribute(ATTR_ID, getNumbersId(false, col, i));
      colValuesElem.appendChild(valueElem);
    }
    colValuesElem.classList.add(CLASS_NUMBERS);
    colValuesElem.classList.add(CLASS_NUMBERS_COL);
    colValuesRowElem.appendChild(colValuesElem);
  }
  gameTable.appendChild(colValuesRowElem);

  // Next, create the individual rows
  for (let row = 0; row < gameBoardHeight; row++) {
    // Create the row
    const rowElem = document.createElement(ELEM_TABLE_ROW);

    // First, add the row numbers
    const rowValuesElem = document.createElement(ELEM_DIV);
    const rowValuesArr = rowValues[row];
    for (let i = 0; i < rowValuesArr.length; i++) {
      const valueElem = document.createElement(ELEM_SPAN);
      valueElem.innerText = rowValuesArr[i];
      valueElem.setAttribute(ATTR_ID, getNumbersId(true, row, i));
      rowValuesElem.appendChild(valueElem);
      if (i < rowValuesArr.length - 1) {
        rowValuesElem.innerHTML += ' ';
      }
    }
    rowValuesElem.classList.add(CLASS_NUMBERS);
    rowValuesElem.classList.add(CLASS_NUMBERS_ROW);
    rowElem.appendChild(rowValuesElem);

    // Next add the columns
    for (let col = 0; col < gameBoardWidth; col++) {
      const cellElem = document.createElement(ELEM_TABLE_CELL);
      cellElem.setAttribute(ATTR_ID, getCellId(col, row));
      cellElem.classList.add(CLASS_CELL);
      cellElem.innerHTML = CELL_NONE;
      rowElem.appendChild(cellElem);
    }
    gameTable.appendChild(rowElem);
  }
  gameBoard.appendChild(gameTable);
}

/**
 * Prefills the cells by filling in full rows/cols and x-ing out empty rows/cols
 */
function prefillCells() {
  for (let row = 0; row < gameBoardHeight; row++) {
    let action = null;
    if (rowValues[row][0] === 0) {
      action = IA_ADD_X;
    }
    else if (rowValues[row][0] === gameBoardWidth) {
      action = IA_ADD_FILL;
    }
    if (action) {
      for (let col = 0; col < gameBoardWidth; col++) {
        takeInternalAction(action, [col, row]);
      }
    }
  }
  for (let col = 0; col < gameBoardWidth; col++) {
    let action = null;
    if (colValues[col][0] === 0) {
      action = IA_ADD_X;
    }
    else if (colValues[col][0] === gameBoardHeight) {
      action = IA_ADD_FILL;
    }
    if (action) {
      for (let row = 0; row < gameBoardHeight; row++) {
        takeInternalAction(action, [col, row]);
      }
    }
  }
}

/**
 * Moves the selected cell
 * @param {string} keyCode The key code of the key input
 * @param {boolean} repeating If true, the key is being held down
 *  If this is true, then we want to not wrap the cursor
 */
function moveSelected(keyCode, repeating) {
  const id = getCellId(selectedPos);
  document.getElementById(id).classList.remove(CLASS_CELL_SELECTED);

  // Translate the key code to a direction
  const navDirection = CONTROL_MAPPING[NAVIGATION][keyCode];
  switch (navDirection) {
    case NAV_UP:
      if (repeating && selectedPos[1] === 0) {
        break;
      }
      selectedPos[1]--;
      if (selectedPos[1] < 0) {
        selectedPos[1] = gameBoardHeight - 1;
      }
      break;
    case NAV_RIGHT:
      if (repeating && selectedPos[0] === gameBoardWidth - 1) {
        break;
      }
      selectedPos[0]++;
      if (selectedPos[0] >= gameBoardWidth) {
        selectedPos[0] = 0;
      }
      break;
    case NAV_DOWN:
      if (repeating && selectedPos[1] === gameBoardHeight - 1) {
        break;
      }
      selectedPos[1]++;
      if (selectedPos[1] >= gameBoardHeight) {
        selectedPos[1] = 0;
      }
      break;
    case NAV_LEFT:
      if (repeating && selectedPos[0] === 0) {
        break;
      }
      selectedPos[0]--;
      if (selectedPos[0] < 0) {
        selectedPos[0] = gameBoardWidth - 1;
      }
      break;
  }
  const nextId = getCellId(selectedPos);
  document.getElementById(nextId).classList.add(CLASS_CELL_SELECTED);
}

/**
 * Takes an action on the selected key based on the given key code
 * @param {string} actionKeyCode The key code of the action to take (assumes valid input)
 */
function takeAction(actionKeyCode) {
  // Get the current action being taken based on the controls
  const action = CONTROL_MAPPING[ACTION][actionKeyCode];
  // Get the current selected cell status
  const selectedCellStatus = gameBoard[selectedPos[1]][selectedPos[0]];

  // Determine what action should be taken on the game board based on
  //  the action from the controls and the current cell status
  currInternalAction = null;
  // If filling or x-ing...
  if (action === ACTION_FILL || action === ACTION_X) {
    // And if the cell is either empty or marked...
    if (selectedCellStatus === CV_NONE || selectedCellStatus === CV_MARKED) {
      // Action should be to add fills or x-es
      currInternalAction = action === ACTION_FILL ? IA_ADD_FILL : IA_ADD_X;
    }
    // Or if the cell is already filled or x-ed...
    else {
      // Action should be to erase
      currInternalAction = IA_ERASE;
    }
  }
  // If marking...
  else if (action === ACTION_MARK) {
    // If the cell is empty...
    if (selectedCellStatus === CV_NONE) {
      // Action should be to add marks
      currInternalAction = IA_ADD_MARK;
    }
    // Or if the cell is marked...
    else if (selectedCellStatus === CV_MARKED) {
      // Action should be to erase marks
      currInternalAction = IA_ERASE_MARK;
    }
    // Do nothing if starting action on filled or x-ed cell
  }

  // Take the action
  takeInternalAction();
}

function clearCellElem(cell) {
  cell.classList.remove(CLASS_CELL_FILLED);
  cell.classList.remove(CLASS_CELL_X_ED);
  cell.classList.remove(CLASS_CELL_MARKED);
  cell.innerHTML = CELL_NONE;
}

/**
 * Applies an action onto a given cell with the given position
 * @param {string} internalAction The action to take, defaults the current action
 * @param {Array<number>} cellPos [row, col], defaults to the selected position
 */
function takeInternalAction(internalAction = currInternalAction, cellPos = selectedPos) {
  const id = getCellId(cellPos);
  const cell = document.getElementById(id);
  const currCellStatus = gameBoard[cellPos[1]][cellPos[0]];

  // Take the action
  switch (internalAction) {
    case IA_ADD_FILL:
      // Fills cannot overwrite x-es
      if (currCellStatus !== CV_X_ED) {
        clearCellElem(cell);
        cell.classList.add(CLASS_CELL_FILLED);
        gameBoard[cellPos[1]][cellPos[0]] = CV_FILLED;

        // Since a square has been filled, check if the puzzle has been solved
        if (checkWin()) {
          // If it has, set the win status and exit
          setWin();
          return;
        }
      }
      break;
    case IA_ADD_X:
      // X-es cannot overwrite fills
      if (currCellStatus !== CV_FILLED) {
        clearCellElem(cell);
        cell.classList.add(CLASS_CELL_X_ED);
        cell.innerText = CELL_X;
        gameBoard[cellPos[1]][cellPos[0]] = CV_X_ED;
      }
      break;
    case IA_ADD_MARK:
      // Marks can only be placed on empty cells
      if (currCellStatus === CV_NONE) {
        clearCellElem(cell);
        cell.classList.add(CLASS_CELL_MARKED);
        cell.innerText = CELL_MARK;
        gameBoard[cellPos[1]][cellPos[0]] = CV_MARKED;
      }
      break;

    case IA_ERASE_MARK:
      // When erasing marks, can only erase marked cells
      if (currCellStatus !== CV_MARKED) {
        break;
      }
      // Fall through:
    case IA_ERASE:
      clearCellElem(cell);
      gameBoard[cellPos[1]][cellPos[0]] = CV_NONE;
      break;
  }

  // If the game hasn't finished and the game board has been changed...
  if (!gameOver && (internalAction === IA_ADD_FILL ||
      internalAction === IA_ADD_X ||
      internalAction === IA_ERASE)) {
    // Update the numbers on this row and column
    updateNumbers(cellPos);
  }
}

/**
 * Updates the numbers on the row and column
 * @param {Array<number>} yx [col, row] of the recently changed cell
 */
function updateNumbers(yx) {
  const [colNum, rowNum] = yx;
  calcNumbersPredictionFromRowCol(true, rowNum);
  calcNumbersPredictionFromRowCol(false, colNum);
}

/**
 * Calculates the numbers prediction for a single row or column
 * @param {boolean} rowCol If true, row. Otherwise, column
 * @param {number} index The row index if row. Column index if column
 */
function calcNumbersPredictionFromRowCol(rowCol, index) {
  const nums = rowCol ? rowValues[index] : colValues[index];
  const icv = rowCol ? gameBoard[index] : gameBoard.map(row => row[index]);
  const ncv = convertICVToNCV(icv);
  calcNumbersPrediction(nums, ncv);
  setNumberStatusFromPrediction(rowCol, index, nums);
}

/**
 * Calculates the prediction for the given numbers array
 * @param {Array<number>} nums The numbers for that row/column
 * @param {Array<number>} arr The row/col in NCV form
 */
function calcNumbersPrediction(nums, arr) {
  // Reset the prediction
  finalNumbersPrediction = [];

  // If there are no values in this array...
  if (nums[0] === 0) {
    // And if the player hasn't filled in any squares (that would make this section)...
    if (arr.every(num => num !== NCV_INIT_FILLED)) {
      // Autofill prediction to be all Xs unless the player has already placed Xs
      finalNumbersPrediction = arr.map(num => num === NCV_INIT_X ? num : NCV_X);
    }
  }
  // If there are values in this array...
  else {
    // Recursively calculate the numbers prediction
    recurseCalcNumbersPrediction(nums, 0, arr, 0);
  }

  // If a prediction was not created, there is no prediction to be made
  if (finalNumbersPrediction.length === 0) {
    finalNumbersPrediction = new Array(arr.length).fill(NCV_NONE);
  }

  // Bit shift the filled numbers so that we can flag whether or not it has been filled already
  finalNumbersPrediction = finalNumbersPrediction.map((num, i) => num >= 0 ? ((num + 1) << 1) + (arr[i] === NCV_INIT_FILLED ? 1 : 0) : num);
}

/**
 * Recursively calculates the prediction for this row/column based on the numbers given
 * NOTE: There are probably more efficient ways of doing this, but this is what I came up with
 *  and I worked really hard on it and don't ever want to look at it again
 * @param {Array<number>} nums The numbers for that row/column
 * @param {number} numsIdx The current index of the nums array
 * @param {Array<number>} initPrediction The initial prediction based on the last calculations
 * @param {number} initPredictionIdx The current index of the initial prediction
 */
function recurseCalcNumbersPrediction(nums, numsIdx, initPrediction, initPredictionIdx) {
  const num = nums[numsIdx];

  // Get the max index we can go to so we don't iterate through array combinations that are invalid
  const maxIdx = initPrediction.length - nums.slice(numsIdx + 1).reduce((sum, number) => sum + number + 1, 0);

  // Start iterating through all possible array combinations
  // `i` will keep track of the iteration starting point
  for (let i = initPredictionIdx; i < maxIdx; i++) {
    let predictionIdx = i; // This will keep track of where we are placing potential squares in the array
    let prediction = initPrediction.slice(); // Make a copy of the initial prediction

    // If there is a filled square on either side of this iteration's number group...
    if ((predictionIdx > 0 && prediction[predictionIdx - 1] === NCV_INIT_FILLED) ||
        (predictionIdx + num < prediction.length && prediction[predictionIdx + num] === NCV_INIT_FILLED)) {
      // It is invalid, skip this iteration
      continue;
    }

    let xEncountered = false; // Use to break out of the inner for loop
    // Fill out this number group
    for (let j = 0; j < num; j++) {
      // If there is a defined X in this number group...
      if (predictionIdx >= prediction.length || prediction[predictionIdx] === NCV_INIT_X) {
        // It is invalid, break out of this for loop
        xEncountered = true; // Have to use this boolean to break out of the outer for loop as well
        break;
      }
      // If we didn't encounter an X, fill the square and move to the next square
      prediction[predictionIdx++] = numsIdx;
    }
    // If we encountered an X...
    if (xEncountered) {
      // It is invalid, skip this iteration
      continue;
    }

    // If somewhere before in this prediction, we skipped over a user filled in square...
    if (prediction.slice(0, predictionIdx).some(num => num === NCV_INIT_FILLED)) {
      // It is invalid, skip this iteration
      continue;
    }

    // If the prediction is complete and we missed a user filled in square...
    if (numsIdx === nums.length - 1 && prediction.slice(predictionIdx).some(num => num === NCV_INIT_FILLED)) {
      // It is invalid, skip this iteration
      continue;
    }

    // If this was not the final number group...
    if (numsIdx < nums.length - 1) {
      // Continue iterating
      recurseCalcNumbersPrediction(nums, numsIdx + 1, prediction, predictionIdx + 1);
    }
    // If all number groups have been filled in...
    else {
      // If the final numbers prediction has not been set, set it
      if (finalNumbersPrediction.length === 0) {
        for (const val of prediction) {
          // Push values so we don't lose the reference
          finalNumbersPrediction.push(val);
        }
      }
      // If final number prediction has been set...
      else {
        // Intersect this prediction with the last one
        finalNumbersPrediction = intersect(finalNumbersPrediction, prediction, NCV_NONE);
      }
    }
  }
}

/**
 * Verifies if the game board has the winning solution
 * There's gotta be a more efficient way to do this, but this works for now
 * @returns True if win, false otherwise
 */
function checkWin() {
  for (let i = 0; i < gameBoardHeight; i++) {
    for (let j = 0; j < gameBoardWidth; j++) {
      if ((gameBoard[i][j] === CV_FILLED && solution[i][j][3] !== 1) ||
        (gameBoard[i][j] !== CV_FILLED && solution[i][j][3] === 1)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Sets the win condition
 */
function setWin() {
  gameOver = true;

  // Remove cursor
  document.getElementById(getCellId(selectedPos)).classList.remove(CLASS_CELL_SELECTED);

  // Add win condition
  const gameBoardElem = document.getElementById(ID_GAME_BOARD);
  const winElem = document.createElement(ELEM_DIV);
  winElem.classList.add(CLASS_WIN);
  winElem.innerText = 'You win!';
  gameBoardElem.appendChild(winElem);
}

/**
 * Sets the numbers statuses based on the numbers prediction
 * @param {boolean} rowCol If true, row. Otherwise, column
 * @param {number} index The row index if row. Column index if column
 * @param {Array<number>} nums The numbers from the given row or column
 */
function setNumberStatusFromPrediction(rowCol, index, nums) {
  // If we have anything that can be filled in, tint the numbers blue
  let blue = false;
  // Keeps track of all the indices that have been solved
  let solvedIndices = [];

  // In Picross, if all of the number groups are found the row is automatically filled
  let numberGroupsFound = true;
  for (const num of finalNumbersPrediction) {
    // If there is a number group...
    if (num > 0) {
      // And that number group contains non-filled in squares
      if (num % 2 === 0) {
        // It is not complete
        numberGroupsFound = false;
        break;
      }
    }
    // If there is an unknown square...
    else if (num === NCV_NONE) {
      // It is not complete
      numberGroupsFound = false;
      break;
    }
    // If the player can add an X, turn the row blue
    else if (num === NCV_X) {
      blue = true;
    }
  }

  // If all the number groups were not found, do the standard number statuses
  if (!numberGroupsFound) {
    // Loop through all elements in the prediction
    for (let i = 0; i < finalNumbersPrediction.length; i++) {
      const num = finalNumbersPrediction[i];
  
      // If an X should be placed here...
      if (num === NCV_X) {
        // Turn the numbers blue
        blue = true;
      }
      // If we encounter a number group...
      else if (num > 0) {
        // Get the number it is based on
        const rawNum = num >> 1;
        // A number group will be considered solved if...
        //  1. It is next to the wall or a player-placed X on its left side
        let solved = i === 0 || finalNumbersPrediction[i - 1] === NCV_INIT_X;
        do {
          // 2. The number group contains all filled squares
          if (finalNumbersPrediction[i] % 2 === 0) {
            solved = false;
            blue = true;
          }
          i++;
        }
        while (i < finalNumbersPrediction.length &&
            finalNumbersPrediction[i] >= rawNum << 1 &&
            finalNumbersPrediction[i] <= (rawNum << 1) + 1);
  
        if (solved) {
          // 3. It is next to the wall or a player-placed X on its right side
          if (i === finalNumbersPrediction.length || finalNumbersPrediction[i] === NCV_INIT_X) {
            // If all is true, push the number to the solved indices
            solvedIndices.push(rawNum - 1);
          }
        }
        // Back the i value up
        i -= 1;
      }
    }
  }

  // Go through all numbers and set the statuses
  for (let i = 0; i < nums.length; i++) {
    const status = blue ? (
      numberGroupsFound || solvedIndices.includes(i) ? NS_FILLED_BLUE : NS_BLUE
    ) : (
      numberGroupsFound || solvedIndices.includes(i) ? NS_FILLED : NS_NONE
    );
    setNumberStatus(status, rowCol, index, i);
  }
}

/**
 * Sets the status of a given number value
 * @param {string} status The number status of the given number
 * @param {boolean} rowCol If true, numbers row. Otherwise, numbers column
 * @param {number} index The row index of the numbers if row numbers. Column index if column numbers
 * @param {number} numberIndex The index of the number inside the numbers row/column
 */
function setNumberStatus(status, rowCol, index, numberIndex) {
  const id = getNumbersId(rowCol, index, numberIndex);
  const numberElem = document.getElementById(id);
  numberElem.classList = [];
  switch (status) {
    case NS_FILLED:
      numberElem.classList.add(CLASS_NUMBERS_FILLED);
      break;
    case NS_FILLED_BLUE:
      numberElem.classList.add(CLASS_NUMBERS_FILLED_BLUE);
      break;
    case NS_BLUE:
      numberElem.classList.add(CLASS_NUMBERS_BLUE);
      break;
  }
}
