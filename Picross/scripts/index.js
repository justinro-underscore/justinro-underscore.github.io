// Keeps track of how many levels there are
const NUM_LEVELS = levels.length;
// Keeps track of the cookies in the browser (shouldn't change on this screen)
const COOKIES = getCookies();

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
    // Create the level cell
    const cell = createLevelCell(i);

    // Add the level cell to the levels container
    levelsContainer.appendChild(cell);
  }

  // Set the selected level to be the first level
  setSelectedLevel(0);
}

/**
 * Creates a new level cell for the given index
 * @param {number} idx The index of the level this cell is for
 * @returns The cell element
 */
function createLevelCell(idx) {
  // Add cell that is a link to the next level
  const cell = document.createElement(ELEM_ANCHOR);
  cell.classList.add(CLASS_LEVEL_CELL);
  cell.setAttribute(ATTR_HREF, `./level/level.html#${idx}`);
  cell.setAttribute(ATTR_ID, `level-${idx}`);
  cell.addEventListener('mouseenter', () => setSelectedLevel(idx));

  // Create the content inside the level cell
  const cellContent = document.createElement(ELEM_DIV);
  cellContent.classList.add(CLASS_LEVEL_CELL_CONTENT);
  cell.appendChild(cellContent);

  // If the user has completed this level...
  if (Object.keys(COOKIES).includes(`${idx}`)) {
    // Create container for preview image, so that we can make the preview image smaller
    const cellImgContainer = document.createElement(ELEM_DIV);
    cellImgContainer.classList.add("level-cell-content-preview-container");
    cellContent.appendChild(cellImgContainer);

    // Create the preview image
    const cellImg = document.createElement(ELEM_IMG);
    cellImg.classList.add(CLASS_PREVIEW);
    cellImg.src = `levels/${levels[idx].file_path}`;
    cellImgContainer.appendChild(cellImg);
  }
  // If the user has not completed this level...
  else {
    // Set the preview to be a question mark
    cellContent.classList.add(CLASS_PREVIEW_UNKNOWN);
  }

  return cell;
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
 * If level selected has not been completed, show default values
 */
function updateLevelDescriptionContent() {
  const levelInfo = levels[currSelectedLevel];

  // Whether or not the user has completed the level
  const completed = Object.keys(COOKIES).includes(`${currSelectedLevel}`);

  // Set static text content values
  document.getElementById(ID_LEVEL_DESC_SIZE).innerText = `${levelInfo.width}x${levelInfo.height}`;

  // Set dynamic text content values
  let title = LEVEL_DESC_CONTENT_DEFAULT;
  let location = LEVEL_DESC_CONTENT_DEFAULT;
  let time = LEVEL_DESC_CONTENT_TIME_DEFAULT;
  // If level has been completed, then set the data
  if (completed) {
    title = levelInfo.name;
    location = levelInfo.location;
    time = formatTime(COOKIES[currSelectedLevel]);
  }
  document.getElementById(ID_LEVEL_DESC_TITLE).innerText = title;
  document.getElementById(ID_LEVEL_DESC_LOCATION).innerText = location;
  document.getElementById(ID_LEVEL_DESC_TIME).innerText = time;

  // Set preview image
  const levelPreviewContainer = document.getElementById(ID_LEVEL_DESC_PREVIEW_CONTAINER);
  const levelPreview = document.getElementById(ID_LEVEL_DESC_PREVIEW);
  if (completed) {
    levelPreviewContainer.classList.remove(CLASS_PREVIEW_UNKNOWN);
    levelPreview.style.display = '';
    levelPreview.src = `levels/${levelInfo.file_path}`;
    if (levelInfo.width > levelInfo.height) {
      levelPreview.style.width = 'calc(100% - 4px)';
    }
    else {
      levelPreview.style.width = '';
    }
  }
  else {
    levelPreviewContainer.classList.add(CLASS_PREVIEW_UNKNOWN);
    levelPreview.style.display = 'none';
    levelPreview.src = ``;
  }
}
