({
	myAction : function(component, event, helper) {
		//component.set("v.toggleSpinner", false);
        component.set("v.loaded", true);
        var recordId = component.get("v.recordId");
       
        var userId = $A.get("$SObjectType.CurrentUser.Id");
       
       helper.mainMethod(component, helper,recordId,userId);
	}
})