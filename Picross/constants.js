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
const KC_Z = 'z';
const KC_X = 'x';
const KC_C = 'c';
const KC_ARROWS = [KC_UP, KC_RIGHT, KC_DOWN, KC_LEFT];
const VALID_ACTION_KC = [KC_Z, KC_X, KC_C];

// Number Statuses
const NS_NONE = 'none';
const NS_FILLED = 'filled';
const NS_AVAILABLE = 'available';

// Internal Cell Values
const CV_NONE = 'none';
const CV_FILLED = 'filled';
const CV_X = 'x-ed';
