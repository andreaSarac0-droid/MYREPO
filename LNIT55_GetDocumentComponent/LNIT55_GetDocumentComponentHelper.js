({
	retriveName : function(cmp,event,helper) {
		var action = cmp.get("c.getObjectName");
        action.setParams({ myId : cmp.get("v.recordId")});
        action.setCallback(this, function(response) {
        	var state = response.getState();
            if (state === "SUCCESS") {
 				var objName = action.getReturnValue();
                cmp.set('v.ObjectName',objName);
                console.log("Il tuo oggetto:  " + cmp.get("v.ObjectName"));
                console.log(cmp.get("v.recordId"));
                console.log("SUCCESS");
                this.retriveObjectData(cmp,event,helper);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown error");
                }
            }
        });
		$A.enqueueAction(action);
	},
    
    retriveObjectData: function(cmp, event, helper){
        var action = cmp.get("c.getObjectBarcode");
        console.log("Il campo da te scelto vale:" + cmp.get("v.fieldName"));
        action.setParams({ objName:cmp.get("v.ObjectName"), myId : cmp.get("v.recordId"), nomeCampo : cmp.get("v.fieldName")});
        action.setCallback(this, function(response) {
        	var state = response.getState();
            if (state === "SUCCESS") {
 				var objBarcode = action.getReturnValue();
                cmp.set('v.recordBarcode',objBarcode);
                console.log(cmp.get("v.recordBarcode"));
                console.log("SUCCESS");
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown error");
                }
            }
        });
		$A.enqueueAction(action);
    },
    
    getDocumentFromBarcode : function(cmp, event, helper){
        var action = cmp.get("c.getDocFromBarcode");
        action.setParams({barcode : cmp.get("v.recordBarcode")});
        console.log(cmp.get("v.recordBarcode"));
        action.setCallback(this, function(response) {        	
            var state = response.getState();
            if (state === "SUCCESS") {
 				var docId = action.getReturnValue();
                if(docId != null){
                	cmp.set('v.DocumentId',docId);
                	window.open("/lightning/r/" + docId+ "/view","_self");
                	console.log("SUCCESS");
                }
                else{
                    cmp.set("v.isModalOpen",true);
                    //alert("Non è stato trovato nessun documento associato a questo barcode:  "+ cmp.get("v.recordBarcode"));
                }
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                        cmp.set("v.isModalOpen",true);
                        //alert("Non è stato trovato nessun documento associato a questo barcode:  "+ cmp.get("v.recordBarcode"));
                    }
                } 
                else {
                    console.log("Unknown error");
                }
            }
        });
		$A.enqueueAction(action);
    }

})