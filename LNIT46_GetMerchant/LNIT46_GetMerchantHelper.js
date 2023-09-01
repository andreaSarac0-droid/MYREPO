({
    preselect : function(component, event) {
        
        
        var recordObjId = component.get("v.recordId");
        
        let action = component.get("c.Preselect");
        
        
        action.setParams({ 
            "InputOpportunityId" : component.get("v.InputOpportunityId"),
            "objectid" : recordObjId
        });
        
        
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.opplinespresenti", response.getReturnValue());
                
                var opplinespresenti = component.get("v.opplinespresenti") ;
                var vdataconfronto = component.get ("v.data");
                
                
                console.log('OPP LINES GIA PRESENTI:' + JSON.stringify(opplinespresenti));
              //  console.log ('vdata da confrontare con le già presenti:'+ JSON.stringify(vdataconfronto));
                
                
                
                //controllo se le opp già presenti è pieno o vuoto
                if (typeof opplinespresenti != "undefined" && opplinespresenti != null && opplinespresenti.length != null && opplinespresenti.length > 0) {
                    console.log ('erano già presenti opplines');
                //era pieno, quindi, confrontarle con vdata e flaggare quelle con lo stesso productcode
                    var selectedRowsIds = [];
                    let x = 0;
                   
                    
                    vdataconfronto.forEach(function(element) {
                        
                        element.Id = '123456789qwertyui'+x
                        x++
                    }); 
                     
                   component.set ('v.data',vdataconfronto);   
                    
                
               
                 //var opplinespresentistringa = JSON.stringify(opplinespresenti);
              
                    
                  
                                   
                  vdataconfronto.forEach(function(element) {
                      opplinespresenti.forEach(function(opportunitylineitem) {
                      
                      if (opportunitylineitem.IT_Product_Code__c == element.product_ref){
                          
                          console.log ('Questa riga era già presente(ambito):'+ element.Id+' con questo productcode:'+element.product_ref);
                          selectedRowsIds.push(element.Id);
                          
                      }
                      
                    });
                    });
                    
                 
                    
                    
                    console.log ('selectedrowsids riempito con gli id da preflaggare:'+selectedRowsIds);
                    
                   component = component.find("partnerTable");           
                   component.set('v.selectedRows', selectedRowsIds);
                    
                    
                   var riempite = component.get("v.selectedRows") ;      
                   console.log ('selectedrows riempito con gli id da preflaggare:'+ JSON.stringify(riempite));   
                      
                    
                }  
                              
                //se è vuoto pre-flaggo tutte le righe nel component
                else {
                    
                    /*console.log ('non erano presenti opplineitem'); 
                    var selectedRowsIds = [];
                    let x = 0;
                    vdataconfronto.forEach(function(element) {
                        
                        element.Id = '123456789qwertyui'+x
                        x++
                    }); 
                     
                     component.set ('v.data',vdataconfronto);   
                    
                    
                     vdataconfronto.forEach(function(element) {
               
                    selectedRowsIds.push(element.Id);
                   
            }); 

                    
                   
                    console.log ('selectedrowsids riempito con gli id da preflaggare::'+JSON.stringify(selectedRowsIds));
                    
                    component = component.find("partnerTable");           
                    component.set('v.selectedRows', selectedRowsIds);
                    
                    
                    var riempite = component.get("v.selectedRows") ;      
                    console.log ('selectedrows riempito con gli id da preflaggare:'+ JSON.stringify(riempite)); */
                                       
                }
                
                
                
            }
            
        });
        // Send action off to be executed
        $A.enqueueAction(action);
        
        
        
    },
    
       getDocument: function(component,event,helper){
        var row = event.getParam("row");
        var barcodeRow = row.barcode;
        console.log(barcodeRow);
        var action = component.get("c.getDocumentFromBarcode");
        action.setParams({barcode :row.barcode});
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