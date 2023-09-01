({
	handleChange : function(component, event, helper) {

		var force_abi = component.get("v.force_abi");
		var force_cab = component.get("v.force_cab");
		var force_cin = component.get("v.force_cin");
		var force_iban = component.get("v.force_iban");
		var iban = component.get("v.iban");

		var action = component.get( "c.calculateIban" ); 
        action.setParams({"forzatura_abi" : force_abi,
						"forzatura_cab":force_cab,
						"forzatura_cin":force_cin,
						"forzatura_iban":force_iban,
						"iban": iban });

        if(iban!=null && iban!=''){
			action.setCallback(this,function(response) {
				var state = response.getState();
				var messaggio='';
				var tipo='';
				console.log("state: " + state);
				if (state === "SUCCESS") {
					
					var result = response.getReturnValue();
					console.log("result: " + result);
					if(result=='1'){
						messaggio='CIN ed IBAN Verificati';
						tipo='success';
					}
					else if(result=='2'){
						messaggio='CIN Corretto, ma IBAN NON verificato. Controllare il CheckIBAN';
						tipo='error';
					}
					else if(result=='ABI CAB non presenti'){
						messaggio='ABI e CAB non presenti. Impossibile validare IBAN';
						tipo='error';
					}
					else if (result=='IBAN non lungo 27 caratteri'){
						messaggio='IBAN NON lungo 27 caratteri, controllare spazi';
						tipo=='error';
					}
					else if(result=='CIN Forzato, ma non IBAN'){
						messaggio='CIN Forzato, ma non IBAN che risulta non valido';
						tipo=='error';
					}
					else{
						messaggio='CIN ed IBAN non verificati';
						tipo='error';
					}

					var ibanCmp = component.find("iban");
					// is iban valid?
					if(result!='1') {
						ibanCmp.setCustomValidity(messaggio);
						component.set('v.ibanValid', false);
					}
					else {
						ibanCmp.setCustomValidity("");
						component.set('v.ibanValid', true);
					}
					ibanCmp.reportValidity();

				}	
				
				else {
					var errors = response.getError();
					console.log(JSON.stringify(errors));
					var toastEvent = $A.get("e.force:showToast");
					toastEvent.setParams({
						"type":"error",
						"title": "Errore!",
						"message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
					});
					toastEvent.fire();
				} 
			});
			$A.enqueueAction(action);
		}
		else{
			component.set('v.ibanValid', true);
		}
	},
})