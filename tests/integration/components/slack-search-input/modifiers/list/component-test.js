import Token from 'ember-slack-search-input/token';
import { prepareConig } from 'ember-slack-search-input/util';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const configHash = prepareConig({
 "before:": {
   type: 'date',
   defaultHint: 'a date',
 },

 "category:": {
   type: 'list',
   defaultHint: 'type',
   sectionTitle: 'Action Types',
   content: [
     {value: 'animal', label: 'animal'},
     {value: 'plant', label: 'plant'},
     {value: 'mineral', label: 'mineral'}
   ]
 }
});

moduleForComponent('slack-search-input/modifiers/-list', 'Integration | Component | slack search input/modifiers/-list', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input/modifiers/-list}}
  `);
  assert.ok(!!this.$('.hint-menu')[0]);
});

test('list displayed', function(assert) {
  let token = Token.create({ configHash, fullText: 'category:' });
  this.set('token', token);

  this.render(hbs`
    {{slack-search-input/modifiers/-list token=token}}
  `);

  assert.deepEqual(
    this.$('li b').map((i, el)=> this.$(el).text().trim()).get(),
    ['plant', 'animal', 'mineral']
  );

  this.set('token.value', 'min');

  assert.deepEqual(
    this.$('li b').map((i, el)=> this.$(el).text().trim()).get(),
    ['mineral']
  );
});


test('list current item works', function(assert) {
  let token = Token.create({ configHash, fullText: 'category:' });
  let changeTokenModel = function(token, model) {
    token.set('model', model);
  };

  this.set('token', token);
  this.set('upClicked', false);
  this.set('downClicked', false);
  this.set('enterClicked', false);
  this.set('changeTokenModel', changeTokenModel);

  let callCount = 0;
  this.set('onFocus', function() { callCount++; });

  this.render(hbs`
    {{slack-search-input/modifiers/-list
      upClicked=upClicked
      downClicked=downClicked
      enterClicked=enterClicked
      changeTokenModel=(action changeTokenModel)
      on-focus=(action onFocus)
      token=token}}
  `);

  assert.notOk(this.$('li.current')[0]);

  this.set('downClicked', !this.get('downClicked'));

  assert.ok(this.$('li:eq(0)').hasClass('current'));

  this.set('upClicked', !this.get('upClicked'));

  assert.ok(this.$('li:eq(2)').hasClass('current'));

  this.set('downClicked', !this.get('upClicked'));

  assert.ok(this.$('li:eq(0)').hasClass('current'));

  assert.equal(callCount, 3);

  assert.notOk(token.get('model'));

  this.set('enterClicked', !this.get('enterClicked'));

  assert.deepEqual(
    this.get('token.model'),
    { label: 'plant', value: 'plant', index: 0 }
  );

  assert.equal(this.get('token.fullText'), 'category:plant' );

});
