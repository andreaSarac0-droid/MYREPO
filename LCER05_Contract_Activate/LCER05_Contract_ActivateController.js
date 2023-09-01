({
    doInit : function(component, event, helper) {
        
        helper.getContractHelper(component, event, helper);
    },
	cancel : function(component, event, helper) {
        
		$A.get("e.force:closeQuickAction").fire();
	},
    activateContract : function(component, event, helper) {
        helper.toggleSpinner(component);
		helper.activateContractJSHelper(component, event, helper);
	}
})