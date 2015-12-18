import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input', 'Integration | Component | slack search input', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input}}
  `);

  assert.equal(this.$().text().trim(), '');
});
