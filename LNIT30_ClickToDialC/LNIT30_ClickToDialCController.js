({
    init : function(cmp, event, helper) {
        var action = cmp.get("c.getPhone");
        action.setParams({ 
            "recordId" : cmp.get("v.recordId"),
            "objectName" : cmp.get("v.objName"),
            "fieldName" : cmp.get("v.fieldName")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var phoneNumber = response.getReturnValue();
                cmp.set("v.Phone",phoneNumber);
                console.log("Phone:: "+phoneNumber);
            }
        })
        $A.enqueueAction(action);
    },
})