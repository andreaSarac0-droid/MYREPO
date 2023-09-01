({  
    init : function(component, event, helper) {
        
        //component.set("v.tDetailListSize", response.getReturnValue());
        var recordId = component.get("v.recordId");
        helper.invokeValidLince(component, event, helper, recordId);        
    },
    Call : function(component, event, helper) {
        //component.set("v.tDetailListSize", response.getReturnValue());
        console.log('Call');
        var action = component.get("c.getCervedDoc");
        action.setParams({
            "AccID" : component.get("v.recordId")
        })
        
        action.setCallback(this, function (response) {
            var state = response.getState();

            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('result',result);
                if (result !== null) {
                    var title = result.split('·')[0];
                    var message = result.split('·')[1];
                    if(title === 'SUCCESS'){
                        console.log('result status',title);
                        console.log('result message',message);
                    	component.set("v.selectedDocumentId", message);
                    	component.set("v.hasModalOpen" , true); 
                        $A.get('e.force:refreshView').fire();
                    } else {
                        helper.alert(component, event, helper, 'error', title, message);
                    }
                    
                } 
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors',errors);
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                
                console.error('errors',message);
                helper.alert(component,event,helper,"error",'ERROR',message);
                //alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    closeModel: function(component, event, helper) {
        // for Close Model, set the "hasModalOpen" attribute to "FALSE"  
        component.set("v.hasModalOpen", false);
        component.set("v.selectedDocumentId" , null);
        
        var recordId = component.get("v.recordId");
        helper.invokeValidLince(component, event, helper, recordId);
        
        $A.get('e.force:refreshView').fire();
        //location.reload();
    }
})