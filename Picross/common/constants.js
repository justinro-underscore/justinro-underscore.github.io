// Elements
const ELEM_DIV = 'div';
const ELEM_TABLE = 'table';
const ELEM_TABLE_ROW = 'tr';
const ELEM_TABLE_CELL = 'td';
const ELEM_SPAN = 'span';
const ELEM_IMG = 'img';
const ELEM_P = 'p';
const ELEM_ANCHOR = 'a';
const ELEM_BREAK = 'br';
const ELEM_ICON = 'i'; // I know this is an italics element, but I'm only using it for icons

// Classes
const CLASS_FONT_AWESOME = 'fa';
const CLASS_FONT_AWESOME_MAP_PIN = 'fa-map-pin';

// Attributes
const ATTR_ID = 'id';
const ATTR_SRC = 'src';
const ATTR_HEIGHT = 'height';
const ATTR_WIDTH = 'width';
const ATTR_HREF = 'href';

// Colors
const COLOR_LIGHT_RED = '#ffb1b1';
const COLOR_DARK_RED = '#9e0000';

// Key Codes
const KC_UP = 'ArrowUp';
const KC_RIGHT = 'ArrowRight';
const KC_DOWN = 'ArrowDown';
const KC_LEFT = 'ArrowLeft';
const KC_ENTER = 'Enter';
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
const ACTION_ENTER = 'enter';
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
    [ACTION_ENTER]: [KC_ENTER],
  }
}
// Reverse the controls to keyCode => action to make code simpler
const CONTROL_MAPPING = Object.fromEntries(Object.entries(CONTROLS).map(([action, mapping]) =>
  [action, Object.fromEntries(Object.entries(mapping).flatMap(([action, keyCodes]) =>
    keyCodes.map(keyCode => [keyCode, action])))]));
const NAVIGATION_KEYS = Object.keys(CONTROL_MAPPING[NAVIGATION]);
const ACTION_KEYS = Object.keys(CONTROL_MAPPING[ACTION]);

// Image Paths
const FINAL_IMG_PATH = 'levels/images/';
const REF_IMG_PATH = FINAL_IMG_PATH + 'ref/';
