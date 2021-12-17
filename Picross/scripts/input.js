/**
 * Binds the event listeners that control input
 */
function bindListeners() {
  document.addEventListener('keydown', keydownListener);
}

/**
 * Handles the keydown input events
 * Navigates across the levels
 * @param {KeyboardEvent} event The keydown event
 */
function keydownListener(event) {
  const keyCode = event.key;
  if (NAVIGATION_KEYS.includes(keyCode)) {
    event.preventDefault();
    moveSelected(keyCode);
  }
  else if (ACTION_KEYS.includes(keyCode) && !event.repeat) {
    takeAction(keyCode);
  }
}