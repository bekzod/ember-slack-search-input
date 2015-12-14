import Ember from 'ember';
import Token from './token';

const { getProperties, get } = Ember;

export const KEYS = {
  ESC: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  TAB: 9
};

export function sanitizeTokens(tokens) {
  return tokens.reduce(function(sum, token) {
    let t = sanitizeToken(token);
    if (t) {
      if (sum[t.modifier]) {
        sum[t.modifier].push(t);
      } else {
        sum[t.modifier] = [t];
      }
    }
    return sum;
  }, Object.create(null));
}

export function sanitizeToken(token) {
  let type = get(token, 'type');
  if (type !== 'space' && type !== 'default') {
    return getProperties(token, 'model', 'fullText', 'modifier', 'value');
  }
  return null;
}

export function getDefaultContent(configHash, modifiersList) {
  let key, val, list;
  let allList = [];

  for (key in configHash) {
    val = configHash[key];
    if (val.type === 'list' && val.content) {
      list = val.content.map(function(item) {
        return {
          label: item.label,
          value: key + item.value,
          fullText: true,
          section: val.sectionTitle
        };
      });
      allList = allList.concat(list);
    }
  }
  var modifiers = modifiersList.map(function(item) {
    item.section = 'modifiers';
    return item;
  });
  return allList.concat(modifiers);
}

function getAllModifiers(configHash) {
  let modifiers = [];
  for (let key in configHash) {
    let config = configHash[key];
    let section = config.type === 'date' ? 'time' : 'others';
    modifiers.push({
      value: key,
      label: config.defaultHint,
      modifier: true,
      section
    });
  }
  return modifiers;
}

export function tokenize(text, configHash) {
  let tokens = [];
  let mem = '';
  let i = 0;

  for (i = 0; i <= text.length; i++) {
    var character = text[i];
    if ((character === ' ' || !character)) {
      if (mem) {
        tokens.push(Token.create({ configHash, fullText: mem }));
      }
      if (character) {
        tokens.push(Token.create({ configHash, fullText: ' ' }));
      }
      mem = '';
    } else if (character !== ' ') {
      mem += character;
    }
  }
  return tokens;
}

export function prepareConig(configHash) {
  let modifiers = getAllModifiers(configHash);
  configHash['+'] = { type: 'modifier-list', content: modifiers };
  configHash['_default'] = {
    type: 'default', content: getDefaultContent(configHash, modifiers)
  };
  return configHash;
}

export function deserializeQueryString(string, configHash) {
  return sanitizeTokens(tokenize(string, configHash));
}


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
