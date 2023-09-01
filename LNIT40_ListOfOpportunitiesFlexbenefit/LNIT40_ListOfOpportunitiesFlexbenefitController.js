({
	oninit : function(component, event, helper)
	{
		let oppList = component.get('v.OpportunityList');

		console.log(oppList)

		let newOppList = []
        		let colonne = [
			{
				name: 'Nome prodotto',
			 	type: 'text',
				fieldName: 'ER_Product_Family__c'
			}
		]

		component.set('v.columns', colonne)
        
        for(let i = 0; i < oppList.length; i++)
		{	 
			newOppList.push(oppList[i].Id);
            console.log('id opp: '+ oppList[i].ER_Product_Family__c + ' '+ oppList[i].Id);
		}
        var serverAction = component.get("c.getListProducts");
        var records = [];
		serverAction.setParams({
            recordIds: newOppList
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state',state);
            if (state === "SUCCESS") {
                records = response.getReturnValue();
                component.set('v.oppList', records)

            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);

	},

	handleNext: function(component, event, helper)
	{		
		let navigate = component.get("v.navigateFlow");
      	navigate("NEXT");
	},

	handleAddOppSelection: function(component, event, helper)
	{
		component.set('v.SelectedList', event.getParam('selectedRows'))
        let selected = component.get('v.SelectedList');
        let listId = [];
        for(let i = 0; i < selected.length; i++){
            listId.push(selected[i].Id);
        }
           
        var serverAction = component.get("c.getSelectedProducts");
     
        serverAction.setParams({
            recordIds: listId
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state',state);
            if (state === "SUCCESS") {
          
                component.set('v.ReturnList', response.getReturnValue());

            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
	}
}) 

/* 0061w00001FFYuGAAX */