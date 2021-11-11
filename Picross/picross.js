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

/**
 * Runs when the page loads, initializes game
 */
function onLoad() {
  bindListeners();
  loadLevel(0);
}

/**
 * Binds the event listeners. This is just keydown for now
 */
function bindListeners() {
  document.addEventListener('keydown', event => {
    if (!gameOver) {
      // TODO Add debounce
      // TODO Add ability to hold action key while moving
      // TODO Make sure that the arrow keys don't scroll the page
      const keyCode = event.key;
      if (NAVIGATION_KEYS.includes(keyCode)) {
        moveSelected(keyCode);
      }
      else if (ACTION_KEYS.includes(keyCode)) {
        takeAction(keyCode);
      }
    }
  });
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
      cellElem.innerHTML = '&nbsp';
      rowElem.appendChild(cellElem);
    }
    gameTable.appendChild(rowElem);
  }
  gameBoard.appendChild(gameTable);
}

/**
 * Creates the game table using level values
 */
function prefillCells() {
  for (let row = 0; row < gameBoardHeight; row++) {
    let action = null;
    if (rowValues[row][0] === 0) {
      action = ACTION_X;
    }
    else if (rowValues[row][0] === gameBoardWidth) {
      action = ACTION_FILL;
    }
    if (action) {
      for (let col = 0; col < gameBoardWidth; col++) {
        takeActionOnCell(action, [col, row]);
      }
      setNumberStatus(NS_FILLED, true, row, 0);
    }
  }
  for (let col = 0; col < gameBoardWidth; col++) {
    let action = null;
    if (colValues[col][0] === 0) {
      action = ACTION_X;
    }
    else if (colValues[col][0] === gameBoardHeight) {
      action = ACTION_FILL;
    }
    if (action) {
      for (let row = 0; row < gameBoardHeight; row++) {
        takeActionOnCell(action, [col, row]);
      }
      setNumberStatus(NS_FILLED, false, col, 0);
    }
  }
}

/**
 * Moves the selected cell
 * @param {string} keyCode The key code of the key input
 */
function moveSelected(keyCode) {
  const id = getCellId(selectedPos);
  document.getElementById(id).classList.remove(CLASS_CELL_SELECTED);

  // Translate the key code to a direction
  const navDirection = CONTROL_MAPPING[NAVIGATION][keyCode];
  switch (navDirection) {
    case NAV_UP:
      selectedPos[1]--;
      if (selectedPos[1] < 0) {
        selectedPos[1] = gameBoardHeight - 1;
      }
      break;
    case NAV_RIGHT:
      selectedPos[0]++;
      if (selectedPos[0] >= gameBoardWidth) {
        selectedPos[0] = 0;
      }
      break;
    case NAV_DOWN:
      selectedPos[1]++;
      if (selectedPos[1] >= gameBoardHeight) {
        selectedPos[1] = 0;
      }
      break;
    case NAV_LEFT:
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
  const action = CONTROL_MAPPING[ACTION][actionKeyCode];

  const selectedCellStatus = gameBoard[selectedPos[1]][selectedPos[0]];
  // If we should just toggle the cell and not take an action
  const toggle = (selectedCellStatus === CV_FILLED && action === ACTION_FILL) ||
    (selectedCellStatus === CV_X_ED && action === ACTION_X) ||
    (selectedCellStatus === CV_MARKED && action === ACTION_MARK)

  // Wipe the slate clean
  const id = getCellId(selectedPos);
  const cell = document.getElementById(id);
  cell.classList.remove(CLASS_CELL_FILLED);
  cell.classList.remove(CLASS_CELL_X_ED);
  cell.classList.remove(CLASS_CELL_MARKED);
  cell.innerHTML = CELL_NONE;
  gameBoard[selectedPos[1]][selectedPos[0]] = CV_NONE;

  // If we are toggling, we already wiped the class list and set the cell content to none
  // If we are not toggling, take an action
  if (!toggle) {
    takeActionOnCell(action, selectedPos);
  }

  // Update the numbers on this row and column
  updateNumbers(selectedPos);

  // Checks if the puzzle has been solved
  if (checkWin()) {
    setWin();
  }
}

/**
 * TODO Come up with a better name for this function
 * Applies an action onto a given cell with the given position
 * @param {string} action The action to take
 * @param {Array<number>} cellPos [row, col]
 */
function takeActionOnCell(action, cellPos) {
  const id = getCellId(cellPos);
  const cell = document.getElementById(id);

  // Take the action
  switch (action) {
    case ACTION_FILL:
      cell.classList.add(CLASS_CELL_FILLED);
      gameBoard[cellPos[1]][cellPos[0]] = CV_FILLED;
      break;
    case ACTION_X:
      cell.classList.add(CLASS_CELL_X_ED);
      cell.innerText = CELL_X;
      gameBoard[cellPos[1]][cellPos[0]] = CV_X_ED;
      break;
    case ACTION_MARK:
      cell.classList.add(CLASS_CELL_MARKED);
      cell.innerText = CELL_MARK;
      gameBoard[cellPos[1]][cellPos[0]] = CV_MARKED;
      break;
  }
}

/**
 * Updates the numbers on the row and column
 * @param {Array<number>} xy [row, col] of the recently changed cell
 */
function updateNumbers(xy) {
  // TODO Fill this in... this is where it gets difficult
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
 * Sets the status of a given number value
 * @param {string} status The number status of the given number
 * @param {boolean} rowCol If true, numbers row. Otherwise, numbers column
 * @param {number} index The row index of the numbers if row numbers. Column index if column numbers
 * @param {number} numberIndex The index of the number inside the numbers row/column
 */
function setNumberStatus(status, rowCol, index, numberIndex) {
  const id = getNumbersId(rowCol, index, numberIndex);
  const numberElem = document.getElementById(id);
  numberElem.classList.remove(CLASS_NUMBERS_FILLED);
  numberElem.classList.remove(CLASS_NUMBERS_AVAILABLE);
  switch (status) {
    case NS_FILLED:
      numberElem.classList.add(CLASS_NUMBERS_FILLED);
      break;
    case NS_AVAILABLE:
      numberElem.classList.add(CLASS_NUMBERS_AVAILABLE);
      break;
  }
}
