({
    opportunityClon: function (component, helper, recordId, pickVal) {
        component.set("v.toggleSpinner", true);
        var action = component.get('c.getCloneOpportunity');
        action.setParams({ financialCenterID: recordId, pickvalue: pickVal, contactId: component.get('v.selectedRecord'), mktgActionId: component.get('v.selectedRecord2'), finCenterFrameId: component.get('v.selectedRecord3'), SquareParent: component.get('v.CapoQuadro'), OwnerId: component.get("v.Owner") });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state); 

            if (state === 'SUCCESS') {
                component.set("v.toggleSpinner", false);
                const result = response.getReturnValue();
                if (result == "CloningNotAllowed") { 
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Financial Center Client status IN DEFINITION cloning not allowed.",
                        "mode": "sticky"
                    });
                }
                else if (result != "noobject" && result != "StatusNotClosedWon") {
                    component.find('notifLib').showToast({
                        "variant": "success",
                        "message": "Opportunity successfully cloned.",
                        "mode": "sticky"
                    });
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                    /*window.setTimeout(function () {
                        window.location.href = "/"+result;
                    }, 1200)  */
                } else if (result == "StatusNotClosedWon") {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Opportunity must be in Stage Closed Won in order to proceed",
                        "mode": "sticky"
                    });
                } else {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Please check. Some object related to Opportunity are missing",
                        "mode": "sticky"
                    });
                }
                // Move to a new location or you can do something else
                //window.location.href = "/"+result;
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": result,
                    "slideDevName": "detail"
                });
                navEvt.fire();

            } else if (state === 'ERROR') {
                component.set("v.toggleSpinner", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
                //const result = response.getReturnValue();
                component.find('notifLib').showToast({
                    "variant": "error",
                    "message": "An error occurred during opportunity cloning. " + message,
                    "mode": "sticky"
                });

            }
        });
        $A.enqueueAction(action);
    },

    pickListValues: function (component, helper, recordId) {
        var action = component.get('c.getPickListTypeValues');
        action.setParams({ financialCenterID: recordId });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);
            if (state === 'SUCCESS') {
                const result = response.getReturnValue();

                component.set("v.pickObject", result);
                console.log('Succes piklist Retrive', state);
                console.log('Succes piklist Retrive result', result);
                if (result == null) {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Financial Center Client status IN DEFINITION cloning not allowed.",
                        "mode": "sticky"
                    });
                    var x = document.getElementById("buttoncloneOppy");
                    x.style.display = "none";
                }
            } else if (state === 'ERROR') {

            }
        });
        $A.enqueueAction(action);
    },
    /*getTypeOppy: function (component, helper, pickVal) {
        console.log('HELPER Set Opportunity type ' + pickVal);

        var action = component.get('c.getTypeOpportunitySet');
        action.setParams({ pickvalue: pickVal });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);
            console.log('Set Opportunity type');
            if (state === 'SUCCESS') {
                const result = response.getReturnValue();
                console.log('Set Opportunity type SUCCES ' + result);

            } else if (state === 'ERROR') {

            }
        });
        $A.enqueueAction(action);
    },*/

    getListOfProduct: function (component, helper, recordId) {
        console.log("Recupero i prodotti per change Product");
        var action = component.get('c.getRetriveProductLineList');
        action.setParams({ idFinancialCenter: recordId });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state getList Product ', state);

            if (state === 'SUCCESS') {
                const result = response.getReturnValue();
                console.log('state getList Product SUCCESS ' + result);
                component.set("v.pickObjectProduct", result);
            } else if (state === 'ERROR') {
            }
        });
        $A.enqueueAction(action);
    },
    opportunityClonProduct: function (component, helper, recordId, pickVal, idProduct) {
        component.set("v.toggleSpinner", true);
        var action = component.get('c.getCloneOpportunityProduct');
        action.setParams({ financialCenterID: recordId, pickvalue: pickVal, productID: idProduct, contactId: component.get('v.selectedRecord'),
                          mktgActionId: component.get('v.selectedRecord2'), finCenterFrameId: component.get('v.selectedRecord3'),
                          SquareParent: component.get('v.CapoQuadro'), OwnerId: component.get('v.Owner'), serviceExpDate: component.get('v.selectedDate') });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);

            if (state === 'SUCCESS') {
                component.set("v.toggleSpinner", false);
                const result = response.getReturnValue();
                if (result == "CloningNotAllowed") {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Financial Center Client status IN DEFINITION cloning not allowed.",
                        "mode": "sticky"
                    });
                }
                else if (result != "noobject" && result != "StatusNotClosedWon") {
                    component.find('notifLib').showToast({
                        "variant": "success",
                        "message": "Opportunity successfully cloned.",
                        "mode": "sticky"
                    });

                    /*window.setTimeout(function () {
                        window.location.href = "/"+result;
                    }, 1200)*/
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "detail"
                    });
                    navEvt.fire();
                } else if (result == "StatusNotClosedWon") {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Opportunity must be in Stage Closed Won in order to proceed",
                        "mode": "sticky"
                    });
                } else {
                    component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "Please check. Some object related to Opportunity are missing",
                        "mode": "sticky"
                    });
                }
                // Move to a new location or you can do something else
                //window.location.href = "/"+result;
                var navEvt = $A.get("e.force:navigateToSObject");
                navEvt.setParams({
                    "recordId": result,
                    "slideDevName": "detail"
                });
                navEvt.fire();

            } else if (state === 'ERROR') {
                component.set("v.toggleSpinner", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);

                component.find('notifLib').showToast({
                    "variant": "error",
                    "message": "An error occurred during opportunity cloning. " + message,
                    "mode": "sticky"
                })

            }
        });
        $A.enqueueAction(action);
    },

    getAccount: function (component, helper, recordId) {
        console.log("Recupero id Account");
        component.set('v.mycolumns', [
            {
                label: 'Financial Center Name',
                fieldName: 'linkName',
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'Name'
                    },
                    target: '_self'
                }
            },

        ]);
        return new Promise((resolve, reject) => {
            var action = component.get('c.getAccount');
            action.setParams({ RecId: recordId });
            action.setCallback(this, (response) => {
                const state = response.getState();
                console.log('state getList Product ', state);

                if (state === 'SUCCESS') {
                    const result = response.getReturnValue();
                    console.log('result.toString : ', result.toString());
                    console.log('state getList Product SUCCESS ' + result.ER_Account_Name__c);
                    component.set("v.AccountId", result.AccountName);
                    component.set("v.Product", result.Product2);
                    component.set("v.ParentCode", result.FrameworkHeadCode);
                    component.set("v.ContractType", result.ContractType);
                    component.set("v.ParentId", result.ParentId);
                    component.set('v.ClientCode', result.ClientCode);
                    component.set('v.IsFlexbenefit', result.isFlexbenefit);
                    console.log('isFlexbenefit from apex: ' + component.get('v.IsFlexbenefit'));
                    var clientCode = component.get('v.ClientCode', result.IT_Financial_Center__c);
                    console.log('client Code ' + clientCode);
                    var code = component.get('v.ParentCode');
                    console.log(' Code ' + code);
                    var contractType = component.get("v.ContractType");
                    var ParentId = component.get('v.ParentId');

                    if ((code == '' && code == undefined) && contractType == '03') {
                        this.CreateLookup(component, event, helper, component.get('v.ParentId'), '');
                    } else if (contractType == '03' && (clientCode == code)) {
                        component.set("v.CapoQuadro", true);
                    } else {
                        this.CreateLookup(component, event, helper, '', ' and IT_Contract__r.IT_Framework_Head_Code__c != \'\' and IT_Client_Status__c=\'02\' and IT_Product2__c=' + '\'' + component.get("v.Product") + '\'');
                    }

                    resolve(response);
                } else if (state === 'ERROR') {
                }
            });
            //$A.enqueueAction(action);
            // if(component.get('v.IsFlexbenefit')== true){
            /*action = component.get('c.GetFinancialCentersFlex');
            action.setParams({recordId:recordId});
            console.log('recordId getAccount' + recordId);
            action.setCallback(this, (response)=>{
                const state = response.getState();
                if(state === 'SUCCESS'){
                    console.log('getFC in Success: ' + recordId);
                    var records = response.getReturnValue();
                    records.forEach(function (record) {
                                //record.linkName = '/lightning/r/Opportunity/' + record.Id + '/view';
                        //console.log('Quote ID in Init flex: '+record.IT_Synced_Zuora_Quote__c);
                        record.linkName = record.Name;
                        console.log('record.Name'+ record.Name);

        });
        component.set("v.FCList", records);
                }
                else if( state === 'ERROR'){
            
                      }
            	
            });*/
            //}        
            $A.enqueueAction(action);
        })
    },
    GetFrameParent: function (component, helper, code) {
        console.log('sono dentro2');
        var action = component.get('c.GetFrameWorkParent');
        action.setParams({ Code: code });
        action.setCallback(this, (response) => {
            const state = response.getState();
            if (state === 'SUCCESS') {
                const result = response.getReturnValue();
                component.set("v.ParentId", result.Id);
                console.log('ParentId' + component.get('v.ParentId'));
            } else if (state === 'ERROR') {
                console.log('erroreparent');
            }
        });
        $A.enqueueAction(action);
    },
    CreateLookup: function (component, event, helper, Parentid, AdditionalFilter) {
        component.set("v.showModal", true);
        $A.createComponent(
            "c:LNIT00_CustomLookup", {
            "objectName": 'ER_Financial_Center__c',
            "fieldName": 'Name',
            "label": 'Capo Quadro',
            "iconName": 'custom:custom61',
            "placeholder": 'Enter Value',
            "value": Parentid,
            "AdditionalFilter": AdditionalFilter
        },
            function (myModal) {
                if (component.isValid()) {
                    var targetCmp = component.find('LookupDiv');
                    var body = targetCmp.get("v.body");
                    body.push(myModal);
                    targetCmp.set("v.body", body);
                }
            }
        );
    },
    GetManager: function (component, helper, recordId) {

        var action = component.get('c.getManager');
        action.setParams({ RecordId: recordId });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('GetManager State: ' + state);
            if (state === 'SUCCESS') {
                const result = response.getReturnValue();
                console.log('Response OwnerId: ' + result)
                component.set("v.Owner", result);
            } else if (state === 'ERROR') {
                console.log('erroreparent');
            }
        });
        $A.enqueueAction(action);
    },

       CheckServiceExpRequired: function (component, helper/*, userId*/) {    //rf 01/06/22 IL-000493
            console.log('service exp');
            var action = component.get('c.getCurrentUserRole');
            action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('service exp state '+state);
            if (state === 'SUCCESS') {
                const role = response.getReturnValue();
                if (role === 'IT Sales Manager 1' ||
                    role === 'IT Sales Manager 2' ||
                    role === 'IT Sales Manager 3' ||
                    role === 'IT Sales Manager 4' ||
                    role === 'IT Sales Rep SM1' ||
                    role === 'IT Sales Rep SM2' ||
                    role === 'IT Sales Rep SM3' ||
                    role === 'IT Sales Rep SM4' ||
                    role === 'IT Sales Rep TL1' ||
                    role === 'IT Sales Rep TL2' ||
                    role === 'IT Sales Rep TL3' ||
                    role === 'IT Sales Rep TL4' ||
                    role === 'IT Sales Rep TL5' ||
                    role === 'IT Sales Rep TL6' ||
                    role === 'IT Team Leader 1' ||
                    role === 'IT Team Leader 2' ||
                    role === 'IT Team Leader 3' ||
                    role === 'IT Team Leader 4' ||
                    role === 'IT Team Leader 5' ||
                    role === 'IT Team Leader 6' ||
                    role === 'IT_Multiproduct' ||
                    role === 'IT_Tender Office' ||
                    role === 'Italy - Branches') {
                    component.set("v.serviceExpRequired", true);
                } else {
                    component.set("v.serviceExpRequired", false);
                }
            }else{
            	console.log('error date');
            }
            });
            $A.enqueueAction(action);
    }
})