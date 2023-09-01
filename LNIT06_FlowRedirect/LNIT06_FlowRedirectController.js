({
    invoke : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        /*var urlRedirect = component.get("v.idRecord");
        var recordId = component.get("v.recordId");
        var urlComplete = '/lightning/ER_Delivery_Site__c/'+urlRedirect+'/view';
       
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            var varParentIdTab = response.parentTabId;
            workspaceAPI.openSubtab({
                parentTabId: varParentIdTab,
                recordId: urlRedirect,
                focus: true
            })
            
            workspaceAPI.closeTab({tabId: focusedTabId}); 

        })  */ 
        workspaceAPI.getFocusedTabInfo().then(function (response) {
            var focusedTabId = response.tabId;
            workspaceAPI.refreshTab({
                tabId: focusedTabId,
                includeAllSubtabs: true
            });
        })
        
        .catch(function(error) {
            console.log(error);
        });
        
    },
    invokeDynamic : function(component, event, helper) {
        var urlRedirect = component.get("v.idRecord");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": urlRedirect,
            "slideDevName": "detail"
        });
        navEvt.fire();
    }
})