({
    Init: function (component, event, helper) {
        console.log('OPP ID flexbenefit: ' + component.get('v.recordId'));

        var selectedValue = component.get('v.selectedValue');
        console.log('selectedValue in primo init Flexbenefit' + component.get('v.selectedValue'));
        if (selectedValue == null || selectedValue == undefined || selectedValue == '') {
            console.log('entra controllo selectedValue in init');
            component.set('v.selectedValue', component.get('v.recordId'));

        }
        //helper.fetchAccounts(component, event,helper);
        if (component.get('v.recordId') == component.get('v.selectedValue')) { //prova
            helper.getFatherOpp(component, helper).then((response) => {
                const result = response.getReturnValue();
                const opp = result[0];
                return helper.fetchAccounts(component, event, helper, opp.recordId);
            }).finally(() => {
                if (selectedValue != null && selectedValue != undefined && selectedValue != '') {
                    component.set('v.selectedValue', selectedValue);
                } else {
                    console.log('selectedValue in init Flexbenefit' + component.get('v.selectedValue'));

                }
                component.set('v.spinner', false);
            })
        } else {
            helper.fetchAccounts(component, event, helper, component.get('v.selectedValue'));
            component.set('v.spinner', false);
        }

        /*let rows = [];
        rows.push(component.get('v.selectedValue'))
        console.log('rows selected value: ' + rows);
        helper.addProductTable(component, event, helper, rows);*/
    },

    addProductTable: function (component, event, helper, oppId) {
        var targetCmp1 = component.find('TableDiv');
        targetCmp1.set("v.body", "");
        //component.set( "v.showModal", true );
        $A.createComponent(
            "c:LNIT00_FlexBenefitAddProducts", {
                "opportunities": oppId,
                "showAddProd": component.get('v.showAddProduct')
            },
            function (myModal) {
                if (component.isValid()) {
                    var targetCmp = component.find('TableDiv');
                    var body = targetCmp.get("v.body");
                    body.push(myModal);
                    targetCmp.set("v.body", body);
                }
            }
        );
    },

    invokeAura: function (component, methodName, params) {
        console.log('invokeAuraMethod', methodName);

        return new Promise((resolve, reject) => {
            const action = component.get('c.' + methodName);

            if (params) action.setParams(params);

            action.setCallback(this, (response) => {
                const state = response.getState();
                console.log('state:' + state);
                if (state === 'SUCCESS') {
                    resolve(response);
                } else if (state === 'ERROR') {
                    //throw new Error(response.getError());
                }
            });

            $A.enqueueAction(action);
        });

    },

    discard: function (component, event, helper, row) {
        console.log('Discard  ');
        var serverAction = component.get("c.DiscardOpportunity");
        console.log('Discard  ');
        serverAction.setParams({
            recordId: row.Id
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state',state);
            if (state === "SUCCESS") {
                this.fetchAccounts(component, event, helper, null);
            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },

    getFatherOpp: function (component, helper) {
        var recordId = component.get('v.recordId');
        return helper.invokeAura(component, 'retrieveOppFather', {
            recordId: recordId
        }).then((response) => {
            const result = response.getReturnValue();
            component.set("v.options", result);
            console.log('options' + component.get('v.options'));

            return Promise.resolve(response);
        })
    },


    /* getFatherOpp: function(component, helper){
         console.log('getFatherOpp recordId: '+component.get('v.recordId'));
         var recordId = component.get('v.recordId');
         var action = component.get("c.retrieveOppFather");
         var opp = [];
         action.setParams({
             recordId: recordId
         });
             action.setCallback(this, function(response){
             var state = response.getState();
                 //console.log('response flex: ', response.getState());  
             if (state === "SUCCESS") {
                     
 
                          var records =response.getReturnValue();
                 records.forEach(function(record){
                         var singleObj = {};
                         singleObj['name'] = record.Name;
                         singleObj['recordId'] = record.Id;
                     console.log('singleObj' + singleObj.name);
                     console.log('singleObj' + singleObj.id);
                     opp.push(singleObj);
                     console.log('id getFatherOpp : '+record.Id);
                     console.log('id getFatherOpp : '+record.Name);
                 });
                 component.set("v.options", opp);
               
             }                   
         }); 
                     $A.enqueueAction(action);
                 
     },*/

    fetchAccounts: function (component, event, helper, recordId) {
        /*var selectedValue= component.get('v.selectedValue');  
        if(selectedValue == null && selectedValue == undefined && selectedValue == ''){
             component.set('v.selectedValue',component.get('v.recordId'));
        } 
		
        var actions = [{
                label: 'Scarta',
                name: 'Scarta'
            },
            {
                label: 'Modifica Condizioni',
                name: 'ModCond'
            }
        ];*/


        if (recordId == null || recordId == undefined) var recordId = component.get("v.recordId");
        return helper.invokeAura(component, 'fetchAccts', {
            recordId: recordId
        }).then((response) => {
            console.log('response:' + response.getState());
            var records = response.getReturnValue();
            if (response.getState() != 'SUCCESS') alert('error');
            records.forEach(function (record) {
           /* if(record.Type != '05'){
            console.log('record type 05');
            actions = [
                {
                    label: 'Modifica Condizioni',
                    name: 'ModCond'
                }
                ];
        	}*/
                record.linkName = '/lightning/r/Opportunity/' + record.Id + '/view';
            	console.log('Quote ID in Init flex: '+record.IT_Synced_Zuora_Quote__c);
                record.Name = record.ER_Product_Family__c;
                console.log('FC : ' + record.IT_Financial_Center__c);
                //console.log('NAME FC: '+record.IT_Financial_Center__r.Name);
                if (record.IT_Financial_Center__c == undefined || record.IT_Financial_Center__c == null || record.IT_Financial_Center__c == '') {
                    record.linkNameFinancial = '';
                    record.FinancialCenterName = '';
                } else {
                    record.FinancialCenterName = record.IT_Financial_Center__r.Name;
                    record.linkNameFinancial = '/lightning/r/IT_Financial_Center__c/' + record.IT_Financial_Center__c + '/view';
                }
                console.log('ER_Product_Family ' + record.ER_Product_Family__c);
                //console.log('record id flexbenefit: '+ record.Id);  
                console.log('FC : ' + record.IT_Financial_Center__c);
            	record.StName = record.StageName;
            	if (record.IT_Synced_Zuora_Quote__c != null || record.IT_Synced_Zuora_Quote__c != undefined) {
            		console.log('FREQ CAN: '+record.IT_Synced_Zuora_Quote__r.IT_Canon_Frequency__c);
            		record.FreqCan = record.IT_Synced_Zuora_Quote__r.IT_Canon_Frequency__c;
            		record.StageQuote = record.IT_Synced_Zuora_Quote__r.IT_Approval_Stage__c;
            		record.DurContr = record.IT_Synced_Zuora_Quote__r.IT_Contract_Duration__c;
            	}
                if (record.IT_GroupId__c != null || record.IT_GroupId__c != undefined) {
                    component.set('v.groupId', record.IT_GroupId__c);
                }
                record.PaymentMethod = record.ER_PaymentMethod__c;
                if (record.IT_Future_CloneQuote_State__c == true) {
                    record.ResultIcon = 'action:approval';
                    record.iconLabel = '';
                } else if (record.IT_Future_CloneQuote_State__c == '' || record.IT_Future_CloneQuote_State__c == null || record.IT_Future_CloneQuote_State__c == undefined) {
                    record.ResultIcon = '';
                    record.iconLabel = '';
                } else {
                    record.ResultIcon = 'action:close';
                    record.iconLabel = '';
                }

            });
            component.set("v.acctList", records);

            return Promise.resolve(response);
        })
        //  $A.enqueueAction(action);
        console.log('fine init');

    },



    saveDataTable: function (component, event, helper) {
        var editedRecords = event.getParam('draftValues');
        var acctList = component.get('v.acctList');
        //get datatable AcctList
     	var newList = [];
        editedRecords.forEach(function (editedRecord){
            acctList.forEach(function (acct){
                if(editedRecord.Id == acct.Id){
                    editedRecord.IT_Synced_Zuora_Quote__c = acct.IT_Synced_Zuora_Quote__c;
					newList.push(editedRecord);
                }
        	})
        })
        var totalRecordEdited = editedRecords.length;
        console.log('enters saveDataTable');
        var action = component.get("c.updateRatePlan");
        action.setParams({
            'editedRatePlanList': newList
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                 
                //if update is successful
                console.log('state :' + state);
                console.log('value :' + response.getReturnValue());
                if (response.getReturnValue() === true) {
                    this.alert(component, event, "Success", '', "Record Saved!");     
                    helper.Init(component, event, helper);
                    $A.get('e.force:refreshView').fire();
                } else { //if update got failed
                    this.alert(component, event, helper, "error", '', 'error');
                    $A.get('e.force:refreshView').fire();
                }
            }
        });
        $A.enqueueAction(action);
    },

    alert: function (component, event, variant, title, message) {
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode": "sticky"
        });
    },
    runFlow: function (component, event, flowName, inputVariables) {
        //    let flowName = event.getSource().get( "v.name" );
        //    var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        //var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        //          var flowName='IT_ZQuote_From_Opportunity';
        component.set("v.showModal", true);
        $A.createComponent(
            "lightning:flow", {
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
    getRowActions: function (cmp, row, doneCallback) {
    	console.log('rowtype'+row.Type);
      var actions = [
            {
                label: 'Modifica Condizioni',
                name: 'ModCond'
            }
        ];
    

        if (row.StageName != 'Closed Won') {
            actions.push({
                label: 'Scarta',
                name: 'Scarta'
            });
            
        } 
		doneCallback(actions);
        //return actions;
    },    
        
	/*getRowIndex: function(rows, row) {
        var rowIndex = -1;
        rows.some(function(current, i) {
            if (current.id === row.id) {
                rowIndex = i;
                return true;
            }
        });
        return rowIndex;
    },*/
	isAmend: function (component, Helper) {
        console.log('check is Amended from flex  ');
        var serverAction = component.get("c.CheckEstendiAGruppo");
        serverAction.setParams({
            recordId: component.get("v.recordId")
        });
        serverAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('CheckEstendiAGruppo result: '+result);
                component.set('v.isAmendedFlex', result);
            } else {
                //Do Something
            }
        });
        $A.enqueueAction(serverAction);
    },

})