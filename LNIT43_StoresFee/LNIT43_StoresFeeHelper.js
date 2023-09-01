({
    getData : function( component, event ) {

        var action = component.get( "c.getFeeData" ); 
        var recordId = component.get("v.recordId");
        var gruppo = component.get("v.gruppoEconomico");
        console.log("recordId: " + recordId);
        var service = component.get("v.serviceName");
        console.log("service: " + service);
        action.setParams({"recordId": recordId,
                        "service" : service });
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            console.log("state: " + state);
            var dataBase= [];
            var dataParticolari= [];
            if (state === "SUCCESS") {
                if ( response.getReturnValue() != null ) {
                    var result = response.getReturnValue();
                    console.log("result: " + JSON.stringify(result));
                    result.forEach(res => {
                        if(res.economic_group_ref == '000000'){
                            dataBase.push(res);
                            console.log("dataBase"+dataBase);
                        }
                        else {
                            dataParticolari.push(res);
                            console.log("dataParticolari"+dataParticolari);
                        }
                        
                    });
                    
                    if(gruppo){
                        component.set("v.data", dataBase);
                        console.log("v data base"+dataBase);
                    }
                    else{
                        component.set("v.data", dataParticolari);
                        console.log("v data particolari"+dataParticolari);
                    }                
                    //component.set("v.data", result);
                    console.log("data OK ");
                }
                else {
                    console.log("No Data Found");
                }
			}	
             
            else if (state === 'ERROR'){
                var errors = response.getError();
                console.log(JSON.stringify(errors));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore!",
                    "message": "Nessun servizio chiamato "+ service + " trovato." 
                });
                toastEvent.fire();
            } 
            else{
                console.log('Something went wrong, Please check with your admin');
            }
        });
        $A.enqueueAction(action);
    },

    /*sortData: function (component, fieldName, sortDirection) {
        var dataToSort = component.get("v.data");
        var reverse = sortDirection !== 'asc'; 
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        component.set("v.data", dataToSort);
    },*/
                              
    getDocument: function(component,event,helper){
        var row = event.getParam("row");
        var barcodeRow = row.barcode_contract;
        console.log(barcodeRow);
        var action = component.get("c.getDocumentFromBarcode");
        action.setParams({barcode :row.barcode_contract});
        action.setCallback(this, function(response) {
        var state = response.getState();
        console.log(state);
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