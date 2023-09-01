({
    invokePostWon: function(component, helper, recordId) {
        console.log('sono nel post won');
        return new Promise($A.getCallback((resolve, reject) => {
            const action = component.get('c.postWonAura');
            action.setParams({ recordId });

            action.setCallback(this, (response) => {
                const returnVal = response.getReturnValue();
                console.log('returnVal', returnVal);
                if (returnVal === 'WonNotRequired') {
                    helper.invokeUpdateStage(component, helper, recordId, 'Closed Won');
                } else if (returnVal === null || returnVal === '') {
                    helper.alert(component, event, helper, "Error", 'An internal error occurred. Please, contact your administrator.', '');
                    helper.invokeUpdateStage(component, helper, recordId, 'Negotiation');
                    component.set("v.loaded", false);
                } else {
                    var status = returnVal.split('·')[0];
                    if (status === 'SUCCESS') {
                        component.set("v.loaded", false);
                        var customerCode = returnVal.split('·')[1];
                        console.log('customerCode', customerCode);
                        component.set("v.customer_ref", customerCode);
                        resolve(response);
                        //helper.alert(component,event,helper,"success",'Success!','');
                    } else if (status === 'ERROR') {
                        component.set("v.loaded", false);
                        var statusCode = returnVal.split('·')[1];
                        var messageCode = returnVal.split('·')[2];
                        var messageText = returnVal.split('·')[3];
                        /*if(messageText.includes("Error: ")){
                            var finalMessage = messageText.split('Error: ')[1];
                        }*/
                        console.error('Error code: ' + statusCode + ' - ' + messageCode + ': ' + messageText);
                        helper.alert(component, event, helper, "error", statusCode + ', ' + messageCode, messageText);
                        helper.invokeUpdateStage(component, helper, recordId, 'Negotiation');
                    }
                }

            });

            $A.enqueueAction(action);
        }));
    },
    invokeGenerateContract: function(component, helper, recordId, customerRef) {
        component.set("v.loaded", true);
        const action = component.get('c.generateContract');
        action.setParams({
            recordId: recordId,
            customerRef: customerRef
        });

        action.setCallback(this, (response) => {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                component.set("v.loaded", false);
                helper.alert(component, event, helper, "success", 'Contract generated!', '');
                $A.get('e.force:refreshView').fire();
                helper.invokeGenerateTicketWelfareVAT(component, helper, component.get('v.recordId'), component.get("v.customer_ref"))
            } else if (status === 'ERROR') {
                component.set("v.loaded", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, helper, "error", 'Error while generating contract', message);
                helper.invokeUpdateStage(component, helper, recordId, 'Negotiation');
            }
        });

        $A.enqueueAction(action);

    },
    invokeGenerateTicketWelfareVAT: function(component, helper, recordId, customerId) {
        console.log(recordId, customerId);

        let action = component.get('c.createTicketWelfareVAT');

        action.setParams({
            customerId: customerId,
            recordId: recordId,
            otherOpp: null
        })

        action.setCallback(this, (res) => {
            switch (res.getReturnValue()) {
                case 'Done':
                    helper.alert(component, event, helper, "success", 'Ticket Welfare in IVA generato!', '');
                    break;

                case 'Opportunità non trovata':
                    helper.alert(component, event, helper, "error", 'Opportunità non trovata', '');
                    break;

                case 'Creating amend':
                    helper.alert(component, event, helper, "success", 'Generando Ticket Welfare in IVA', '');
                    break;

                case 'Non ticket welfare':
                    break;

                default:
                    helper.alert(component, event, helper, "error", 'Errore sconosciuto', '');
            }
        })

        $A.enqueueAction(action)
    },
    invokeUpdateStage: function(component, helper, recordId, selectStatus) {
        component.set("v.loaded", true);
        var action = component.get("c.updateStage");
        action.setParams({ recordId: recordId, selectStatus: selectStatus });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //helper.alert(component,event,helper,"success",'',"Record was updated sucessfully.");
                component.set("v.loaded", false);
                $A.get('e.force:refreshView').fire();
            } else {
                component.set("v.loaded", false);
                var errors = response.getError();
                console.log('errors', errors);
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, helper, "error", '', message);
                $A.get('e.force:refreshView').fire();
            }



        });
        $A.enqueueAction(action);
    },
    invokeAutomaticContract: function(component, helper, recordId) {
        return new Promise($A.getCallback((resolve, reject) => {
            const action = component.get("c.getAutomaticContract");
            action.setParams({ recordId });

            action.setCallback(this, (response) => {
                var state = response.getState();
                console.log('state', state);

                if (state === 'SUCCESS') {
                    component.set("v.loaded", false);
                    var result = response.getReturnValue()
                    console.log('result', result);
                    component.set("v.automatic", result);

                    resolve(response);
                } else {
                    component.set("v.loaded", false);
                    var errors = response.getError();
                    console.error('Error : ' + errors);
                    helper.alert(component, event, helper, "error", errors);
                    //helper.invokeUpdateStage(component,helper,recordId,'Negotiation');
                }
            });

            $A.enqueueAction(action);
        }));

    },
    invokeCreateCase: function(component, helper, recordId) {
        console.log('create case');
        component.set("v.loaded", true);
        var action = component.get("c.createCase");
        action.setParams({ oppId: recordId });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.alert(component, event, helper, "success", '', "Provisioning Case created");
                component.set("v.loaded", false);
                $A.get('e.force:refreshView').fire();
            } else {
                component.set("v.loaded", false);
                var errors = response.getError();
                console.log('errors', errors);
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, helper, "error", 'Errors creating provisioning case', message);
                $A.get('e.force:refreshView').fire();
            }



        });
        $A.enqueueAction(action);
    },
    // TTT
    postWon: function(component, event, helper, isCaseRequired) {
        component.set("v.loaded", true);
        component.set("v.isModalOpen", false);
        component.set("v.isModalCaseOpen", false);
        var createCaseProv = component.get("v.createCase");
        //Get record id
        const recordId = component.get('v.recordId');
        //Get picklist status selected
        var selectStatus = component.get('v.picklistField.StageName');
        console.log('in postwon');
        console.log(selectStatus);
        var action = component.get("c.updateStage");
        action.setParams({
            recordId: recordId,
            selectStatus: selectStatus
        });
        action.setCallback(this, function(response) {
            console.log('in postwon in setCallback');

            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('in postwon in setCallback SUCCESS');
                helper.invokePostWon(component, helper, recordId).then(() => {
                    //invoke generate contract method
                    const customerRef = component.get("v.customer_ref");
                    console.log('createCaseProv ', createCaseProv);
                    if (!createCaseProv) {
                        return helper.invokeGenerateContract(component, helper, recordId, customerRef);
                    } else {
                        console.log('create case');
                        helper.invokeGenerateContract(component, helper, recordId, customerRef);
                        return helper.invokeCreateCase(component, helper, recordId);
                    }

                });
                //helper.invokeGenerateContract(component,helper,recordId,'E430111');
            } else {
                component.set("v.loaded", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, helper, "error", '', message);
            }
            $A.get('e.force:refreshView').fire();
        });
        console.log('in postwon fine***');
        $A.enqueueAction(action);

    },
    invokeCreditCheck: function(component, event, helper) {
        console.log('credit check');
        component.set("v.loaded", true);
        var recordId = component.get('v.recordId');
        console.log('recordId', recordId);
        const action = component.get('c.creditCheck');
        action.setParams({
            oppId: recordId
        });

        action.setCallback(this, (response) => {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                component.set("v.loaded", false);
                var returnValue = response.getReturnValue();
                console.log('return value ', returnValue);
                var message = returnValue.split('+')[0];

                if (returnValue) {
                    if (message == 'error') {
                        component.set("v.loaded", false);
                        helper.alert(component, event, helper, "error", 'Errore servizio credit check ', returnValue.split('+')[1]);
                    } else if (message == 'success') {
                        var value = parseInt(returnValue.split('+')[1]);
                        //check if ok or not
                        component.set("v.loaded", false);
                        if (value <= 33) {
                            helper.alert(component, event, helper, "error", 'Credit check rosso', returnValue.split('+')[1]);
                        } else if (value <= 66) {
                            helper.alert(component, event, helper, "error", 'Credit check giallo', returnValue.split('+')[1]);
                        } else {
                            helper.alert(component, event, helper, "success", 'Credit check verde', returnValue.split('+')[1]);
                            helper.postWon(component, event, helper);
                        }

                    } else {
                        component.set("v.loaded", false);
                        helper.alert(component, event, helper, "error", 'Errore servizio credit check ', returnValue);
                    }
                }
                $A.get('e.force:refreshView').fire();
            } else if (status === 'ERROR') {
                component.set("v.loaded", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, helper, "error", 'An error occurred. Contact your Salesforce Admin. ', message);
            }
        });

        $A.enqueueAction(action);

    },
    isCreditCheckRequired: function(component, event, helper, recordId) {
        const action = component.get('c.creditCheckConditions');
        action.setParams({
            oppId: recordId
        });

        action.setCallback(this, (response) => {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                console.log('cc ', response.getReturnValue());
                component.set('v.creditCheckRequired', response.getReturnValue());
            }
        });

        $A.enqueueAction(action);

    },
    conditionsCaseProvisioning: function(component, event, helper, recordId) {
        const action = component.get('c.getCaseProvisioningConditions');
        action.setParams({
            oppId: recordId
        });

        action.setCallback(this, (response) => {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                console.log('case prov ', response.getReturnValue());
                component.set('v.caseProv', response.getReturnValue());
            }
        });

        $A.enqueueAction(action);

    },
    alert: function(component, event, helper, variant, title, message) {
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode": "sticky"
                /*,
                            "duration": 7000*/
        });

    }
})