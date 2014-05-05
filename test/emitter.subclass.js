var assert = require("assert")
  , PatternEmitter = require("../lib")
  , util = require("util")

describe("Pattern Emitter subclassing", function(){
	it("Should function with prototypal inheritance", function(){
		
		function DummyClass(){}

		DummyClass.prototype = new PatternEmitter();


		var dummy = new DummyClass();
		dummy.addListener('test_{event}', function( value, event){
			assert.equal( value, event )
		});

		dummy.emit("test_foo", "foo")
		dummy.emit("test_that", "that")
		dummy.emit("test_bar", "bar")

	})

	it("Shound function with Node.js util methods", function(){
		function DummyClass(){
			PatternEmitter.call( this )
			this.counter = 0;
		};

		util.inherits(DummyClass, PatternEmitter)
		
		DummyClass.prototype.error = function(){
			throw new Error();
		}

		DummyClass.prototype.count = function(){
			this.counter += 1;
		}

		var emitter = new DummyClass();

		assert.throws(function(){
			emitter.error();
		})

		emitter.addListener('beforeChange', function(){
			emitter.count();
			assert.ok(true)
		})


		emitter.emit('beforeChange', 1)
		emitter.emit('beforeChange', 1)
		emitter.emit('test', 1)

		assert.equal( emitter.counter, 2 )
	})
})