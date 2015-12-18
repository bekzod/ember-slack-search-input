import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input/modifiers/-date', 'Integration | Component | slack search input/modifiers/date', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input/modifiers/-date}}
  `);

  assert.ok(this.$('.datetimepicker-container > div').hasClass('bootstrap-datetimepicker-widget'));
});
