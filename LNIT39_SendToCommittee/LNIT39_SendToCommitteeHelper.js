({
	sendInfo: function(component,helper,recordId,userId) {
            var recordId = component.get("v.recordId");
            var userId = $A.get("$SObjectType.CurrentUser.Id");
            var action = component.get("c.retiveAnyPointData");
            action.setParams({
                "objectid": recordId,
                "userIDstr": userId
            });
            action.setCallback(this, function(response) { //quando apex risponde
                if (response.getState() === "SUCCESS"){
                  var toastEvent = $A.get("e.force:showToast");
                  toastEvent.setParams({
                      "type": "success",
                      "title": "Successo",
                      "message": "Note salvate ed inviate al comitato "
                  });
                  toastEvent.fire(); 
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
            }
        })
        $A.enqueueAction(action);
      }
})