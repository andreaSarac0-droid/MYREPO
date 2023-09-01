({
    
	init : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        helper.buttonFilter(component, event, helper, recordId);
        helper.invokeShowButton(component, event, helper, recordId);
        helper.invokeIsMerchant(component, event, helper, recordId);
		helper.invokeResendLink(component, event, helper, recordId);
        helper.invokeInitDocusignButton(component, event, helper, recordId);
        helper.invokeHideResendLink(component, event, helper, recordId);
        
    },
    onClick : function(component, event, helper) {
        component.set("v.loaded",true);
        var recordId = component.get("v.recordId");
        console.log('recordId',recordId);
        var activated = component.get("v.activationVar");
        console.log('activationVar',activated);
        var revisione = component.get("v.revisioneVar");
        console.log('revisioneVar',revisione);
        
        const action = component.get('c.checkIndirizzi');
            action.setParams({
                oppId : recordId
            });
        
            action.setCallback(this, (response)=>{
                var status = response.getState();
                var returnVal = response.getReturnValue();
                console.log('returnVal',returnVal);
                if(returnVal === 'SUCCESS'){
            if(!activated || revisione){
                //if((!activated || !isMerchant) && revMerchant){
                    
                    const action2 = component.get('c.activateOpportunity');
                    action2.setParams({
                        recordId : recordId
                    });
                    action2.setCallback(this, (response)=>{
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
        					component.set("v.disableDocu",true);
                			console.log(component.get("v.disableDocu"));
                        }else {
                            var status = returnVal.split('·')[0];
                            if(status === 'MERCHANT'){
                                component.set("v.loaded",false);
                                helper.alert(component,event,helper,"success",'Invio onboarding in corso.','');
                                //$A.util.addClass(component.find('button'), "slds-button_success");
                                //component.set("v.buttonLabel",$A.get("$Label.c.IT_Onboarding_Email_Sent"));
                                component.set("v.disable", false); 
                                
                                $A.get('e.force:refreshView').fire();
                                
                            }else if(status === 'SUCCESS'){
                                component.set("v.loaded",false);
                                helper.alert(component,event,helper,"success",'Email inviata!','');
                                //$A.util.removeClass(myButton, "slds-button-neutral");
                                $A.util.addClass(component.find('button'), "slds-button_success");
                                component.set("v.buttonLabel",$A.get("$Label.c.IT_Onboarding_Email_Sent"));
                                component.set("v.disable", false);  
                                component.set("v.disable3", false);
                                $A.get('e.force:refreshView').fire();
                                
                            }else if(status === 'ERROR'){
                                component.set("v.loaded",false);
                                var statusCode = returnVal.split('·')[1];
                                var message = returnVal.split('·')[2];
            
                                console.error('Error code: '+statusCode+' - '+message);
                                helper.alert(component,event,helper,"error",'Errors activating opportunity: '+statusCode+message,message);
                            }
                        }
                });
                    
                $A.enqueueAction(action2);
        	
			}
        }else{
            component.set("v.loaded",false);
                    /*var errors = response.getError();
                    let message = ''; // Default error message
                    // Retrieve the error message sent by the server
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        message += errors[0].message;
                    }
                    console.error('errors',message);*/
                    helper.alert(component,event,helper,"error",'',returnVal);
                }
            
        });
    
        $A.enqueueAction(action);
	},
    
    onClickDocu: function(component, event, helper){
    	component.set("v.loaded",true);
        var recordId = component.get("v.recordId");
        console.log('recordId',recordId);
		helper.invokeDocusignLink(component, event, helper, recordId);        
    },
     resendOnboarding: function(component, event, helper){
        component.set("v.loaded",true);
            var recordId = component.get("v.recordId");
            const action = component.get('c.resendOnboardinglink');
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
                        component.set("v.disable2", false);  
                        $A.get('e.force:refreshView').fire();
                        helper.alert(component,event,helper,"success",'Link onboarding reinviato correttamente.','');
                    }else if(status === 'ERROR'){
                        component.set("v.loaded",false);
                        var statusCode = returnVal.split('·')[1];
                        var message = returnVal.split('·')[2];
    
                        console.error('Error code: '+statusCode+' - '+message);
                        helper.alert(component,event,helper,"error",'Errors resending link onboarding: '+statusCode+message,message);
                    }
                }
            });
                
            $A.enqueueAction(action);
    }
})