({
	callContractPivotal: function(component, merchantCode){
        
        var inputStringFlow = merchantCode;
		var action = component.get("c.populateListContract");
        action.setParams({
            "groupMerchantCode": inputStringFlow
        })
        action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
                console.log('response.getState():: '+response.getState());
                component.set('v.loaded', true);
				var responseListContact = response.getReturnValue();
                console.log('responseListContact:: '+responseListContact);    	
				console.log('responseListContact:: '+JSON.stringify(responseListContact));
                component.set('v.columns', [

                    {label: 'Barcode', fieldName: 'barcode', type: 'text'},
                    {label: 'Tipo', fieldName: 'tipo', type: 'text'},
                    {label: 'decorrenza', fieldName: 'decorrenza', type: 'text'},
                    {label: 'Fee', fieldName: 'fee', type: 'text'},
                    {label: 'Locali', fieldName: 'locali', type: 'text'},
                    {label: 'MaxCommission', fieldName: 'maxCommission', type: 'text'},
                    {label: 'Quadro', fieldName: 'quadro', type: 'text'},
                    {label: 'RagioneSociale', fieldName: 'ragioneSociale', type: 'text'},
                    {label: 'StatoContratto', fieldName: 'statoContratto', type: 'text'},
                    {label: 'TrCommission', fieldName: 'trCommission', type: 'text'}

                ]);
                component.set('v.data', responseListContact);
			}
        })
        $A.enqueueAction(action);
    }
})