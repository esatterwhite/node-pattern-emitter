var assert = require("assert")
  , PatternEmitter = require("../lib")


describe('PatternEmitter', function(){
	describe("#addListener - named", function(){
		it('Should emit named events with no arguments', function( done){
			var emitter = new PatternEmitter();

			emitter.addListener('test', function(){
				assert.ok(1)
				done()
			})
			emitter.emit('test')
		});

		it("Should emit names events with many arguments", function( done ){
			var emitter = new PatternEmitter();
			
			emitter.addListener('foo', function( value ){
				assert.equal( value, 1);
			});

			emitter.addListener('bar', function( a, b, c ){
				assert.strictEqual( a, 1 );
				assert.strictEqual( b, 2 );
				assert.strictEqual( c, 3 );
				done();
			});			

			emitter.emit('foo', 1 )
			emitter.emit('bar', 1, 2, 3 )
		});


		it('Should emit a newListener event', function( ){
			var emitter = new PatternEmitter();
			var noop = function(){};
			emitter.addListener( 'newListener', function( name, fn ){
				assert.equal( name, 'test')
				assert.equal( fn, noop )
			});
			emitter.addListener('test', noop)

		})
	});

	describe("#addListener - pattern", function(){

		it("Should match named patterns", function( ){
			var emitter = new PatternEmitter();

			emitter.addListener( 'test_{type}', function( value, event_type ){
				assert.equal( event_type, "event");
				assert.strictEqual( value, 1);
			})

			emitter.emit('test_event', 1);
			emitter.emit('fake_event', 12);
		})

		it( "Should accept wildcard pattern matching", function(){
			var emitter = new PatternEmitter();

			emitter.addListener('{event*}', function( value, event_name ){
				if( event_name == 'foo'){
					assert.equal( value, 'bar');
				}

				if( event_name == 'bar'){
					assert.equal( value, 'baz');
				}
			})
			emitter.emit("foo", "bar");
			emitter.emit("bar", "baz");
		})

		describe("#addListener - pattern rules", function(){

			it("should accept regular expressions", function(){
				var emitter = new PatternEmitter();
				var rules = {
					event:/(\d+)/
				}
				
				emitter.addListener('pattern_{event}', function( value, event ){
					assert.equal( event, "12345" )
					assert.equal( value,1  )
				}, rules )


				emitter.emit("pattern_12345", 1 )
				emitter.emit("pattern_shoes", 1 )
			})
		})
	})
});