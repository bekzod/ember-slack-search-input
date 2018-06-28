/*global moment*/
import { getMatch } from '../../../../util';

const MONTHS = moment.months().invoke('toLowerCase');
const ALLOWED_VALUES = ['yesterday', 'today'].concat(MONTHS);
const DATE_FORMAT = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/;
const DATE_FORMAT_FULL = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}:[0-9]{1,2}-[0-9]{1,2}$/;

export default {
  defaultHint: 'a date',

  serialize(date) {
    if (!date) { return null; }
    let format = 'YYYY-MM-DD';
    if (date.hours() !== 0 || date.minutes() !== 0) {
      format = 'YYYY-MM-DD:HH-mm';
    }
    return date.format(format);
  },

  deserialize(val) {
    if (val === 'yesterday') {
      return moment().startOf('day').subtract(1, 'day');
    } else if (val === 'today') {
      return moment().startOf('day');
    } else if (MONTHS.includes(val)) {
      return moment().month(val).startOf('month');
    } else if (DATE_FORMAT_FULL.test(val)) {
      return moment(val, 'YYYY-MM-DD:HH-mm');
    } else {
      return moment(val, 'YYYY-MM-DD');
    }
  },

  validate(string) {
    return string === 'yesterday' ||
      string === 'today' ||
      MONTHS.includes(string) ||
      DATE_FORMAT.test(string) && moment(string, 'YYYY-MM-DD').isValid() ||
      DATE_FORMAT_FULL.test(string) && moment(string, 'YYYY-MM-DD:HH-mm').isValid();
  },

  getHints(string) {
    const possibleValues = [moment().format('YYYY-MM-DD')].concat(ALLOWED_VALUES);
    if (string) {
      return getMatch(string, possibleValues);
    }
  }
};
