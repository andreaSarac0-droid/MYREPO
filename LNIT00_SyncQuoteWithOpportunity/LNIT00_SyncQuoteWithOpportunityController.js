({
    onClick : function(component, event, helper) {
        component.set("v.loaded",true);
		var recordId = component.get("v.recordId");
        var action = component.get("c.syncQuoteAndOpportunity");
        action.setParams({
            recordId
        });
        action.setCallback(this, (response)=>{
            const state = response.getState();
            console.log('state',state);
            if(state === 'SUCCESS'){
            	component.set("v.loaded",false);
            	var resp = response.getReturnValue();
            	console.log('check',resp.check);
            	if(resp.check){
            		helper.alert(component,event,helper,"Success",'',"Sync succeded!");  
        			//location.reload();
        			$A.get('e.force:refreshView').fire();
                }else{
                    helper.alert(component,event,helper,"error",'',resp.error);  
                }
            	
        		$A.get('e.force:refreshView').fire();
            }else if(state === 'ERROR'){
            	component.set("v.loaded",false);
            	var errors = response.getError();
                console.log('errors',errors);
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                
                console.error('errors',message);
            	helper.alert(component,event,helper,"error","There was a problem syncing quote.",message);  
            }
    	});
    
    	$A.enqueueAction(action);
	}
})