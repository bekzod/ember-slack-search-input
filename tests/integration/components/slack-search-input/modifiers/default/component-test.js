import Token from 'ember-slack-search-input/token';
import { prepareConig } from 'ember-slack-search-input/util';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const configHash = prepareConig({
 "after:": {
   type: 'date',
   defaultHint: 'a date',
 },

 "category:": {
   type: 'list',
   defaultHint: 'category',
   sectionTitle: 'category',
   content: [
     {value: 'animal', label: 'animal'},
     {value: 'plant', label: 'plant'},
     {value: 'mineral', label: 'mineral'}
   ]
 }
});

moduleForComponent('slack-search-input/modifiers/-default', 'Integration | Component | tag search input/modifiers/-default', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`
    {{slack-search-input/modifiers/-default}}
  `);

  assert.ok(!!this.$('.hint-menu')[0]);
});

test('it renders', function(assert) {
  let token = Token.create({ configHash, fullText: 'a' });
  this.set('token', token);

  assert.equal(this.get('token.type'), 'default');
  this.render(hbs`
    {{slack-search-input/modifiers/-default token=token}}
  `);

  assert.deepEqual(
    this.$('.header-label').map((index, el)=> this.$(el).text().trim()).get(),
    ['modifiers', 'category']
  );

  assert.deepEqual(
    this.$('.slack-search-input-list').map((index, el)=> this.$(el).children().length).get(),
    [2, 3]
  );
});
