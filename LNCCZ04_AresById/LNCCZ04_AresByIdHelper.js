({
    validateAresForm: function(component) {
        //alert("helper");
        var validId = true;
  
        var sId = component.get("v.sId");
        
        if($A.util.isEmpty(sId)) 
        {
            validId = false;
            console.log("Quick action context doesn't have a valid parent Id");
        }

        return(validId);
    }
})