({
	// getCustomMeta: function (component, event, helper) {
	// 	var action = component.get("c.getRecordsAura3");
	// 	action.setCallback(this, function(response){
	// 		var state = response.getState();
	// 		console.log('State: ' + state);
	// 		if(state === "SUCCESS"){
	// 			console.log('Evviva');
	// 			var ListCoda = response.getReturnValue();
	// 			console.log('ListCoda: ' + ListCoda);
	// 			var fieldMap = [];
	// 			for(var key in ListCoda){
	// 				fieldMap.push({key: key, value: ListCoda[key]});
	// 			}
	// 			console.log('fieldMap: ' + fieldMap);
	// 			component.set("v.fieldMap",fieldMap);
	// 		}
	// 		if(state === "ERROR"){
	// 			var message = errors[0].message;
	// 			console.error('errors',message);
	// 		}
	// 	});
	// 	$A.enqueueAction(action);
    // }
})