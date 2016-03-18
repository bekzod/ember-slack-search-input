import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { KEYS } from 'ember-slack-search-input/util';

moduleForComponent('slack-search-input', 'Integration | Component | slack search input', {
  integration: true
});

const configHash = {
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
};

test('it renders', function(assert) {
  this.render(hbs`
    {{slack-search-input}}
  `);
  assert.equal(this.$('input.slack-search-input')[0]);
});

test('modifiers highlighted', function(assert) {
  this.set('inputValue', '');
  this.set('configHash', configHash);
  this.render(hbs`
    {{slack-search-input
      configHash=configHash
      inputValue=inputValue}}
  `);

  this.set('inputValue', 'before:');
  assert.equal(this.$('input').val(), 'before:');
  assert.equal(this.$('.background-container .modifier.incomplete').text().trim(), 'before:');

  this.set('inputValue', 'before:2000-12-12');
  assert.equal(this.$('input').val(), 'before:2000-12-12');
  assert.notOk(this.$('.background-container .modifier').hasClass('incomplete'));

  this.set('inputValue', 'category:');
  assert.equal(this.$('input').val(), 'category:');
  assert.equal(this.$('.background-container .modifier.incomplete').text().trim(), 'category:');

  this.set('inputValue', 'category:animal');
  assert.equal(this.$('input').val(), 'category:animal');
  assert.notOk(this.$('.background-container .modifier').hasClass('incomplete'));

});

test('inputValue is correct and ends in space after an autocomplete', function(assert) {
  this.set('inputValue', '');
  this.set('configHash', configHash);
  this.render(hbs`
    {{slack-search-input
      configHash=configHash
      inputValue=inputValue}}
  `);

  this.set('inputValue', 'category:mi');
  this.$('input').trigger(Ember.$.Event('keydown', { keyCode: KEYS.TAB }));
  this.$('input').trigger(Ember.$.Event('keydown', { keyCode: KEYS.ENTER }));
  assert.equal(this.get('inputValue'), 'category:mineral ');
});
