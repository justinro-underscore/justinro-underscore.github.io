// TODO Replace most instances of for loop with forEach

// The position of the selected cell
let selectedPos;
// The width of the game board
let gameBoardWidth;
// The height of the game board
let gameBoardHeight;
// The numbers values for each row
let rowValues;
// The numbers values for each column
let colValues;

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
    // TODO Add debounce
    // TODO Add ability to hold action key while moving
    // TODO Make sure that the arrow keys don't scroll the page
    const keyCode = event.key;
    const dir = KC_ARROWS.indexOf(keyCode);
    if (dir >= 0) {
      moveSelected(dir);
    }
    else if (VALID_ACTION_KC.includes(keyCode)) {
      takeAction(keyCode);
    }
  });
}

/**
 * Loads the specified level into the game board
 * @param {number} index The index of the level to play 
 */
function loadLevel(index) {
  // Get data
  const data = levels[index];
  gameBoardHeight = data.length;
  gameBoardWidth = data[0].length;

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
        if (row ? data[i][j] : data[j][i] === 1) {
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
      action = KC_X;
    }
    else if (rowValues[row][0] === gameBoardWidth) {
      action = KC_Z;
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
      action = KC_X;
    }
    else if (colValues[col][0] === gameBoardHeight) {
      action = KC_Z;
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
 * @param {number} dir The direction to move (assumes valid range)
 *    0 - Up
 *    1 - Right
 *    2 - Down
 *    3 - Left
 */
function moveSelected(dir) {
  const id = getCellId(selectedPos);
  document.getElementById(id).classList.remove(CLASS_CELL_SELECTED);

  switch (dir) {
    case 0:
      selectedPos[1]--;
      if (selectedPos[1] < 0) {
        selectedPos[1] = gameBoardHeight - 1;
      }
      break;
    case 1:
      selectedPos[0]++;
      if (selectedPos[0] >= gameBoardWidth) {
        selectedPos[0] = 0;
      }
      break;
    case 2:
      selectedPos[1]++;
      if (selectedPos[1] >= gameBoardHeight) {
        selectedPos[1] = 0;
      }
      break;
    case 3:
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
  const id = getCellId(selectedPos);
  const cell = document.getElementById(id);

  // If we should just toggle the cell and not take an action
  const toggle = (cell.classList.contains(CLASS_CELL_FILLED) && actionKeyCode === KC_Z) ||
    (cell.classList.contains(CLASS_CELL_X_ED) && actionKeyCode === KC_X) ||
    (cell.classList.contains(CLASS_CELL_MARKED) && actionKeyCode === KC_C)
  // Wipe the slate clean
  cell.classList.remove(CLASS_CELL_FILLED);
  cell.classList.remove(CLASS_CELL_X_ED);
  cell.classList.remove(CLASS_CELL_MARKED);
  cell.innerHTML = CELL_NONE;

  // If we are toggling, we already wiped the class list and set the cell content to none
  // If we are not toggling, take an action
  if (!toggle) {
    takeActionOnCell(actionKeyCode, selectedPos);
  }
}

/**
 * Applies an action onto a given cell with the given position
 * @param {string} actionKeyCode The key code of the action to take (assumes valid input)
 * @param {Array} cellPos [row, col]
 */
function takeActionOnCell(actionKeyCode, cellPos) {
  const id = getCellId(cellPos);
  const cell = document.getElementById(id);

  // Take the action
  switch (actionKeyCode) {
    case KC_Z: // Fill
      cell.classList.add(CLASS_CELL_FILLED);
      break;
    case KC_X: // X
      cell.classList.add(CLASS_CELL_X_ED);
      cell.innerText = CELL_X;
      break;
    case KC_C: // Mark
      cell.classList.add(CLASS_CELL_MARKED);
      cell.innerText = CELL_MARK;
      break;
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
