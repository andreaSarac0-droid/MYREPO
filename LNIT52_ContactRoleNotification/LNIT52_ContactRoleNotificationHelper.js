({
    getColumnAndAction: function (component) {
        var contactview = component.get ("v.ContactView");
       
        var objectName = component.get("v.sObjectName");
        var actions = [{ label: "Disattiva", name: "disattiva" }];
        var columns = [
            { label: "Referente", fieldName: 'url', type: "url", editable: false, typeAttributes: { label: { fieldName: "name" }, target: "_self" } },
            { label: "Tipo Recapito", sortable: true, fieldName: "contactType", type: "text", editable: false },
            { label: "Recapito", sortable: true, fieldName: "contactDetail", type: "text", editable: false }
        ];
        switch (objectName) {
            case "ER_Financial_Center__c":
                let fcType = component.get("v.financialCenterType");
                if(fcType == "Merchant") {
                    columns.push(
                        { label: "Circolari", fieldName: "isCircular", type: "boolean", editable: "true" },
                        { label: "Prefatture", fieldName: "isPreview", type: "boolean", editable: "true" },
                        { label: "Doc. Amministrativi", fieldName: "isAdminDoc", type: "boolean", editable: "true" },
                        { label: "Bonifico", fieldName: "isBank", type: "boolean", editable: "true" }
                    );
                } else if(fcType == "Client") {
                    columns.push(
                        { label: "Fatture", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                        { label: "Ordini", fieldName: "isOrdering", type: "boolean", editable: "true"},
                        { label: "Sut", fieldName: "isReporting", type: "boolean", editable: "true" },
                        { label: "Comunicazioni", fieldName: "isNotification", type: "boolean", editable: "true" }
                    );
                }
                break;
            case "Opportunity":
                columns.push(
                    { label: "Circolari", fieldName: "isCircular", type: "boolean", editable: "true" },
                    { label: "Prefatture", fieldName: "isPreview", type: "boolean", editable: "true" },
                    { label: "Doc. Amministrativi", fieldName: "isAdminDoc", type: "boolean", editable: "true" },
                    { label: "Bonifico", fieldName: "isBank", type: "boolean", editable: "true" }
                );
                break;
                
                
                //deli e distrib
                
                  case "ER_Delivery_Site__c":
                columns.push(
                        { label: "Fatture", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                        { label: "Ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                        { label: "Sut", fieldName: "isReporting", type: "boolean", editable: "true" },
                        { label: "Comunicazioni", fieldName: "isNotification", type: "boolean", editable: "true" }
                );
                break;
                
                
                   case "ER_Distribution_Point__c":
                columns.push(
                        { label: "Fatture", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                        { label: "Ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                        { label: "Sut", fieldName: "isReporting", type: "boolean", editable: "true" },
                        { label: "Comunicazioni", fieldName: "isNotification", type: "boolean", editable: "true" }
                );
                break;
                
                
            
                
                
            case "Contact":
                if (contactview == 'Merchant'){
                   
                
                columns = [
                    { label: "Financial Center", fieldName: "url", type: "url", editable: false, typeAttributes: { label: { fieldName: "name" }, target: "_self" } },
                    { label: "Tipo Recapito", sortable: true, fieldName: "contactType", type: false, editable: false },
                    { label: "Recapito", sortable: true, fieldName: "contactDetail", type: "text", editable: false },
                    { label: "Circolari", fieldName: "isCircular", type: "boolean", editable: "true" },
                    { label: "Prefatture", fieldName: "isPreview", type: "boolean", editable: "true" },
                    { label: "Doc. Amministrativi", fieldName: "isAdminDoc", type: "boolean", editable: "true" },
                    { label: "Bonifico", fieldName: "isBank", type: "boolean", editable: "true" },
                  // { label: "Fatture", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                  //  { label: "Ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                  //  { label: "Sut", fieldName: "isReporting", type: "boolean", editable: "true" },
                  //  { label: "Comunicazioni", fieldName: "isNotification", type: "boolean", editable: "true" },
                ];
                    }
                                      
                    else if (contactview == 'Client'){
                   
                
                columns = [
                    { label: "Financial Center", fieldName: "url", type: "url", editable: false, typeAttributes: { label: { fieldName: "name" }, target: "_self" } },
                    { label: "Tipo Recapito", sortable: true, fieldName: "contactType", type: false, editable: false },
                    { label: "Recapito", sortable: true, fieldName: "contactDetail", type: "text", editable: false },
                   // { label: "Circolari", fieldName: "isCircular", type: "boolean", editable: "true" },
                   // { label: "Prefatture", fieldName: "isPreview", type: "boolean", editable: "true" },
                   // { label: "Doc. Amministrativi", fieldName: "isAdminDoc", type: "boolean", editable: "true" },
                   // { label: "Bonifico", fieldName: "isBank", type: "boolean", editable: "true" },
                    { label: "Fatture", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                    { label: "Ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                    { label: "Sut", fieldName: "isReporting", type: "boolean", editable: "true" },
                    { label: "Comunicazioni", fieldName: "isNotification", type: "boolean", editable: "true" },
                ];
                    }
                    
                break;
        }

        columns.push(
            { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'slds-popover__body' } }
        );
        component.set('v.columns', columns);
    },

    getContactRoles: function (component) {
        
        var contactview = component.get ("v.ContactView");
        var actionName = '';         
        var recordId = component.get("v.recordId");
        var objectName = component.get("v.sObjectName");
        console.log(objectName);
        switch (objectName) {
            case 'ER_Financial_Center__c':
                actionName = 'c.getFinancialCenterNotification';
                break;
            case 'Opportunity':
                actionName = 'c.getOpportunityNotification';
                break;
                
            case 'ER_Delivery_Site__c':
                actionName = 'c.getDeliverySiteNotification';
                break;    
              
             case 'ER_Distribution_Point__c':
                actionName = 'c.getDistributionPointNotification';
                break;      
                
            case 'Contact':
                if (contactview == 'Client'){
                    actionName = 'c.getContactNotificationCLIENT'
                    console.log('getContactNotificationCLIENT');
                }
                else if (contactview == 'Merchant'){
                actionName = 'c.getContactNotification';
                    }
                break;
        }

        var action = component.get(actionName);

        action.setParams({ "recordId": recordId });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();

                component.set("v.data", resultData);
                component.set('v.filteredData', resultData);

                this.preparePagination(component, resultData);

                component.set('v.loaded', true);
            } 
            else {
                this.showToast("Error!", "error", response.getError()[0].message);
                component.set('v.loaded', true);
            }
        });
        $A.enqueueAction(action);
    },

    deactivateRow : function (component, event) { 
        let row = event.getParam('row');
        let objectName = component.get("v.sObjectName");
        let rowId = row.rowId;
        let recordId = component.get("v.recordId");
        
        var action = component.get("c.deactivateRow");
        action.setParams({
            "recordId": recordId,
            "rowId": rowId,
            "objectName": objectName,
        });

        action.setCallback(this, function (response) {
            if(response.getState() === "SUCCESS") {
                this.showToast("Success!", "success", "Record deactivated successfully.");
            } else {
                this.showToast("Error!", "error", response.getError()[0].message);
            }
            $A.get('e.force:refreshView').fire();
        });

        $A.enqueueAction(action);
    },

    viewRecord: function (component, event) {
        var row = event.getParam('row');
        var recordId = row.Id;
        var navEvt = $A.get("event.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recordId,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },

    helpOpenModel: function (component, event, flowName, recordId,view) {
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");

       var inputVariables = [
            {
            name: 'recordId',
            type: 'String',
            value: recordId
        },
          {
            name: 'view',
            type: 'String',
            value: view
        },
           
         {
            name: 'StartingComponent',
            type: 'String',
            value: 'LNIT52'
        }     
               
                                                                      
                             
                             ];
        flow.startFlow(flowName, inputVariables);
    },

    handleSave: function (component, event) {
        
        let draftValues = event.getParam('draftValues');
        let recordId = component.get("v.recordId");
        let objectName = component.get("v.sObjectName");
        let actionName = '';

        console.log('draft values in save: '+ JSON.stringify(draftValues));

        switch (objectName) {
            case 'ER_Financial_Center__c':
                actionName = 'c.saveFinancialCenter';
                break;
            case 'Opportunity':
                actionName = "c.saveOpportunity";
                break;
                
            case 'ER_Delivery_Site__c':
                actionName = "c.saveDeliverySite";
                break;
                
            case 'ER_Distribution_Point__c':
                actionName = "c.saveDistributionpoint";
                break;    
                     
                               
            case 'Contact':
               
                actionName = "c.saveContact";
                    
             
                break;
        }
        var action = component.get(actionName);
        action.setParams({
            "json": JSON.stringify(draftValues),
            "recordId": recordId,
        });
    
        action.setCallback(this, function (response) {
            if(response.getState() === "SUCCESS") {
                this.showToast("Success!", "success", "Records updated successfully.");
            } else {
                this.showToast("Error!", "error", response.getError()[0].message);
            }
            $A.get('e.force:refreshView').fire();
        });
        $A.enqueueAction(action);
    },

    preparePagination: function (component, contacts) {
        let countTotalPage = Math.ceil(contacts.length / component.get("v.pageSize"));
        let totalPage = countTotalPage > 0 ? countTotalPage : 1;

        component.set("v.totalPages", totalPage);
        component.set("v.pageNumber", 1);

        this.setPageDataAsPerPagination(component);
    },

    setPageDataAsPerPagination: function (component) {
        let data = [];
        let totalPages = component.get("v.totalPages");
        let pageNumber = component.get("v.pageNumber");
        let pageSize = component.get("v.pageSize");
        let filteredData = component.get('v.filteredData');

        if(pageNumber == totalPages) {
            component.set("v.isLastPage", true);
        }
        else {
            component.set("v.isLastPage", false);
        }

        let x = (pageNumber - 1) * pageSize;
        for (; x < (pageNumber) * pageSize; x++) {
            if (filteredData[x]) {
                data.push(filteredData[x]);
            }
        }
        component.set("v.data", data);
    },

    showToast: function(title, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message": message
        });
        toastEvent.fire();
    },

    checkFinancialCenterType: function(component) {
        let recordId = component.get("v.recordId");

        return new Promise($A.getCallback(function(resolve, reject) {
            var action = component.get("c.getFinancialCenterType");
            action.setParams({ "financialCenterId" : recordId});
            action.setCallback(self, function(response) {
                let state = response.getState();
                if(state === 'SUCCESS') {
                    resolve(response.getReturnValue());
                } else if(state === 'ERROR') {
                    reject(action.getError());
                }
            });
            $A.enqueueAction(action);
        }));
    }
})