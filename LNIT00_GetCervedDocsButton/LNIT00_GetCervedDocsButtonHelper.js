({
	alert: function(component, event, helper, variant, title, message){
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode" : "sticky"/*,
            "duration": 7000*/
        });

    },
    invokeValidLince: function(component, event, helper, recordId){

        var action = component.get("c.ValidLince");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state ',state);
            var result = response.getReturnValue();
            if (state === "SUCCESS") {
            
                if (result != null) {
                    console.log(result.length);             
                    component.set("v.valid", result);                
                } 
            } else if (state === "ERROR") {

                console.error(response.getError());

                //helper.alert(component, event, helper, 'error', 'Error on Lince.', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    }
})