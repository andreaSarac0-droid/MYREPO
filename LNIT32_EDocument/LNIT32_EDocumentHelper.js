({
	showEDocument : function(component, event, helper) {
		var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
		var dataStart = component.get("v.dataStart");
		var dataEnd = component.get("v.dataEnd");
		console.log('dataStart:: '+dataStart);
		console.log('dataEnd:: '+dataEnd);
		
		var action = component.get("c.CreateGetEDocumentEInvoice");
        action.setParams({
			"objectId": recordObjectId,
			"objectName": recordObjectName,
			"dateFrom": dataStart,
			"dateTo": dataEnd,
			"isDocument": true
		})
        action.setCallback(this, function (response) {
			if (action.getState() == "SUCCESS") {
				component.set('v.loaded', true);
				var responseCall = response.getReturnValue();    	
				console.log('responseCall:: '+JSON.stringify(responseCall));
                if (responseCall != null && responseCall != '') {
                    component.set('v.data', responseCall.slice(0,5));
                }else{
                    component.set('v.data', null);
                }  
				
                component.set('v.columns', [

					{label: 'Numero Documento', fieldName: 'document_number', type: 'text'},
                    {label: 'Id', fieldName: 'document_ref', type: 'text'},
					{label: 'Data Documento', fieldName: 'document_date', type: 'text'},
					{label: 'Codice Locale', fieldName: 'store_ref', type: 'date'},
					{label: 'Importo Totale Fattura', fieldName: 'amount_invoice', type: 'number'},
					{label: 'Data Creazione', fieldName: 'created_date', type: 'date'},
					{label: 'Data Invio Sdi', fieldName: 'legal_einvoice_ref_send_date', type: 'date'},
					{label: 'Data Esito Sdi', fieldName: 'legal_einvoice_ref_result_date', type: 'date'},
					{label: 'Errore', fieldName: 'error', type: 'text'}
				]);
	
			}else if(action.getState() == "ERROR"){
				component.set('v.loaded', true);
				var errors = response.getError();
				component.set("v.showErrors",true);
				component.set("v.errorMessage",errors[0].message);
			}
        })
        $A.enqueueAction(action);
        
    }
})