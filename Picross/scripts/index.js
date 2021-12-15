/**
 * Loads all of the levels into the main menu
 */
function onLoad() {
  // Get reference to the levels table
  const levelsContainer = document.getElementById('levels');
  levelsContainer.style.gridTemplateColumns = new Array(LEVELS_ROW_COUNT).fill(`${100 / LEVELS_ROW_COUNT}%`).join(' ');

  // Go through all levels and add them to the levels container
  for (let i = 0; i < levels.length; i++) {
    // Add link to the level
    const link = document.createElement(ELEM_ANCHOR);
    link.classList.add(CLASS_LEVEL_CELL);
    link.setAttribute(ATTR_HREF, `./level/level.html#${i}`);

    // TODO Make cell content more interesting
    const cellContent = document.createElement(ELEM_DIV);
    cellContent.classList.add(CLASS_LEVEL_CELL_CONTENT);
    cellContent.innerHTML = `Level ${i}`;
    link.appendChild(cellContent);

    // Add the level cell to the current row
    levelsContainer.appendChild(link);
  }
}