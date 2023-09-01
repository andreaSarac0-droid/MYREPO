({
	doInit : function(component, event, helper) {
		var recordId = component.get("v.recordId");
		console.log("recordId: " + recordId);

		var action = component.get( "c.calculateIban" ); 
        action.setParams({"recordId": recordId });
        
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
				else if(result=='1 ABI CAB non presenti'){
					messaggio='ABI e CAB non presenti, ma IBAN valido';
					tipo='error';
				}
				else if(result=='2 ABI CAB non presenti'){
					messaggio='ABI e CAB non presenti, CIN corretto, ma IBAN errato';
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
				var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": tipo,
                    "title": "Controllo IBAN effettuato",
                    "message": messaggio
                });
                toastEvent.fire();
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
	},
})