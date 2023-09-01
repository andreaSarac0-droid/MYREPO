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
			"isDocument": false
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

					{label: 'Stato Fattura', fieldName: 'status', type: 'text'},
                    {label: 'Id Sdi', fieldName: 'legal_einvoice_ref', type: 'text'},
					{label: 'Data Sdi', fieldName: 'legal_einvoice_ref_date', type: 'date'},
					{label: 'Partita Iva', fieldName: 'vat_number', type: 'date'},
					{label: 'Denominazione', fieldName: 'name', type: 'number'},
					{label: 'Data Documento', fieldName: 'document_date', type: 'date'},
					{label: 'Tipo Documento', fieldName: 'document_type', type: 'text'},
					{label: 'Importo Totale', fieldName: 'amount', type: 'text'},
					{label: 'Imponibile', fieldName: 'taxable', type: 'text'},
					{label: 'Imposta', fieldName: 'tax', type: 'text'},
					{label: 'Iva Mista', fieldName: 'vat', type: 'text'},
					{label: 'Aliquota Iva', fieldName: 'tax_rate', type: 'text'},
					{label: 'Abbuono', fieldName: 'discount', type: 'text'},
					{label: 'Importo Bollo', fieldName: 'stamp', type: 'text'}
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