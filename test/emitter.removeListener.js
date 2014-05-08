var assert = require("assert")
  , PatternEmitter = require("../lib")

describe("PatternEmitter", function(){

	describe("#removeListener", function( ){
		it("should remove a handler by name", function(){
			var emitter = new PatternEmitter();

			var fn = function(){
				throw new Error();
			}

			emitter.addListener('test', fn)
			emitter.addListener('test2', fn)
			emitter.removeListener('test', fn )

			assert.doesNotThrow(function(){
				emitter.emit('test')
			});

			assert.throws(function(){
				emitter.emit('test2')
			});
		});

	});

	describe("#removeAllListeners", function(){
		it('should remove all handlers', function(){
			var emitter = new PatternEmitter();
			var fn = function(){
				throw new Error()
			}

			emitter.addListener('test', fn)
			emitter.addListener('test2', fn)

			assert.throws(function(){
				emitter.emit( 'test' )
			})

			assert.throws(function(){
				emitter.emit( 'test2' )
			})

			emitter.removeAllListeners();

			assert.doesNotThrow(function(){
				emitter.emit( 'test' )
			})

			assert.doesNotThrow(function(){
				emitter.emit( 'test2' )
			})


		});
		
	})

});