({
    //Aggiorna la tabella
    updateTable: function(cmp, event, helper) {
        cmp.set("v.showErrors", false);
        var action = cmp.get("c.importDocumentOpportunity");
        action.setParams({ oppoId: cmp.get("v.recordId") });
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                var data = action.getReturnValue();
                cmp.set('v.data', data);
                console.log("SUCCESS UPDATETABLE");
                cmp.set("v.isModalNewDocumentOpen", false);
                //console.log("From server: " + JSON.stringify(action.getReturnValue())); 
                // You would typically fire a event here to trigger 
                // client-side notification that the server-side 
                // action is complete
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        // optionally set storable, abortable, background flag here
        // A client-side action could cause multiple events, 
        // which could trigger other events and 
        // other server-side action calls.
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },

    //Riceve informazioni sull'opportunity
    updateOpportunity: function(cmp, event, helper) {
        var action2 = cmp.get("c.importRelatedOpportunity1");
        action2.setParams({ opportunityId: cmp.get("v.recordId") });
        action2.setCallback(this, function(response) {
            var state2 = response.getState();
            if (state2 === "SUCCESS") {
                var data2 = action2.getReturnValue();
                cmp.set('v.relatedOppoDoc', data2);
                console.log("SUCCESS! UPDATEOPPORTUNITY");
                //console.log("From server: " + JSON.stringify(action2.getReturnValue())); 
            } else if (state2 === "ERROR") {
                var errors2 = response.getError();
                if (errors2) {
                    if (errors2[0] && errors2[0].message) {
                        console.log("Error message: " +
                            errors2[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action2);
    },

    //Azioni che avvengono quando viene caricato un file
    uploadFileCreateLink: function(cmp, event, helper) {
        // Get the list of uploaded files and the information about the selected row
        var uploadedFiles = event.getParam("files");
        console.log('uploadedFiles: ' + JSON.stringify(uploadedFiles));
        var documentId = uploadedFiles[0].documentId;
        cmp.set("v.rowFiles", uploadedFiles[0].documentId);
        var rowId = cmp.get("v.rowId");
        console.log("ROWID: " + rowId);
        var rowRientrato = cmp.get("v.rowIT_Returned__c");
        console.log("Id file caricato   : " + documentId);
        console.log("row id vale:  " + rowId);
        console.log("Rientrato: " + rowRientrato);
        alert("Files caricato : " + uploadedFiles.length);
        // Get the file name
        uploadedFiles.forEach(file => console.log(file.name));
        // Link uploaded file with the related IT_Edenred_Document        
        var action = cmp.get("c.createLink");
        action.setParams({ bdocid: rowId, documentId: documentId });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('State: ' + state);
            if (state === "SUCCESS") {
                //this.modifyDataRientro(cmp,event,helper);
                this.modifyBarcode(cmp, event, helper);
                /*if( rowRientrato === false){
                  console.log("Rientrato modificato!");
                  this.modifyRientrato(cmp,event,helper);
                }*/
                cmp.set("v.isModalOpen", false);
            } else if (state === "ERROR") {
                cmp.set("v.isModalOpen", false);
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        this.showToast("Error!", "error", errors[0].message);
                        console.log("Error message: " +
                            errors[0].message);
                        cmp.set("v.isModalOpen", false);
                        cmp.set("v.errorMessage", errors[0].message);
                        cmp.set("v.showErrors", true);

                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        var updateOppo = cmp.get("v.ListForUpdate")
        updateOppo.push(rowId);
        $A.enqueueAction(action);
        var action2 = cmp.get("c.updateDocumentsSingle");
        action2.setParams({ doc1: rowId, oppId: cmp.get("v.recordId") });
        action2.setCallback(this, function(response) {
            var state2 = response.getState();
            if (state2 === "SUCCESS") {
                console.log("Hai aggiornato documento");
                //$A.get('e.force:refreshView').fire();
                helper.updateTable(cmp, event, helper);
                //helper.updateOppoDate(cmp,event,helper);
                //cmp.set("v.draftValues",[]);
            } else if (state2 === "ERROR") {
                var errors2 = response.getError();
                if (errors2) {
                    if (errors2[0] && errors2[0].message) {
                        this.showToast("Error!", "error", errors2[0].message);
                        console.log("Error message: " +
                            errors2[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action2);
    },

    //Modifica il valore rientrato quando viene inserito un file e rientrato e' settato su false
    //AL MOMENTO QUESTA FUNZIONE E' STATA DISATTIVATA
    /*modifyRientrato: function(cmp,event,helper){
    	//var rowId=cmp.get("v.rowId");
    	//var rowRientrato=cmp.get("v.rowIT_Returned__c");
    	var action2 = cmp.get("c.updateFieldRientrato");
    	action2.setParams({IdRiga:cmp.get("v.rowId")});
    	// Create a callback that is executed after 
    	// the server-side action returns
    	action2.setCallback(this, function(response) {
        var state2 = response.getState();
        if (state2 === "SUCCESS") {
            // Alert the user with the value returned 
            // from the server
            console.log("SUCCESS!");
            this.updateTable(cmp,event,helper);
            // You would typically fire a event here to trigger 
            // client-side notification that the server-side 
            // action is complete
        }
        else if (state2 === "ERROR") {
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
   		 $A.enqueueAction(action2); 
    },*/

    //Modifica la Data di rientro quando viene inserito un file
    /*modifyDataRientro: function(cmp,event,helper){
    	var action2 = cmp.get("c.updateFieldDataRientro");
    	action2.setParams({IdRiga:cmp.get("v.rowId")});
    	// Create a callback that is executed after 
    	// the server-side action returns
    	action2.setCallback(this, function(response) {
        var state2 = response.getState();
        if (state2 === "SUCCESS") {
            // Alert the user with the value returned 
            // from the server
            console.log("SUCCESS!");
            this.updateTable(cmp,event,helper);
            // You would typically fire a event here to trigger 
            // client-side notification that the server-side 
            // action is complete
        }
        else if (state2 === "ERROR") {
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
    $A.enqueueAction(action2);
    },*/

    //modifica il barcode quando viene inserito un nuovo file
    modifyBarcode: function(cmp, event, helper) {
        console.log("**rowId " + cmp.get("v.rowId") + cmp.get("v.recordId"));

        var action = cmp.get("c.getBarcodeFromAutoNumber");
        action.setParams({ IdRiga: cmp.get("v.rowId"), oppId: cmp.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("SUCCESS! you changed the barcode");
                this.updateTable(cmp, event, helper);
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    updateOppoDate: function(cmp, event, helper) {
        var draftValues = event.getParam('draftValues');
        var action2 = cmp.get("c.updateOpportunityDate");
        action.setParams({ doc1: draftValues, oppId: cmp.get("v.recordId") });
        //var draftValues = event.getParam('draftValues');
        action2.setCallback(this, function(response) {
            var state2 = response.getState();
            if (state2 === "SUCCESS") {
                this.updateTable(cmp, event, helper);
                console.log("SUCCESS! HAI AGGIORNATO L'OPPORTUNITY");
                //console.log("From server: " + JSON.stringify(action2.getReturnValue())); 
            } else if (state2 === "ERROR") {
                var errors2 = response.getError();
                if (errors2) {
                    if (errors2[0] && errors2[0].message) {
                        console.log("Error message: " +
                            errors2[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action2);
    },

    updateOppDocument: function(cmp, event, helper) {
        //DraftValues contiene i valori inseriri dall'utente editabili dalla tabella
        var draftValues = event.getParam('draftValues');
        console.log(" Hai inserito questi valori:   " + draftValues[0].Id);
        var action2 = cmp.get("c.updateDocuments");
        action2.setParams({ doc1: draftValues, oppId: cmp.get("v.recordId") });
        action2.setCallback(this, function(response) {
            var state2 = response.getState();
            if (state2 === "SUCCESS") {
                console.log("Hai aggiunto un documento");
                //$A.get('e.force:refreshView').fire();
                helper.updateTable(cmp, event, helper);
                //helper.updateOppoDate(cmp,event,helper);
                //cmp.set("v.draftValues",[]);
            } else if (state2 === "ERROR") {
                var errors2 = response.getError();
                if (errors2) {
                    if (errors2[0] && errors2[0].message) {
                        console.log("Error message: " +
                            errors2[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action2);
    },

    getPicklist: function(cmp, event, helper) {
        var action = cmp.get("c.getPicklistDocument");
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('State: ' + state);
            if (state === "SUCCESS") {
                console.log('Evviva');
                var ListCoda = response.getReturnValue();
                console.log('ListCoda: ' + ListCoda);
                var fieldMap = [];
                for (var key in ListCoda) {
                    fieldMap.push({ key: key, value: ListCoda[key] });
                }
                console.log('fieldMap: ' + fieldMap);
                cmp.set("v.fieldMap", fieldMap);
                //console.log(fieldMap[0].value);
                cmp.set("v.selectedPicklist", fieldMap[0].value);
                console.log(cmp.get("v.selectedPicklist"));
            }
            if (state === "ERROR") {
                var message = errors[0].message;
                console.error('errors', message);
            }
        });
        $A.enqueueAction(action);
    },

    recallDoc: function(cmp, helper, event, docType, recordId) {
        var action = cmp.get("c.createNewDocument");
        action.setParams({
            oppoId: recordId,
            documentType: docType
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log('State: ' + state);
            if (state === "SUCCESS") {
                //console.log('Evviva');
                var boolDocumentCreated = response.getReturnValue();
                //console.log('Creato');
                console.log(boolDocumentCreated);
                //cmp.set("v.isModalNewDocumentOpen",false);
                //if(boolDocumentCreated === true){
                this.updateTable(cmp, event, helper);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Documento creato!",
                    "type": "success"
                });
                toastEvent.fire();
                //}
                // if(boolDocumentCreated === false){
                //     var toastEvent = $A.get("e.force:showToast");
                //     toastEvent.setParams({
                //         "title": "Attenzione!",
                //         "message": "E' già stato creato un documento di questo tipo!",
                //         "type" : "error"
                //         });
                // toastEvent.fire();
                // }
            }
            if (state === "ERROR") {
                var message = errors[0].message;
                console.error('errors', message);
            }
        });
        $A.enqueueAction(action);
    }
})