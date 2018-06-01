_JurisDictionFilter.$inject = ["$http", "$filter"];
module.exports = _JurisDictionFilter;


    // Create the return function and set the required parameter name to **input**
    function _JurisDictionFilter() {
      
        return function(items, params) {
           var result = items    
           
           result = FilterJursidictions(items,params)     
          
         console.log(result)
          return result;
        }

        function FilterJursidictions(items, params) {
            var selected = [] 
            if(params.length==0) {
                return items
            }
           
            
                 
                for(var i = 0 ; i < items.length ; i++) {
                    for(var j = 0 ; j < params.length; j++) {
                     if(params[j] ==items [i].name) {
                         selected.push(items [i])
                     }
                }

             }
             return selected;
        }
    }
  
