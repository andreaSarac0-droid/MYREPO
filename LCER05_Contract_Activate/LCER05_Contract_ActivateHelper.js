({
    getContractHelper : function(component, event, helper) {
        var action = component.get("c.getContract");
        action.setParams({
            "contractId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response)
                           {   
                               
                               var state = response.getState();
                               
                               if(state === "SUCCESS"){

                                   var result = response.getReturnValue();
                                   if(result.length > 0){
                                       
                                       component.set("v.contract",result[0]);
                                       if(result[0].Status == $A.get("$Label.c.LABS_SF_Contract_Status_Activated")){
                                           
                                           helper.showToast("Error",$A.get("$Label.c.LABS_SF_Contract_AlreadyActivated"),"error","dismissible");
                                           $A.get("e.force:closeQuickAction").fire();
                                       }
                                       else if(result[0].Status == $A.get("$Label.c.LABS_SF_Contract_Status_Terminated")){
                                           helper.showToast("Error",$A.get("$Label.c.LABS_SF_Contract_CannotBeActivated"),"error","dismissible");
                                           $A.get("e.force:closeQuickAction").fire();
                                       }
                                   }
                               }
                               else if(state === "ERROR"){
                                   console.log('###ERROR response : '+JSON.stringify(action.getError()));
                                   helper.showToast("Error",action.getError()[0].message,"error","dismissible");
                               }
                           });
        $A.enqueueAction(action);                
    },
    activateContractJSHelper : function(component, event, helper) {
        
        var action = component.get("c.activateContractController");
        var contract = component.get("v.contract");
        var opportunityId = contract.ER_OpportunityId__c;
        console.log('###activateContractJSHelper contract : '+contract);
        action.setParams({
            "contract" : contract,
            "opportunityId" : opportunityId
        });
        action.setCallback(this, function(response)
                           {   
                               helper.toggleSpinner(component);
                               var state = response.getState();
                               console.log('STATE :: '+JSON.stringify(state));
                               if(state === "SUCCESS"){

                                   $A.get("e.force:closeQuickAction").fire();
                                   $A.get("e.force:closeQuickAction").fire();
                                   var activationMessage = $A.get("$Label.c.LABS_SF_Contract_SuccessfullyActivated");
                                   activationMessage = activationMessage.replace('{0}',contract.ContractNumber);
                                   helper.showToast("",activationMessage,"","dismissible");
                                   $A.get('e.force:refreshView').fire();
                               }
                               else if(state === "ERROR"){
                                   console.log('###ERROR : '+JSON.stringify(action.getError()));
                                   helper.showToast("Error",action.getError()[0].message,"error","dismissible");
                               }
                           });
        $A.enqueueAction(action);   
    },
    toggleSpinner : function (component) {  
        
        var spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(title, message, type, mode, recordId) {
        var toastEvent = $A.get("e.force:showToast");
        if(recordId != null){
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,            
                "mode": mode,
                "messageTemplate": $A.get("$Label.c.LABS_SF_Contract_OpportunityAmended1"),
                "messageTemplateData": ['', {
                    url: '/'+recordId,
                    label: $A.get("$Label.c.LABS_SF_Contract_OpportunityAmended2"),
                }
                                       ]
            });
        }else{
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,            
                "mode": mode
            });
        }
        
        toastEvent.fire();
    }
})