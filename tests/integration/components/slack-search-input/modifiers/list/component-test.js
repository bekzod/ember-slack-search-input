import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input/modifiers/-list', 'Integration | Component | slack search input/modifiers/-list', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input/modifiers/-list}}
  `);
  assert.ok(true);
});
