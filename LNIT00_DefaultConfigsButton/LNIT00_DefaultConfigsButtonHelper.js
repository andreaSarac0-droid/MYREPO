({
	 alert: function(component, event, helper, variant, title, message){
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode" : "sticky"/*,
            "duration": duration*/
        });
     },
    invokeShowButton: function(component, event, helper, recordId){
        console.log('show button');
        var action = component.get("c.disableButton");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();
            
            if (state === "SUCCESS") {
                if (result != null) {
                    console.log(result.length);             
                    component.set("v.show", result);                
                } 
            } else if (state === "ERROR") {
                alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    }
})