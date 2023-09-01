({  
    getOpportunityHelper : function(component, event, helper){

        var action = component.get("c.getOpportunityRecord");
        action.setParams({
            "opportunityId" : component.get("v.recordId"),
        });
        action.setCallback(this, function(response){
            
            var state = response.getState();
            
            if(state === "SUCCESS"){

                var result = response.getReturnValue();
                if(result.length > 0){
                    
                    component.set("v.opportunity",result[0]);
                    if(result[0].ER_IsAmended__c == false){
                        
                        helper.showToast("Error",$A.get("$Label.c.LABS_SF_Opp_CannotDiscardAmendment"),"error","dismissible");
                        $A.get("e.force:closeQuickAction").fire();
                    }
                } 
            }
            else if(state === "ERROR"){
                console.log('ERROR!');
                helper.showToast("Error",action.getError()[0].message,"error","dismissible");
            }
        });
        $A.enqueueAction(action);
    },
    DiscardAmendmentHelper : function(component, event, helper) {
        var action = component.get("c.discardAmendement");
        action.setParams({
            "opportunityId" : component.get("v.recordId"),
        });
        
        action.setCallback(this, function(response){
            helper.toggleSpinner(component);
            var state = response.getState();
            
            if(state === "SUCCESS"){
                console.log('SUCCESS!');
                $A.get("e.force:closeQuickAction").fire();
                helper.showToast("",$A.get("$Label.c.LABS_SF_Opp_SuccessfullyDeleted"),"success","dismissible");
                helper.openRelatedList(component, event);
            }
            else if(state === "ERROR"){
                console.log('ERROR!');
                helper.showToast("Error",action.getError()[0].message,"error","dismissible");
            }
        });
        
        $A.enqueueAction(action);
    },
    toggleSpinner : function (component) {  
        
        var spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(title, message, type, mode) {
        var toastEvent = $A.get("e.force:showToast");

        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,            
            "mode": mode
        });

        toastEvent.fire();
    },
    openRelatedList: function(component, event){
        var relatedListEvent = $A.get("e.force:navigateToRelatedList");
        relatedListEvent.setParams({
            "relatedListId": "Opportunities",
            "parentRecordId": component.get("v.opportunity").AccountId
        });
        relatedListEvent.fire();
    }
})