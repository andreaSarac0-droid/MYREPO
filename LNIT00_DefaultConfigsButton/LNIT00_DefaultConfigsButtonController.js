({
    init : function(component, event, helper) {
        
        //component.set("v.tDetailListSize", response.getReturnValue());
        var recordId = component.get("v.recordId");
        helper.invokeShowButton(component, event, helper, recordId);
        
    },
    onClick : function(component, event, helper) {
        component.set("v.loaded",true);
		var recordId = component.get("v.recordId");
        const action = component.get('c.applyDefaultConfigs');
        action.setParams({
            recordId : recordId
        });
        action.setCallback(this, (response)=>{
            var status = response.getState();
            console.log('status',status);
            if(status === 'SUCCESS'){
            	component.set("v.loaded",false);
                helper.alert(component,event,helper,"success",'Configurations applied!','');
            	helper.invokeShowButton(component, event, helper, recordId);
                $A.get('e.force:refreshView').fire();
            	
            } else {
                component.set("v.loaded",false);
                var errors = response.getError();
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors',message);
                helper.alert(component,event,helper,"error",'Errors applying default values: ',message);
            }
        });
            
        $A.enqueueAction(action);
	}
})