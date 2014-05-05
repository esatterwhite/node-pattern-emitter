node-pattern-emitter
====================

Node Pattern-Emitter is a full implementation of the event emitter API from Node.js that allows you to attach event handlers to complex patterns where the pattern matches are passed as arguments to the handlers. This, over the simple string matching with the default EventEmitter, can open the doors for highly generic and flexible code.


## Installation
```
npm install node-pattern-emitter --save
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

#### Literal Values

#### Regular Expression

#### Functions