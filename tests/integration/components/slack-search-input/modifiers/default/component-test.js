import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input/modifiers/-default', 'Integration | Component | tag search input/modifiers/-default', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`
    {{slack-search-input/modifiers/-default}}
  `);

  assert.ok(true);
});
