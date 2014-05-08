var assert = require("assert")
  , PatternEmitter = require("../lib")

describe("PatternEmitter", function(){

	describe("#addListener - pattern rules", function(){

		it("should accept regular expressions", function(){
			var emitter = new PatternEmitter();
			var rules = {
				event:/(\d+)/
			};
			
			emitter.addListener('pattern_{event}', function( value, event ){
				assert.equal( event, "12345" )
				assert.equal( value, 1  )
			}, rules )

			assert.doesNotThrow(function(){
				emitter.emit("pattern_12345", 1 )
				emitter.emit("pattern_shoes", 1 ) // should never happen
			})
		})

		it("should accept array of literal values", function(){
			var emitter = new PatternEmitter();
			var rules = {
				event:['foo', 'bar', 'baz']
			};
			
			emitter.addListener('pattern_{event}', function( value, event ){
				var valid = {
					foo:1
					,bar:1
					,baz:1
				}
				var is_valid = valid.hasOwnProperty( event )

				if( is_valid ){
					assert.ok( true )
				} else{
					assert.ok( false )
				}
			}, rules )


			emitter.emit("pattern_bar", 1 ) 
			emitter.emit("pattern_foo", 1 ) 
			emitter.emit("pattern_foo", 1 ) 
			emitter.emit("pattern_baz", 1 ) 
			emitter.emit("pattern_test", 1 ) // should never happen
		})
	})
})