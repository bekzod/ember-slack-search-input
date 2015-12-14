import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tag-search-input/hint-popup/list', 'Integration | Component | tag search input/hint popup/list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{tag-search-input/hint-popup/list}}`);

  assert.equal(this.$().text().trim(), '');
});
