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

        switch (action) {
            case 'disattiva':
                helper.deactivateRow(component, event);
                break;
            case 'gestisciStoreFigli':
                break;
        }
    },

    onSave: function (component, event, helper) {
        helper.handleSave(component, event);
    },

    openModel: function (component, event, helper) {
        var flowName = component.get("v.creationFlow");
        var recordId = component.get("v.recordId");
        var view = component.get("v.ContactView");
        helper.helpOpenModel(component, event, flowName, recordId,view);
        
         
        
        
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

    onCreateRecord: function (component, event, helper) {
        console.log("Create Record");
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