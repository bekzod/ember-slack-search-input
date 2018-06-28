import { get } from '@ember/object';
import { getMatch } from '../../../../util';

export default {
  serialize(model) {
    return model && get(model, 'value');
  },

  deserialize(label, list) {
    if (list) {
      return list.findBy('value', label);
    } else {
      return label;
    }
  },

  validate(string, list) {
    if (list) {
      return list.any(function(item) {
        return this.serialize(item) === string;
      }, this);
    } else {
      return string;
    }
  },

  getHints(string, list) {
    if (list && list.length) {
      let labelMatches = getMatch(string, list, 'label');
      let valueMatches = getMatch(string, list, 'value');

      let matches = labelMatches
        .concat(valueMatches)
        .uniq()
        .filter((item) => (item.value !== string))
        .sortBy('value.length');

      if (matches.length) {
        return matches;
      }
    }
    return [];
  }
};
