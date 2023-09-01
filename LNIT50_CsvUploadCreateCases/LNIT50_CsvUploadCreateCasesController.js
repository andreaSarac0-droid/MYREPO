({
	handleUploadFinished: function (component, event, helper) {
        console.log("Documento Caricato");
        var uploadedFiles = event.getParam("files");
        var contentVersionId = uploadedFiles[0].contentVersionId;
        var documentId = uploadedFiles[0].documentId;
        console.log("contentVersionId "+contentVersionId+' docId '+documentId);
        var recordId = component.get('v.recordId');
        var action = component.get("c.createCases");
        action.setParams({
            "contentVersionId": contentVersionId,
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("Casi creati");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"success",
                    "title": "Operazione avvenuta con successo",
                    "message": "Creazione dei casi avvenuta con successo!"
                });
                toastEvent.fire();
                
            }
            else{
                console.log("Errore");
                var errors = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore",
                    "message": errors[0].message
                });
                toastEvent.fire();
                 
            }
        });
        $A.enqueueAction(action);
        
    },
})