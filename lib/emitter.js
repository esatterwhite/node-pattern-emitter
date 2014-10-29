/*jshint laxcomma:true, smarttabs: true */
'use strict';
/**
 * Provides the event emitter interface with complex pattern mathching
 * @module lib/emitter
 * @author Eric Satterwhite
 * @requires crossroads
 * @requires module:lib/helpers/array/from
 **/
var  crossroads = require( 'crossroads' ) // this is crossroads
   , from = require( './helpers/array/from' ) // custom moduleB
   , PatternEmitter;                         // The primary Class exports from the module

// converts onFoo -> foo
function removeOn( str ){
	return str.replace(/^on([A-Z])/, function( full, first ){
		return first;
	});
}

/**
 * Provides pattern matching through event names
 * @class module:lib/emitter.PatternEmitter
 * @example var emitter = new PatternEmitter();
 * emitter.on('before-{action*}')
 */
PatternEmitter   = function PatternEmitter(  ){
	// nothing needs to happen here;
	// can also be used as "mixin"
	this.$hub                = null
	this.$events             = {}
	this.$hub                = crossroads.create();
	this.$hub.greedy		 = true;
	this.$hub.shouldTypecast = true;
	this.$hub.ignoreState    = true;
};



/**
 * This does somePatternEmitter
 * @lends module:NAME.PatternEmitter.prototype
 */ 
PatternEmitter.prototype = {
	/**
	 * Attaches a function handler to a named event or pattern
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#addListener
	 * @param {String} pattern The name or pattern of the event to listen for
	 * @param {Function} handler The function to be executed when an event matching name is dispatched
	 * @param {Object} [rules=null] An object container crossroads validation rules for the event handler
	 * @return Self
	 **/
	addListener: function(name, fn, rules){
		var type = removeOn( name );

		this._createhub.call( this );
		if(!this.$events.hasOwnProperty( type )){
			this.$events[ type ] = this.$hub.addRoute( type );
			this.$events[ type ].rules = rules || null;
		}

	       /**
		* @name module:lib/emitter.PatternEmitter#newListener
		* @event
		* @param {String} name The name of the event 
		* @param {Function} handler a reference to the even handler that was attached
		*/
		this.emit( "newListener", name, fn );
		this.$events[ type ].matched.add( fn );
		return this;
	}

	,_createhub: function(){
		if( this.$hub == null ){
		}
	}
	/**
	 * Short to addevent for adding Events in bulk as key value pairs where the key is the name of the event name and the value is the event handler<br />
	 * @method module:lib/emitter.PatternEmitter#addListeners
	 * @example
	 *  MyClassInstance.addListeners({
	 *      "foo_{bar*}": function(){},
	 *      "before:action:":function(){}
	 *  });
	 * @chainable
	 * @param  {Object} events object with name / handler pairs
	 * @return {PatternEmitter} The class Instance
	 */
	, addListeners: function( events ){
		for( var type in events ){
			this.addEvent( type, events[type] );
		}
		return this;
	}
	, listeners: function listeners( event ){

	}

	/**
	 * removes specified event from a class instance
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#removeListener
	 * @param  {String} name the name of the method to remove
	 * @param  {Function} fn the function to remove. Must be the same function initially used ( non-anonymous )
	 * @return {PatternEmitter} the class instance
	 */
	, removeListener: function( name, fn ){
		var sig;

		sig = this.$events[ name ].matched;

		if( sig && fn ){
			sig.remove( fn );
		}

		return this;
	}
	/**
	 * Shortcut to remove event allowing key / value pairs to be passed  to perform a bulk operatino
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#removeListeners
	 * @param  {Object} events object containing event names and handler pairs
	 * @return {PatternEmitter} The class instance
	 */
	, removeListeners: function( events ){
		var type;
		if(!events){
			this.$hub.removeAllRoutes();
			for( type in this.$events ){
				delete this.$events[type];
			}
		}

		if( typeof events == "object"){
			for( type in events ){
				this.$events[ type ].dispose();
			}
			this.$events = {};
		}
		return this;
	}
	, removeAllListeners: function(){
		return this.removeListeners();
	}
	/**
	 * Alias for addListener
	 * #method module:lib/emitter.PatternEmitter#on
	 * @return {PatternEmitter} Class instance
	 **/
	, on: function(){
		return this.addListener.apply( this, arguments );
	}
	/**
	 * Adds an event handler that will be removed after its first executeion. eg. It will only be executed once
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#once
	 * @param {String} name Name of the event the bind a handler to
	 * @param {Function} fn The function to use as the event handler
	 * @param  {Object} rules Rules object to clean and validate event parameters
	 * @return {PatternEmitter} The current class instance
	 **/
	, once: function(){
			var type = removeOn( name );

			this._createhub.call( this );
			if(!this.$events.hasOwnProperty( type )){
				this.$events[ type ] = this.$hub.addOnce( type );
				this.$events[ type ].rules = rules || null;
			}

		   /**
			* @name module:lib/emitter.PatternEmitter#newListener
			* @event
			* @param {String} name The name of the event 
			* @param {Function} handler a reference to the even handler that was attached
			*/
			this.emit( "newListener", name, fn );
			this.$events[ type ].matched.add( fn );
					  
			return this;
	}
	/**
	 * Alias for remove event
	 * chainable
	 * @method module:lib/emitter.PatternEmitter#un
	 * @return {PatternEmitter} reference to instance
	 **/
	, un : function(){
		return this.removeListener.apply( this, arguments )
	}
	/**
	 * Fires a named event
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#emit
	 * @param {String} name the name of the event to fire
	 * @param {Array} [args=null] the array of arguments to pass to the handler. Single arguments need not be an array
	 * @param {Number} [delay=0] the amount of time in millisecond to wait before dispatching the event
	 */
	, emit: function(name /*, [ args ]*/){
		if( !this.$hub || this.$suspended ){ return; }

		var type  // The normailized event name
		  , args
		  ;

		type = removeOn( name );
		args = Array.prototype.splice.call( arguments, 1, arguments.length );
		this.$hub.parse( name, args );
		return this;
	}
	/**
	 * Prevents any events from being fired
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#suspendEvents
	 * @return {PatternEmitter} the current class instance
	 **/
	, suspendEvents: function(){
		this.$suspended = true;
		return this;
	}
	/**
	 * allows events to be fired if previosly suspended
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#resumeEvents
	 * @return {PatternEmitter} the class instance
	 **/
	, resumeEvents: function(){
		this.$suspended = false;
		return this;
	}

};
module.exports = PatternEmitter;
