({
	showEDocument : function(component, event, helper) {
		var recordObjectId = component.get("v.recordId");
		var recordObjectName = component.get("v.sObjectName");
		var recordGetType = component.get("v.TypeGetUta");
        var recordPageNumber = component.get("v.pageNumber");
        console.log('recordPageNumber:: '+recordPageNumber);
		
		var action = component.get("c.CreateGetUta");
        action.setParams({
			"objectId": recordObjectId,
			"objectName": recordObjectName,
			"getTypeCall": recordGetType,
			"numberPage": recordPageNumber
		})
        action.setCallback(this, function (response) {
			if (action.getState() == "SUCCESS") {
				component.set('v.loaded', true);
				var responseCall = response.getReturnValue();    	
				console.log('responseCall:: '+JSON.stringify(responseCall));
                
                if (responseCall != null && responseCall != '') {
                    component.set('v.isButtonActiveNext', false);

					//component.set('v.data', responseCall.slice(0,5));
					component.set('v.data', responseCall);
                    console.log('recordGetType:: '+recordGetType);
                    
					if(recordGetType == "Order"){
                       
						component.set('v.columns', [

							{label: 'Num Ordine', fieldName: 'order_ref', type: 'text'},
                            {label: 'Bolla di trasporto', fieldName: 'delivery_note_ref', type: 'url', typeAttributes: {label: { fieldName: 'delivery_note_ref_OnlyCode' }, target: '_blank'}},
							{label: 'Data', fieldName: 'modified_date', type: 'date'},
							{label: 'Num Pezzi', fieldName: 'items_count', type: 'integer'},
							{label: 'Stato', fieldName: 'delivery_status', type: 'text'},
                            {label: 'Data presa in carico', fieldName: 'start_date', type: 'date'},
                            {label: 'Destinatario', fieldName: 'delivery_address', type: 'text'},
                            {label: 'Dettagli', fieldName: 'details', type: 'text'},
                            {label: 'Pross. passi', fieldName: 'next_delivery_step', type: 'text'},
                            {label: 'Descrizione', fieldName: 'description', type: 'text'},
                            {label: 'Quantita', fieldName: 'quantity_items', type: 'text'}
						]);


					}else if(recordGetType == "Payment"){
						
						component.set('v.columns', [

							//{label: 'Tipo', fieldName: 'payment_type_ref', type: 'text'},
							{label: 'Risultato Aggancio', fieldName: 'payment_status', type: 'text'},
                            {label: 'Rifiuto', fieldName: 'is_discarded_String', type: 'text'},
							{label: 'Data Rifiuto', fieldName: 'discarded_date', type: 'date'},
                            {label: 'Codice Rifiuto', fieldName: 'bank_rejection_code', type: 'text'},
                            {label: 'Desc. Rifiuto', fieldName: 'bank_rejection_description', type: 'text'},
                            {label: 'Data creazione', fieldName: 'creation_date', type: 'date'},
                            {label: 'Mandato', fieldName: 'payment_ref', type: 'text'},
                            {label: 'SDD Only', fieldName: 'is_sdd_only_String', type: 'text'},
                            {label: 'Cauzione richiesta', fieldName: 'has_deposit_requested_String', type: 'text'},
                            {label: 'Cauzione versata', fieldName: 'has_acquired_requested_String', type: 'text'},
                            {label: 'Primo invio', fieldName: 'creation_date_invoice', type: 'date'},
                            {label: 'Ultimo invio', fieldName: 'last_update_date_invoice', type: 'date'}		
						]);
					}
                    
                }else{
                    component.set('v.isButtonActiveNext', true);
                    component.set('v.data', null);
                }  
	
			}else if(action.getState() == "ERROR"){
				component.set('v.loaded', true);
				var errors = response.getError();
				component.set("v.showErrors",true);
				component.set("v.errorMessage",errors[0].message);
			}
        })
        $A.enqueueAction(action);
        
    },
    
    changePage: function (component, event, changeType) {
        var numberPage = component.get('v.pageNumber');
        if(changeType == 'Next'){
            numberPage++;
            component.set('v.isButtonActive',false);
        }
        else if(changeType =='Back'){
                numberPage--;
        }
        console.log('pageNumber::::::::::: '+numberPage);    
        component.set('v.pageNumber',numberPage);
    }
})