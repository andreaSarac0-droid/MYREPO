({
	sortData_present: function (component, fieldName, sortDirection) {
        var dataToSort = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        component.set("v.data", dataToSort);
    },
    
    sortBy: function (field, reverse, primer) {
         var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
         //checks if the two rows should switch places
         reverse = !reverse ? 1 : -1;
         return function (a, b) {
             return a = key(a)?key(a):'', b = key(b)?key(b):'', reverse * ((a > b) - (b > a));
     	}
    },

	showEDocument : function(component, event, helper) {
		var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
		var dataStart = component.get("v.dataStart");
		var dataEnd = component.get("v.dataEnd");
		var pickTypeVar = component.get("v.pickType");
		var pickStatusVar = component.get("v.pickStatus");
		var pickCategoryVar = component.get("v.pickCategory");
		console.log('dataStart:: '+dataStart);
		console.log('dataEnd:: '+dataEnd);

		var boolDataCounterVar = component.get("v.boolDataCounter");	
		
		var action = component.get("c.CreateGetOperator");
        action.setParams({
			"objectId": recordObjectId,
			"objectName": recordObjectName,
			"dateFrom": dataStart,
			"dateTo": dataEnd,
			"selectType": pickTypeVar,
			"selectStatus": pickStatusVar,
			"selectCategory": pickCategoryVar
		})
        action.setCallback(this, function (response) {
			if (action.getState() == "SUCCESS") {
				component.set('v.loaded', true);
				var responseCall = response.getReturnValue();    	
				console.log('responseCall:: '+JSON.stringify(responseCall));
                if (responseCall != null && responseCall != '') {
					var sortedList = responseCall.sort((a,b)=>(new Date(a.date_op)-new Date(b.date_op))*-1);
					if(boolDataCounterVar == true)
						component.set('v.data', sortedList.slice(0,5));
					else	
						component.set('v.data', sortedList);

                    var assetProduct = responseCall[0].typeAssetProduct;
                    console.log('assetProduct:: '+assetProduct);
					if(assetProduct == "WEL"){
						component.set('v.boolControlFilter', true);
						component.set('v.columns', [

							{label: 'Num Piano', fieldName: 'csn', type: 'text'},
                            {label: 'Codice Operatore', fieldName: 'operation_ref', type: 'text'},
                            {label: 'Dettaglio', fieldName: 'outlet_name', type: 'text'},
                            {label: 'Importo', fieldName: 'amount', type: 'number'},
                            //{label: 'Valuta', fieldName: 'currency_op', type: 'text'},
                            {label: 'Data', fieldName: 'date_op', type: 'date', sortable: true, typeAttributes: {  
								day: 'numeric',  
								month: 'numeric',  
								year: 'numeric'
								}},
							{label: 'Tipo Mov', fieldName: 'type', type: 'text'},
                            {label: 'Stato', fieldName: 'status', type: 'text'},
                            {label: 'Categoria', fieldName: 'category_id', type: 'text'},
                            {label: 'Dettaglio Categoria', fieldName: 'category_detail_desc', type: 'text'},
                            {label: 'Download', fieldName: 'flg_downloadable', type: 'text'}
							
		
						]);


					}else if(assetProduct == "ETR"){
						component.set('v.boolControlFilter', false);
						component.set('v.columns', [

							{label: 'Num Carta', fieldName: 'csn', type: 'text'},
							{label: 'Dettaglio', fieldName: 'label', type: 'text'},
							{label: 'Data', fieldName: 'date_op', type: 'date', sortable: true, typeAttributes: {  
								day: 'numeric',  
								month: 'numeric',  
								year: 'numeric'
								}},
							{label: 'Importo', fieldName: 'amount', type: 'number'},
                            {label: 'Numero buoni', fieldName: 'voucher_count', type: 'text'},
							{label: 'Importo Buono', fieldName: 'voucher_value', type: 'text'},
							//{label: 'Valuta', fieldName: 'currency_op', type: 'text'},
							{label: 'Tipo Mov', fieldName: 'type', type: 'text'},
							{label: 'Nr. serie', fieldName: 'voucher_serial_number', type: 'text'},
							{label: 'Id Buono', fieldName: 'carnet_serial_number', type: 'text'},
							{label: 'Data scadenza', fieldName: 'expiration_date', type: 'text'},
							{label: 'Id Terminale', fieldName: 'terminal_id', type: 'text'}
						]);
					}else if(assetProduct == "TCW"){
						component.set('v.boolControlFilter', false);
						component.set('v.columns', [

							{label: 'Num Carta', fieldName: 'csn', type: 'text'},
							{label: 'Dettaglio', fieldName: 'label', type: 'text'},
							{label: 'Data', fieldName: 'date_op', type: 'date', sortable: true, typeAttributes: {  
								day: 'numeric',  
								month: 'numeric',  
								year: 'numeric'
								}},
							{label: 'Importo', fieldName: 'amount', type: 'number'},
							//{label: 'Valuta', fieldName: 'currency_op', type: 'text'},
							{label: 'Tipo Mov', fieldName: 'type', type: 'text'}
						]);
					}
                    
                }else{
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
        
    }
})