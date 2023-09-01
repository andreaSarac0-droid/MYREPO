({
	getQuoteType: function (component)
	{
		var action = component.get('c.checkQuoteContractType');
		action.setParams(
			{
				quoteId: component.get('v.recordId')
			}
		)
		action.setCallback(this, (res) => {
			var state = res.getState();
			if(state == "SUCCESS")
			{
				if(res.getReturnValue() == "ContractType 01")
				{
					component.set('v.AddCharge', false);
				}
			}
		})
		$A.enqueueAction(action);
	},
    
    getProdutctUta: function(component)
    {
		var recordId = component.get('v.recordId');
		var sObjectName = component.get('v.sObjectName')
		console.log("v.recordId : ", recordId);
		var action1 = component.get("c.checkUtaProduct");
		action1.setParams({
			"recordId": recordId,
			"sObjectName":sObjectName
        });
        action1.setCallback(this, function(response1) {
			var boolUta = response1.getReturnValue();
			if(sObjectName=='zqu__Quote__c'){
				component.set("v.SendToCommittee", boolUta);
				console.log("v.SendToCommittee : ", boolUta);
            	component.set("v.CreditCheck", boolUta);
				console.log("v.CreditCheck : ", boolUta);
			}
			else if (sObjectName=='Lead'){
				component.set("v.SendToCommittee", false);
				component.set("v.CreditCheck", boolUta);
				console.log("v.CreditCheck : ", boolUta);
			}
        })
        $A.enqueueAction(action1);
    },
    
    buttonFilter: function (component,event,helper,recordId){
        console.log('Filtro sul pulsante');
        var sObjectName = component.get('v.sObjectName');
        var action = component.get("c.filterGestCred");
        action.setParams({
            "recordId" : recordId,
            "sObjectName": sObjectName
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();        
            if (state === "SUCCESS") {
                console.log('result: ' + result);
                component.set("v.showGestCredButton",result);
            } else if (state === "ERROR") {
                helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },

	helperMethod : function() {
		
	}
})