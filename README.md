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
```

```hbs
{{tag-search-input
  placeholder='search for objects'
  configHash=configHash
  inputValue=model.queryString 
  isPopupHidden=isSearchPopupHidden
  valueChange=(action 'searchValueChange')
  modefierAutoComplete=(action 'modefierAutoComplete')
  enter=(action 'search')
  focus-in=(action 'inputFocusedIn')
  focus-out=(action 'inputFocusedOut')
}}
```
There is also help popup which is displayed when user focuses input first time. The content of popup should be passed to `tag-search-input` in block form. 

```hbs
{{#tag-search-input as |concatToInputValue|}}
  <div class="help-title">
    Search with Filters
  </div>
  <span class='help-text'>Narrow your search using filter <span onmousedown={{action concatToInputValue 'before:'}} class='modifier'>before:</span>, <span onmousedown={{action concatToInputValue 'channel:'}} class='modifier'>channel:</span> or <span onmousedown={{action concatToInputValue '@'}} class='modifier'>@</span>. Or press plus key <span onmousedown={{action concatToInputValue '+'}} class='modifier'>+</span> to get all available filters</span>
{{/tag-search-input}}
```

## tag-search-input options

### placeholder
Simple placeholder displayed when input has no value

### configHash
Config object used for getting modifiers

### inputValue
Initial value of input 

### isPopupHidden
can be used to hide popups 

### valueChange(newValue)
fired when inputValue changes 

###modefierAutoComplete(newValue, modifierValue)
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
Currently addon styles rely on `bootstrap 3.x.x`, if you don't have it installed you should explicitly specify to import them in `ember-cli-build.js` 
```javascript 
  var app = new EmberAddon(defaults, {
    'ember-slack-search-input': {
      importBootstrapCSS: true, // it will import glyphicons too 
      importBootstrapJS: true, // if you want bootstrap js is (not required for addon)
    }
  });
```

## TODO
* write tests
* remove bootstrap dependency 
* add more modifier types
