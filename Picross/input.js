// Defines the current nav/action key being held down
let currNavKey;
let currActionKey;
// Defines the timeout ID of the navigation step
let navTimeoutId;

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
  // If the key is being held down, ignore the event
  if (event.repeat) {
    return;
  }

  // Only process input if game is not over
  if (!gameOver) {
    const keyCode = event.key;
    if (NAVIGATION_KEYS.includes(keyCode)) {
      event.preventDefault();

      currNavKey = keyCode;
      navStep(false);

      if (navTimeoutId) {
        clearTimeout(navTimeoutId);
      }
      navTimeoutId = setTimeout(navStep, NAV_INITIAL_TIMEOUT);
    }
    // Only run the action event once
    else if (ACTION_KEYS.includes(keyCode)) {
      currActionKey = keyCode;
      takeAction(keyCode);
    }
  }
}

/**
 * Takes a step of navigation
 * @param {boolean} repeating If true, that means this is a repeated action
 */
function navStep(repeating = true) {
  moveSelected(currNavKey, repeating);
  // If an action key is currently being pressed down...
  if (currActionKey) {
    // Execute the current action
    takeInternalAction();
  }

  if (repeating) {
    navTimeoutId = setTimeout(navStep, NAV_SUBSEQUENT_TIMEOUT);
  }
}

/**
 * Handles the keyup input events
 * Ends the current action being taken
 * @param {KeyboardEvent} event The keyup event
 */
function keyupListener(event) {
  // Only process input if game is not over
  if (!gameOver) {
    const keyCode = event.key;
    if (currNavKey === keyCode) {
      clearInterval(navTimeoutId);
      currNavKey = null;
    }
    else if (currActionKey === keyCode) {
      currActionKey = null;
    }
  }
}