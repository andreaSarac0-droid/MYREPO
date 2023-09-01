({
	init : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        helper.invokeShowButton(component, event, helper, recordId);

    },
    onClick : function(component, event, helper) {
        component.set("v.loaded",true);
        var recordId = component.get("v.recordId");
        const action = component.get('c.uploadOpportunityContractAura');
        action.setParams({
        	recordId : recordId
        });
        action.setCallback(this, (response)=>{
        //var status = response.getState();
        var returnVal = response.getReturnValue();
                console.log('returnVal',returnVal);
                if(returnVal === null || returnVal === ''){
                    var errors = response.getError();
                    let message = ''; // Default error message
                    // Retrieve the error message sent by the server
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        message += errors[0].message;
                    }
                    console.error('errors',message);
                    helper.alert(component,event,helper,"error",message,'');
                    //helper.alert(component,event,helper,"Error",'An internal error occurred. Please, contact your administrator.','');
                    component.set("v.loaded",false);
                }else {
                    var status = returnVal.split('·')[0];
                    if(status === 'SUCCESS'){
                        component.set("v.loaded",false);
    					if((returnVal.split('·')).length == 2){
    						helper.alert(component,event,helper,"success",returnVal.split('·')[1],'');
						}else{
 							helper.alert(component,event,helper,"success",'Contratto inviato!','');
 						}
                        //$A.util.addClass(component.find('button'), "slds-button_success");
                        //component.set("v.buttonLabel",'Onboarding Email inviata');
                        //component.set("v.disable", false);  
                        $A.get('e.force:refreshView').fire();
                        
                    }else if(status === 'ERROR'){
                        component.set("v.loaded",false);
                        var statusCode = returnVal.split('·')[1];
                        var message = returnVal.split('·')[2];
    
                        console.error('Error code: '+statusCode+' - '+message);
                        helper.alert(component,event,helper,"error",'Errors sending contract: '+statusCode+message,message);
                    }
                }
            });
                
        $A.enqueueAction(action);
    }
        
})