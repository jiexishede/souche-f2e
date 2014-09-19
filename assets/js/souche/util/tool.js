define(function(){
    var Tool = {
        getMax: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var max = -Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] > max ){
                    max = arr[i];
                }
            }
            return max;
        },
        getMin: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var min = Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] < min ){
                    min = arr[i];
                }
            }
            return min;
        },
        getMaxMin: function(){
            var arr = null;
            if( Array.isArray(arguments[0]) ){
                arr = arguments[0];
            }
            else{
                arr = [].slice.call(arguments);
            }
            var min = Infinity, max = -Infinity;
            for(var i=0, j=arr.length; i<j; i++){
                if( arr[i] < min ){
                    min = arr[i];
                }
                if( arr[i] > max ){
                    max = arr[i];
                }
            }
            return {
                max: max,
                min: min
            };
        }
    };

    var es5Shim = {
        isArray: function(){
            if( !Array.isArray ){
                Array.isArray = function(obj){
                    return Object.prototype.toString.call(obj) === '[object Array]';
                }
            }
        }
    };

    var pathed = pathed || false;
    if( !pathed ){
         for( var i in es5Shim ){
            if(es5Shim.hasOwnProperty(i)){
                es5Shim[i]();
            }
        }
        pathed = true;
    }
   

    return Tool;
});