({ 
    doinit : function(component, event, helper) {
        console.log("In Child lookup Init-05");
        // var icon = component.get("v.icon");
        var sObject = component.get("v.object");
        
        // console.log("icon5:: "+icon);
        // console.log("Object5:: "+sObject);
        // console.log("Product5:: " +  JSON.stringify( component.get("v.Product")) );
        // console.log("asset:: " +  JSON.stringify( component.get("v.Asset")) );
        // console.log("Individual:: " +  JSON.stringify( component.get("v.Individual")) );

    },
    
    onOptionClick : function(component, event, helper) {
        var sObject = component.get("v.object");
        if(sObject == "Account"){
            console.log("In child init1");
                var selVal  = component.get("v.myContact");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    selectedItem : selVal
                });
                evt.fire();
        }
        else if(sObject == "ER_Financial_Center__c"){
            console.log("In child init2");
                var selVal  = component.get("v.FinCenter");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    FinCenter : selVal
                });
                evt.fire();
        }
        else if(sObject == "IT_Circuit__c"){
            console.log("In child init3");
                var selVal  = component.get("v.Circuit");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Circuit : selVal
                });
                evt.fire();
        }
        else if(sObject == "Contact"){
            console.log("In child init4");
                var selVal  = component.get("v.Contact");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Contact : selVal
                });
                evt.fire();
        }
        else if(sObject == "ER_Acceptor__c"){
            console.log("In child init5");
                var selVal  = component.get("v.Pos");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Pos : selVal
                });
                evt.fire();
        }
        else if(sObject == "ER_Store__c"){
            console.log("In child init6");
                var selVal  = component.get("v.Store");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Store : selVal
                });
                evt.fire();
        }
        else if(sObject == "Asset"){
            console.log("In child init7");
                var selVal  = component.get("v.Asset");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Asset : selVal
                });
                evt.fire();
        }
        else if(sObject == "Product"){
            console.log("In child init11");
                var selVal  = component.get("v.Product");
                console.log('selVal::: '+selVal);

                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Product : selVal
                });
                evt.fire();
        }
        else if(sObject == "ER_Employee__c"){
            console.log("In child init8");
                var selVal  = component.get("v.Employee");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Employee : selVal
                });
                evt.fire();
        }
        else if(sObject == "Individual"){
            console.log("InChild init9");
                var selVal  = component.get("v.Individual");
                console.log('***selVal:: ',selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    Individual : selVal
                });
                // var selValxxx  = component.get("v.Individual");
                // console.log('***selValxxx:: ',selValxxx);
                evt.fire();
        }
        else if(sObject == "User"){
            console.log("In child init10");
                var selVal  = component.get("v.User");
                console.log(selVal);
                
                var evt = component.getEvent("LEVIT02_LookupEventToParent");
                evt.setParams({
                    User : selVal
                });
                evt.fire();
        }
    }
})