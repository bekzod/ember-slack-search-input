import Token from 'ember-slack-search-input/token';
import { prepareConig } from 'ember-slack-search-input/util';
import { module, test } from 'qunit';

module('Unit | Token');

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

test('token properties computed properly', function(assert) {
  let token = Token.create({ configHash, fullText: ' ' });
  assert.equal(token.get('type'), 'space');

  token.set('fullText', 'before:');
  assert.equal(token.get('type'), 'date');
  assert.equal(token.get('modifier'), 'before:');
  assert.equal(token.get('value'), '');

  token.set('fullText', 'before:yester');
  assert.equal(token.get('type'), 'date');
  assert.equal(token.get('modifier'), 'before:');
  assert.equal(token.get('value'), 'yester');
  assert.equal(token.get('hint'), 'day');
});

test('token date type works', function(assert) {
  let token = Token.create({ configHash, fullText: 'before:2000-1-1' });

  assert.equal(token.get('type'), 'date');
  assert.equal(token.get('modifier'), 'before:');
  assert.equal(token.get('value'), '2000-1-1');

  token.set('fullText', 'before:mar');

  assert.equal(token.get('value'), 'mar');
  assert.equal(token.get('subHint'), 'ch');
  assert.equal(token.get('hint'), 'ch');
  assert.notOk(token.get('isValueValid'));

  assert.ok(token.autoComplete());

  assert.equal(token.get('value'), 'march');
  assert.notOk(token.get('subHint'));
  assert.notOk(token.get('hint'));
  assert.ok(token.get('isValueValid'));

});

test('token list type works', function(assert) {
  let token = Token.create({ configHash, fullText: 'category:plant' });

  assert.equal(token.get('type'), 'list');
  assert.equal(token.get('modifier'), 'category:');
  assert.equal(token.get('value'), 'plant');

  token.set('fullText', 'category:pla');

  assert.equal(token.get('value'), 'pla');
  assert.equal(token.get('subHint'), 'nt');
  assert.equal(token.get('hint'), 'nt');
  assert.notOk(token.get('isValueValid'));
  assert.deepEqual(token.get('hints'), [
    {value: 'plant', label: 'plant'},
  ]);

  assert.ok(token.autoComplete());

  assert.equal(token.get('value'), 'plant');
  assert.notOk(token.get('subHint'));
  assert.notOk(token.get('hint'));
  assert.ok(token.get('isValueValid'));

  token.set('value', '');

  assert.equal(token.get('fullText'), 'category:');
  assert.deepEqual(token.get('hints'), [
    {value: 'plant', label: 'plant'},
    {value: 'animal', label: 'animal'},
    {value: 'mineral', label: 'mineral'}
  ]);

});

