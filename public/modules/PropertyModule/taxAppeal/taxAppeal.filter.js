_JurisDictionFilter.$inject = ["$http", "$filter"];
module.exports = {JurisdictionFilter: _JurisDictionFilter, AppealFilter: _AppealFilter,
    pAddressFilter: _pAddressFilter,pOwnerNameFilter: _pOwnerNameFilter,
    pZipCodeFilter: _pZipCodeFilter,ownerInputFilter: _ownerInputFilter,
    zipCodeInputFilter: _zipCodeInputFilter
};


    // Create the return function and set the required parameter name to **input**
    function _JurisDictionFilter() {
      
        return function(items, params) {
           var result = items    
           
           result = FilterJursidictions(items,params)     
          
        
          return result;
        }

        function FilterJursidictions(items, params) {
            var selected = [] 
         
            if(params.length==0) {
                return items
            }
            for (var i = 0 ; i < params.length;i++) {
                         for(var j = 0 ; j < items.length; j++) {
                            if(items[j].name==params[i]){
                            selected.push(items[j])
                            }

                         }
            }
             return selected;
        }
    }

    function _AppealFilter(){
        return function(items, params) {
            var result = []
           
            if(params.ns==false && params.don==false && params.ip==false) {
                return items;
            }    
            angular.forEach(items, function(value, key){
                if(!value) {
                    
                }
                if(params.ns==true && value.properties.status=='Not Started') {
                    result.push(value)
                } 
                if(params.don==true && value.properties.status=='Done') {
                    result.push(value)
                } 
                if(params.ip==true && value.properties.status=='In Progress') {
                    result.push(value)
                } 
             }); 
          
           return result;
         }
    }

    function _pAddressFilter() {
        return function(items, params) {
            var result = []
            
            if(params.length==0){
                return items;
            }
            
            angular.forEach(items, function(item) {
                var extractAddress = ''
                if(item.address) extractAddress = item.address;
                else extractAddress = item.streetAddress;                ;

                if(extractAddress.toLowerCase().indexOf(params.toLowerCase()) !== -1){
                    result.push(item);
                }
            });   
            
          
           return result;
         }
    }
  
    function _pOwnerNameFilter() {
        return function(items, params) {
            var result = []
          
            if(params.length==0) {
                return items
            }
            for (var i = 0 ; i < params.length;i++) {   
                   angular.forEach(items, function(item) {
               
                        if(item.ownerName==params[i]){
                            result.push(item)
                         }
                    });   
          }
            
          
           return result;
         }
    }



    function _pZipCodeFilter(){
  return function(items, params) {
            var result = []
            console.log(items)
            if(params.length==0) {
                return items
            }
            for (var i = 0 ; i < params.length;i++) {   
            angular.forEach(items, function(item) {
               
                if(item.zipCode==params[i]){
                    result.push(item)
                }
            });   
        }
            
          
           return result;
         }
    }
  
    function _ownerInputFilter(){
        return function(data, params) {
                  var result = []
                  console.log(data)
                  if(params.length==0) {
                      return data
                  }
                  for (var  i = 0 ; i< params.length;i++) {
                   var filtered =    data.filter(item => item.name == params[i])
                        
                   result = result.concat(filtered)
                  }
                  
                
                 return result;
               }
         }

         function _zipCodeInputFilter(){
            return function(data, params) {
                      var result = []
                      console.log(data)
                      if(params.length==0) {
                          return data
                      }
                      for (var  i = 0 ; i< params.length;i++) {
                            
                       result = result.concat(data.filter(item => item.name == params[i]))
                      }
                      
                    
                     return result;
                   }
             }
        
