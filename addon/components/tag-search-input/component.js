import Ember from 'ember';
import Token from './token';
import layout from './template';
import { setCursor, KEYS } from './util';

const { set, on, run, getProperties, computed, get } = Ember;

function sanitizeTokens(tokens) {
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

function sanitizeToken(token) {
  let type = get(token, 'type');
  if (type !== 'space' && type !== 'default') {
    return getProperties(token, 'model', 'fullText', 'modifier', 'value');
  }
  return null;
}

function getDefaultContent(configHash, modifiersList) {
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

function tokenize(text, configHash) {
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

function prepareConig(configHash) {
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

export default Ember.Component.extend({
  layout: layout,
  classNames: ['tag-search-input'],
  cursorLocation: -1,
  // used to pass event to child components
  enterClicked: false,
  upClicked: false,
  downClicked: false,
  isPopupHidden: false,
  isPopupFocused: false, // when popup focused not triggering enter event when enter clicked

  configHash: {},
  firstTimeFocus: true,
  showHelp: computed('inputValue', 'cursorLocation', 'firstTimeFocus', function() {
    return !get(this, 'inputValue') &&
      get(this, 'cursorLocation') !== -1 &&
      get(this, 'firstTimeFocus');
  }),

  tokenConfig: computed('configHash', function() {
    return prepareConig(get(this, 'configHash'));
  }),

  tokenTypes: ['default', 'modifier-list', 'space'],
  proxyValue: '',
  inputValue: computed({
    set(key, val) {
      set(this, 'proxyValue', val);
      return val;
    },
    get() {
      return '';
    }
  }),

  popupComponent: computed('currentToken', 'currentToken.type', function() {
    let type = get(this, 'currentToken.type');
    set(this, 'isPopupFocused', false);
    if (type && (type !== 'space')) {
      return 'tag-search-input.hint-popup.' + (type === 'modifier-list' ? 'list' : type);
    }
  }),

  onInitComponent: on('didInsertElement', function() {
    run.schedule('afterRender', this, function() {
      this._mainInput = this.$('.main-input');
      this._background = this.$('.background-container');
      this._mouseWheelListener = run.bind(this, 'onMouseMove');
      this._mainInput.on("mousewheel DOMMouseScroll", this._mouseWheelListener); // maybe to do with custom events ?
    });
  }),

  teadDown: on('willRemoveElement', function() {
    this._mainInput.off("mousewheel DOMMouseScroll", this._mouseWheelListener);
  }),

  onMouseMove(e) {
    this.scrollBackground(e.target.scrollLeft);
  },

  tokens: computed('inputValue', 'tokenConfig', function() {
    return tokenize(get(this, 'inputValue'), get(this, 'tokenConfig'));
  }),

  getTokensString() {
    let tokens = get(this, 'tokens');
    return tokens
      .reduce(function(sum, token) {
        sum += get(token, 'fullText');
        return sum;
      }, '');
  },

  setCursor(newLocation) {
    set(this, 'cursorLocation', newLocation);
    run.schedule('afterRender', this, function() {
      setCursor(this._mainInput[0], newLocation);
    });
  },

  scrollInputAndBackground(amount) {
    run.schedule('afterRender', this, function() {
      this._mainInput[0].scrollLeft = amount;
      this._background.scrollLeft(this._mainInput[0].scrollLeft);
    });
  },

  scrollBackground(amount) {
    run.schedule('afterRender', this, function() {
      this._background.scrollLeft(amount);
    });
  },

  currentTokenCursor: computed('cursorLocation', 'currentToken', function() {
    let currentToken = get(this, 'currentToken');
    let cursorLocation = get(this, 'cursorLocation');
    if (currentToken) {
      let tokenCursorEnd = this.getTokenEndCursorPos(currentToken);
      return cursorLocation - (tokenCursorEnd - get(currentToken, 'length'));
    } else {
      return -1;
    }
  }),

  currentToken: computed('tokenIndex', 'tokens', function() {
    return get(this, 'tokens')[get(this, 'tokenIndex')];
  }),

  tokenIndex: computed('cursorLocation', 'tokens.[]', function() {
    let cursorLocation = get(this, 'cursorLocation');
    let sumIndex = 0;
    let token, startIndex, endIndex;
    let tokens = get(this, 'tokens');
    let length = get(tokens, 'length');
    for (var i = 0; i < length; i++) {
      token = tokens[i];
      startIndex = sumIndex;
      endIndex = get(token, 'length') + startIndex;
      sumIndex = endIndex;
      if (startIndex < cursorLocation && cursorLocation <= endIndex) {
        return i;
      }
    }
    return -1;
  }),

  hintValue: computed('isLastTokenSelected', 'currentToken.hint', function() {
    if (get(this, 'isLastTokenSelected')) {
      return get(this, 'currentToken.hint');
    }
  }),

  isLastTokenSelected: computed('tokenIndex', 'tokens.length', function() {
    let tokensCount = get(this, 'tokens.length');
    return tokensCount && (tokensCount - 1) === get(this, 'tokenIndex');
  }),

  getTokenEndCursorPos(token) {
    let tokens = get(this, 'tokens');
    let sum = 0;
    let t;
    for (var i = 0; i < tokens.length; i++) {
      t = tokens[i];
      sum += get(t, 'length');
      if (t === token) { break; }
    }
    return sum;
  },

  actions: {
    inputPaste({ target }) {
      run.next(this, function() {
        set(this, 'inputValue', target.value);
        set(this, 'cursorLocation', target.selectionStart);
        this.scrollBackground(target.scrollLeft);
      });
    },

    inputCut({ target }) {
      run.next(this, function() {
        set(this, 'inputValue', target.value);
        set(this, 'cursorLocation', target.selectionStart);
        this.scrollBackground(target.scrollLeft);
      });
    },

    concatToInputValue(text) {
      let newStr = get(this, 'inputValue') + text;
      set(this, 'inputValue', newStr);
      this._mainInput.focus();
      set(this, 'cursorLocation', newStr.length - 1);
      return false;
    },

    changeTokenModel(token, model, shouldMoveCursor) {
      let tokenType = get(token, 'type');
      set(token, 'model', model);
      let tokens = get(this, 'tokens');
      let isLastTokenSelected = tokens.indexOf(token) === get(this, 'tokenIndex');
      let cursorLocation;
      if (shouldMoveCursor) {
        if (!model.modifier && isLastTokenSelected) {
          tokens.pushObject(Token.create({ fullText: ' ' }));
        }
        cursorLocation = this.getTokenEndCursorPos(token) + (model.modifier ? 0 : 1);
      } else {
        cursorLocation = get(this, 'cursorLocation');
      }

      let tokensString = this.getTokensString();
      set(this, 'proxyValue', tokensString);
      this.setCursor(cursorLocation);
      if (isLastTokenSelected) {
        this.scrollInputAndBackground(Number.MAX_VALUE);
      } else {
        this.scrollBackground(this._mainInput.scrollLeft());
      }

      if ((tokenType !== 'default' || model.fullText) && this.attrs.modefierAutoComplete) {
        this.attrs.modefierAutoComplete(tokensString, sanitizeToken(token));
      }
      if (this.attrs.valueChange) {
        this.attrs.valueChange(tokensString);
      }
    },

    onFocusIn() {
      set(this, 'firstTimeFocus', true);
      if (this.attrs['focus-in']) {
        this.attrs['focus-in']();
      }
    },

    onFocusOut() {
      set(this, 'cursorLocation', -1);
      this.scrollBackground(0);
      if (this.attrs['focus-out']) {
        this.attrs['focus-out']();
      }
    },

    onKeyDown(value, e) {
      const { target, keyCode } = e;
      if (keyCode === KEYS.ENTER) {
        e.preventDefault();
        this.toggleProperty('enterClicked');
        if (!get(this, 'isPopupFocused') && this.attrs.enter) {
          this.attrs.enter();
        }
      } else if (keyCode === KEYS.ESC) {
        this._mainInput.blur();
      } else if (keyCode === KEYS.UP) {
        e.preventDefault();
        this.toggleProperty('upClicked');
      } else if (keyCode === KEYS.DOWN) {
        e.preventDefault();
        this.toggleProperty('downClicked');
      } else if (keyCode === KEYS.TAB) {
        e.preventDefault();
        let currentToken = get(this, 'currentToken');
        let tokenType = get(currentToken, 'type'); // token type before autocomplete
        if (currentToken.autoComplete()) {
          let hasVal = get(currentToken, 'value');
          let tokens = get(this, 'tokens');
          let isLastTokenSelected = get(this, 'isLastTokenSelected');
          let cursorLocation = this.getTokenEndCursorPos(currentToken);
          if (hasVal) {
            if (isLastTokenSelected) {
              tokens.pushObject(Token.create({ fullText: ' ' }));
            }
            cursorLocation += 1;
          }

          let tokensString = this.getTokensString();
          set(this, 'proxyValue', tokensString);
          this.setCursor(cursorLocation);
          if (isLastTokenSelected) {
            this.scrollInputAndBackground(Number.MAX_VALUE);
          } else {
            this.scrollBackground(target.scrollLeft);
          }

          if (tokenType !== 'default' && this.attrs.modefierAutoComplete) {
            this.attrs.modefierAutoComplete(tokensString, sanitizeToken(currentToken));
          }
          if (this.attrs.valueChange) {
            this.attrs.valueChange(tokensString);
          }
        } else if (get(currentToken, 'type') !== 'date') {
          this.toggleProperty('downClicked');
        }
      } else {
        run.next(this, function() {
          let val = target.value;
          if (val !== get(this, 'inputValue')) {
            set(this, 'inputValue', val);
            if (this.attrs.valueChange) {
              this.attrs.valueChange(val);
            }
          }
          set(this, 'cursorLocation', target.selectionStart);
          this.scrollBackground(target.scrollLeft);
          set(this, 'firstTimeFocus', false);
        });
      }
    },

    onClick({ target }) {
      this.scrollBackground(target.scrollLeft);
      set(this, 'cursorLocation', target.selectionStart);
    }
  }

});
