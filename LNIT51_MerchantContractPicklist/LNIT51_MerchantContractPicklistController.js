({
	doInit : function(component, event, helper) {
		
		var contract_input = component.get('v.contract_input')+''; //se ci metto le '' mi vede una stringa
		console.log('contract_input'+contract_input);
		var fc_prospect = component.get('v.fc_prospect');
		console.log('fc_prospect'+fc_prospect);
		var contract_input_list = contract_input.split(';');
		console.log('contract_input_list'+contract_input_list);
		var loaded = component.get('v.loaded');
		var pickvalue =[];
		var pickValueLabel =[{'label': "--Seleziona Contratto--",'value': null}];
		
		if(fc_prospect){
			contract_input_list.forEach(single => {
				if(single!='97' && single!='92' && single!='102'){ //&& single!='91'  && single!='95' && single!='100'
					pickvalue.push(single);
					console.log('single'+single);
				}
			});
		}
		else{
			contract_input_list.forEach(single => {
				pickvalue.push(single);
				console.log('single'+single);
			});
		}
		
		var action = component.get( "c.getPicklistLabelFromAPIName" );
		action.setParams({"inputSplitt": pickvalue});
        console.log('inputSplitt '+pickvalue);
		action.setCallback(this,function(response) {
			var state = response.getState();
			console.log("response: " + JSON.stringify(response));
			console.log("state: " + state);
			var retvalue= response.getReturnValue();
			console.log("retvalue: " + retvalue);
			if (state === "SUCCESS") {
				loaded="true";
				component.set('v.loaded', loaded);
				retvalue.forEach(function(singleVL) {
					pickValueLabel.push({
						'label': singleVL.label,
						'value': singleVL.value
					});
					console.log('singleVL'+singleVL);
				});
				//pickValueLabel.sort();
				pickValueLabel.sort(function(a, b) {
					var nameA = a.label.toUpperCase(); // ignora maiuscole e minuscole
					var nameB = b.label.toUpperCase(); // ignora maiuscole e minuscole
					if (nameA < nameB) {
					  return -1;
					}
					if (nameA > nameB) {
					  return 1;
					}
				});
				component.set('v.pickvalue',pickValueLabel);
				console.log('pickValueLabel'+JSON.stringify(pickValueLabel));
				//component.set('v.contratto_output',selectedValue);
				//console.log('contratto_output'+contratto_output);
			}	
			else{
					console.log('Something went wrong, Please check with your admin');
			}
			
		});
		
		$A.enqueueAction(action);
		
	}
})