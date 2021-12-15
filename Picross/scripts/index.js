// Keeps track of how many levels there are
const NUM_LEVELS = levels.length;

// The current level that is selected
let currSelectedLevel;

/**
 * Sets up the game
 */
function onLoad() {
  bindListeners();
  loadGame();
}

/**
 * Loads all of the levels into the main menu
 */
function loadGame() {
  // Get reference to the levels table
  const levelsContainer = document.getElementById('levels');
  levelsContainer.style.gridTemplateColumns = new Array(LEVELS_ROW_COUNT).fill(`${100 / LEVELS_ROW_COUNT}%`).join(' ');

  // Go through all levels and add them to the levels container
  for (let i = 0; i < NUM_LEVELS; i++) {
    // Add cell that is a link to the next level
    const cell = document.createElement(ELEM_ANCHOR);
    cell.classList.add(CLASS_LEVEL_CELL);
    cell.setAttribute(ATTR_HREF, `./level/level.html#${i}`);
    cell.setAttribute(ATTR_ID, `level-${i}`);
    cell.addEventListener('mouseenter', () => setSelectedLevel(i));

    // TODO Make cell content more interesting
    const cellContent = document.createElement(ELEM_DIV);
    cellContent.classList.add(CLASS_LEVEL_CELL_CONTENT);
    cellContent.innerHTML = `Level ${i}`;
    cell.appendChild(cellContent);

    // Add the level cell to the current row
    levelsContainer.appendChild(cell);
  }

  // Set the selected level to be the first level
  setSelectedLevel(0);
}

/**
 * Sets the new currently selected level
 * @param {number} newSelectedLevel The new selected level index
 */
function setSelectedLevel(newSelectedLevel) {
  // If we're selecting the same level, ignore this event
  if (newSelectedLevel === currSelectedLevel) {
    return;
  }

  // Remove the previous selected cell (if it exists)
  if (currSelectedLevel !== undefined) {
    const selectedCell = document.getElementById(`level-${currSelectedLevel}`);
    selectedCell.classList.remove(CLASS_LEVEL_CELL_SELECTED);
  }

  // Set the new selected cell
  const newSelectedCell = document.getElementById(`level-${newSelectedLevel}`);
  newSelectedCell.classList.add(CLASS_LEVEL_CELL_SELECTED);
  currSelectedLevel = newSelectedLevel;

  // Update the level description content
  updateLevelDescriptionContent();
}

/**
 * Moves the selected level
 * @param {string} keyCode The key code of the key input
 */
function moveSelected(keyCode) {
  const navDirection = CONTROL_MAPPING[NAVIGATION][keyCode];
  let newSelectedLevel;
  switch (navDirection) {
    case NAV_UP:
      if (currSelectedLevel < LEVELS_ROW_COUNT) {
        return;
      }
      newSelectedLevel = currSelectedLevel - LEVELS_ROW_COUNT;
      break;
    case NAV_RIGHT:
      if (currSelectedLevel >= (NUM_LEVELS - 1)) {
        return;
      }
      newSelectedLevel = currSelectedLevel + 1;
      break;
    case NAV_DOWN:
      if (currSelectedLevel > ((Math.floor(NUM_LEVELS / LEVELS_ROW_COUNT) * LEVELS_ROW_COUNT) - 1)) {
        return;
      }
      // Jump to either the cell below or the last cell if no cells are below
      newSelectedLevel = Math.min(currSelectedLevel + LEVELS_ROW_COUNT, NUM_LEVELS - 1);
      break;
    case NAV_LEFT:
      if (currSelectedLevel <= 0) {
        return;
      }
      newSelectedLevel = currSelectedLevel - 1;
      break;
  }
  setSelectedLevel(newSelectedLevel);
}

/**
 * Updates the level description content to reflect the current selected level
 * TODO If the level is locked, set to default values
 */
function updateLevelDescriptionContent() {
  const levelInfo = levels[currSelectedLevel];

  // Set text content values
  document.getElementById(ID_LEVEL_DESC_TITLE).innerText = levelInfo.name;
  document.getElementById(ID_LEVEL_DESC_LOCATION).innerText = 'TODO';
  document.getElementById(ID_LEVEL_DESC_SIZE).innerText = `${levelInfo.width}x${levelInfo.height}`;
  document.getElementById(ID_LEVEL_DESC_TIME).innerText = 'TODO';

  // Set preview image
  document.getElementById(ID_LEVEL_DESC_PREVIEW_CONTAINER).classList.remove(CLASS_LEVEL_DESC_PREVIEW_UNKNOWN);
  const levelPreview = document.getElementById(ID_LEVEL_DESC_PREVIEW);
  levelPreview.style.display = '';
  levelPreview.setAttribute(ATTR_SRC, `levels/${levelInfo.file_path}`)
}
