({
	doInit : function(component, event, helper) {
		helper.showEDocument(component, event, helper);    
	},

	showDocumentFilter : function(component, event, helper) {
		component.set('v.loaded', false);
		helper.showEDocument(component, event, helper);    
	},

	openAllEDocument : function(component,event,helper) {
        var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
		var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT32_EDocument",
            componentAttributes : {
                recordId : recordObjectId,
                sObjectName : recordObjectName,
                viewAllBool : false,
            }    
        });
        evt.fire();  	
    },
})