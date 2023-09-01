({
    typeHelper : function(component , typePicklist) { 
        var action = component.get('c.returnCurrentAttachment');
        var recordId = component.get('v.recordId');
        var attId;
        console.log("PARM" + typePicklist);
        action.setParams({
            "recordId": recordId,
            "fileType" : typePicklist
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                attId = response.getReturnValue();
                console.log("ATTID" + JSON.stringify(attId));
                component.set("v.currentAttachment", attId);
                if (attId != null) {
                    component.set('v.uploadLabel', 'Aggiorna File');
                    console.log("TROVATO" + attId);
                    component.set('v.predictions', []);
                    if (component.get('v.vediDettaglio')) {
                        component.set('v.uploadLabel', 'Aggiungi File');
                        component.set('v.predictions', []);
                    }
                } else {
                    component.set('v.uploadLabel', 'Inserisci Nuovo File');
                    console.log("NON TROVATO" + attId);
                    component.set('v.predictions', []);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    
    getMilestoneNameHelper : function(component , typePicklist) {
        var action = component.get('c.getMilestoneName');
        var recordId = component.get('v.recordId');
        action.setParams({
            "caseId": recordId,
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                var responseString = response.getReturnValue();
                console.log("responseString: " + responseString);
                component.set("v.milestoneName", responseString.split('§')[0]);
                component.set("v.milestonePhase", responseString.split('§')[1]);
                component.set("v.numeroDocumenti", responseString.split('§')[2]);
                component.set("v.statement", responseString.split('§')[3]);
                console.log("milestonePhase: " + component.get('v.milestonePhase'));
            }
            
        });
        $A.enqueueAction(action);
    },
})