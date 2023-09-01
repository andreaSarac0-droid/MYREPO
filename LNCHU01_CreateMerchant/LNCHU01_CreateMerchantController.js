({
	doInit : function(component, event, helper) {
		 //call apex class method - preparation
       	var action = component.get('c.addMerchantsAura');
        
        // retrieve the merchant id to be sent 
        action.setParams({"merchantId": component.get("v.recordId")});
        
        // Configure response handler
       	action.setCallback(this, function(response) {
        	//store state of response
         	var state = response.getState();

            // Define the different possible toaster as a response
            var toastEvent = $A.get("e.force:showToast");
            
            if (component.isValid() && state === "SUCCESS") { /* Get a response from the server (Success or error) */ 
                //set response value in serverRestonse  attribute on component.
                component.set('v.hasErrors', response.getReturnValue());
                console.log('Loading properly the Apex method , response state: ' + state);
                
                var errors = response.getReturnValue();
                console.log('Loading properly the Apex method , response state: ' + errors);
                
                // if the response is true (create merchant succeeded)
                if (errors[0] == 'succeeded') { 
                    toastEvent.setParams({
                        mode: 'dismissible',
                        message: 'Merchant creation succeeded !',
                        type:'success'
                	});
                } else { /* otherwise */
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Merchant creation failed ! ' + response.getReturnValue()[1],
                        type:'error'
                	});
                }
            }
            else {
                toastEvent.setParams({
                    mode: 'dismissible',
                    message: 'ERROR',
                    type:'error'
                });
                
                console.log('Problem loading the Apex method, response state: ' + state);
            }
            
            $A.get("e.force:closeQuickAction").fire();
            toastEvent.fire();
            $A.get("e.force:refreshView").fire();
    	});
       	$A.enqueueAction(action);
	},
  
    //*************this function automatic call by aura:waiting event********  
    showSpinner: function(component, event, helper) {
       //make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
   },
    
   //***********this function automatic call by aura:doneWaiting event*********
    hideSpinner : function(component,event,helper){
     // make Spinner attribute to false for hide loading spinner    
       component.set("v.Spinner", false);
    },
    
})