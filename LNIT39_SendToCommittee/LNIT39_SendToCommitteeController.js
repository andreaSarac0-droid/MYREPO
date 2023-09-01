({
	openModel : function(component, event, helper) {
		component.set("v.isModalOpen", true)
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  to close popup
        component.set("v.isModalOpen", false);
     },

    saveInfo : function(component, event, helper) {
        var comments = component.find("notes").get("v.value");
        component.set("v.note",comments);
        console.log("comments:",comments);
        var obj =component.get("v.sObjectName");
        var checked="YES";
        component.set("v.checked",checked);
        console.log("checked:",checked);
        var recordId = component.get("v.recordId");
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log("userId:",userId);
        
        var action = component.get("c.saveNotes");
        action.setParams({
            "recordId": recordId,
            "notes": comments,
            "check": checked,
            "obj": obj
        });
        action.setCallback(this, function(response) { //quando apex risponde
                if (response.getState() === "SUCCESS"){
                    helper.sendInfo(component, helper,recordId,userId);
                    console.log("salvate con successo");
                    component.set("v.isModalOpen", false);
                }
                else {
                    var errors = response.getError();
                    console.log(JSON.stringify(errors));
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type": "error",
                        "title": "Errore!",
                        "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                    });
                    toastEvent.fire(); //allert a video
                    component.set("v.isModalOpen", false);
            }
        })
        $A.enqueueAction(action);         
        
	},

	
})