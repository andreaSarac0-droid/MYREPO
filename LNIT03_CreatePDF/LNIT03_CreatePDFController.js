({
	doInit : function(component, event, helper) {
		var recordObjectName = component.get("v.sObjectName");
        var recordObjectId = component.get("v.recordId");
        var action = component.get('c.ShowPdfList');
        action.setParams({
            "objectType": recordObjectName,
            "recordId": recordObjectId
        })
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var templateList = response.getReturnValue();
                if (templateList != null && templateList != '') {
                    component.set("v.templateListName", templateList);
                    console.log('TemplateView::' + templateList);
                }
            }
        });
        $A.enqueueAction(action);

	},
    
    	invoke : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
		var templateId = component.get("v.idTemplateHtml");
		console.log('idTemplateHtml: '+templateId);
		var action = component.get("c.ShowPdf");
        action.setParams({
            "TemplateId": templateId,
            "recordObjectId": recordObjectId,
            "recordObjectName": recordObjectName 
        })
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var templateHtml = response.getReturnValue();
                $A.get("e.force:closeQuickAction").fire();
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.refreshTab({
                              tabId: focusedTabId,
                              includeAllSubtabs: true
                     });
                });
            }
        });
        $A.enqueueAction(action);
        //window.open('/lightning/r/Case/' + recordObjectId + '/view', '_top');
	}
})