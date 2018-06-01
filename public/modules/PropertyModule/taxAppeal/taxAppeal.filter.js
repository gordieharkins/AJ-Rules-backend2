_JurisDictionFilter.$inject = ["$http", "$filter"];
module.exports = _JurisDictionFilter;


    // Create the return function and set the required parameter name to **input**
    function _JurisDictionFilter() {
      
        return function(items, params) {
            console.log(items, params)
                var out = [];
                console.log(items)

  
                 return items;
        }
    }
  
