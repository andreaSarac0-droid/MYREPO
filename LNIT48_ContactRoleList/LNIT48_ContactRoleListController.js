({
    doInit: function (component, event, helper) {
        
       
        
    
        
        component.set('v.loaded', true);
        if(component.get('v.sObjectName') == 'ER_Financial_Center__c') {
            helper.checkFinancialCenterType(component)
            .then($A.getCallback(function(type) {
                component.set("v.financialCenterType", type);
                helper.getColumnAndAction(component);
            }));
        } else {
            helper.getColumnAndAction(component);
        }
        helper.getContactRoles(component);
    },

    onNext: function (component, event, helper) {
        let pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber + 1);
        helper.setPageDataAsPerPagination(component);
    },

    onPrev: function (component, event, helper) {
        let pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber - 1);
        helper.setPageDataAsPerPagination(component);
    },

    onRowAction: function (component, event, helper) {
       
        
        let action = event.getParam('action').name;
        
        console.log ('Hai premuto Disattiva,siamo nella row action:'+action);

        switch (action) {
            case 'disattiva':
                helper.deactivateRow(component, event);
                break;
            case 'gestisciStoreFigli':
                break;
        }
    },

    onSave: function (component, event, helper) {
        var numberLegal = 0;
        var numberLegalNotNull = 0;
        var indexOfLegal = 0;
        var draftValues = event.getParam('draftValues');
        var numOfDraft = draftValues.length;
        component.set('v.draftValues',draftValues);
        for (let i=0; i < numOfDraft; i++){
            //console.log(draftValues[i].rowId);
            //console.log(draftValues[i].isPos);
            //console.log(draftValues[i].isLegal);
            //console.log(draftValues[i].isAdmin);
            //console.log(draftValues[i].isLocal);
            if(draftValues[i].isLegal == true){
                numberLegal++;
                indexOfLegal = i;
            }
            if(draftValues[i].isLegal != null){
                numberLegalNotNull++;
            }
        }
        console.log('draftValues:' + JSON.stringify(draftValues));
        if(numberLegal == 1 && (component.get('v.sObjectName') == 'ER_Financial_Center__c' || component.get('v.sObjectName') == 'Opportunity' || component.get('v.sObjectName') == 'ER_Store__c')){
            //var actionName = "c.getContactFromDraftvalues";
            var action = component.get("c.getContactFromDraftvalues");
            var idCr = draftValues[indexOfLegal].rowId
            //var idCr = draftValues[0].rowId

            action.setParams({
                "ContactRoleId" :  idCr
            });
            console.log ('AZIONE:'+ action);
            action.setCallback(this, function (response) {
                console.log(response.getState());
                //console.log(response.getError()[0].message);
                if(response.getState() === "SUCCESS") {
                    //this.showToast("Success!", "success", "Records updated successfully.");
                    console.log('response draft: ' + response.getReturnValue());
                    component.set("v.contSostituisce",response.getReturnValue());
                } else {
                    this.showToast("Error!", "error", response.getError()[0].message);
                }
                $A.get('e.force:refreshView').fire();
            });
            $A.enqueueAction(action);
            var recordId = component.get("v.recordId");
            console.log('recordId: ' + recordId);
            var action2 = component.get("c.getLegaleFinancialCenter");
            /*if(component.get('v.sObjectName') == 'ER_Financial_Center__c'){
                action2 = component.get("c.getLegaleFinancialCenter");
            }
            if(component.get('v.sObjectName') == 'Opportunity'){
                action2 = component.get("c.getLegaleOpportunity");
            }*/
            action2.setParams({
                "fcId" :  recordId
            });
            console.log ('AZIONE:'+ action2);
            action2.setCallback(this, function (response) {
                console.log(response.getState());
                //console.log(response.getError()[0].message);
                if(response.getState() === "SUCCESS") {
                    //this.showToast("Success!", "success", "Records updated successfully.");
                    console.log('response: ' + response.getReturnValue());
                    component.set("v.contDaSostituire",response.getReturnValue());
                } else {
                    this.showToast("Error!", "error", response.getError()[0].message);
                }
                $A.get('e.force:refreshView').fire();
            });
            $A.enqueueAction(action2);
            component.set("v.isModalOpenLegalRap", true);
        }
        else{
            helper.handleSave(component, event);
        }
        //helper.handleSave(component, event);
    },
    
        handleYesLegal: function (component, event, helper){
        component.set("v.legalIsChanged",true);
        component.set("v.isModalOpenLegalRap", false);
        component.set("v.confirmCancel",false);
        helper.handleSave(component, event);
    },
    
    handleNoLegal: function (component, event, helper){
        component.set("v.legalIsChanged",false);
        component.set("v.isModalOpenLegalRap", false);
        component.set("v.confirmCancel",true);
        helper.handleSave(component, event);
    },

    openModel: function (component, event, helper) {
        var flowName = component.get("v.creationFlow"); //fix 19.04.2021 
        var recordId = component.get("v.recordId");
        console.log('View: ' + component.get("v.ContactView"));
        var view = component.get("v.ContactView");
        
       
        
        helper.helpOpenModel(component, event, flowName, recordId,view);
    },

    
    
       openModel2: function (component, event, helper) {
        var flowName = 'IT179_EditContactRoleFromContact';
        var recordId = component.get("v.recordId");
       
        
       
        
        helper.helpOpenModel2(component, event, flowName, recordId);
    },

    openModel3: function(component,event,helper){
        var flowName = 'IT192_RefNuovoButton';
        var recordId = component.get("v.recordId");
        console.log(component.get("v.recordId"));
        console.log(component.get("v.oppId"));
       
        
        helper.helpOpenModel3(component, event, flowName, recordId);
    },
    
    openModel4: function(component,event,helper){
        var flowName = 'IT207_FinancialCenter_Store_Ref';
        var recordId = component.get("v.recordId");
        console.log(component.get("v.recordId"));
        //console.log(component.get("v.oppId"));
       
        
        helper.helpOpenModel3(component, event, flowName, recordId);
    },

    openModel5: function(component,event,helper){
        var flowName = 'IT198_CreateContactRoleFromFinacialCenter';
        var recordId = component.get("v.recordId");
        var StartingComponent = 'LNIT48';
        console.log('Id: ' + component.get("v.recordId"));
        //console.log(component.get("v.oppId"));
       
        
        helper.helpOpenModel5(component, event, flowName, recordId,view);
    },
    
    openModelDisattivaMassivo: function (component, event, helper) {
        var flowName = component.get("v.flowNameMassivo");
        var recordId = component.get("v.recordId");
        helper.helpOpenModel(component, event, flowName, recordId);
    },

    statusChange: function (component, event) {
        if (event.getParam('status') === "FINISHED") {
            component.set("v.isModalOpen", false);
        }
    },

    closeModel: function (component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },

    closeModel2: function (component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpenLegalRap", false);
        $A.get('e.force:refreshView').fire();
    },

    onCreateRecord: function (component, event, helper) {
        
        
        /*
        console.log("premuto pulsante nuovo");
        
        //test for call flow
        var whichflow = component.get("v.creationFlow");
        console.log("che flow?:"+whichflow);
        
        //let recordId = component.get("v.recordId");
        //console.log ("recordId che sto passando al flow:"+recordId);
        
        var flow = component.find("flowData");
        
        
         var inputVariables = [
               {
                  name : "recordId",
                  type : "SObject",
                  value: component.get("v.recordId")
               }
            ];
        
        
        flow.startFlow(whichflow,inputVariables);
        
        */
        
        /*
            var defaultfield = '';
            if(component.get('v.sObjectName') == 'ER_Financial_Center__c'){
                defaultfield = 'ER_Financial_Center__c='+component.get('v.recordId');
            }
            else if(component.get('v.sObjectName') == 'ER_Store__c'){
                defaultfield = 'ER_Store__c='+component.get('v.recordId');
            }
            var navService = component.find("navService");
            var pageReference = {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'ER_Contact_Role__c',
                    actionName: 'new'
                },
                state: {
                    defaultFieldValues : defaultfield,
                    nooverride: "1"
                }
            };
            event.preventDefault();
            navService.navigate(pageReference);*/
        },

    onRefresh : function(component, event, helper) {            
        var icona = component.find("iconRef");
        $A.util.toggleClass(icona, "rotator");
        component.set("v.loaded", false);
        helper.getContactRoles( component, event );
    },
})