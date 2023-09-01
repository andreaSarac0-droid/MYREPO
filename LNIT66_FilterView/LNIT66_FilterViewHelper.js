({
	objectFilter: function(component, objId, objName, objType){
        
        var inputStringId = objId;
		var inputStringName = objName;
		var inputStringType = objType;
		//var inputStringId = '0015r00000HoSZeAAN';
		//var inputStringName = 'Account';
		//var inputStringType = 'Contact';
		console.log('inputStringId:: '+inputStringId);
		console.log('inputStringName:: '+inputStringName);
		console.log('inputStringType:: '+inputStringType);
		var action = component.get("c.filterData");
        action.setParams({ 
            "idObject": inputStringId,
			"nameObject": inputStringName,
			"typeFilter": inputStringType
        })
        action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
                console.log('response.getState():: '+response.getState());
                component.set('v.loaded', true);
				var responseListContactFC = response.getReturnValue();
				console.log('responseListContactFC:: '+JSON.stringify(responseListContactFC)); 
				var actions = [
					{ label: 'Edit', name: 'Edit' } ];  
				
				if (inputStringType == "ER_Financial_Center__c") {
					component.set('v.columns', [

						//{label: 'Nome Cliente', fieldName: 'NameFinancialCenter', type: 'text'},
						{label: 'Codice Cliente', fieldName: 'CodeFinancialCenterProduct', type: 'text'},
						{label: 'Stato Cliente', fieldName: 'StatusFinancialCenter', type: 'text'}, 
						{label: 'Commerciale', fieldName: 'SalesManagerFinancialCenter', type: 'text'}

					]);
                }else if(inputStringType == "Opportunity"){
                	component.set('v.columns', [
						{label: 'Data Creazione', fieldName: 'CreateDateOpp', type: 'date'},
						{label: 'Prodotto', fieldName: 'ProductOpp', type: 'text'},
						{label: 'Tipo', fieldName: 'TypeOpp', type: 'text'},
						{label: 'Titolare', fieldName: 'OwnerOpp', type: 'text'},
						//{label: 'Nome', fieldName: 'NameOpp', type: 'text'},
						{label: 'Stato', fieldName: 'StageOpp', type: 'text'}, 
						{label: 'Data Chiusura', fieldName: 'CloseDateOpp', type: 'date',},

					]);
                }else if(inputStringType == "Contact"){
					component.set('v.columns', [
						{label: 'Nome', fieldName:'NameContact',type:'text',sortable: true},
						{label: 'Link', fieldName: 'linkContact', type: 'url', typeAttributes: {label: 'Apri', tooltip: { fieldName: 'NameContact' }, target: '_self'}},
                        {label: 'Qualifica', fieldName: 'TitleContact', type: 'text'},
						{label: 'Email', fieldName: 'EmailContact', type: 'text'},
						{label: 'Phone', fieldName: 'PhoneContact', type: 'text'},
						{label: 'Mobile', fieldName: 'MobilePhoneContact', type: 'text'},
						{label: 'Status', fieldName: 'StatusContact', type: 'text'},
						{ type: 'action', typeAttributes: { rowActions: actions } }

					]);
				}	
                component.set('v.data', responseListContactFC);   
			}
        })
        $A.enqueueAction(action);
    },

	/*sortBy: function(field, reverse, primer) {
        var key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    },*/

    /*handleSort: function(component, event, helper) {
       /* var sortedBy = event.getParam('fieldName');
		console.log('Campo da ordinare: ' + sortedBy);
        var sortDirection = event.getParam('sortDirection');
		console.log('sortDirection ' + sortDirection);
        var cloneData = this.DATA.slice(0);
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
		cmp.set('v.data', cloneData);
        cmp.set('v.sortDirection', sortDirection);
        cmp.set('v.sortedBy', sortedBy);
		var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);

    },*/

	sortData: function (component, event) {
		var sortedBy = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');

        var cloneData = this.DATA.slice(0);
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'desc' ? 1 : -1)));
        
        component.set('v.data', cloneData);
        //component.set('v.sortDirection', sortDirection);
        //component.set('v.sortedBy', sortedBy);
		component.set("v.sortedBy", event.getParam("fieldName"));
		component.set("v.sortedDirection", event.getParam("sortDirection"));
		/*var data = component.get("v.data");
		var reverse = sortDirection !== 'desc'; 
		var fieldName = component.get("v.sortedBy");
		var sortDirectionCmp = component.get("v.sortDirection");
		console.log('reverse: ' + reverse);
		console.log('fieldName: ' + fieldName);
		//sorts the rows based on the column header that's clicked

	        data.sort(this.sortBy(fieldName, reverse));           
		component.set("v.data", data);
		if(sortDirectionCmp == 'desc'){
			component.set("v.sortDirection",'asc');
		}
		if(sortDirectionCmp == 'asc'){
			component.set("v.sortDirection",'desc');
		}*/
		
		},
		
		sortBy: function (field, reverse, primer) {
			var key = primer ?
				function(x) {return primer(x[field])} :
				function(x) {return x[field]};
			//checks if the two rows should switch places
			reverse = !reverse ? 1 : -1;
			return function (a, b) {
				return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
			}
		}


	
})