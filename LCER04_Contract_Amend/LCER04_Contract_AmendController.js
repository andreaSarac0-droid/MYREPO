({
    doInit : function(component, event, helper) {
        
        helper.getContractHelper(component, event, helper);
    },
	cancel : function(component, event, helper) {
        
		$A.get("e.force:closeQuickAction").fire();
	},
    amendContract : function(component, event, helper) {
        helper.toggleSpinner(component);
		helper.amendContractHelper(component, event, helper);
	}
})