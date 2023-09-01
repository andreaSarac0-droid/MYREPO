({
	callCaseField : function(component, event, helper, objectId, objectName) {
		console.log('objectId:: '+objectId);
		console.log('objectName:: '+objectName);
		var dataStart = component.get("v.dataStart");
		var dataEnd = component.get("v.dataEnd");
		var companyCode = component.get("v.CodCompany");
		console.log('dataStart:: '+dataStart);
		console.log('dataEnd:: '+dataEnd);
		console.log('companyCode:: '+companyCode);
		
		var action = component.get("c.CreateGetDocumentsAccounted");
        action.setParams({
			"objectId": objectId,
			"objectName": objectName,
			"companyNumber": companyCode,
			"dateFrom": dataStart,
			"dateTo": dataEnd,
			"controlLimit": false
		})
        action.setCallback(this, function (response) {
			if (action.getState() == "SUCCESS") {
				component.set('v.loaded', true);
				var responseCall = response.getReturnValue();    	
				console.log('responseCall:: '+JSON.stringify(responseCall));
                if (responseCall != null && responseCall != '') {
                    component.set('v.data', responseCall);
                }else{
                    component.set('v.data', null);
                }  
				var columnsAction = [];
                columnsAction.push({label : 'Visualizza Dettaglio', name : 'Visualizza Dettaglio'});
                component.set('v.columns', [

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
					{ type: 'action', typeAttributes: { rowActions: columnsAction } } 
				]);

				var actionPick = component.get("c.ShowList");
				actionPick.setParams({
					"objectId": objectId,
					"objectName": objectName
				})
				actionPick.setCallback(this, function (responsePickW) {
					if (responsePickW.getState() == "SUCCESS") {
						var responsePick = responsePickW.getReturnValue();    	
						console.log('responePick:: '+JSON.stringify(responsePick));
						component.set('v.documentListName', responsePick);
					}	
				})
				$A.enqueueAction(actionPick); 	
			}else if(action.getState() == "ERROR"){
				component.set('v.loaded', true);
				var errors = response.getError();
				component.set("v.showErrors",true);
				component.set("v.errorMessage",errors[0].message);
			}
        })
        $A.enqueueAction(action);  	
	},
    
    
})