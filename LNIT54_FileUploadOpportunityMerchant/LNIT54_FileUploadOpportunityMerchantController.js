({
    //Ricava i campi relativi all'opportunity e ai documenti relazionati
    init: function (cmp, event, helper) {
        helper.updateTable(cmp,event,helper);
        helper.updateOpportunity(cmp,event,helper);
        //set datatable columns
        cmp.set('v.columns', [
                { label: 'Documento', fieldName: 'IT_Record_Link__c', type: 'url',typeAttributes: {label: { fieldName: 'IT_Document_Type_Confirmed__c' }, target: '_self'}},
                //{ label: 'Rientrato', fieldName: 'IT_Returned__c', type: 'boolean',editable:'true'}, //Rientrato non deve comparire nella tabella 
                { label: 'Data Rientro', fieldName: 'IT_Return_Date__c', type: 'date-local', editable:'true'},
                { label: 'Barcode', fieldName: 'IT_Barcode__c', type: 'text',editable:'true'},
                { label: 'Data Firma', fieldName: 'IT_Signing_Date__c', type: 'date-local',editable:'true'},
                { label: 'Carica', type:  'button', typeAttributes:{iconName: 'utility:upload',label: '',name: 'Carica', title: '', disabled: false, value: 'test'},cellAttributes: { alignment: 'center' }}
                ]);
        
    },
    
    //Imposta isModalOpen a true e recupera informazioni sulla riga selezionata
	openModal: function(component, event, helper) {
        component.set("v.isModalOpen", true);
		var row = event.getParam("row");
        component.set("v.rowId",row.Id);
        component.set("v.rowIT_Returned__c",row.IT_Returned__c);
        component.set("v.rowScelta",row); 
        component.set("v.rowIT_Barcode__c",row.IT_Barcode__c);
        component.set("v.rowIT_Return_Date__c",row.IT_Return_Date__c);
        component.set("v.rowIT_Signing_Date__c",row.IT_Signing_Date__c);
        component.set("v.rowIT_Barcode_AutoNumber__c",row.IT_Barcode_Autonumber__c);
        console.log("Ritorno:    " + row.IT_Returned__c);
        console.log("Data ritorno:    " + row.IT_Return_Date__c);
        console.log("Data firma:    " + row.IT_Signing_Date__c);
        console.log("Barcode documento:    " + row.IT_Barcode_Autonumber__c);
        console.log("type:    " + row.IT_Document_Type_Confirmed__c);
   },
    
    //Cosa succede dopo che un file e' stato caricato
    handleUploadFinished: function (cmp, event, helper) {
        console.log("!v.recordId" + cmp.get("v.recordId"));
		helper.uploadFileCreateLink(cmp,event,helper);
        //helper.modifyDataRientro(cmp,event.helper);
        //helper.modifyBarcode(cmp,event,helper);
    },      
    
    //Imposta isModalOpen chiudendo il pop-up
    exitModal: function(cmp, event, helper) {
        cmp.set("v.isModalOpen", false);
   },
    
    //Cosa succede quando viene cliccato il pulsante salva
	handleSave: function (cmp, event, helper) {
        //DraftValues contiene i valori inseriri dall'utente editabili dalla tabella
      	var draftValues = event.getParam('draftValues');
      	console.log(" Hai inserito questi valori:   " + draftValues[0].Id);
      	var action = cmp.get("c.updateDocuments");
      	action.setParams({doc1 : draftValues,oppId:cmp.get("v.recordId")});
      	action.setCallback(this, function(response) {
          var state = response.getState();
          if(state === "SUCCESS"){
              console.log("Hai aggiunto un documento");
              //$A.get('e.force:refreshView').fire();
              helper.updateTable(cmp,event,helper);
              //helper.updateOppoDate(cmp,event,helper);
              cmp.set("v.draftValues",[]);
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
    
    //Cosa succede quando viene cliccato il tasto ricarica
    refreshButton: function(cmp,event,helper){
        cmp.set("v.showErrors",false);
    	helper.updateTable(cmp,event,helper);
	},
    //Viene cliccato il pulsante Nuovo doc
    newDoc: function(cmp,event,helper){
        console.log('Nuovo doc');
        cmp.set("v.isModalNewDocumentOpen",true);
        helper.getPicklist(cmp,event,helper);
    },
    //Chiudo pop up del nuovo doc
    exitModalNewDocument: function(cmp,event,helper){
        cmp.set("v.isModalNewDocumentOpen",false);
    },

    onChange: function(cmp,event,helper){
        console.log(cmp.get("v.selectedPicklist"));
    },
    //Prendo i parametri per creare documento
    createDoc: function(cmp,event,helper){
        var tipoDocumento = cmp.get("v.selectedPicklist");
        var recordId = cmp.get("v.recordId");
        helper.recallDoc(cmp,event,helper,tipoDocumento,recordId);
        helper.updateTable(cmp,event,helper);
    }
	
});