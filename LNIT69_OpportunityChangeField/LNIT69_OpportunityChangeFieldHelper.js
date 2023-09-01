({
    getAcctype : function(component, event) {
        var objectName = component.get("v.objectName");
        if(objectName === 'ER_Financial_Center__c'){
            var data = component.get("v.fcRecords");
            var actionName = "c.getAccountCompanyType";
            var action = component.get(actionName);
            action.setParams({
                "listFc": data
            })
            action.setCallback(this, function(response){
                console.log('Evviva');
                var accType = response.getReturnValue();
                console.log('accType: ' + accType);
                component.set("v.accountCompanyType",accType);
            });
             $A.enqueueAction(action);
        }
    },


    getFieldPicklist : function(component, event) {
        
        var fieldName = component.get("v.fieldName");
        var objectName = component.get("v.objectName");
        //var fieldName2 = component.get("v.fieldName2");
        console.log('objectName: ' + objectName);
        console.log('fieldName: ' + fieldName);
        var data = component.get("v.fcRecords");
        //console.log('fieldName2: ' + fieldName2);
        //console.log('Data JSON: ' + JSON.stringify(data));
        var actionName = "c.getProfileName2";
        var action = component.get(actionName);
        action.setParams({
            "listRecord": data,
            "fieldName": fieldName,
            "objectName": objectName ,  
            "opp" : component.get("v.OppFlow") 
        });
        /*if(objectName == 'ER_Contact_Role__c'){
            var data2 = component.get("v.contactRoleRecords");
            var data3 = component.get("v.contactDetailRecords");
            console.log('sei in Contact Role');
            var actionName = "c.getProfileName2";
            var action = component.get(actionName);
            //console.log('Data2 JSON: ' + JSON.stringify(data2));
            action.setParams({
                "listRecord": data2,
                "listRecord2": data3,
                "fieldName": fieldName,
                "fieldName2": fieldName2,
                "objectName": objectName
            });
        }*/
        action.setCallback(this, function(response){
            console.log('Evviva');
            console.log(response.getReturnValue());
            var listResponse = response.getReturnValue();
            console.log('fieldName: ' + fieldName);
            console.log('fieldName lenght: ' + Object.keys(listResponse).length);
            /*if(objectName != 'ER_Contact_Role__c'){
                console.log('Hai contact role non mettere inserimento manuale');
                listResponse.push('Inserisci manualmente');
            }*/
            listResponse.push('Inserisci manualmente');
            console.log('listResponse: ' + listResponse);
            component.set("v.options",listResponse);
            component.set("v.outputString",listResponse[0]);
            if(component.get("v.outputString") == 'Inserisci manualmente'){
                component.set("v.InserimentoManuale",true);
                component.set("v.outputString",'');
            }
            console.log("v.outputString: " + component.get("v.outputString"));
        });
        $A.enqueueAction(action);
    }
})