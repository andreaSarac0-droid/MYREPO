({
	init : function(cmp, event, helper) {
		var inputStringFlow = cmp.get("v.InputStringField");
		var action = cmp.get("c.populatePickList");
        action.setParams({
            "stringInput": inputStringFlow
        })
        action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
				var responsePick = response.getReturnValue();    	
				console.log('responePick:: '+JSON.stringify(responsePick));
				cmp.set('v.returnValues', responsePick);
			}
        })
        $A.enqueueAction(action);
	}
})