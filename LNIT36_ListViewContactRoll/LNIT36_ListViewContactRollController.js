/*fetchCont : function(component, event, helper) {
        helper.fetchContHelper(component, event, helper);
    }*/


({
    doInit : function(component, event, helper) {        
        helper.getColumnAndAction(component);
        helper.getDatas(component, helper);
    },
     
    handleNext : function(component, event, helper) { 
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber+1);
        helper.getDatas(component, helper);
    },
     
    handlePrev : function(component, event, helper) {        
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber-1);
        helper.getDatas(component, helper);
    },
 	
    handleRowAction : function(cmp,event,helper){
        var action = event.getParam('action').name;
        var row = event.getParam('row');
        var idRecord = '';
        console.log(action);
        
        if(action == 'disattiva'){
            var flowName = 'IT75_Contact_Role_Deactivation';
            var recordId = row.Id.replace("/", "");
            helper.helpOpenModel(cmp, event, flowName,recordId);
        }
        
        
    },
    
    openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        /*component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        var recordId = component.get("v.recordId");
        var flowName = component.get("v.flowName");
        var inputVariables = [
            {
                name : 'recordId',
                type : 'String',
                value : recordId
            }
        ];
        flow.startFlow(flowName, inputVariables);*/
            var flowName = component.get("v.flowName");
            var recordId = component.get("v.recordId");
            helper.helpOpenModel(component, event, flowName, recordId);
        },
    
    openModelDisattivaMassivo: function(component, event, helper) {
        // Set isModalOpen attribute to true
        /*component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        var recordId = component.get("v.recordId");
        var flowName = component.get("v.flowName");
        var inputVariables = [
            {
                name : 'recordId',
                type : 'String',
                value : recordId
            }
        ];
        flow.startFlow(flowName, inputVariables);*/
            var flowName = component.get("v.flowNameMassivo");
            var recordId = component.get("v.recordId");
            helper.helpOpenModel(component, event, flowName, recordId);
        },
    
    statusChange : function (cmp, event) {
        if (event.getParam('status') === "FINISHED") {
            cmp.set("v.isModalOpen", false);
        }
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    
    createRecord : function (component, event, helper) {
        /*var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "ER_Contact_Role__c"
        });
        createRecordEvent.fire();*/
        var navService = component.find("navService");
        var pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'ER_Contact_Role__c',
                actionName: 'new'
            }
        };
        event.preventDefault();
        navService.navigate(pageReference);
    },
})