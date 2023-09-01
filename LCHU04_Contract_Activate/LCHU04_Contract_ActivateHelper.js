({
    getContractHelper : function(component, event, helper) {
        
        console.log('getContractHelper IN');
        var action = component.get("c.getContract");
        action.setParams({
            
            "contractId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){  
            
            
            var state = response.getState();
            console.log('getContractHelper Response');
            if(state === "SUCCESS"){
                
                var result = response.getReturnValue();
                console.log('getContractHelper Response Result : '+JSON.stringify(result));
                
                if(result.length > 0){
                    /*var contractTotallySynchronized = true;
                    for (var index in result[0].ER_ContractLineItems__r) {
                        console.log('CLI : '+result[0].ER_ContractLineItems__r[index].ER_Creation_date_in_OS__c);
                        if(!result[0].ER_ContractLineItems__r[index].ER_Creation_date_in_OS__c){
                            contractTotallySynchronized = false;
                            console.log('contractTotallySynchronized :'+contractTotallySynchronized);
                        }
                    }

                    if(contractTotallySynchronized){
                        helper.showToast("Error",$A.get("$Label.c.LABS_SF_Contract_AlreadyExistInSysOp"),"error","dismissible");
                        $A.get("e.force:closeQuickAction").fire();
                    }*/
                    if(result[0].Status == $A.get("$Label.c.LABS_SF_Contract_Status_Activated")){
                        
                        helper.showToast("Error",$A.get("$Label.c.LABS_SF_Contract_AlreadyActivated"),"error","dismissible");
                        $A.get("e.force:closeQuickAction").fire();
                    }
                    else if(result[0].Status == $A.get("$Label.c.LABS_SF_Contract_Status_Terminated")){
                        helper.showToast("Error",$A.get("$Label.c.LABS_SF_Contract_CannotBeActivated"),"error","dismissible");
                        $A.get("e.force:closeQuickAction").fire();
                    }
                        else{
                            component.set("v.contract",result[0]);
                            helper.getMessages(component, event, helper);
                        }
                }
            }
            else if(state === "ERROR"){
                console.log('###ERROR response : '+JSON.stringify(action.getError()));
                helper.showToast("Error",action.getError()[0].message,"error","dismissible");
            }
        });
        $A.enqueueAction(action);                
    },
    activateContractJSHelper : function(component, event, helper) {
        
        console.log('activateContractJSHelper IN');
        var action = component.get("c.activateContractController");
        var contract = component.get("v.contract");
        var opportunityId = contract.ER_OpportunityId__c;
        console.log('###activateContractJSHelper contract : '+contract);
        action.setParams({
            "contract" : contract,
            "opportunityId" : opportunityId
        });
        action.setCallback(this, function(response)
                           {   
                               console.log('activateContractJSHelper Response');
                               helper.toggleSpinner(component);
                               var state = response.getState();
                               console.log('STATE :: '+JSON.stringify(state));
                               if(state === "SUCCESS"){
                                   
                                   $A.get("e.force:closeQuickAction").fire();
                                   var activationMessage = $A.get("$Label.c.LABS_SF_Contract_SuccessfullyActivated");
                                   activationMessage = activationMessage.replace('{0}',contract.ContractNumber);
                                   helper.showToast("",activationMessage,"","dismissible");
                                   $A.get('e.force:refreshView').fire();
                               }
                               else if(state === "ERROR"){
                                   console.log('###ERROR : '+JSON.stringify(action.getError()));
                                   helper.showToast("Error",action.getError()[0].message,"error","dismissible");
                               }
                           });
        $A.enqueueAction(action);   
    },
    toggleSpinner : function (component) {  
        
        var spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(title, message, type, mode, recordId) {
        var toastEvent = $A.get("e.force:showToast");
        if(recordId != null){
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,            
                "mode": mode,
                "messageTemplate": $A.get("$Label.c.LABS_SF_Contract_OpportunityAmended1"),
                "messageTemplateData": ['', {
                    url: '/'+recordId,
                    label: $A.get("$Label.c.LABS_SF_Contract_OpportunityAmended2"),
                }
                                       ]
            });
        }else{
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,            
                "mode": mode
            });
        }
        
        toastEvent.fire();
    },
    getMessages : function(component, event, helper) {
        
        console.log('getMessages IN');
        helper.toggleSpinner(component);
        var contract = component.get("v.contract");
        var accountId = contract.AccountId;
        var okDiv = component.find("okDiv");
        var errorDiv = component.find("errorDiv");
        var errorInfoP = component.find("errorInfoP");
        var errorHeader = component.find("errorHeader");
        var getMessagesAction = component.get("c.beforeEdgWS");
        var activateButton = component.find("activateBtnID");
        var okDivContract = component.find("okDivContract");
        getMessagesAction.setParams({"merchantId": accountId});        
        // Configure response handler
        getMessagesAction.setCallback(this, function(response) {
            
            console.log('getMessages Response');
            helper.toggleSpinner(component);
            var state = response.getState();
            
            if(state === "SUCCESS") 
            {
                var sJson = response.getReturnValue(), oJson = JSON.parse(sJson);
                
                //*****Count of errors more than Zero
                if(oJson.count > 0)
                {   
                    console.log(oJson.count+' errors :: '+sJson);
                    component.set("v.errorMessage", oJson.count + ' error(s) to correct'); 
                    $A.util.toggleClass(errorInfoP, "errorMessage");    
                    component.set("v.errorList", oJson.data); 
                    
                    if(oJson.existing == true)
                    {   
                        component.set("v.AccountCreatedInSysOp",true);
                        component.set("v.errorMessage", "Existing - " + oJson.data[0].sName);
                        activateButton.set("v.disabled", false);
                        $A.util.toggleClass(errorInfoP, "okMessage");
                        $A.util.toggleClass(errorHeader, "toggleHeader");
                        $A.util.toggleClass(okDivContract, "hide");
                    }    
                }
                else 
                {   
                    activateButton.set("v.disabled", false);
                    console.log('No error :: '+sJson);
                    $A.util.toggleClass(errorDiv, "toggle");
                    $A.util.toggleClass(okDiv, "hide");
                }
            } 
            else 
            {
                console.log('Problem getting Messages, response state: ' + state);
            }
        });
        $A.enqueueAction(getMessagesAction);
    },
    saveEdg: function(component, event, helper) {
        
        console.log('Create Merchant');
        helper.toggleSpinner(component);
        var contract = component.get("v.contract");
        var accountId = contract.AccountId;
        var okDivContract = component.find("okDivContract");
        var okDiv = component.find("okDiv");
        component.set("v.Spinner", true);
        
        var saveEdgAction = component.get('c.saveEdgWS');
        
        // retrieve the merchant id to be sent 
        saveEdgAction.setParams({"merchantId": accountId});
        
        // Configure response handler
        saveEdgAction.setCallback(this, function(response) {
            helper.toggleSpinner(component);
            //store state of response
            var state = response.getState();
            
            // Define the different possible toaster as a response
            var toastEvent = $A.get("e.force:showToast");
            
            
            if (component.isValid() && state === "SUCCESS") { /* Get a response from the server (Success or error) */
                
                //set response value in serverRestonse  attribute on component.
                component.set('v.hasErrors', response.getReturnValue());
                console.log('Loading properly the Apex method , response state: ' + state);
                
                var errors = response.getReturnValue();
                console.log('Loading properly the Apex method , response state: ' + errors);
                
                // if the response is true (create merchant succeeded)
                if (errors[0] == 'succeeded') { 
                    toastEvent.setParams({
                        mode: 'dismissible',
                        message: 'Merchant creation succeeded !',
                        type:'success'
                    });
                    $A.util.toggleClass(okDivContract, "hide");
                    $A.util.toggleClass(okDiv, "hide");
                    helper.saveContractEdg(component, event, helper);
                } else { /* otherwise */
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Merchant creation failed ! ' + response.getReturnValue()[1],
                        type:'error'
                    });
                }
            }
            else {
                var errors = saveEdgAction.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        toastEvent.setParams({
                            mode: 'dismissible',
                            message: errors[0].message,
                            type:'error'
                        });
                    }
                } else {
                    toastEvent.setParams({
                        mode: 'dismissible',
                        message: 'Error',
                        type:'error'
                    });
                }
                
                console.log('Problem loading the Apex method, response state: ' + state);
            }
            component.set("v.Spinner", false);
            //$A.get("e.force:closeQuickAction").fire();
            toastEvent.fire();
            //$A.get("e.force:refreshView").fire();
        });
        $A.enqueueAction(saveEdgAction);
    },
    saveContractEdg: function(component, event, helper) {
        
        console.log('Create Contract');
        helper.toggleSpinner(component);
        var contract = component.get("v.contract");
        var accountId = contract.AccountId;
        var okDivContract = component.find("okDivContract");
        component.set("v.Spinner", true);
        
        var saveEdgAction = component.get('c.saveContractEdgWS');
        
        // retrieve the merchant id to be sent 
        saveEdgAction.setParams({
            "contractInst": contract,
            "action": "Activation"
        });
        
        // Configure response handler
        saveEdgAction.setCallback(this, function(response) {
            helper.toggleSpinner(component);
            var state = response.getState();
            
            var toastEvent = $A.get("e.force:showToast");
            
            if (component.isValid() && state === "SUCCESS") {
                console.log('SUCCESS');
                console.log('response.getReturnValue() :: '+response.getReturnValue());
                component.set('v.hasErrors', response.getReturnValue());
                
                var errors = response.getReturnValue();
                console.log('response.errors() :: '+errors);
                // if the response is true (create merchant succeeded)
                if (errors[0] == 'succeeded' || errors[0] == 'warning') { 
                    if(errors[0] == 'succeeded'){
                        toastEvent.setParams({
                        mode: 'dismissible',
                        message: 'Contract creation succeeded !',
                        type:'success'
                    });
                        var activationMessage = $A.get("$Label.c.LABS_SF_Contract_SuccessfullyActivated");
                        activationMessage = activationMessage.replace('{0}',contract.ContractNumber);
                        helper.showToast("",activationMessage,"","dismissible");
                    }
                    else{
                        toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Contract Created with errors: ' + errors[1],
                        type:'warning'
                    });
                    }
                    
                    $A.util.toggleClass(okDivContract, "hide");
                    $A.get("e.force:closeQuickAction").fire();                    
                    $A.get('e.force:refreshView').fire();
                }
                else { /* otherwise */
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: 'Contract creation failed: ' + errors[1],
                        type:'error'
                    });
                }
            }
            else {
                var errors = saveEdgAction.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        toastEvent.setParams({
                            mode: 'dismissible',
                            message: errors[0].message,
                            type:'error'
                        });
                    }
                } else {
                    toastEvent.setParams({
                        mode: 'dismissible',
                        message: 'Error',
                        type:'error'
                    });
                }
                
                console.log('Problem loading the Apex method, response state: ' + state);
            }
            component.set("v.Spinner", false);
            toastEvent.fire();
        });
        $A.enqueueAction(saveEdgAction);
    },
})