import Ember from 'ember';
import Token from '../../token';
import layout from './template';
import { setCursor, KEYS, tokenize, prepareConig, sanitizeToken } from '../../util';

const { set, on, run, computed, get } = Ember;

export default Ember.Component.extend({
  layout: layout,
  classNames: ['slack-search-input'],
  cursorLocation: -1,
  // used to pass event to child components
  enterClicked: false,
  maxlength: 250,
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

  excludedTokenTypes: ['default', 'modifier-list', 'space'],
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

  popupComponent: computed('activeToken.type', function() {
    let type = get(this, 'activeToken.type');
    set(this, 'isPopupFocused', false);
    if (type && (type !== 'space')) {
      return 'slack-search-input/modifiers/' + (type === 'modifier-list' ? '-list' : '-' + type);
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

  tearDown: on('willRemoveElement', function() {
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

  activeTokenCursor: computed('cursorLocation', 'activeToken', function() {
    let activeToken = get(this, 'activeToken');
    let cursorLocation = get(this, 'cursorLocation');
    if (activeToken) {
      let tokenCursorEnd = this.getTokenEndCursorPos(activeToken);
      return cursorLocation - (tokenCursorEnd - get(activeToken, 'length'));
    } else {
      return -1;
    }
  }),

  activeToken: computed('activeTokenIndex', 'tokens', function() {
    return get(this, 'tokens')[get(this, 'activeTokenIndex')];
  }),

  activeTokenIndex: computed('cursorLocation', 'tokens.[]', function() {
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

  hintValue: computed('isLastTokenSelected', 'activeToken.hint', function() {
    if (get(this, 'isLastTokenSelected')) {
      return get(this, 'activeToken.hint');
    }
  }),

  isLastTokenSelected: computed('activeTokenIndex', 'tokens.length', function() {
    let tokensCount = get(this, 'tokens.length');
    return tokensCount && (tokensCount - 1) === get(this, 'activeTokenIndex');
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
      set(this, 'cursorLocation', newStr.length);
      return false;
    },

    changeTokenModel(token, model, shouldMoveCursor) {
      let tokenType = get(token, 'type');
      set(token, 'model', model);
      let tokens = get(this, 'tokens');
      let isLastTokenSelected = tokens.indexOf(token) === get(this, 'activeTokenIndex');
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

      if ((tokenType !== 'default' || model.fullText) && this.attrs.modifierAutoComplete) {
        this.attrs.modifierAutoComplete(tokensString, sanitizeToken(token));
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
        e.preventDefault();
        if (this.attrs.escape) {
          if (this.attrs.escape() === true) {
            this._mainInput.blur();
          }
        } else {
          this._mainInput.blur();
        }
      } else if (keyCode === KEYS.UP) {
        e.preventDefault();
        this.toggleProperty('upClicked');
      } else if (keyCode === KEYS.DOWN) {
        e.preventDefault();
        this.toggleProperty('downClicked');
      } else if (keyCode === KEYS.TAB) {
        e.preventDefault();
        let activeToken = get(this, 'activeToken');
        let tokenType = get(activeToken, 'type'); // token type before autocomplete
        if (activeToken.autoComplete()) {
          let hasVal = get(activeToken, 'value');
          let tokens = get(this, 'tokens');
          let isLastTokenSelected = get(this, 'isLastTokenSelected');
          let cursorLocation = this.getTokenEndCursorPos(activeToken);
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

          if (tokenType !== 'default' && this.attrs.modifierAutoComplete) {
            this.attrs.modifierAutoComplete(tokensString, sanitizeToken(activeToken));
          }
          if (this.attrs.valueChange) {
            this.attrs.valueChange(tokensString);
          }
        } else if (get(activeToken, 'type') !== 'date') {
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
