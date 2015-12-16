import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input/hint-popup/date', 'Integration | Component | slack search input/hint popup/date', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{slack-search-input/hint-popup/date}}`);

  assert.equal(this.$().text().trim(), '');
});
