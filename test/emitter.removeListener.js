var assert = require("assert")
  , PatternEmitter = require("../lib")

describe("PatternEmitter", function(){

	describe("#removeListener", function( ){
		it("should remove a handler by name", function(){
			var emitter = new PatternEmitter();
			var fn = function(){
				assert.ok( false )
			}

			emitter.addListener('test', fn)

			emitter.removeListener('test', fn )
			emitter.emit('test')
			assert.ok( true )
		})
	})
})