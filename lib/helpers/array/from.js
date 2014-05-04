/*jshint laxcomma:true, smarttabs: true */
/**
 * helper module to create arrays out of non-array like things
 * @module lib/helpers/array/from
 * @author Eric Satterwhite
 **/

function isEnumerable( item ){
 return (item != null &&  typeof( item.length ) == 'number' && Object.prototype.toString.call(item) != '[object Function]' );
}  
module.exports = function from(item) { /**  Named function expression in this submodule to avoid using arguments.callee below */

    if(item == null){
        return [];
    }
    if(arguments.length > 1){
        return from(arguments);
    }
    return (isEnumerable(item) && typeof item != 'string') ? (Array.isArray(item) ) ? item : Array.prototype.slice.call(item) : [item];

};;