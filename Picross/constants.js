// Elements
const ELEM_DIV = 'div';
const ELEM_TABLE = 'table';
const ELEM_TABLE_ROW = 'tr';
const ELEM_TABLE_CELL = 'td';
const ELEM_SPAN = 'span';

// IDs
const ID_GAME_BOARD = 'game-board';
const ID_GAME_TABLE = 'game-table';

// Classes
const CLASS_CELL = 'cell';
const CLASS_CELL_SELECTED = 'cell-selected';
const CLASS_CELL_FILLED = 'cell-filled';
const CLASS_CELL_X_ED = 'cell-x-ed';
const CLASS_CELL_MARKED = 'cell-marked';
const CLASS_NUMBERS = 'numbers';
const CLASS_NUMBERS_ROW = 'numbers-row';
const CLASS_NUMBERS_COL = 'numbers-col';
const CLASS_NUMBERS_FILLED = 'numbers-filled';
const CLASS_NUMBERS_AVAILABLE = 'numbers-available';
const CLASS_WIN = 'win';

// Attributes
const ATTR_ID = 'id';

// Cell Content
const CELL_NONE = '&nbsp';
const CELL_X = 'X'; // TODO Change to unicode
const CELL_MARK = '?' // TODO Change to unicode for diamond

// Key Codes
const KC_UP = 'ArrowUp';
const KC_RIGHT = 'ArrowRight';
const KC_DOWN = 'ArrowDown';
const KC_LEFT = 'ArrowLeft';
const KC_W = 'w';
const KC_A = 'a';
const KC_S = 's';
const KC_D = 'd';
const KC_Z = 'z';
const KC_X = 'x';
const KC_C = 'c';

// Controls
const NAVIGATION = 'navigation';
const NAV_UP = 'nav up';
const NAV_RIGHT = 'nav right';
const NAV_DOWN = 'nav down';
const NAV_LEFT = 'nav left';
const ACTION = 'action';
const ACTION_FILL = 'fill';
const ACTION_X = 'x';
const ACTION_MARK = 'mark';
// This isn't actually used, this is just easier to visualize
const CONTROLS = {
  [NAVIGATION]: {
    [NAV_UP]: [KC_UP, KC_W],
    [NAV_RIGHT]: [KC_RIGHT, KC_D],
    [NAV_DOWN]: [KC_DOWN, KC_S],
    [NAV_LEFT]: [KC_LEFT, KC_A],
  },
  [ACTION]: {
    [ACTION_FILL]: [KC_Z],
    [ACTION_X]: [KC_X],
    [ACTION_MARK]: [KC_C],
  }
}
// Reverse the controls to keyCode => action to make code simpler
const CONTROL_MAPPING = Object.fromEntries(Object.entries(CONTROLS).map(([action, mapping]) =>
  [action, Object.fromEntries(Object.entries(mapping).flatMap(([action, keyCodes]) =>
    keyCodes.map(keyCode => [keyCode, action])))]));
const NAVIGATION_KEYS = Object.keys(CONTROL_MAPPING[NAVIGATION]);
const ACTION_KEYS = Object.keys(CONTROL_MAPPING[ACTION]);

// Number Statuses
const NS_NONE = 'none';
const NS_FILLED = 'filled';
const NS_AVAILABLE = 'available';

// Internal Cell Values
const CV_NONE = 'none';
const CV_FILLED = 'filled';
const CV_X_ED = 'x-ed';
const CV_MARKED = 'marked';

// Numbers Calculation Values
const NCV_NONE = -1;
const NCV_INIT_X = -2;
const NCV_INIT_FILLED = -3;
const NCV_X = -4;
