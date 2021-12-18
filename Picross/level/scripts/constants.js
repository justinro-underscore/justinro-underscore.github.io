// IDs
const ID_GAME_BOARD = 'game-board';
const ID_GAME_TABLE = 'game-table';
const ID_TIMER = 'timer';
const ID_SCREEN_OVERLAY = 'screen-overlay';
const ID_LEVEL_NAME = 'level-name';
const ID_LEVEL_LOCATION = 'level-location';
const ID_LEVEL_QUOTE = 'level-quote';
const ID_FINAL_IMG = 'final-img';
const ID_REF_IMG = 'ref-img';

// Classes
const CLASS_CELL = 'cell';
const CLASS_CELL_SELECTED = 'cell-selected';
const CLASS_CELL_FILLED = 'cell-filled';
const CLASS_CELL_X_ED = 'cell-x-ed';
const CLASS_CELL_MARKED = 'cell-marked';
const CLASS_CELL_MISSED = 'cell-missed';
const CLASS_NUMBERS = 'numbers';
const CLASS_NUMBERS_SELECTED = 'numbers-selected';
const CLASS_NUMBERS_ROW = 'numbers-row';
const CLASS_NUMBERS_COL = 'numbers-col';
const CLASS_NUMBERS_FILLED = 'numbers-filled';
const CLASS_NUMBERS_FILLED_BLUE = 'numbers-filled-blue';
const CLASS_NUMBERS_BLUE = 'numbers-blue';
const CLASS_WIN = 'win';

// Cell Content
const CELL_NONE = '&nbsp';
const CELL_X = 'X'; // TODO Change to unicode
const CELL_MARK = '?' // TODO Change to unicode for diamond

// Number Statuses
const NS_NONE = 'none';
const NS_FILLED = 'filled';
const NS_FILLED_BLUE = 'filledBlue';
const NS_BLUE = 'blue';

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

// Internal Actions
const IA_ADD_FILL = 'add fill';
const IA_ADD_X = 'add x';
const IA_ADD_MARK = 'add mark';
const IA_ERASE = 'erase';
const IA_ERASE_MARK = 'erase mark';
