import Component from '@ember/component';
import { run } from '@ember/runloop';
import { computed, observer, get } from '@ember/object';
import layout from './template';

export default Component.extend({
  classNames: ['hint-menu-container'],
  layout: layout,

  cursor: -1,

  didInsertElement() {
    this._super(...arguments);
    run.schedule('afterRender', this, function() {
      let el = this.$('.datetimepicker-container')
        .datetimepicker({
          inline: true,
          sideBySide: true,
          useCurrent: false,
          date: get(this, 'token.model')
        })
        .on('dp.change', run.bind(this, 'onDateChange'));
        this._picker = el.data("DateTimePicker");
    });
  },

  setPickerDate: observer('token.model', function() {
    run.schedule('afterRender', this, function() {
      if (this._picker) {
        this._picker.date(get(this, 'token.model'));
      }
    });
  }),

  cursorLocationType: computed('cursor', 'token.length', function() {
    let cursor = get(this, 'cursor');
    let keyLength = get(this, 'token.modifier.length');
    if (cursor >= keyLength) {
      if (cursor < (keyLength + 5)) {
        return 'year';
      } else if (cursor < (keyLength + 8)) {
        return 'month';
      } else if (cursor < (keyLength + 11)) {
        return 'day';
      } else if (cursor < (keyLength + 14)) {
        return 'hour';
      } else if (cursor < (keyLength + 17)) {
        return 'minute';
      }
    }
  }),

  goUp: observer('upClicked', function() {
    let date = get(this, 'token.model');
    let cursorLocationType = get(this, 'cursorLocationType');
    if (date && cursorLocationType) {
      date.add(1, cursorLocationType);
      run.once(this, function() {
        this.attrs.changeTokenModel(get(this, 'token'), date);
        this.notifyPropertyChange('token.model');
      });
    }
  }),

  goDown: observer('downClicked', function() {
    let date = get(this, 'token.model');
    let cursorLocationType = get(this, 'cursorLocationType');
    if (date && cursorLocationType) {
      date.subtract(1, cursorLocationType);
      run.once(this, function() {
        this.attrs.changeTokenModel(get(this, 'token'), date);
        this.notifyPropertyChange('token.model');
      });
    }
  }),

  onDateChange({date}) {
    let tokenDate = get(this, 'token.model');
    if (date && !date.isSame(tokenDate)) {
      let isTimeChanged = !tokenDate ?
        false : (date.hours() !== tokenDate.hours()) || (date.minutes() !== tokenDate.minutes());
      this.attrs.changeTokenModel(get(this, 'token'), date, !isTimeChanged);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this._picker) {
      this._picker.destroy();
    }
  }

});
