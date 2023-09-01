({
    handleUploadFinished: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var uploadedFiles = event.getParam("files");
        var fileName = uploadedFiles[0].name;
        var action = component.get('c.newAttachmentUpdate');
        action.setParams({
            "recordId": recordId,
            "documentId": uploadedFiles[0].documentId,
            "title": fileName
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("New version Created");
                var bdocId = response.getReturnValue();
                console.log(bdocId + ' CDOC '+  uploadedFiles[0].documentId);
                var action2 = component.get('c.createLink');
                action2.setParams({
                    "bdocid": bdocId,
                    "documentId": uploadedFiles[0].documentId,
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("LINK CREATED");
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": bdocId
                        });
                        navEvt.fire();
                    }
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        component.set("v.isModalOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    
    deleteVersion: function(component, event, helper) {
        // Set isModalOpen attribute to false
        //Add your code to call apex method or do some processing
        var recordId = component.get("v.recordId");
        var action = component.get("c.deleteLastVersion");
        action.setParams({
            "recordId":recordId
        })
        action.setCallback(this, function (response) {
            component.set("v.isModalOpen", false);
            var workspaceAPI = component.find("workspace");
            if (response.getState() == "SUCCESS") {
                var responseId = response.getReturnValue();
                if (responseId != null){
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.getEnclosingTabId().then(function(tabId) {
                            console.log(tabId);
                            var enclosingTabId = tabId;
                            workspaceAPI.focusTab({tabId : tabId}).then(function(response2) {
                                workspaceAPI.refreshTab({
                                    tabId: enclosingTabId,
                                    includeAllSubtabs: false
                                }).then(function(response3) {
                                    workspaceAPI.closeTab({tabId: focusedTabId})
                                })
                            })
                        })
                    });
                }
            }
        })
        $A.enqueueAction(action);
    },
    
})