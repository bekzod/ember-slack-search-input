# ember-slack-search-input
Attempt to replicate slack search input field as ember addon. 
###[Demo](http://ember-slack-search-input.surge.sh)

Like search input field in slack, special keywords(modifiers) are used to filter out the search. This modifiers are passed as form of config object with options like:

```javascript
  configHash: {
    "@": { // '@' is special key (modifier) which highlighted in input
      type: 'list', // type of modifier (either list or date)
      defaultHint: 'any user', // displayed when modifier is active but has no value
      sectionTitle: 'Users', // used as header when all modifiers content displayed 
      content: [ // content to be used for displaying list 
        {value: 'abrahm', label: 'Abrahm Micanski' }, 
        {value: 'lilly', label: 'Lilly Richards' },
        {value: 'emma', label: 'Emma Roberts' },
      ]
    },

    "before:": {
      type: 'date', 
      defaultHint: 'a date',
    }
  }
```

```hbs
{{slack-search-input
  placeholder='search for objects'
  configHash=configHash
  inputValue='' 
  isPopupHidden=false
  valueChange=(action 'searchValueChange')
  modifierAutoComplete=(action 'modifierAutoComplete')
  enter=(action 'search')
  focus-in=(action 'inputFocusedIn')
  focus-out=(action 'inputFocusedOut')
}}
```
There is also help popup which is displayed when user focuses input first time. The content of popup should be passed to `slack-search-input` in block form. 

```hbs
{{#slack-search-input as |concatToInputValue|}}
  <div class="help-title">
    Search with Filters
  </div>
  <span class='help-text'>Narrow your search using filter <span onmousedown={{action concatToInputValue 'before:'}} class='modifier'>before:</span>, <span onmousedown={{action concatToInputValue 'channel:'}} class='modifier'>channel:</span> or <span onmousedown={{action concatToInputValue '@'}} class='modifier'>@</span>. Or press plus key <span onmousedown={{action concatToInputValue '+'}} class='modifier'>+</span> to get all available filters</span>
{{/slack-search-input}}
```

## slack-search-input options

#### placeholder:String
Simple placeholder displayed when input has no value

#### configHash:Object
Config object used for getting modifiers

#### inputValue:String
Initial value of input 

#### isPopupHidden:Boolean
can be used to hide popups 

#### valueChange(newValue:String)
fired when inputValue changes 

####modifierAutoComplete(newValue:String, modifierValue:Object)
fired when modifier has valid value

## Modifier Types
Currently two types of modifiers are supported `list` and `date`:
  * Date - Date picker popup is showed when modifier is active.
  * List - List is simple list of possible options

## Deserialize Query String 
Once you got query string, you can deserialze it to object.

```javascript
  import { deserializeQueryString } from `ember-slack-search-input`;


  search() {
    let queryString = get(this, 'queryString');
    console.log(queryString) // `before:2000-23-23 lorem`
    let modifiers = deserializeQueryString(queryString);
    let before = modifiers['before:'] // array of values
    let { model, fullText, modifier, value } = before;
    console.log(model) // moment date
    console.log(fullText) // before:2000-23-23
    console.log(modifier) // before:
    console.log(value) // 2000-23-23
  }
```

##Requirements 
Currently addon styles has hard dependency on `bootstrap 3.x.x`, bootstrap should be installed already to styles work properly.

## Installation
You can install either with `ember install`:

For Ember CLI >= `0.2.3`:

```shell
ember install ember-slack-search-input
```

For Ember CLI < `0.2.3`:

```shell
ember install:addon ember-slack-search-input
```

## TODO
* write tests
* remove bootstrap dependency 
* add more modifier types
