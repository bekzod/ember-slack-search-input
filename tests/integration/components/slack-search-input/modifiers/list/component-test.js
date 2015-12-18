import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slack-search-input/modifiers/-list', 'Integration | Component | slack search input/modifiers/list', {
  integration: true
});

skip('it renders', function(assert) {
  this.render(hbs`{{slack-search-input/modifiers/-list}}`);
  assert.ok(!!this.$().text().trim());
});
