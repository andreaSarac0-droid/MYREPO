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
                                   console.log('###SUCCESS');
                                   var result = response.getReturnValue();
                                   console.log('###result : '+JSON.stringify(result));
                                   if(result.length > 0){
                                       
                                       component.set("v.contract",result[0]);
                                       if(result[0].Status != 'Activated'){
                                           
                                           helper.showToast("Error","Cannot be amended","error","dismissible");
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
    amendContractHelper : function(component, event, helper) {
        
        var action = component.get("c.contractAmendment");
        var contractId = component.get("v.recordId");
        var opportunityId = component.get("v.contract").ER_OpportunityId__c;
        console.log('###test contractAmendment');
        action.setParams({
            "contractId" : contractId,
            "opportunityId" : opportunityId
        });
        action.setCallback(this, function(response)
                           {   
                               helper.toggleSpinner(component);
                               var state = response.getState();
                               console.log('STATE :: '+JSON.stringify(state));
                               if(state === "SUCCESS"){
                                   console.log('###SUCCESS');
                                   var result = response.getReturnValue();
                                   
                                   $A.get("e.force:closeQuickAction").fire();
                                   helper.showToast("","New opportunity created : "+result.Id,"success","sticky",result.Id); 
                               }
                               else if(state === "ERROR"){
                                   console.log('###ERROR response : '+JSON.stringify(action.getError()));
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
                "messageTemplate": '{1} created!',
                "messageTemplateData": ['', {
                    url: '/'+recordId,
                    label: 'Opportunity',
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