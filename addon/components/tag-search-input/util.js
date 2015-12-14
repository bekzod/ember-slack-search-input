
export const KEYS = {
  ESC: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  TAB: 9
};

export function getMatch(subString, array, key) {
  return array
    .filter(function(string) {
      if (key) { string = string[key]; }
      return string.toLowerCase().indexOf(subString.toLowerCase()) > -1 &&
        subString.length < string.length;
    })
    .sortBy('length');
}

export function setCursor(node, pos) {
  if (node) {
    if (node.createTextRange) {
      var textRange = node.createTextRange();
      textRange.collapse(true);
      textRange.moveEnd(pos);
      textRange.moveStart(pos);
      textRange.select();
      return true;
    } else if (node.setSelectionRange) {
      node.setSelectionRange(pos,pos);
      return true;
    }
  }
  return false;
}
