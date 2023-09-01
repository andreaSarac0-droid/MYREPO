({
    getColumnAndAction: function (component) {
              
    
        
        var isreadonly = component.get( "v.ReadOnly" );
        var isFlow = component.get("v.isFlow");
        console.log ('isreadonly:' + isreadonly);
        console.log("isFlow: " + isFlow);
        
        var ContactView = component.get( "v.ContactView" );
        console.log ('La contact view è:'+ContactView);
        
        var objectName = component.get('v.sObjectName');
        var actions = [{ label: 'Disattiva', name: 'disattiva' }];
        
        if (isreadonly == 'Yes'){
            console.log ('Readonly era yes');
            
             var columns = [
            { label: 'Referente', fieldName: 'contactUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'contactName' }, target: '_self' } },
            { label: 'Email', sortable: true, fieldName: 'contactEmail', type: 'text', editable: 'true' },
            { label: 'Telefono', sortable: true, fieldName: 'contactPhone', type: 'text', editable: 'true' }
        ];
            
            
            
        }
        
        
        if (isreadonly != 'Yes') {
        
        var columns = [
            { label: 'Referente', fieldName: 'contactUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'contactName' }, target: '_self' } },
            { label: 'Email', sortable: true, fieldName: 'contactEmail', type: 'text', editable: 'true' },
            { label: 'Telefono', sortable: true, fieldName: 'contactPhone', type: 'text', editable: 'true' }
        ];
            
            }
        console.log(objectName);
        switch (objectName) {
            case 'ER_Store__c':
   
            case 'IT_Opportunity_Store__c':
                if (isreadonly == 'Yes' ){
                console.log ('Readonly era yes e sto in opp store');
                
                columns.push(
                    //16.04.2021 fix:
                    { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: true }, 
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: true},
                    //{ label: "Ruoli", fieldName: "contRoles", type: "String",editable: false}
                    { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: false }, 
                    { label: "Ref. POS", fieldName: "isPos", type: "boolean", editable: false },
                    { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: false },
                    { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: false }
                    // { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                );
                }
            
                
                
                if (isreadonly != 'Yes') {
                     columns.push(
                    //16.04.2021 fix:
                    { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: "true" }, 
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: "true" }, 
                    
                    
                    { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: "true" }, 
                    { label: "Ref. POS", fieldName: "isPos", type: "boolean", editable: "true" },
                    { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: "true" },
                    { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: "true" }
                    // { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                );  
                    
                }
       
                break;
                
                
                
                
            case 'ER_Financial_Center__c':
                let fcType = component.get("v.financialCenterType");
                    if (isreadonly == 'Yes'){
                        console.log ('Readonly era yes e sto in fincenter');
                
                
                if(fcType == 'Merchant') {
                    columns.push(
                        
                        //16.04.2021 fix:
                        { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: 'true' }, 
                        { label: "PEC", fieldName: "contactPec", type: "text", editable: 'true' }, 
                        
                        
                        { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: false },
                        { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: false }
                        // { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                    );
                    actions.push({ label: 'Gestisci ruoli Store figli', name: 'gestisciStoreFigli' });
                } else if(fcType == 'Client') {
                    columns.push(
                        { label: "Fax", fieldName: "contactFax", type: "text", editable: 'true' },
                        { label: "PEC", fieldName: "contactPec", type: "text", editable: 'true' },
                        { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                       // { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    );
                }
                
                
        } 
                
                if (isreadonly != 'Yes') {
                                        
                if(fcType == 'Merchant') {
                    columns.push(
                        
                        //16.04.2021 fix:
                        { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: "true" }, 
                        { label: "PEC", fieldName: "contactPec", type: "text", editable: "true" }, 
                        
                        
                        { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: "true" },
                        { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: "true" }
                        // { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                    );
                    actions.push({ label: 'Gestisci ruoli Store figli', name: 'gestisciStoreFigli' });
                } else if(fcType == 'Client') {
                    columns.push(
                        { label: "Fax", fieldName: "contactFax", type: "text", editable: "true" },
                        { label: "PEC", fieldName: "contactPec", type: "text", editable: "true" },
                        { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                     //   { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                        { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: "true" }
                    );
                }
                                    
            }         
                
                
                
                break;
                
                
                
                
                
                
                
            case 'ER_Delivery_Site__c':
            case 'ER_Distribution_Point__c':
                
                 if (isreadonly == 'Yes'){
                
                columns.push(
                    { label: "Fax", fieldName: "contactFax", type: "text", editable: 'true' },
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: 'true' },
                    { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                  //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                    { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                );
                actions.pop(); 
                 }
                
                
               if (isreadonly != 'Yes'){
                       columns.push(
                    { label: "Fax", fieldName: "contactFax", type: "text", editable: "true" },
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: "true" },
                    { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: "true" },
                  //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: "true" },
                    { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: "true" }
                );
                actions.pop(); 
                    
                }  
                break;
                
                
                
                
                
                
            case 'Opportunity':
                
                if (isreadonly == 'Yes'){
                
                columns.push(
                    //16.04.2021 fix:
                    { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: "true" }, 
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: "true" },
                    { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: true },
                    { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: true },
                    { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: true },
                    { label: "Ref. Pos", fieldName: "isPos", type: "boolean", editable: true }
                    //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                );
                
                actions.push({ label: 'Gestisci ruoli Store figli', name: 'gestisciStoreFigli' });
                
                }
                
                if (isreadonly != 'Yes'){
                    
                      columns.push(
                    //16.04.2021 fix:
                    { label: "Cellulare", fieldName: "contactMobile", type: "text", editable: "true" }, 
                    { label: "PEC", fieldName: "contactPec", type: "text", editable: true },
                    { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: true },
                    { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: true },
                    { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: true },
                    { label: "Ref. Pos", fieldName: "isPos", type: "boolean", editable: true }
                    //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" }
                );
                
                actions.push({ label: 'Gestisci ruoli Store figli', name: 'gestisciStoreFigli' });
                                            
                }
               break;
                
                
                
                
                
            case 'Contact':
                
                if (isreadonly == 'Yes'){
                    console.log ('Readonly era yes e sto in contact');
                
                
                
                if (ContactView == 'Merchant'){
                    
                    columns = [
                        { label: 'Financial Center', fieldName: 'fcUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'fcName' }, target: '_self' } },
                        //  { label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: false },
                        { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: false },
                        //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        //  { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                        //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        //  { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    ];
                        }
                        
                        if (ContactView == 'Store'){
                        
                    columns = [
                        { label: 'Store', fieldName: 'contactUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'contactName' }, target: '_self' } },
                        //  { label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: false },
                        { label: "Ref. Pos", fieldName: "isPos", type: "boolean", editable: false },
                        //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        //  { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                        //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        //  { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    ];    
                                         
                        }  
                        
                        if (ContactView == 'Client'){
                    
                     columns = [
                        { label: 'Financial Center', fieldName: 'fcUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'fcName' }, target: '_self' } },
                        //{ label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        //{ label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: "true" },
                        //{ label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: "true" },
                        //{ label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                      //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    ];        
                        
                        
                        }
                
                   }
                
                if (isreadonly != 'Yes') {
                    
                   if (ContactView == 'Merchant'){
                    
                    columns = [
                        { label: 'Financial Center', fieldName: 'fcUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'fcName' }, target: '_self' } },
                        //  { label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        { label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: "true" },
                        { label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: "true" },
                        //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        //  { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                        //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        //  { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    ];
                        }
                        
                        if (ContactView == 'Store'){
                        
                    columns = [
                        { label: 'Store', fieldName: 'contactUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'contactName' }, target: '_self' } },
                        //  { label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        { label: "Ref. Locale", fieldName: "isLocal", type: "boolean", editable: "true" },
                        { label: "Ref. Pos", fieldName: "isPos", type: "boolean", editable: "true" },
                        //  { label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        //  { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: false },
                        //  { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: false },
                        //  { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: false }
                    ];    
                                         
                        }  
                        
                        if (ContactView == 'Client'){
                    
                     columns = [
                        { label: 'Financial Center', fieldName: 'fcUrl', type: 'url', editable: false, typeAttributes: { label: { fieldName: 'fcName' }, target: '_self' } },
                        //{ label: 'Tipo', sortable: true, fieldName: 'fcType', type: 'text', editable: false },
                        //{ label: "Legale Rap.", fieldName: "isLegal", type: "boolean", editable: "true" },
                        //{ label: "Ref. Amministrativo", fieldName: "isAdmin", type: "boolean", editable: "true" },
                        //{ label: "Titolare Effettivo", fieldName: "isHolder", type: "boolean", editable: "true" },
                        { label: "Riceve fattura cliente", fieldName: "isInvoicing", type: "boolean", editable: true },
                       // { label: "Effettua ordini", fieldName: "isOrdering", type: "boolean", editable: true },
                        { label: "Riceve ticket", fieldName: "isDelivery", type: "boolean", editable: true }
                    ];        
                        
                        
                        }  
                                  
                    
                }
                        
                        break;
                
                
                
                
                        }
                        if(objectName != 'ER_Delivery_Site__c'){
                            columns.push(
                            { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'slds-popover__body' } }
                            );
                        }
                        component.set('v.columns', columns);
                        },
                        
                        
                        
    getContactRoles: function (component) {
                        
                        var ContactView = component.get( "v.ContactView" );
                        var actionName = '';         
                        var recordId = component.get("v.recordId");
                        var objectName = component.get("v.sObjectName");
                        
                        switch (objectName) {
                        case 'ER_Store__c':
                        actionName = 'c.getStoreContactRoles';
                        break;
                        case 'ER_Financial_Center__c':
                        actionName = 'c.getFinancialCenterContactRoles';
                        break;
                        case 'ER_Delivery_Site__c':
                        actionName = 'c.getDeliverySiteContactRoles';
                        break;
                        case 'ER_Distribution_Point__c':
                        actionName = 'c.getDistributionPointContactRoles';
                        break;
                        case 'Opportunity':
                        actionName = 'c.getOpportunityContactRoles';
                        break;
                        case 'IT_Opportunity_Store__c':
                        actionName = 'c.getOpportunityStoreContactRoles';
                        break;
                        
                        case 'Contact':
                        
                        if (ContactView == 'Merchant'){                        
                        actionName = 'c.getContactCRs';                      
                        }
                                
                                
                        if (ContactView == 'Client'){                        
                        actionName = 'c.getContactCRsClient';                      
                        }        
                        
                        if (ContactView == 'Store'){                        
                        actionName = 'c.getContactCRstore';                      
                        }
                        
                        
                        
                        break;
                        }
                        
                        var action = component.get(actionName);
                        
                        action.setParams({ "recordId": recordId });
                        action.setCallback(this, function (response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                        var resultData = response.getReturnValue();
                        console.log(resultData);
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
        var ContactView = component.get( "v.ContactView" );
        
        console.log ('De-activate Row is executing');
        let row = event.getParam('row');
        let objectName = component.get("v.sObjectName");
        let rowId = row.rowId;
        let recordId = component.get("v.recordId");
        let roles = [];
        
        switch (objectName) {
            case "ER_Store__c":
                roles.push("Store Manager", "Operational","Legacy Role 1", "Administrative Contact");
                break;
            case "IT_Opportunity_Store__c":
                roles.push("Store Manager", "Operational");
                break;
            case 'ER_Financial_Center__c':
                if(component.get("v.financialCenterType") == 'Merchant') {
                    roles.push("Legacy Role 1", "Administrative Contact", "Legacy Role 2");
                } else if(component.get("v.financialCenterType") == 'Client') {
                    roles.push("Invoicing", "Ordering", "Delivery");
                }
                break;
            case 'ER_Delivery_Site__c':
            case 'ER_Distribution_Point__c':
                roles.push("Invoicing", "Ordering", "Delivery");
                break;
            case 'Opportunity':
                roles.push("Legacy Role 1", "Administrative Contact", "Legacy Role 2");
                break;
            case 'Contact':
                
                 if (ContactView == 'Merchant'){                        
                          roles.push("Legacy Role 1", "Administrative Contact", "Legacy Role 2", "Invoicing", "Ordering", "Delivery");               
                        }
                
                
                 if (ContactView == 'Client'){                        
                          roles.push("Legacy Role 1", "Administrative Contact", "Legacy Role 2", "Invoicing", "Ordering", "Delivery");               
                        }
                
                
                if (ContactView == 'Store'){                        
                          roles.push("Store Manager", "Operational", "Legacy Role 1", "Administrative Contact", "Legacy Role 2");               
                        }               
                
        }
        
        console.log ('parametri per la disatt: rowid '+rowId+' ruoli: '+roles);
        
        var action = component.get("c.deactivateRow");
        action.setParams({
            "recordId": recordId,
            "rowId": rowId,
            "objectName": objectName,
            "roles": roles,
            "contactview" : ContactView
        });
        
        action.setCallback(this, function (response) {
            console.log("STATE DISATTIVA: " + response.getState());
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
            value: 'LNIT48'
        }     
                                                                      
                             
                             ];
        flow.startFlow(flowName, inputVariables);
    },
    

    
    
      helpOpenModel2: function (component, event, flowName, recordId) {
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        
        var inputVariables = [
            {
            name: 'recordId',
            type: 'String',
            value: recordId
        },
                
                             ];
        flow.startFlow(flowName, inputVariables);
    },

    helpOpenModel3: function (component, event, flowName, recordId) {
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        
        var inputVariables = [
            {
            name: 'recordId',
            type: 'String',
            value: recordId
        },
                
                             ];
        flow.startFlow(flowName, inputVariables);
    },

    helpOpenModel5: function (component, event, flowName, recordId,view) {
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        flowName = 'IT198_CreateContactRoleFromFinacialCenter';
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
        console.log ('Pulsante salva.');
        var ContactView = component.get( "v.ContactView" );
        //var draftValues = event.getParam('draftValues');
        var draftValues = component.get("v.draftValues");
        console.log(draftValues);
        console.log ('DraftValues quando salva:'+JSON.stringify(draftValues));
        let recordId = component.get("v.recordId");
        let objectName = component.get("v.sObjectName");
        let actionName = '';
        let data = component.get("v.data");
        let numOfDraft = draftValues.length
        let numberLocal =0;
        let numberPos = 0;
        let numberLegal = 0;
        let numberAdmin = 0;
        let numberLegalNotNull = 0;
        if(objectName == 'Opportunity'){
            console.log("SIZE::: " + draftValues.length);
            for (let i=0; i < numOfDraft; i++){
                console.log(draftValues[i].rowId);
                console.log(draftValues[i].isPos);
                console.log(draftValues[i].isLegal);
                console.log(draftValues[i].isAdmin);
                console.log(draftValues[i].isLocal);

                if(draftValues[i].isPos == true){
                    numberPos++;
                }
                if(draftValues[i].isLegal == true){
                    numberLegal++;
                }
                if(draftValues[i].isAdmin == true){
                    numberAdmin++;
                }
                if(draftValues[i].isLocal == true){
                    numberLocal++;
                }
            }
            console.log("Number Pos: " + numberPos);
            console.log("Number Local: " + numberLocal);
            console.log("Number Legal: " + numberLegal);
            console.log("Number Admin: " + numberAdmin);
            console.log('(this.checkLegal(data): ' + this.checkLegal(data));
            console.log('this.checkLegal(draftValues)' + this.checkLegal(draftValues));
            var isLegalChanged = component.get( "v.legalIsChanged" );
            var confirmCancel  = component.get("v.confirmCancel");
            //console.log("Uscito dal loop");
            if(isLegalChanged == false && confirmCancel == true){
                this.showToast("Warning!", "warning", "Legale Rappresentante non modificato");
                $A.get('e.force:refreshView').fire();
            }
            else{
            //console.log("Uscito dal loop");
        //(this.checkLegal(data) && this.checkLegal(draftValues) Controllo su referente legale
        //if((this.checkLegal(data) && this.checkLegal(draftValues)) || numberPos > 1 || numberLegal > 1 || numberAdmin > 1 || numberLocal > 1) 
            if(numberPos > 1 || numberLegal > 1 || numberAdmin > 1 || numberLocal > 1 || (this.checkLegal(data)==true && this.checkLegal(draftValues)==false && numberLegal != 0))  {
                this.showToast("Warning!", "warning", "There must be one \'Legale\'");
                $A.get('e.force:refreshView').fire();
            } 
        
            else {
                switch (objectName) {
                case 'Opportunity':
                    actionName = "c.saveOpportunityChanges";
                    break;
            }
            var action = component.get(actionName);
            action.setParams({
                "json": JSON.stringify(draftValues),
                "recordId": recordId,
               
            });
            console.log ('AZIONE:'+ action);
            action.setCallback(this, function (response) {
                if(response.getState() === "SUCCESS") {
                    this.showToast("Success!", "success", "Records updated successfully.");
                } else {
                    this.showToast("Error!", "error", response.getError()[0].message);
                }
                $A.get('e.force:refreshView').fire();
            });
            $A.enqueueAction(action);
            console.log ('action enqueued');
        }
        }
    }
        if(objectName == 'ER_Financial_Center__c'){
            console.log('FINANCIAL CENTER SAVE CLASS')
            console.log("SIZE::: " + draftValues.length);
            for (let i=0; i < numOfDraft; i++){

                console.log(draftValues[i].rowId);
                console.log(draftValues[i].isPos);
                console.log(draftValues[i].isLegal);
                console.log(draftValues[i].isAdmin);
                console.log(draftValues[i].isLocal);

                if(draftValues[i].isPos == true){
                    numberPos++;
                }
                if(draftValues[i].isLegal == true){
                    numberLegal++;
                }
                if(draftValues[i].isAdmin == true){
                    numberAdmin++;
                }
                if(draftValues[i].isLocal == true){
                    numberLocal++;
                }
                if(draftValues[i].isLegal != null){
                    numberLegalNotNull++;
                }
            }
            console.log("Number Pos: " + numberPos);
            console.log("Number Local: " + numberLocal);
            console.log("Number Legal: " + numberLegal);
            console.log("Number Admin: " + numberAdmin);
            console.log("Number Legal Not Null: " + numberLegalNotNull);
            console.log('(this.checkLegal(data): ' + this.checkLegal(data));
            console.log('this.checkLegal(draftValues)' + this.checkLegal(draftValues));
            var isLegalChanged = component.get( "v.legalIsChanged" );
            var confirmCancel  = component.get("v.confirmCancel");
            //console.log("Uscito dal loop");
            if(isLegalChanged == false && confirmCancel == true){
                this.showToast("Warning!", "warning", "Ruoli non modificati");
                $A.get('e.force:refreshView').fire();
            }
            else{
            //console.log("Uscito dal loop");
         //(this.checkLegal(data) && this.checkLegal(draftValues) Controllo su referente legale
         //if((this.checkLegal(data) && this.checkLegal(draftValues)) || numberPos > 1 || numberLegal > 1 || numberAdmin > 1 || numberLocal > 1) 
         //|| (this.checkLegal(data)==true && this.checkLegal(draftValues)==false && numberLegal == 0)
            if(numberLegal > 1 || (this.checkLegal(data)==true && this.checkLegal(draftValues)==false && numberLegalNotNull != 0))  {
                this.showToast("Errore!", "error", "Ci deve essere un solo rappresentante \'Legale\'");
                $A.get('e.force:refreshView').fire();
            } 
        
            else {
                switch (objectName) {
                case 'ER_Financial_Center__c':
                    actionName = "c.saveFinancialCenterChanges";
                    break;
            }
            var action2 = component.get(actionName);
            action2.setParams({
                "json": JSON.stringify(draftValues),
                "recordId": recordId,
               
            });
            console.log ('AZIONE:'+ action2);
            action2.setCallback(this, function (response) {
                if(response.getState() === "SUCCESS") {
                    this.showToast("Success!", "success", "Records updated successfully.");
                } else {
                    this.showToast("Error!", "error", response.getError()[0].message);
                }
                $A.get('e.force:refreshView').fire();
            });
            $A.enqueueAction(action2);
            console.log ('action enqueued');
            }
            }
            if(objectName == 'Contact'){
            console.log('CONTACT SAVE CLASS')
            console.log("SIZE::: " + draftValues.length);
            for (let i=0; i < numOfDraft; i++){
                if(draftValues[i].isLegal != null){
                    numberLegalNotNull++;
                }
            }
            if(numberLegalNotNull != 0)  {
                this.showToast("Errore!", "error", "Ci deve essere un solo rappresentante \'Legale\'");
                $A.get('e.force:refreshView').fire();
            } 
        
            else {
            switch (objectName) {
                case 'Contact':
                    actionName = "c.saveContactChanges";
                    break;
            }
            var action3 = component.get(actionName);
            action3.setParams({
                "json": JSON.stringify(draftValues),
                "recordId": recordId,
               
            });
            console.log ('AZIONE:'+ action2);
            action3.setCallback(this, function (response) {
                if(response.getState() === "SUCCESS") {
                    this.showToast("Success!", "success", "Records updated successfully.");
                } else {
                    this.showToast("Error!", "error", response.getError()[0].message);
                }
                $A.get('e.force:refreshView').fire();
            });
            $A.enqueueAction(action3);
            console.log ('action enqueued');
            }
        }
            }
            if(objectName == 'Contact'){
                console.log('CONTACT SAVE CLASS')
                console.log("SIZE::: " + draftValues.length);
                for (let i=0; i < numOfDraft; i++){
                    if(draftValues[i].isLegal != null){
                        numberLegalNotNull++;
                    }
                }
                if(numberLegalNotNull != 0)  {
                    this.showToast("Errore!", "error", "Ci deve essere un solo rappresentante \'Legale\'");
                    $A.get('e.force:refreshView').fire();
                } 
            
                else {
                switch (objectName) {
                    case 'Contact':
                        actionName = "c.saveContactChanges";
                        break;
                }
                var action3 = component.get(actionName);
                action3.setParams({
                    "json": JSON.stringify(draftValues),
                    "recordId": recordId,
                   
                });
                console.log ('AZIONE:'+ action2);
                action3.setCallback(this, function (response) {
                    if(response.getState() === "SUCCESS") {
                        this.showToast("Success!", "success", "Records updated successfully.");
                    } else {
                        this.showToast("Error!", "error", response.getError()[0].message);
                    }
                    $A.get('e.force:refreshView').fire();
                });
                $A.enqueueAction(action3);
                console.log ('action enqueued');
                }
            }
            if(objectName == 'ER_Store__c'){
                console.log('STORE SAVE CLASS')
                console.log("SIZE::: " + draftValues.length);
                actionName = "c.saveStoreChanges";
                var action4 = component.get(actionName);
                action4.setParams({
                    "json": JSON.stringify(draftValues),
                    "recordId": recordId,
                   
                });
                console.log ('AZIONE:'+ action4);
                action4.setCallback(this, function (response) {
                    if(response.getState() === "SUCCESS") {
                        this.showToast("Success!", "success", "Records updated successfully.");
                    } else {
                        this.showToast("Error!", "error", response.getError()[0].message);
                    }
                    $A.get('e.force:refreshView').fire();
                });
                $A.enqueueAction(action4);
                console.log ('action enqueued');
                }
        
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
    
    checkLegal: function(values) {
        return values.some((element) => element.isLegal === true);
    },
    checkPos: function(values) {
        console.log("UNICO RAPP POS");
        return values.some((element) => element.isPos === true);
    },

    checkLocal: function(values) {
        console.log("UNICO RAPP LOCAL");
        return values.some((element) => element.isLocal === true);
    },
    checkAdmin: function(values) {
        console.log("UNICO RAPP ADMIN");
        return values.some((element) => element.isAdmin === true);
    },
    
    checkFinancialCenterType: function(component) {
        let recordId = component.get("v.recordId");
        
        return new Promise($A.getCallback(function(resolve, reject) {
            var action = component.get("c.getFinancialCenterType");
            action.setParams({ "recordId" : recordId});
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