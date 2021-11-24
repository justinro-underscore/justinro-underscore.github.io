// Defines the current action key being held down
let currActionKey;

/**
 * Binds the event listeners that control input
 */
function bindListeners() {
  document.addEventListener('keydown', keydownListener);
  document.addEventListener('keyup', keyupListener);
}

/**
 * Handles the keydown input events
 * Basically kicks off any interaction with the game
 * @param {KeyboardEvent} event The keydown event
 */
function keydownListener(event) {
  if (!gameOver) {
    const keyCode = event.key;
    if (NAVIGATION_KEYS.includes(keyCode)) {
      // NOTE: I changed this to debounce but didn't like the way it felt.
      //  It's currently on branch picross-debounce-input, if I want to come back to it
      event.preventDefault();
      moveSelected(keyCode, event.repeat);
      // If an action key is currently being pressed down...
      if (currActionKey) {
        // Execute the current action
        takeInternalAction();
      }
    }
    // Only run the action event once
    else if (ACTION_KEYS.includes(keyCode) && !event.repeat) {
      currActionKey = keyCode;
      takeAction(keyCode);
    }
  }
}

/**
 * Handles the keyup input events
 * Ends the current action being taken
 * @param {KeyboardEvent} event The keyup event
 */
function keyupListener(event) {
  if (!gameOver) {
    const keyCode = event.key;
    if (ACTION_KEYS.includes(keyCode) && currActionKey === keyCode) {
      currActionKey = null;
    }
  }
}