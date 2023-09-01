({
    Init: function (component, event, helper) {
        helper.Init(component, event, helper);
    },

    closeLinceModal: function (component, event, helper) {
        component.set('v.showLince', false);
    },

    handleRowAction: function (component, event, helper) {

        var action = event.getParam('action');
        var row = event.getParam('row');
        var rowList = [];
        rowList.push(row);
        switch (action.name) {
            case 'Quote':
                var inputVariables = [{
                    name: "recordId",
                    type: "String",
                    value: row.Id
                }];
                var flowName = 'IT_ZQuote_From_Opportunity';
                helper.runFlow(component, event, flowName, inputVariables);
                break;
            case 'Update':
                var inputVariables = [{
                    name: "recordId",
                    type: "String",
                    value: row.Id
                }];
                var flowName = 'IT110_UpdateGroupValues';
                // mdaolio 20230303 - IL 1608
                if (row.IT_Product_Line_Type__c == '6') {
                    flowName = 'IT110_UpdateGroupValuesWelfare';
                }
                helper.runFlow(component, event, flowName, inputVariables);
                break;
            case 'Sincronizza':
                helper.Sync(component, event, row);
                break;
            case 'Vinci':
                helper.postWon(component, event, row);
                break;
            case 'Revisiona':
                helper.Revision(component, row, action, helper);
                break;
            case 'Pdf':
                helper.openPdf(component, event, helper, row);
                break;
            case 'Scarta':
                helper.Discard(component, row, action,helper);
                break;
            case 'ModInd':
                var inputVariables = [{
                    name: "recordId",
                    type: "String",
                    value: row.Id
                }];
                var flowName = 'IT_Opp_ChangeAddress';
                helper.runFlow(component, event, flowName, inputVariables);
                break;
            case 'ModAcc':
                var inputVariables = [{
                    name: "OpportunityId",
                    type: "String",
                    value: row.Id
                }];
                var flowName = 'IT98_EditAccountData';
                helper.runFlow(component, event, flowName, inputVariables);
                break;
            case 'Esito':
                if (row.IT_Action_Result__c == 'SUCCESS') {
                    helper.alert(component, event, "Success", '', row.IT_Action_Result__c);
                } else {
                    helper.alert(component, event, "error", '', '' + row.IT_Action_Result__c);
                }
                break;
            case 'Lince':
                console.log('Lince pressed');
                helper.lince(component, helper, event, row.Id)
                break;
            case 'DocuSign':
                console.log('DocuSign: ' + row.Id);
                console.log('Status: ' + row.StageName);
                helper.onClickDocu(component, helper, event, row.Id);
                break;
            default:
                // helper.showRowDetails(row);
                break;
        }
    },

    hideModal: function (component, event, helper) {
        if (event.getParam("status").indexOf("FINISHED") !== -1) {
            component.set("v.showModal", false);
            component.get("v.body").destroy();
            component.get("v.flow").destroy();

            $A.get('e.force:refreshView').fire();

        }

    },
    isRefreshed: function (component, event, helper) {
        location.reload();
    },
    closeModal: function (component, event, helper) {
        component.set('v.showModal', false);
        //component.find('ModalDiv').destroy();
        component.get("v.body").destroy();
        component.get("v.flow").destroy();
        component.find('ModalDiv').set('v.body', []);

        /*var body = component.get("v.body");
        body.shift();
        component.set('v.body', body);
        component.find('templateID').destroy();*/
    },

    toggleSection: function (component, event, helper) {
        // dynamically get aura:id name from 'data-auraId' attribute
        var sectionAuraId = event.target.getAttribute("data-auraId");
        // get section Div element using aura:id
        var sectionDiv = component.find(sectionAuraId).getElement();
        /* The search() method searches for 'slds-is-open' class, and returns the position of the match.
         * This method returns -1 if no match is found.
         */
        var sectionState = sectionDiv.getAttribute('class').search('slds-is-open');

        // -1 if 'slds-is-open' class is missing...then set 'slds-is-open' class else set slds-is-close class to element
        if (sectionState == -1) {
            sectionDiv.setAttribute('class', 'slds-section slds-is-open');
        } else {
            sectionDiv.setAttribute('class', 'slds-section slds-is-close');
        }
    },
    WonSelected: function (component, event, helper) {

    },

    updateSelectedRows: function (cmp, event) {
        var selectedRows = event.getParam('selectedRows');
        console.log('ROWS: ' + JSON.stringify(selectedRows));
        cmp.set('v.myRows', selectedRows);
    },

    massiveAuth: function (component, event, helper) {
        var rows = component.get("v.acctList");
        if (rows != null && rows != undefined && rows.length > 0) {
            var rowIds = [];
            rows.forEach(function (element) {
                console.log('SYNC QUOTE ID: ' + element.IT_Synced_Zuora_Quote__c);
                if (element.IT_Synced_Zuora_Quote__c != null && element.IT_Synced_Zuora_Quote__c != undefined) {
                    rowIds.push(element.IT_Synced_Zuora_Quote__c);
                }
            });
            var serverAction = component.get("c.MassiveAuth");
            console.log('AFTER ACTION');
            serverAction.setParams({
                "recordIds": rowIds
            });
            console.log('AFTER SETPARAMS');
            serverAction.setCallback(this, function (response) {
                var state = response.getState();
                console.log('AFTER state' + state);
                if (state === "SUCCESS") {
                    helper.alert(component, event, "success", 'Successo', 'Quote selezionate mandate in approvazione');
                } else {
                    var errors = response.getError();
                    let message = ''; // Default error message
                    // Retrieve the error message sent by the server
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        message += errors[0].message;
                    }
                    console.error('errors', message);
                    helper.alert(component, event, "error", 'Error', message);
                }
            });
            $A.enqueueAction(serverAction);
        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }
    },
    massiveSync: function (component, event, helper) {
        var rows = component.get("v.myRows");
        if (rows != null && rows != undefined && rows.length > 0) {
            helper.MassiveSync(component, event, rows);
        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }

    },
    massiveWin: function (component, event, helper) {
        var rows = component.get("v.myRows");
        if (rows != null && rows != undefined && rows.length > 0) {
            var rowsWithoutParentOpp = [];
            var OppRow;
            rows.forEach(function (element) {
                if (element.Id == component.get('v.recordId')) {
                    console.log('OPP ID TROVATA: ' + element.Id);
                    OppRow = element;
                } else {
                    rowsWithoutParentOpp.push(element);
                    console.log('rowsWithoutParentOpp ',rowsWithoutParentOpp);
                }
            });
            console.log('OPP Row: ' + OppRow);
            
            //Prendere ID Opp Padre
            if (OppRow != null && OppRow != undefined)
            {
                helper.postWon(component, event, OppRow);
            }

            console.log('FutureRows1: ' + rowsWithoutParentOpp);
            
            if (rowsWithoutParentOpp != null && rowsWithoutParentOpp != undefined && rowsWithoutParentOpp != '')
            {
                console.log('rowsWithoutParentOpp not null');
                setTimeout(function () {
                    helper.postWonFUTURE(component, event, rowsWithoutParentOpp);
                }, 30000);
            }

            if (rowsWithoutParentOpp == null || rowsWithoutParentOpp == undefined || rowsWithoutParentOpp == '')
            {
                console.log('OPP Row2: ' + OppRow);
                console.log('rowsWithoutParentOpp null');
                rowsWithoutParentOpp.push(OppRow);
                console.log('FutureRows2: ' + JSON.stringify(rowsWithoutParentOpp));
                setTimeout(function () {
                    helper.postWonFUTURE(component, event, rowsWithoutParentOpp);
                }, 30000);
            }


        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }
    },
    massiveReview: function (component, event, helper) {
        var rows = component.get("v.myRows");
        if (rows != null && rows != undefined && rows.length > 0) {
            helper.MassiveRevision(component, rows);
        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }
    },
    massiveActivation: function (component, event, helper) {
        var rows = component.get("v.myRows");
        if (rows != null && rows != undefined && rows.length > 0) {
            helper.massiveActivation(component, rows);
        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }
    },
    massivePDF: function (component, event, helper) {
        var rows = component.get("v.myRows");
        if (rows != null && rows != undefined && rows.length > 0) {
            helper.MassiveopenPdf(component, event, rows);
        } else {
            helper.alert(component, event, "error", 'Attenzione', 'Selezionare almeno un elemento');
        }
    },

    handleSave: function (component, event, helper) {

        helper.saveDataTable(component, event, helper);
    },
    Agreement: function (component, event, helper) {

        var inputVariables = [{
            name: "recordId",
            type: "String",
            value: component.get('v.recordId')
        }];
        var flowName = 'IT_GroupAgreement';
        helper.runFlow(component, event, flowName, inputVariables);
    }

})