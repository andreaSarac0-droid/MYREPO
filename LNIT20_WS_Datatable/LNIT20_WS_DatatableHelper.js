({
    getColumns : function( cmp, event ) {
        // NEED TO ADD DATA FETCH THROUGH WS
        var action = cmp.get( "c.getMetadataColumns" ); 
        var recordId = cmp.get("v.recordId");
        var service = cmp.get("v.serviceName");
        action.setParams({"service": service });
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.loaded', true);
                if ( response.getReturnValue() != null ) {
                    var result = response.getReturnValue();
                    var columns = [];
                    console.log("result: " + JSON.stringify(result));
                    result.forEach(function(singleColumn){
                        columns.push({label : singleColumn.IT_Column_Label__c, fieldName : singleColumn.IT_Column_Data_Name__c, type : singleColumn.IT_Column_Data_Type__c});
                    });
                    columns.push({label: 'PDF',type: 'button',typeAttributes:{label: 'PDF',name: 'Carica', title: '', disabled: false, value: 'test',},cellAttributes: { alignment: 'left' },initialWidth: 100});                    
                    cmp.set("v.columns",columns);
                    console.log("Columns OK " + JSON.stringify(columns));
                }
                else {
                    console.log("No Columns Found");
                }
            } else if (state === 'ERROR'){
                cmp.set('v.loaded', true);
                var errors = response.getError();
                console.log(JSON.stringify(errors));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore!",
                    "message": "Nessun servizio chiamato "+ service + " trovato." 
                });
                toastEvent.fire();
            } else{
                console.log('Something went wrong, Please check with your admin');
            }
        });
        $A.enqueueAction(action);
    },
    
    updateTable : function( cmp, event, helper ) {
        var action = cmp.get( "c.getAFFIData" );
        var recordId = cmp.get("v.recordId");
        var sObjectName = cmp.get("v.sObjectName");
        var service = cmp.get("v.serviceName");
        
        action.setParams({"service": service, "recordId" : recordId, "objectName" : sObjectName});
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.loaded', true);
                if ( response.getReturnValue() != null ) {
                    var result = response.getReturnValue();
                    console.log("result: " + result);
                    
                    var data = JSON.parse(result).data;
                    cmp.set('v.data',data);
                    console.log("DATA OK: " + data);
                    
                }
                else {
                    console.log("No Columns Found");
                }
            } else if (state === 'ERROR'){
                cmp.set('v.loaded', true);
                var errors = response.getError();
                console.log(JSON.stringify(errors));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore!",
                    "message": "Nessun servizio chiamato "+ service + " trovato sull'oggetto "+ sObjectName
                });
                toastEvent.fire();
            } else{
                console.log('Something went wrong, Please check with your admin');
            }
        });
        
        // Queue this action to send to the server
        $A.enqueueAction(action);
    },
    
    getDocument: function(component,event,helper){
        var row = event.getParam("row");
        var barcodeRow = row.barcode_contract;
        console.log(barcodeRow);
        var action = component.get("c.getDocumentFromBarcode");
        action.setParams({barcode :row.barcode_contract});
        action.setCallback(this, function(response) {
        var state = response.getState();
        	if (state === "SUCCESS") {
                var docId = action.getReturnValue();
                if(docId != null){
                	window.open("/lightning/r/"+docId+ "/view","_self");
                    console.log("Document retrieved!");
                }
                else{
                    console.log("Documento non trovato");
                    component.set("v.isModalOpen",true);
                }
        	}
            else if (state === "ERROR") {
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                        //component.set("v.isModalOpen",true);
                        alert("Si è verificato un errore");
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