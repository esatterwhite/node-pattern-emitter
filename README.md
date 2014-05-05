node-pattern-emitter
====================

Node Pattern-Emitter is a full implementation of the event emitter API from Node.js that allows you to attach event handlers to complex patterns where the pattern matches are passed as arguments to the handlers. This, over the simple string matching with the default EventEmitter, can open the doors for highly generic and flexible code.


## Installation
```
npm install node-pattern-emitter --save
```

### Standard Strings

PatternEmitter is a full implementation of Node.js EventEmitter and functions as you would expect.

```js
var PatternEmitter = require('pattern-emitter');
var emitter = new PatternEmitter();

emitter.on('foobar', function( a, b, c ){
	console.log( a, b, c)
});

emitter.emit('foobar', 1, 2, 3) // -> 1, 2 ,3
```

### Simple variables

In the most simple case, you can include a pattern group in the name of your event with the `{}` syntax. Whatever value is matched for the group will be passed as a positional argument to the event handler.

```js
var PatternEmitter = require('pattern-emitter');
var emitter = new PatternEmitter();

emitter.on('object-{type}', function( type ){
	console.log( type )
})

emitter.emit('object-create') // -> create
emitter.emit('object-update') // -> update
emitter.emit('object-delete') // -> delete
emitter.emit('foobar')        // nothing happens
```

### Wildcard Matching

### Event Validation

You can hook into, and validate the named groups of your event and determine if / when an event should or should not be dispatched. This is achieved by passing an object as the third parameter to `addListener` or on, where the key is the name of the group to validate.

#### Literal Values

The simplest validation type is an array of literal values to accept as valid;

```js
var PatternEmitter = require('pattern-emitter');
var emitter = new PatternEmitter();
// only allow object-foo and object-bar events
var rules = {
	type:["foo", "bar"]
};

emitter.on('object-{type}', function( type ){
	console.log( type )
}, rules);

emitter.emit('object-foo') // -> foo
emitter.emit('object-bar') // -> bar
emitter.emit('object-test') // nothing happens
```

#### Regular Expression

#### Functions