/*jshint laxcomma:true, smarttabs: true */
'use strict';
/**
 * Provides the event emitter interface with complex pattern mathching
 * @module lib/emitter
 * @author Eric Satterwhite
 * @requires crossroads
 * @requires module:lib/helpers/array/from
 * @requires moduleC
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

function createHub(){
	if( this.$hub == null ){
		this.$hub                = crossroads.create();
		this.$hub.greedy		 = true;
		this.$hub.shouldTypecast = true;
		this.$hub.ignoreState    = true;
	}
}

/**
 * DESCRIPTION
 * @class module:NAME.PatternEmitter
 * @param {TYPE} NAME DESCRIPTION
 * @example var x = new NAME.PatternEmitter({});
 */
PatternEmitter   = function PatternEmitter(  )/** @lends module:NAME.PatternEmitter.prototype */{
	// nothing needs to happen here;
	// can also be used as "mixin"
};



/**
 * This does somePatternEmitter
 * @param {TYPE} name DESCRPTION
 * @param {TYPE} name DESCRIPTION
 * @returns {TYPE} DESCRIPTION
 */ 
PatternEmitter.prototype = {
	 $hub: null
	,$events: {}
	/**
	 * Attaches a function handler to a named event or pattern
	 * @chainable
	 * @method module:lib/emitter.PatternEmitter#addListener
	 * @param {String} pattern The name or pattern of the event to listen for
	 * @param {Function} handler The function to be executed when an event matching name is dispatched
	 * @param {Object} [rules=null] An object container crossroads validation rules for the event handler
	 * @return Self
	 **/
	,addListener: function(name, fn, rules){

		createHub.call( this );
		if( rules && rules.regex ){
			var type = new RegExp( name, rules.flags );
			if(!this.$events.hasOwnProperty( type )){
				this.$events[ name ] = this.$hub.addRoute( type );
				this.$events[ name ].rules = rules || null;
			}
			name = type;
		} else {
			var type = removeOn( name );
			if(!this.$events.hasOwnProperty( type )){
				this.$events[ type ] = this.$hub.addRoute( type );
				this.$events[ type ].rules = rules || null;
			}
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

	, addListeners: function(){}
	, listeners: function listeners( event ){

	}
	, removeListener: function(){}
	, removeListeners: function(){}
	, removeAllListeners: function(){}
	, on: function(){
		return this.addListener.apply( this, arguments );
	}

	, once: function(){}
	, un : function(){}
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
	, suspendEvents: function(){}
	, resumeEvents: function(){}

};

module.exports = PatternEmitter;