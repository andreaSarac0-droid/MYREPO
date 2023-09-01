({
    doInit: function(component, event, helper) {
        if (component.get('v.isFlow')) {
            var recordObjectName = component.get("v.objectName");
            var recordObjectId = component.get("v.recordId");
        } else {
            var recordObjectName = component.get("v.sObjectName");
            var recordObjectId = component.get("v.recordId");
        }
        var emailAddressTo = component.get("v.emailAddressTo");
        var emailAddressFrom = component.get("v.emailAddressFrom");
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

    invoke: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        if (component.get('v.isFlow')) {
            var recordObjectName = component.get("v.objectName");
            var recordObjectId = component.get("v.recordId");
        } else {
            var recordObjectName = component.get("v.sObjectName");
            var recordObjectId = component.get("v.recordId");
        }
        var emailAddressTo = component.get("v.emailAddressTo");
        var emailAddressFrom = component.get("v.emailAddressFrom");
        var templateId = component.get("v.idTemplateHtml");
        console.log('idTemplateHtml: ' + templateId + '*' + recordObjectId + '*' + recordObjectName + '*' + emailAddressTo + '*' + emailAddressFrom);

        var action = component.get("c.ShowPdf");
        action.setParams({
            "TemplateId": templateId,
            "recordObjectId": recordObjectId,
            "recordObjectName": recordObjectName,
            "emailAddressTo": emailAddressTo,
            "emailAddressFrom": emailAddressFrom

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

                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "success",
                    "title": "Success!",
                    "message": "Generato Pdf, inviato in allegato a Email < " + emailAddressTo + " > ."
                });
                toastEvent.fire();
                console.log('showToast*** ');
            } else {
                var errors = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "error",
                    "title": "Errore!",
                    "message": "Si è verificato un errore nell'invio della Email: " + errors[0].pageErrors[0].message
                });
                toastEvent.fire();
            }
        });

        $A.enqueueAction(action);
        //window.open('/lightning/r/Case/' + recordObjectId + '/view', '_top');
    }
})