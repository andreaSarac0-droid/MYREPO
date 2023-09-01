({
	doInit : function(component, event, helper) {
		var getAccountAction = component.get("c.getAccountWS");
        getAccountAction.setParams({"accId": component.get("v.recordId")});

        var okDiv = component.find("okDiv");
        var errorDiv = component.find("errorDiv");
        var errorInfoP = component.find("errorInfoP");
        var errorHeader = component.find("errorHeader");
     
 
        // Configure response handler
        getAccountAction.setCallback(this, function(response) {
            
            var state = response.getState();
            
            if(state === "SUCCESS") 
            {
                component.set("v.acc", response.getReturnValue());
            } 
            else 
            {
                console.log('Problem getting Account, response state: ' + state);
            }
        });
        $A.enqueueAction(getAccountAction);
        
 		var getMessagesAction = component.get("c.beforeEdgWS");
        getMessagesAction.setParams({"merchantId": component.get("v.recordId")});
 
        // Configure response handler
        getMessagesAction.setCallback(this, function(response) {
            
            var state = response.getState();
            
            if(state === "SUCCESS") 
            {
                var sJson = response.getReturnValue(), oJson = JSON.parse(sJson);
                
                //*****Count of errors more than Zero
                if(oJson.count > 0)
                {
                component.set("v.errorMessage", oJson.count + ' error(s) to correct'); 
                $A.util.toggleClass(errorInfoP, "errorMessage");    
                component.set("v.errorList", oJson.data); 
                 
                if(oJson.existing == true)
                {
                  component.set("v.errorMessage", "Existing - " + oJson.data[0].sName);
                  $A.util.toggleClass(errorInfoP, "okMessage");
                  $A.util.toggleClass(errorHeader, "toggleHeader"); 
                }    
                    
                $A.util.toggleClass(okDiv, "toggle"); 
                }
                else 
                {
                 $A.util.toggleClass(errorDiv, "toggle");  
                }
            } 
            else 
            {
                console.log('Problem getting Messages, response state: ' + state);
            }
        });
        $A.enqueueAction(getMessagesAction);
        
	},
  
    //*************showSpinner aura:waiting event********  
    showSpinner: function(component, event, helper) {
        //component.set("v.Spinner", true); 
   },
    
   //***********hideSpinner aura:doneWaiting event*********
    hideSpinner : function(component,event,helper){
       //component.set("v.Spinner", false);
    },
    
   //******************saveEdg what was in init before ****************
    saveEdg: function(component, event, helper) {
        
        component.set("v.Spinner", true);
        
       	var saveEdgAction = component.get('c.saveEdgWS');
        
        // retrieve the merchant id to be sent 
        saveEdgAction.setParams({"merchantId": component.get("v.recordId")});
        
        // Configure response handler
       	saveEdgAction.setCallback(this, function(response) {
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
            component.set("v.Spinner", false);
            $A.get("e.force:closeQuickAction").fire();
            toastEvent.fire();
            $A.get("e.force:refreshView").fire();
    	});
        $A.enqueueAction(saveEdgAction);
    },
    //******************closePopUp**************** 
	closePopUp: function(component, event, helper) {
	    $A.get("e.force:closeQuickAction").fire();
    }
})