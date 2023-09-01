({	
    doInit : function(component, event, helper) {
        console.log('doInit!');
        helper.getOpportunityHelper(component, event, helper);
    },
	cancel : function(component, event, helper) {
        
		$A.get("e.force:closeQuickAction").fire();
	},
    DiscardAmendment : function(component, event, helper) {
        helper.toggleSpinner(component);
		helper.DiscardAmendmentHelper(component, event, helper);
	}
})