({
    Init: function (component, event, helper) {
        console.log('OPP ID: ' + component.get('v.recordId'));
        //var actions = helper.getRowActions.bind(this, component);
        helper.fetchAccounts(component, event, helper);
    },
    fetchAccounts: function (component, event, helper) {
        //var actions = helper.getRowActions.bind(this, component);
        var actions = [
            { label: 'New Quote', name: 'Quote' },
            { label: 'Sincronizza', name: 'Sincronizza' },
            { label: 'Vinci', name: 'Vinci' },
            { label: 'Revisiona', name: 'Revisiona' },
            { label: 'Pdf', name: 'Pdf' },
            { label: 'Scarta', name: 'Scarta' },
            { label: 'Modifica Indirizzo', name: 'ModInd' },
            { label: 'Modifica Account', name: 'ModAcc' },
            { label: 'Esito', name: 'Esito' },
            { label: 'Lince', name: 'Lince' },
            { label: 'Modifica condizioni', name: 'Update' },
            //{ label: 'Invia DocuSign', name: 'DocuSign'}
        ];
         var DocusignAction = {
            label: 'Invia DocuSign', 
            name: 'DocuSign',
        };
        actions.push(DocusignAction);
        //var columns = [
        component.set("v.mycolumns", [
            {
                label: 'Opportunity Name', fieldName: 'linkName', type: 'url',
                typeAttributes: { label: { fieldName: 'Name' }, target: '_self' }
            },
            {
                label: 'FinancialCenter', fieldName: 'linkNameFinancial', type: 'url',
                typeAttributes: { label: { fieldName: 'FinancialCenterName' }, target: '_self' }
            },
            {
                label: 'FinancialCenterEx', fieldName: 'linkNameFinancialEx', type: 'url',
                typeAttributes: { label: { fieldName: 'FinancialCenterNameEx' }, target: '_self' }
            },
            { label: 'Prodotto', fieldName: 'ER_Product_Family__c', type: 'Text' },
            { label: 'Sconto', fieldName: 'Sconto', type: 'Text' },
            { label: 'Metodo Pagamento', fieldName: 'ER_PaymentMethod__c', type: 'Text' },
            { label: 'Pec', fieldName: 'IT_Pec_Ebill__c', type: 'Text', editable: true },
            { label: 'Cod.Fatt.Elettronica', fieldName: 'IT_Ebill_Target_Code__c', type: 'Text', editable: true },
            { label: 'Cod.Univoco Ufficio', fieldName: 'IT_Office_Code__c', type: 'Text', editable: true },
            { label: 'Data firma', fieldName: 'IT_Signed_Date__c', type: 'date', editable: true },
            { label: 'Company Type', fieldName: 'CompanyType', type: 'Text' },
            { label: 'Stato Opportunità', fieldName: 'StageName', type: 'Text' },
            { label: 'Stato Quote', fieldName: 'StageQuote', type: 'Text' },
            { label: 'Boolean DocuSign', fieldName: 'BoolDocuSign', type: 'Bool'  },
            {
                label: 'Quote', fieldName: 'linkNameQuote', type: 'url',
                typeAttributes: { label: { fieldName: 'QuoteName' }, target: '_self' }
            },
            //  {label: 'Esito', fieldName: 'IT_Action_Result__c', type: 'Text' },
            {
                label: 'Result', fieldName: 'Result',
                cellAttributes: {
                    iconName: {
                        fieldName: 'ResultIcon'
                    },
                    iconPosition: 'left',
                    iconAlternativeText: ''
                }
            },      //      {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: { fieldName: 'actionLabel'}, title: 'Click to Edit', name: 'edit_status', iconName: 'utility:edit', disabled: {fieldName: 'actionDisabled'}, class: 'btn_next'}},
            { type: 'action', typeAttributes: { rowActions: actions } }]);
        /*          
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'New Quote', name: 'Quote', title: 'Click to create Quote'}},
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'Sincronizza', name: 'Sincronizza', title: 'Click to create Quote'}},
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'Vinci', name: 'Vinci', title: 'Click to create Quote'}},
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'Revisiona', name: 'Revisiona', title: 'Click to create Quote'}},
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'Pdf', name: 'Pdf', title: 'Click to create Quote'}},
            {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: 'Scarta', name: 'Scarta', title: 'Click to create Quote'}}]);
*/
        //component.set("v.mycolumns",columns);
        var recordId = component.get("v.recordId");
        var action = component.get("c.fetchAccts");
        action.setParams({
            recordId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
            	var checkStatus = false;
                var records = response.getReturnValue();
                records.forEach(function (record) {
                    record.linkName = '/lightning/r/Opportunity/' + record.Id + '/view';
                    if (record.IT_Financial_Center__c) record.linkNameFinancial = '/lightning/r/IT_Financial_Center__c/' + record.IT_Financial_Center__c + '/view';
                    if (record.IT_Financial_Center_Ex__c) record.linkNameFinancialEx = '/lightning/r/IT_Financial_Center__c/' + record.IT_Financial_Center_Ex__c + '/view';
                    if (record.IT_Synced_Zuora_Quote__c) record.linkNameQuote = '/lightning/r/zqu__Quote__c/' + record.IT_Synced_Zuora_Quote__c + '/view';
                    record.linkNameAcc = '/lightning/r/Account/' + record.AccountId + '/view';
                    record.AccountName = record.Account.Name;
            		if (record.IT_Synced_Zuora_Quote__c) {
            			record.StageQuote = record.IT_Synced_Zuora_Quote__r.IT_Approval_Stage__c;
                        if(record.StageQuote === 'In Approval' || record.StageQuote === 'In Approvazione'){
                        	checkStatus = true;
                    	}
        			}	
                    if (record.IT_Synced_Zuora_Quote__c) record.QuoteName = record.IT_Synced_Zuora_Quote__r.Name;
                    if (record.IT_Financial_Center__c) record.FinancialCenterName = record.IT_Financial_Center__r.Name;
                    if (record.IT_Financial_Center_Ex__c) record.FinancialCenterNameEx = record.IT_Financial_Center_Ex__r.Name;
                    if (record.IT_Synced_Zuora_Quote__c) record.Sconto = record.IT_Synced_Zuora_Quote__r.IT_Sconto__c;
            		record.CompanyType = record.Account.IT_Company_Type__c;
                    record.IT_Action_Result__c = record.IT_Action_Result__c;
                    if (record.IT_Action_Result__c == 'SUCCESS') {
                        record.ResultIcon = 'action:approval';
                        record.iconLabel = '';
                    } else if (record.IT_Action_Result__c == '' || record.IT_Action_Result__c == null || record.IT_Action_Result__c == undefined) {
                        record.ResultIcon = '';
                        record.iconLabel = '';
                    } else {
                        record.ResultIcon = 'action:close';
                        record.iconLabel = '';
                    }
                    if (record.ER_Product_Family__c === 'FLEXBENEFIT') component.set("v.flexbenefit", true);
                    //console.log('StageName: ' + record.StageName);
                    if (record.StageName === 'Proposal') {
                        console.log('Sei nel if delle closed won');
                        record.BoolDoc = true;
                        console.log('test if: ' + actions[11]);
                    }
                    else{
                        console.log('Sei nel else delle closed won');
                        DocusignAction.disabled = true;
                        record.BoolDoc = false;
                        //console.log('test else: ' + JSON.parse(JSON.stringify(actions[11])));
                        //actions.push({label: 'Invia DocuSign', name: 'DocuSign'});
                    }
                });
            console.log('in approvazione '+checkStatus);
            	if(checkStatus){
                    records.forEach(function (record) {
                    	record.StageQuote = 'In Approvazione';
                	});
        		}
                component.set("v.acctList", records);
                console.log(JSON.parse(JSON.stringify(component.get("v.acctList"))));
                
            }
        });
        $A.enqueueAction(action);
    },
    runFlow: function (component, event, flowName, inputVariables) {
        //    let flowName = event.getSource().get( "v.name" );
        //    var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        //var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        //          var flowName='IT_ZQuote_From_Opportunity';
        component.set("v.showModal", true);
        $A.createComponent(
            "lightning:flow",
            {
                "onstatuschange": component.getReference("c.hideModal")
            },
            (flow, status, errorMessage) => {
                if (status === "SUCCESS") {
                    component.set("v.body", flow);
                    component.set("v.flow", flow);
                    if (component.get("v.recordId")) {
                        flow.startFlow(flowName, inputVariables);
                        console.log('Flow1');

                    } else {
                        flow.startFlow(flowName);
                        console.log('Flow2');
                    }

                }
            }
        );
    },
    Sync: function (component, event, row) {
        component.set("v.loaded", true);
        var recordId = row.IT_Synced_Zuora_Quote__c;
        var action = component.get("c.syncQuoteAndOpportunity");
        action.setParams({
            recordId
        });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);
            if (state === 'SUCCESS') {
                component.set("v.loaded", false);
                var resp = response.getReturnValue();
                console.log('check', resp.check);
                if (resp.check) {
                    this.alert(component, event, "Success", '', "Sync succeded!");
                    //location.reload();
                    $A.get('e.force:refreshView').fire();
                } else {
                    this.alert(component, event, "error", '', "It's not possible to synchronize a quote that has not been approved yet.");
                }

                $A.get('e.force:refreshView').fire();
            } else if (state === 'ERROR') {
                component.set("v.loaded", false);
                var errors = response.getError();
                console.log('errors', errors);
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }

                console.error('errors', message);
                this.alert(component, event, "error", "There was a problem syncing quote.", message);
            }
        });

        $A.enqueueAction(action);
    },
    alert: function (component, event, variant, title, message) {
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode": "sticky"/*,
            "duration": duration*/
        });
    },
    Discard: function (component,row,action,helper) {
        var serverAction = component.get("c.DiscardOpportunity");
        serverAction.setParams({
            recordId: row.Id
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.fetchAccounts(component,event, helper);
            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },
    Revision: function (component, row, action, helper) {
        var serverAction = component.get("c.Revision");
        serverAction.setParams({
            recordId: row.Id
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.fetchAccounts(component,event, helper);
            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },
    openPdf: function (component, event, helper, row) {
        component.set("v.showModal", true);
        $A.createComponent(
            "c:LNIT00_SelectQuoteTemplateForProduct", {
            "recordId": row.IT_Synced_Zuora_Quote__c
        },
            function (myModal) {
                if (component.isValid()) {
                    var targetCmp = component.find('ModalDiv');
                    var body = targetCmp.get("v.body");
                    body.push(myModal);
                    targetCmp.set("v.body", body);
                }
            }
        );

    },
    invokePostWon: function (component, recordId) {
        console.log('sono nel post won');
        return new Promise($A.getCallback((resolve, reject) => {
            const action = component.get('c.Won');
            action.setParams({
                recordId: recordId
            });

            action.setCallback(this, (response) => {
                const returnVal = response.getReturnValue();
                console.log('returnVal', returnVal);
                if (returnVal === null || returnVal === '')
                {
                    this.alert(component, event, "Error", 'An internal error occurred. Please, contact your administrator.', '');
                    this.invokeUpdateStage(component, recordId, 'Negotiation');

                    component.set("v.loaded", false);
                    console.log('sono nel post won 2');
                }
                else
                {
                    var status = returnVal.split('·')[0];

                    if (status === 'SUCCESS')
                    {
                        component.set("v.loaded", false);
                        var customerCode = returnVal.split('·')[1];
                        console.log('customerCode', customerCode);
                        component.set("v.customer_ref", customerCode);
                        resolve(response);
                        console.log('sono nel post won 3');
                        //helper.alert(component,event,helper,"success",'Success!','');
                    }
                    else if (status === 'ERROR')
                    {
                        component.set("v.loaded", false);
                        var statusCode = returnVal.split('·')[1];
                        var messageCode = returnVal.split('·')[2];
                        var messageText = returnVal.split('·')[3];
                        /*if(messageText.includes("Error: ")){
                            var finalMessage = messageText.split('Error: ')[1];
                        }*/
                        console.error('Error code: ' + statusCode + ' - ' + messageCode + ': ' + messageText);
                        this.alert(component, event, "error", statusCode + ', ' + messageCode, messageText);
                        this.invokeUpdateStage(component, recordId, 'Negotiation');
                        console.log('sono nel post won 4');
                    }
                }

            });

            $A.enqueueAction(action);
        }));
    },
    invokeGenerateContract: function (component, recordId, customerRef) {
        component.set("v.loaded", true);
        const action = component.get('c.generateContract');
        console.log('generate contract');
        action.setParams
        ({
            recordId: recordId,
            customerRef: customerRef
        });

        action.setCallback(this, (response) =>
        {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                component.set("v.loaded", false);
                this.alert(component, event, "success", 'Contract generated!', '');
                // $A.get('e.force:refreshView').fire();
            }
            else if (status === 'ERROR')
            {
                component.set("v.loaded", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
                this.alert(component, event, "error", 'Error while generating contract', message);
                this.invokeUpdateStage(component, recordId, 'Negotiation');
            }
        });

        $A.enqueueAction(action);

    },
    invokeUpdateStage: function (component, recordId, selectStatus) {
        component.set("v.loaded", true);
        var action = component.get("c.updateStage");
        console.log('updatestatus:' + recordId)
        action.setParams({ recordId: recordId, selectStatus: selectStatus });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //helper.alert(component,event,helper,"success",'',"Record was updated sucessfully.");
                component.set("v.loaded", false);
            } else {
                component.set("v.loaded", false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, "error", '', message);
            }
            //     $A.get('e.force:refreshView').fire();

        });
        $A.enqueueAction(action);
    },
    postWon: function (component, event, row) {
        component.set("v.loaded", true);
        // component.set("v.isModalOpen",false);
        //Get record id
        const recordId = row.Id;
        //Get picklist status selected
        var selectStatus = 'Closed Won';
        console.log('postwon');
        var action = component.get("c.updateStage");
        action.setParams({
            recordId: recordId,
            selectStatus: selectStatus
        });
        action.setCallback(this, function (response) {
            var state = response.getReturnValue();
            if (state === "Closed Won") {
                this.invokePostWon(component, recordId).then(() => {
                    //invoke generate contract method
                    const customerRef = component.get("v.customer_ref");
                    return this.invokeGenerateContract(component, recordId, customerRef);
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
                console.log('post won 5');
                console.log('row:' + row.id);
                console.error('errors', message);
                // this.alert(component,event,helper,"error",'',message);
            }
            // $A.get('e.force:refreshView').fire();
        });
        $A.enqueueAction(action);

    },

    //GESTIONE FUTURA START

    postWonFUTURE: function (component, event, rows) {
        // component.set("v.isModalOpen",false);
        //Get record id

        console.log('Post won future rows', rows);
        var rowIds = rows.map(el => el.Id);
        console.log('Post won future rowIds', rowIds);

        //Get picklist status selected
        var selectStatus = 'Closed Won';
        console.log('postwon');
        var action = component.get("c.MassiveUpdateStageFuture");
        action.setParams({
            "recordIds": rowIds,
            "status": selectStatus
        });
        action.setCallback(this, function (response)
        {
            var state = response.getState();
            var Values = response.getReturnValue() || [];
            var rowIds2 = [];

            console.log('Massive Close Won Update Values: ', Values);

            Values.forEach( element =>
            {
                if (element != null && element != undefined) 
                    rowIds2.push(element);
            });

            if (state === "SUCCESS" && rowIds2.length > 0) 
            {
                this.invokePostWonFUTURE(component, event, rowIds2);
                this.alert(component, event, "Success", '', "Won massivo in corso, clicca refresh per avere il risultato");
            }
            else
            {
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                this.alert(component, event, "error", '', message);
            }
            //  $A.get('e.force:refreshView').fire();
        });
        $A.enqueueAction(action);

    },

    invokePostWonFUTURE: function (component, event, recordIds) {
        console.log('sono nel post won');
        return new Promise($A.getCallback((resolve, reject) => {
            const action = component.get('c.MassiveWonFuture');
            action.setParams({
                "recordIds": recordIds
            });

            action.setCallback(this, (response) => {
                if (status === 'SUCCESS') {
                    resolve(response);

                } else if (status === 'ERROR') {
                    //   this.invokeUpdateStageFUTURE(component,event, recordIds, 'Negotiation');
                }
            });

            $A.enqueueAction(action);
        }));
    },

    invokeGenerateContractFUTURE: function (component, event, recordIds, customerRef) {
        const action = component.get('c.MassiveGenerateContractFuture');
        action.setParams({
            "recordId": recordIds,
            "customerRef": customerRef,
            "size": recordIds.length
        });

        action.setCallback(this, (response) => {
            var status = response.getState();
            console.log('status', status);
            if (status === 'SUCCESS') {
                this.alert(component, event, "success", 'Contract generated!', '');
                //  $A.get('e.force:refreshView').fire();
            } else if (status === 'ERROR') {
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
                this.alert(component, event, "error", 'Error while generating contract', message);
                this.invokeUpdateStageFUTURE(component, event, recordIds, 'Negotiation');
            }
        });

        $A.enqueueAction(action);

    },
    invokeUpdateStageFUTURE: function (component, event, recordIds, selectStatus) {

        action.setParams({
            "recordId": recordIds,
            "selectStatus": selectStatus,
            "size": recordIds.length
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //helper.alert(component,event,helper,"success",'',"Record was updated sucessfully.");

            } else {

                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                console.error('errors', message);
                helper.alert(component, event, "error", '', message);
            }
            //    $A.get('e.force:refreshView').fire();

        });
        $A.enqueueAction(action);
    },
    MassiveRevision: function (component, rows) {
        var rowIds = [];
        rows.forEach(function (element) {
            rowIds.push(element.Id);
        });
        var serverAction = component.get("c.MassiveRevision");
        serverAction.setParams({
            "recordIds": rowIds
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.fetchAccounts();
            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },

    MassiveSync: function (component, event, rows) {
        var rowIds = [];
        var oppIds = [];
        rows.forEach(function (element) {
            rowIds.push(element.IT_Synced_Zuora_Quote__c);
            oppIds.push(element.Id);
        });
        component.set("v.loaded", true);
        var action = component.get("c.MassivesyncQuoteAndOpportunityFuture");
        action.setParams({
            "recordIds": rowIds,
            "oppIds": oppIds,
        });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);
            if (state === 'SUCCESS') {
                component.set("v.loaded", false);
                this.alert(component, event, "Success", '', "Sincronizzazione massiva in corso, clicca refresh per avere il risultato");
                //location.reload();
                $A.get('e.force:refreshView').fire();

            } else if (state === 'ERROR') {
                component.set("v.loaded", false);
                var errors = response.getError();
                console.log('errors', errors);
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }

                console.error('errors', message);
                this.alert(component, event, "error", "There was a problem syncing quote.", message);
            }
        });

        $A.enqueueAction(action);
    },
    MassiveopenPdf: function (component, event, rows) {
        /*component.set( "v.showModal", true );
        $A.createComponent(
            "c:LNIT00_SelectQuoteTemplateForProduct",{
                "rows": rows,
                "isMassive" : true
            },
            function(myModal){
                if (component.isValid()) {
                    var targetCmp = component.find('ModalDiv');
                    var body = targetCmp.get("v.body");
                    body.push(myModal);
                    targetCmp.set("v.body", body);           
                }
            }
        );*/

        rows.forEach(function (element) {
            var record15id = element.IT_Synced_Zuora_Quote__c.slice(0, 15);
            var urlZuora = "/apex/zqu__zqgeneratedocument?quoteId=" + record15id + "&format=pdf";
            window.open(urlZuora);
        });
    },
    saveDataTable: function (component, event, helper) {
        var editedRecords = event.getParam('draftValues');
        var totalRecordEdited = editedRecords.length;
        var action = component.get("c.updateOppo");
        action.setParams({
            'editedOppoList': editedRecords
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //if update is successful
                if (response.getReturnValue() === true) {
                    this.alert(component, event, "Success", '', "Record Saved!");
                    helper.Init(component, event, helper);
                } else { //if update got failed
                    this.alert(component, event, "error", '', 'error');
                }
            }
        });
        $A.enqueueAction(action);
    },
    reloadDataTable: function () {
        var refreshEvent = $A.get("e.force:refreshView");
        if (refreshEvent) {
            refreshEvent.fire();
        }
    },

    massiveActivation: function (component, rows) {
        var rowIds = [];
        rows.forEach(function (element) {
            rowIds.push(element.Id);
        });
        component.set("v.loaded", true);
        var serverAction = component.get("c.MassiveActivation");
        serverAction.setParams({
            "recordIds": rowIds
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.loaded", false);
                this.alert(component, event, "success", 'Successo', 'Flag Attivazione aggiornato!');
            } else {
                console.log('error');
                component.set("v.loaded", false);
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },
    lince: function(component, helper, event, recordId)
    {
        console.log(recordId)

        let action = component.get('c.getOpportunityQuote');

        action.setParams({
            oppId: recordId
        });

        action.setCallback(this, (response) => {
            let state = response.getState();
            console.log(state)
            if(state == 'SUCCESS')
            {
                let returnValue = response.getReturnValue();
                console.log(returnValue)
                if(returnValue != 'Errore')
                {
                    component.set('v.linceSelectedId', returnValue);

                    helper.invokeValidLince(component, helper, event, returnValue);
                }
            }
        })

        $A.enqueueAction(action);
    },

    invokeValidLince: function (component, helper, event, recordId) {

        var action = component.get("c.ValidLince");
        action.setParams({
            "recordId": recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('valid lince state ', state);
            var result = response.getReturnValue();
            if (state === "SUCCESS") {
                if (result != null)
                    component.set("v.validLince", result);

                    helper.Call(component, event, helper);
                
            } else if (state === "ERROR") {

                console.error(response.getError());

                //helper.alert(component, event, helper, 'error', 'Error on Lince.', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },

    Call : function(component, event, helper) {
        //component.set("v.tDetailListSize", response.getReturnValue());
        console.log('Call');
        var action = component.get("c.getCervedDoc");
        console.log(action, component.get('v.linceSelectedId'))
        action.setParams({
            "AccID" : component.get("v.linceSelectedId")
        })
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('Call state: ', state);

            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('result',result);
                if (result !== null) {
                    var title = result.split('·')[0];
                    var message = result.split('·')[1];
                    if(title === 'SUCCESS'){
                        console.log('result status',title);
                        console.log('result message',message);
                    	component.set("v.linceSelectedId", message);
                    	component.set("v.showLince" , true); 
                        $A.get('e.force:refreshView').fire();
                    } else {
                        helper.alert(component, event, 'error', title, message);
                    }
                    
                } 
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors',errors);
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                
                console.error('errors',message);
                helper.alert(component,event,helper,"error",'ERROR',message);
                component.set("v.showLince" , true); 
                //alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    onClickDocu: function(component, event, helper,recordId){
    	component.set("v.loaded",true);
        //var recordId = component.get("v.recordId");
        console.log('recordId riga: ',recordId);
        var action2 = component.get("c.checkQuoteConditions");
        action2.setParams ({
            recordId : recordId
        });
        action2.setCallback(this, (response)=>{
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log('Quote andata a buon fine');
                var result = response.getReturnValue();
                console.log(result);
                if(result == true){
                    console.log('ParteButtonFilter');
                    this.buttonFilter(component, event, helper, recordId);    
                    //helper.buttonFilter(component, event, helper, recordId);                   
                }
                if(result == false){
                    console.log('test sei nel no');
                    component.set("v.loaded",false);
                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Attenzione!",
                            "message": "Prima di procedere con l'invio del contratto tramite Docusign, popolare i campi nella sezione Contratto Welfare",
                            "type" : "error"
                            });
    toastEvent.fire();
                    this.showToast("Error!", "error", "Compilare campi quote!");
                    alert('Compilare i campi della quote !!');
                    
                }
                //helper.invokeDocusignLink(component, event, helper, recordId);
            }
            if (state === "ERROR") {
                  var errors = response.getError();
                  if (errors) {
                      if (errors[0] && errors[0].message) {
                          console.log("Error message: " + 
                                   errors[0].message);
                                   cmp.set("v.errorMessage",errors[0].message);
                                   cmp.set("v.showErrors",true);
                      }
                    }
                }
        });
        $A.enqueueAction(action2);
		//helper.invokeDocusignLink(component, event, helper, recordId);        
    },

    buttonFilter: function (component,event,helper,recordId){
        console.log('recordId row:' + recordId);
        //console.log('docusign');
        var action = component.get("c.filterDocuSignWelfare");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('OK docusign');
                var urlString = window.location.href;
                console.log('URLSTRING:: ' + urlString);
                var baseURL = urlString.substring(0, urlString.indexOf("/r/"));
                var result = response.getReturnValue();
                //console.log('link docusign '+encodeURI(result));
                component.set("v.loaded",false);
                component.set("v.disable",true);
                var urlCall = baseURL + encodeURI(result);
                console.log('urlCall: ' + urlCall);
                /*$A.util.addClass(component.find('buttonDocu'), "slds-button_success");
                component.set("v.buttonLabelDocu",$A.get("$Label.c.IT_Contratto_Inviato_Docusign"));*/
                //var link = {!URLFOR("/apex/dfsle__gendocumentgenerator",null,)};
                //var link = encodeURIComponent(result);
                //EncodingUri funziona ma genera messaggio "The link you followed isn’t valid. This page requires a CSRF confirmation token. Report this error to your Salesforce administrator."
                //var link = encodeURI(result);
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({                      
                    //"url" : "/apex/dfsle__gendocumentgenerator',null,'[sId=0065r000004N4PMAA0,templateId=a2p5r000000HsF6AAK,recordId=0065r000004N4PMAA0,title=Contratto Ticket Restaurant cartaceo]"
                    "url": result
                    //"url":'/one/one.app#eyJjb21wb25lbnREZWYiOiJvbmU6YWxvaGFQYWdlIiwiYXR0cmlidXRlcyI6eyJhZGRyZXNzIjoiaHR0cHM6Ly9lci1pdGFseS0tZGV2MDAyLS1kZnNsZS52aXN1YWxmb3JjZS5jb20vYXBleC9nZW5kb2N1bWVudGdlbmVyYXRvcj9zSWQ9MDA2NXIwMDAwMDRONFBNJnRlbXBsYXRlSWQ9YTJwNXIwMDAwMDBIc0Y2QUFLJnJlY29yZElkPTAwNjVyMDAwMDA0TjRQTSZ0aXRsZT1Db250cmF0dG8rVGlja2V0K1Jlc3RhdXJhbnQrY2FydGFjZW8mX0NPTkZJUk1BVElPTlRPS0VOPVZtcEZQU3hOYWtGNVRXa3dkMDFwTUhoTk1WRjNUMFJ2TVU1NmIzZFBRelEwVGxST1lTeEhiSGhWU1RkeVFUQkRlV1U1VWtoVlRFNHlUbGR4TEUxRVRYbGFhbXMxJmNvbW1vbi51ZGQuYWN0aW9ucy5BY3Rpb25zVXRpbE9SSUdfVVJJPSUyRmFwZXglMkZkZnNsZV9fZ2VuZG9jdW1lbnRnZW5lcmF0b3IifSwic3RhdGUiOnt9fQ%3D%3D'
                });
                urlEvent.fire();
                //window.open(link,"_blank");//_parent//_blank
            }else{
                component.set("v.loaded",false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                	message += errors[0].message;
            	}
                console.error('errors',message);
                helper.alert(component,event,helper,"error",message,'');
                //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
     },
     getRowActions: function (component, row, doneCallback) {
        var actions = [
            { label: 'New Quote', name: 'Quote' },
            { label: 'Sincronizza', name: 'Sincronizza' },
            { label: 'Vinci', name: 'Vinci' },
            { label: 'Revisiona', name: 'Revisiona' },
            { label: 'Pdf', name: 'Pdf' },
            { label: 'Scarta', name: 'Scarta' },
            { label: 'Modifica Indirizzo', name: 'ModInd' },
            { label: 'Modifica Account', name: 'ModAcc' },
            { label: 'Esito', name: 'Esito' },
            { label: 'Lince', name: 'Lince' },
            { label: 'Modifica condizioni', name: 'Update' },
            //{ label: 'Invia DocuSign', name: 'DocuSign'}

        ];
        var DocusignAction = {
            label: 'Invia DocuSign', 
            name: 'DocuSign'
        };
        console.log('QUI: ' +  row.StageName);
        if(row.StageName === 'Closed Won'){
            console.log('QUI');
            DocusignAction.disabled = true;
        }
        actions.push(DocusignAction);
    }
})