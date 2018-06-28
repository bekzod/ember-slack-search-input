import { reads } from '@ember/object/computed';
import EmberObject, { set, get, computed } from '@ember/object';
import DateSource from './components/slack-search-input/modifiers/-date/adapter';
import ListSource from './components/slack-search-input/modifiers/-list/adapter';
import DefaultSource from './components/slack-search-input/modifiers/-default/adapter';

export default EmberObject.extend({
  modifier: '',
  value: '',

  configHash: computed(function() {
    return {};
  }),

  config: computed('configHash', 'modifier', 'value', function() {
    let configHash = get(this, 'configHash');
    let modifier = get(this, 'modifier');
    let value = get(this, 'value');

    if (modifier) {
      return configHash[modifier];
    } else if (value && (value !== ' ')) {
      return configHash['_default'];
    }
  }),

  type: computed('config.type', function() {
    return get(this, 'config.type') || 'space';
  }),

  sectionTitle: reads('config.sectionTitle'),
  content: reads('config.content'),
  adapter: computed('type', function() {
    const type = get(this, 'type');
    if (type === 'list' || type === 'modifier-list') {
      return ListSource;
    } else if (type === 'date') {
      return DateSource;
    } else {
      return DefaultSource;
    }
  }),

  fullText: computed('modifier', 'value', 'configHash', {
    get() {
      return get(this, 'modifier') + get(this, 'value');
    },
    set(key, val) {
      let configs = get(this, 'configHash');
      if (configs) {
        let modifier;
        if (val.substr(0, 1) === '+') {
          modifier = '+';
        } else {
          for (let k in configs) {
            if (val.substr(0, k.length) === k) {
              modifier = k;
              break;
            }
          }
        }
        if (modifier) {
          let value = val.substr(modifier.length);
          set(this, 'modifier', modifier);
          set(this, 'value', value);
        } else if (val) {
          set(this, 'value', val);
        }
      }
      return val;
    }
  }),

  length: reads('fullText.length'),

  firstHint: reads('hints.firstObject'),

  subHint: computed('value', 'adapter', 'firstHint', function() {
    let value = get(this, 'value');
    let firstHint = get(this, 'firstHint');
    let hint = typeof firstHint === 'string' ?
      firstHint : get(this, 'adapter').serialize(firstHint);
    let valueLength = value.length;
    if (valueLength && hint && hint.indexOf(value) === 0) {
      return hint.substr(valueLength);
    }
  }),

  hint: computed('subHint', 'config.defaultHint', 'value', function() {
    return get(this, 'value').length ?
      get(this, 'subHint') : get(this, 'config.defaultHint');
  }),

  hints: computed('value', 'adapter', function() {
    return get(this, 'adapter').getHints(get(this, 'value'), get(this, 'content')) || [];
  }),

  model: computed('value', 'isValueValid', 'adapter', {
    set(key, newModel) {
      let val = get(this, 'adapter').serialize(newModel);
      if (newModel.fullText || newModel.modifier) {
        set(this, 'fullText', val);
        return null;
      } else {
        set(this, 'value', val);
      }
      return newModel;
    },
    get() {
      if (get(this, 'isValueValid')) {
        return get(this, 'adapter')
          .deserialize(get(this, 'value'), get(this, 'content'));
      } else {
        return null;
      }
    }
  }),

  isValueValid: computed('value', 'adapter', function() {
    return get(this, 'adapter')
      .validate(get(this, 'value'), get(this, 'content'));
  }),

  autoComplete() {
    let hint = get(this, 'firstHint');
    let subHint = get(this, 'subHint');

    if (hint && subHint) {
      let hintValue = typeof hint === 'string' ? hint : hint.value;
      if (hint.modifier) {
        set(this, 'fullText', hintValue);
      } else {
        set(this, 'value', hintValue);
      }
      return true;
    }
    return false;
  }
});
