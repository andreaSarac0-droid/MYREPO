({
	init: function (component, event, helper){
		var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
        component.set('v.loaded', false);
        helper.callCaseField(component, event, helper, recordObjectId, recordObjectName);
        
    },
    
    showCaseFilter: function (component, event, helper){
		var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
        var icona = component.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');
        component.set('v.loaded', false);
        helper.callCaseField(component, event, helper, recordObjectId, recordObjectName);
        
    },
    
    openAllAccBalance : function(component,event,helper) {
        var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
		var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT31_ViewAllAccountBalance",
            componentAttributes : {
                objectCustomId : recordObjectId,
                objectCustomName : recordObjectName,
            }    
        });
        evt.fire();  	
    },

	handleRowAction : function(component,event,helper){
        var action = event.getParam('action').name;
        var row = event.getParam('row');
        var idRecord = '';
        console.log('ACTION:: '+action);
        if(action == 'Visualizza Dettaglio'){
            console.log("row.document-year  "+JSON.stringify(row));
            var actionWorkflow = component.get("c.CreateGetDocumentDetail"); 
			actionWorkflow.setParams({
                "documentYear": row.document_year,
                "storeCode": row.store_ref,
				"companyNumber": row.company_ref,
				"documentNumber": row.document_number,
				"documentCode": row.document_ref
            })
            actionWorkflow.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    console.log('currency data is:' + JSON.stringify(response.getReturnValue()));
                    var dataList = response.getReturnValue();
                    console.log("dataList::: "+dataList);
                    if (dataList != null && dataList.workflows != '') {
                        component.set('v.dataWorkflow', dataList.slice(0,1));
                    }else{
                        component.set('v.dataWorkflow', null);
                    } 
                    component.set('v.columnsWorkflow', [

                        {label: 'Id', fieldName: 'document_ref', type: 'text'},
                        {label: 'Anno Documento', fieldName: 'document_year', type: 'text'},
                        {label: 'Codice Società', fieldName: 'company_ref', type: 'text'},
                        {label: 'Codice Locale', fieldName: 'store_ref', type: 'text'},
                        {label: 'Codice Tipo Documento', fieldName: 'document_type_ref', type: 'number'},
                        {label: 'Descrizione Documento', fieldName: 'document_type_desc', type: 'text'},
                        {label: 'Numero Documento', fieldName: 'document_number', type: 'text'},
                        {label: 'Data Documento', fieldName: 'document_date', type: 'date'},
                        {label: 'Data Scadenza', fieldName: 'validity_end_date', type: 'date'},
                        {label: 'Stato Eca', fieldName: 'eca_status', type: 'text'},
                        {label: 'Data Valuta', fieldName: 'currency_date', type: 'date'},
                        {label: 'Importo Totale Fattura', fieldName: 'amount_invoice', type: 'number'},
                        {label: 'Data Contabile', fieldName: 'accounting_date', type: 'date'},
                        {label: 'Data Assegno', fieldName: 'check_date', type: 'text'},
                        {label: 'Sigla Banca', fieldName: 'bank_code', type: 'text'},
                        {label: 'Buono Pagamento', fieldName: 'ticket', type: 'text'},
                        {label: 'Protocollo', fieldName: 'protocol', type: 'text'},
                        {label: 'Importo Sconto', fieldName: 'amount_discount', type: 'number'},
                        {label: 'Importo Sconto Fast', fieldName: 'amount_discount_fast', type: 'number'},
                        {label: 'Importo Sconto Opz Pref', fieldName: 'amount_discount_fast_operation', type: 'number'},
                        {label: 'Importo Scorporo', fieldName: 'amount_deduct', type: 'number'},
                        {label: 'Utente Creazione', fieldName: 'created_by', type: 'text'},
                        {label: 'Data Creazione', fieldName: 'created_date', type: 'date'},
                        {label: 'Barcode', fieldName: 'barcode', type: 'text'},
                        {label: 'PDF', fieldName: 'detailURL', type: 'url' , typeAttributes: {label: 'PDF', target: '_blank'}}
                    ]);   
                    
                }
            });
            $A.enqueueAction(actionWorkflow);       
        }
    }
})