/*({
    fetchContHelper : function(component, event, helper) {
        component.set('v.mycolumns', [

            ]);
        var action = component.get("c.fetchContacts");
        action.setParams({
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.contactList", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})*/

({
    getColumnAndAction : function(component) {
        var actions = [
            {label: 'Disattiva', name: 'disattiva'}
        ];
        if(component.get('v.sObjectName') == 'Contact'){
            component.set('v.columns', [
                //{label: 'Tipo', fieldName: 'Id', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'RoleType' }, target: '_self'}},
                {label: 'Ruolo', fieldName: 'IT_Role_FRM__c', type: 'text'},
                {label: 'Financial Center', sortable: true, fieldName: 'ER_Financial_Center__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'FCName' }, target: '_self'}},
                {label: 'Store', sortable: true, fieldName: 'ER_Store__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'StoreName' }, target: '_self'}}
                //{type: 'action', typeAttributes: { rowActions: actions } } 
            ]);
        }
        else if(component.get('v.sObjectName') == 'ER_Financial_Center__c'){
            component.set('v.columns', [
                {label: 'Referente', sortable: true, fieldName: 'ER_Contact__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'ContactName' }, target: '_self'}},
                //{label: 'Tipo', fieldName: 'Id', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'RoleType' }, target: '_self'}},
                {label: 'Ruolo', fieldName: 'IT_Role_FRM__c', type: 'text'},
                {label: 'Telefono', fieldName: 'ContactPhone', type: 'text'},
                {label: 'Cellulare', fieldName: 'ContactMobile', type: 'text'},
                {label: 'Email', fieldName: 'ContactEmail', type: 'text'},
                {label: 'PEC', fieldName: 'ContactPec', type: 'text'},
                {label: 'Fax', fieldName: 'ContactFax', type: 'text'},
                {label: 'Store', sortable: true, fieldName: 'ER_Store__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'StoreName' }, target: '_self'}}
                //{type: 'action', typeAttributes: { rowActions: actions }}
            ]);
        }
        else{
            component.set('v.columns', [
                {label: 'Referente', sortable: true, fieldName: 'ER_Contact__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'ContactName' }, target: '_self'}},
                //{label: 'Tipo', fieldName: 'Id', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'RoleType' }, target: '_self'}},
                {label: 'Ruolo', fieldName: 'IT_Role_FRM__c', type: 'text'},
                                {label: 'Telefono', fieldName: 'ContactPhone', type: 'text'},
                {label: 'Cellulare', fieldName: 'ContactMobile', type: 'text'},
                {label: 'Email', fieldName: 'ContactEmail', type: 'text'},
                {label: 'PEC', fieldName: 'ContactPec', type: 'text'},
                {label: 'Fax', fieldName: 'ContactFax', type: 'text'}
                //{type: 'action', typeAttributes: { rowActions: actions }}
            ]);
        }
    },
     
    getDatas : function(component, helper) {
        var action = component.get("c.getData");
        var pageSize = component.get("v.pageSize").toString();
        var pageNumber = component.get("v.pageNumber").toString();
        var pageNumber = component.get("v.pageNumber").toString();
        var recordId = component.get("v.recordId");
        var objectName = component.get("v.sObjectName");
         
        action.setParams({
            'pageSize' : pageSize,
            'pageNumber' : pageNumber,
            "recordId" : recordId,
            "objectName" : objectName
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                if(resultData.length < component.get("v.pageSize")){
                    component.set("v.isLastPage", true);
                } else{
                    component.set("v.isLastPage", false);
                }
                component.set("v.dataSize", resultData.length);
                if(component.get('v.sObjectName') == 'Contact'){
                        resultData.forEach(function(record){
                            if(record.Id != null && record.Id != undefined){
                                record.Id = '/'+record.Id;
                            }
                            if(record.IT_Type__c != null && record.IT_Type__c != undefined){
                                record.RoleType = record.IT_Type__c;
                            }
                            if(record.ER_Financial_Center__c != null && record.ER_Financial_Center__c != undefined){
                                record.ER_Financial_Center__c = '/'+record.ER_Financial_Center__c;
                            }
                            if(record.ER_Financial_Center__c != null && record.ER_Financial_Center__c != undefined){
                                record.FCName = record.ER_Financial_Center__r.Name;
                            }
                            if(record.ER_Store__c != null && record.ER_Store__c != undefined){
                                record.ER_Store__c = '/'+record.ER_Store__c;
                            }
                            if(record.ER_Store__c != null && record.ER_Store__c != undefined){
                                record.StoreName = record.ER_Store__r.Name;
                            }
                            if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactPhone = record.ER_Contact__r.Phone;
                            }
                            if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactEmail = record.ER_Contact__r.Email;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactPec = record.ER_Contact__r.IT_PEC__c;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactMobile = record.ER_Contact__r.MobilePhone;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactFax = record.ER_Contact__r.Fax;
                            }
                    });
                }
                else{
                    resultData.forEach(function(record){
                            if(record.Id != null && record.Id != undefined){
                                record.Id = '/'+record.Id;
                            }
                            if(record.IT_Type__c != null && record.IT_Type__c != undefined){
                                record.RoleType = record.IT_Type__c;
                            }
                            if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ER_Contact__c = '/'+record.ER_Contact__c;
                            }
                            if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactName = record.ER_Contact__r.Name;
                            }
                        	if(record.ER_Store__c != null && record.ER_Store__c != undefined){
                                record.ER_Store__c = '/'+record.ER_Store__c;
                            }
                            if(record.ER_Store__c != null && record.ER_Store__c != undefined){
                                record.StoreName = record.ER_Store__r.Name;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactPhone = record.ER_Contact__r.Phone;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactEmail = record.ER_Contact__r.Email;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactPec = record.ER_Contact__r.IT_PEC__c;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactMobile = record.ER_Contact__r.MobilePhone;
                            }
                        	if(record.ER_Contact__c != null && record.ER_Contact__c != undefined){
                                record.ContactFax = record.ER_Contact__r.Fax;
                            }
                    });
                }
                component.set("v.data", resultData);
            }
            else{
                 var errors = response.getError();    
                console.log('ERROR: '+errors[0].message);
            }
        });
        $A.enqueueAction(action);
    },
     
    viewRecord : function(component, event) {
        var row = event.getParam('row');
        var recordId = row.Id;
        var navEvt = $A.get("event.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recordId,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },
    
    helpOpenModel : function(component, event, flowName, recordId ){
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        
        var inputVariables = [
            {
                name : 'recordId',
                type : 'String',
                value : recordId
            }
        ];
        flow.startFlow(flowName, inputVariables);
    },
    
    
})