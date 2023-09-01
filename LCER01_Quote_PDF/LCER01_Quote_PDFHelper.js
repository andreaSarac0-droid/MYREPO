({
    previewHelper : function(component, event, helper) {
        this.toggleSpinner(component);
        var action = component.get("c.previewPDF");
        action.setParams({
            "selectedTemplate" : component.get("v.templateName"),
            "objectId" : component.get("v.recordId"),
        });
        
        action.setCallback(this, function(response){
            
            var state = response.getState();
            
            if(state === "SUCCESS"){
                console.log("SUCCESS");
                console.log("response.getReturnValue() : "+response.getReturnValue());
                component.set("v.blobString", response.getReturnValue());
                component.set("v.isOpen", true);
                this.toggleSpinner(component);
            }
            else if(state === "ERROR"){
                this.toggleSpinner(component);
                console.log("ERROR");
            }
        });
        
        $A.enqueueAction(action);
    },
    saveHelper : function(component, event, helper) {
        console.log('toggleSpinners ! : ');
        this.toggleSpinner(component);
        var action = component.get("c.savePDF");
        action.setParams({
            "selectedTemplate" : component.get("v.templateName"),
            "objectId" : component.get("v.recordId"),
        });
        
        action.setCallback(this, function(response){
            
            let state = response.getState();
            
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                console.log('Save SUCCESS : '+JSON.stringify(result));
                console.log('Is Phone : '+$A.get("$Browser.isPhone"));
                if($A.get("$Browser.isPhone")){
                    $A.get("e.force:closeQuickAction").fire();
                    helper.showToast(component,"","PDF was saved successfully to quote.");
                }
                else{
                    var actionAPI = component.find("quickActionAPI");
                    var targetFields = {ToAddress: {value: result.contactId}, Subject: {value: "Edenred Contract"}, ContentDocumentIds: {value: result.contentdocumentId}};
                    var args = {actionName: "Quote.SendEmail",entityName: "Quote", targetFields: targetFields};
                    actionAPI.setActionFieldValues(args).then(function(result){
                        
                        helper.toggleSpinner(component);
                        $A.get("e.force:closeQuickAction").fire();
                        helper.showToast(component,"","PDF was saved successfully to quote.");
                    }).catch(function(e){                   
                        helper.toggleSpinner(component);
                        $A.get("e.force:closeQuickAction").fire();
                        helper.showToast(component,"Error",JSON.stringify(e),"error");
                        console.log('error ! : '+JSON.stringify(e));
                    });
                }
            }
            else if(state === "ERROR"){
                console.log('toggleSpinners ! : ');
                helper.toggleSpinner(component);
                $A.get("e.force:closeQuickAction").fire();
                helper.showToast(component,"Error","error","error");
            }
        });
        
        $A.enqueueAction(action);
    },
    toggleSpinner : function (component) {  
        
        var spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(component, title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": type,
            "title": title,
            "message": message
        });
        toastEvent.fire();
    },
    getTemplates : function(component, event, helper){

        var action = component.get("c.getTemplates");
        var custs = [];
        custs.push({value:'-', key:''});

        action.setCallback(this, function(response){
            
            var state = response.getState();
            
            if(state === "SUCCESS"){

                var templatesMap = response.getReturnValue();
                console.log("SUCCESS");

                for (var keyy in templatesMap) {
                    
                    console.log(keyy + " = " + templatesMap[keyy]);
                    custs.push({value:templatesMap[keyy], key:keyy});
                }
            }
            else if(state === "ERROR"){

                console.log("ERROR");
            }
            
            component.set("v.functions",custs);
        });

        
        $A.enqueueAction(action);
    }

})