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

Pattern Emitter allows you to match against wild cards so you don't have to account for every named event within your application with `{*}` notation. For Example, in complex CRUD applications, listening to create, update or delete event pipelines can get messy. It could also be used to re-disaptch / transform events

```js
var PatternEmitter = require('pattern-emitter');
var emitter = new PatternEmitter();

emitter.on("before-{action*}" function( instance, action ){
	// do some crud magic
	emitter.emit('after-'+action, instance)
});

emitter.on('manage-{datatype}', function(datatype){
     // trip off some background tasks...
     console.log('managing %s ! ', datatype )
});

emitter.emit("before-add"); // -> dispatches after-add
emitter.emit("before-update"); // -> dispatches aftrer-update
emitter.emit("before-delete"); // -> dispatches after delete
emitter.emit("before-manage-blogpost"); // -> dispatches after-manage-blogpost -> "managing blogpost"
```

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

In situations when simple string matching isn't enough, Regular expressions can be used for complex pattern matching. The same rules object syntax is used to achieve this

```js
var PatternEmitter = require('pattern-emitter');
var emitter        = new PatternEmitter();

// only allow events that are numbers
var rules = {
	amount:/(\d+)/
};

emitter.on('pattern-{amount}', function( type ){
	console.log( type )
}, rules);

emitter.emit('pattern-1234') // -> 1234
emitter.emit('pattern-4321') // -> 4321
emitter.emit('pattern-test') // nothing happens
```

#### Functions

For extreme situations where Regular Expressions can't do it, you can use a function to validate pattern groups. You function should return either `true` or `false` to indicate if the value has passed your validation rules

```js
var PatternEmitter = require('pattern-emitter');
var emitter        = new PatternEmitter();

// Event is dispatched if
// 1) bar is either baz or far
// 2) AND foo is a number greater than 10
var rules = {
	foo:/(\d+)/
	,bar: function( value, request, valuesobj ){
		if( value in ['baz', 'far'] ){
			// foo has already been validated to be a number
			if( valuesobj.foo > 10 ){
				return true;
			}
		}
		return false;
	};
};

emitter.on('pattern-{foo}-{bar}', function( type ){
	console.log( foo, bar );
}, rules);

emitter.emit('pattern-1234-baz') // -> 1234, baz
emitter.emit('pattern-2-far') // -> 4, far
emitter.emit('pattern-one-baz') // nothing happens
```
