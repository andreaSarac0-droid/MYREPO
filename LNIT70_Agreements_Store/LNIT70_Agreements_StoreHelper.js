({
	callAgreementsAffi: function(component, objId, objName){
        
        var inputStringId = objId;
		var inputStringName = objName;
		var action = component.get("c.CreateCallAgreementsAffi");
        action.setParams({
            "idObject": inputStringId,
			"nameObject": inputStringName
        })
        action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
                console.log('response.getState():: '+response.getState());
                component.set('v.loaded', true);
                var boolDataCounterVar = component.get("v.boolDataCounter");
				var responseListContact = response.getReturnValue();
				var responseListData = responseListContact.data;
				var responseListStores = responseListContact.storesResponse;
				component.set('v.dataSecond', responseListContact.stores);
				console.log('responseListContact3:: '+JSON.stringify(responseListContact));   
				console.log('responseListContact4:: '+JSON.stringify(responseListStores));  
                component.set('v.columnsFirst', [

                    {label: 'Data Abilitazione', fieldName: 'enabling_date', type: 'date'},
					{label: 'Data Decorrenza', fieldName: 'start_date', type: 'date'},
					{label: 'Corrispettivo', fieldName: 'corresponding', type: 'text'},
					{label: 'Condizione Pagamento', fieldName: 'payment_condition', type: 'text'},
					{label: 'Condizione Pagamento Desc', fieldName: 'payment_condition_desc', type: 'text'},
					{label: 'Canone', fieldName: 'fee', type: 'double'},
					{label: 'Data Disabilitazione', fieldName: 'disabling_date', type: 'date'},
					{label: 'User', fieldName: 'modified_by', type: 'text'},
					{label: 'Data Modifica', fieldName: 'modified_date', type: 'date'}//, 
					//{label: 'PDF', fieldName: 'modified_date', type: 'button'} 

                ]);
				console.log('responseListData.detailURL:: '+JSON.stringify(responseListData[0].detailURL));  
				component.set('v.LinkBarcode', responseListData[0].detailURL);
                component.set('v.dataFirst', responseListData);

				/*component.set('v.columnsSecond', [

                    {label: 'Stato', fieldName: 'status', type: 'text'},
					{label: 'Codice', fieldName: 'ref', type: 'text'},
					{label: 'Insegna', fieldName: 'BannerText', type: 'text'},
					{label: 'Indirizzo', fieldName: 'storeAddress', type: 'text'},
					{label: 'Cap', fieldName: 'zip', type: 'text'},
					{label: 'Città', fieldName: 'city', type: 'text'},
					{label: 'Prov', fieldName: 'province', type: 'text'},
					{label: 'Data Metadati', fieldName: 'metadata_date', type: 'date'}
					//{label: 'Data Chiusura', fieldName: 'ref', type: 'datetime'}

                ]);*/
				
                if(boolDataCounterVar == true){
					component.set('v.dataSecond', responseListStores.slice(0,10));
				}else{	
					component.set('v.dataSecond', responseListStores);
					var workspaceAPI = component.find("workspace");
                    workspaceAPI.setTabLabel({
                        label: "List Stores"
                    });
				}
			}
        })
        $A.enqueueAction(action);
    },

})