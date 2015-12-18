import Token from 'ember-slack-search-input/token';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const configHash = {
  'before:': {
    type: 'date'
  }
};

moduleForComponent('slack-search-input/modifiers/-date', 'Integration | Component | slack search input/modifiers/-date', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input/modifiers/-date}}
  `);

  assert.ok(this.$('.datetimepicker-container > div').hasClass('bootstrap-datetimepicker-widget'));
});

test('picked date and time highlighted', function(assert) {
  let token = Token.create({ configHash, fullText: 'before:' });

  this.set('token', token);

  this.render(hbs`
    {{slack-search-input/modifiers/-date token=token}}
  `);

  assert.ok(!this.$('.datepicker-days active')[0]);

  this.set('token.fullText', 'before:2000-12-10');

  assert.equal(this.$('.datepicker-days .active').text().trim(), 10);
  assert.equal(this.$('.picker-switch:eq(0)').text().trim(), 'December 2000');
  assert.equal(this.$('.timepicker-picker .timepicker-hour').text().trim(), 12);
  assert.equal(this.$('.timepicker-picker .timepicker-minute').text().trim(), '00');
  assert.equal(this.$('.timepicker-picker [data-action="togglePeriod"]').text().trim(), 'AM');

  this.set('token.fullText', 'before:2001-11-01:21-34');

  assert.equal(this.$('.datepicker-days .active').text().trim(), 1);
  assert.equal(this.$('.picker-switch:eq(0)').text().trim(), 'November 2001');
  assert.equal(this.$('.timepicker-picker .timepicker-hour').text().trim(), '09');
  assert.equal(this.$('.timepicker-picker .timepicker-minute').text().trim(), '34');
  assert.equal(this.$('.timepicker-picker [data-action="togglePeriod"]').text().trim(), 'PM');
});

test('can increment/decrement date and time', function(assert) {
  let token = Token.create({ configHash, fullText: 'before:2000-1-5:12-00' });

  let changeTokenModel = function(token, model) {
    token.set('model', model);
  };

  this.set('token', token);
  this.set('cursor', 0);
  this.set('upClicked', false);
  this.set('downClicked', false);
  this.set('changeTokenModel', changeTokenModel);

  this.render(hbs`
    {{slack-search-input/modifiers/-date
      token=token
      upClicked=upClicked
      downClicked=downClicked
      changeTokenModel=(action changeTokenModel)
      cursor=cursor}}
  `);

  this.set('upClicked', !this.get('upClicked'));
  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.datepicker-days .active').text().trim(), 5);
  assert.equal(this.$('.picker-switch:eq(0)').text().trim(), 'January 2000');
  assert.equal(this.$('.timepicker-picker .timepicker-hour').text().trim(), '12');
  assert.equal(this.$('.timepicker-picker .timepicker-minute').text().trim(), '00');
  assert.equal(this.$('.timepicker-picker [data-action="togglePeriod"]').text().trim(), 'PM');

  this.set('cursor', 7); // before:<cursor>2000-1-5:12-00

  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.picker-switch:eq(0)').text().trim(), 'January 1999');

  this.set('cursor', 12); // before:1999-<cursor>1-5:12-00

  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.picker-switch:eq(0)').text().trim(), 'December 1998');

  this.set('cursor', 15); // before:1999-12-<cursor>5:12-00

  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.datepicker-days .active').text().trim(), 4);

  this.set('cursor', 18); // before:1999-12-4:<cursor>12-00

  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.timepicker-picker .timepicker-hour').text().trim(), '11');

  this.set('cursor', 21); // before:1999-12-4:12-<cursor>00

  this.set('upClicked', !this.get('upClicked'));
  this.set('downClicked', !this.get('downClicked'));
  this.set('downClicked', !this.get('downClicked'));

  assert.equal(this.$('.timepicker-picker .timepicker-minute').text().trim(), '59');
  assert.equal(this.$('.timepicker-picker [data-action="togglePeriod"]').text().trim(), 'AM');
});
