({
	doInit : function(cmp, event, helper) {
        //set columns
        cmp.set('v.loaded', false);
        var actions = [
            { label: 'Modifica Referente', name: 'edit_contact' },
            { label: 'Modifica Recapito', name: 'edit_detail' },
            { label: 'Aggiungi Associazione', name: 'edit_association' }
        ];
        if(cmp.get('v.isFlow')){
            cmp.set('v.columns', [
                {type: 'action', typeAttributes: { rowActions: actions } },
                {label: 'Dettaglio Contatto', sortable: true, fieldName: 'detailName', type: 'text', editable: false},
                {label: 'Financial Center', sortable: true, fieldName: 'fcName', type: 'text', editable: false},
                {label: 'Ordini', sortable: true, fieldName: 'IT_Order_Confirm_Address__c', type: 'boolean', editable: true},
                {label: 'Fatture', sortable: true, fieldName: 'IT_Billing_Confirm_Address__c', type: 'boolean', editable: true},
                {label: 'SUT', sortable: true, fieldName: 'IT_Send_SUT__c', type: 'boolean', editable: true },
                {label: 'Comunicazioni', sortable: true, fieldName: 'IT_Notifications__c', type: 'boolean', editable: true }
                
            ]);
        }
        else{
		cmp.set('v.columns', [
            
            {label: 'Dettaglio Contatto', sortable: true, fieldName: 'IT_Contact_Detail__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'detailName' }, target: '_self'}},
            {label: 'Financial Center', sortable: true, fieldName: 'IT_Financial_Center__c', type: 'url', editable: false, typeAttributes: {label: { fieldName: 'fcName' }, target: '_self'}},
            {label: 'Ordini', sortable: true, fieldName: 'IT_Order_Confirm_Address__c', type: 'boolean', editable: true},
            {label: 'Fatture', sortable: true, fieldName: 'IT_Billing_Confirm_Address__c', type: 'boolean', editable: true},
            {label: 'SUT', sortable: true, fieldName: 'IT_Send_SUT__c', type: 'boolean', editable: true },
            {label: 'Comunicazioni', sortable: true, fieldName: 'IT_Notifications__c', type: 'boolean', editable: true },
            {type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        }
        helper.updateTable( cmp, event );
        if(cmp.get("v.isViewAll")){
            var workspaceAPI = cmp.find("workspace");
            window.setTimeout(function(){         
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.setTabLabel({
                    tabId: focusedTabId,
                    label: "All Details"
                });
                workspaceAPI.setTabIcon({
                    tabId: focusedTabId,
                    icon: "standard:contact_list"
                });
            })}, 300);
        }
	},
    updateTable: function( cmp, event, helper) {
        cmp.set('v.loaded', false);
      	helper.updateTable( cmp, event );
    },
    onNext : function(cmp , event, helper) {        
        var pageNumber = cmp.get("v.currentPageNumber");
        cmp.set("v.currentPageNumber", pageNumber+1);
        helper.updateTable( cmp, event );
    },
    onPrev : function(cmp, event, helper) {        
        var pageNumber = cmp.get("v.currentPageNumber");
        cmp.set("v.currentPageNumber", pageNumber-1);
        helper.updateTable( cmp, event );
    },
    onFirst : function(cmp, event, helper) {        
        cmp.set("v.currentPageNumber", 1);
        var pageSize = cmp.get("v.selectedPageSize");
        helper.updateTable( cmp, event );
    },
    onLast : function(cmp, event, helper) {        
        cmp.set("v.currentPageNumber", cmp.get("v.totalPages"));
        helper.updateTable( cmp, event );
    },
    onPageClick: function( cmp, event, helper ) {
        cmp.set("v.currentPageNumber", parseInt(event.getSource().get('v.name')));
        helper.updateTable( cmp, event );
    },
    updateColumnSorting: function( cmp, event, helper) {
        cmp.set('v.loaded', false);
        cmp.set("v.sortedDirection", event.getParam("sortDirection"));
        if(event.getParam("fieldName")== 'IT_Contact_Detail__c'){
            cmp.set("v.sortedBy", 'IT_Contact_Detail__r.IT_Contact_Info__c' );
        }else{
            cmp.set("v.sortedBy", event.getParam("fieldName") );
        }
        
        helper.updateTable( cmp, event );
    },
    filteredSearch: function( cmp, event, helper) {
        if(cmp.get("v.searchTerm").length > 1 || cmp.get("v.searchTerm").length == 0){
            helper.updateTable( cmp, event );
        }

    },
    
    handleSave: function (cmp, event, helper) {
        //cmp.set('v.saveDraftValues', event.getParam('draftValues'));
        var draftValues = event.getParam('draftValues');
        
        var workspaceAPI = cmp.find("workspace");
        var action = cmp.get("c.updateRecords");
        action.setParams({"detailList" : draftValues});
        action.setCallback(this, function(response) {
            var state = response.getState();
            cmp.set('v.draftValues', []);
            if (state === "SUCCESS") {
                helper.updateTable( cmp, event );
            }
            else{
                
                var errors = response.getError();
                var errorMessage = errors[0].message != undefined? errors[0].message : errors[0].pageErrors != undefined? errors[0].pageErrors[0].message : null;
                console.log(JSON.stringify(errors) + 'ERROR:: '+errorMessage);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore!",
                    "message": "Si è verificato il seguente errore: " + errorMessage
                });
                toastEvent.fire();
            }
            
            
            /*workspaceAPI.getFocusedTabInfo().then(function (response2) {
                var focusedTabId = response2.tabId;
                workspaceAPI.refreshTab({
                    tabId: focusedTabId,
                    includeAllSubtabs: false
                });
            });*/
            
        });
        $A.enqueueAction(action);
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
    
    statusChange : function (cmp, event) {
        if (event.getParam('status') === "FINISHED") {
           cmp.set("v.isModalOpen", false);
        }
    },
            
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    saveNewDetail: function(component, event, helper) {
        helper.helpSaveDetail(component , event);
    },

    handleRowAction : function(cmp,event,helper){
        var action = event.getParam('action').name;
        var row = event.getParam('row');
        var idRecord = '';
        console.log(action);
        if(action == 'edit_contact' || action == 'edit_detail'){
            if(action == 'edit_contact'){
                idRecord = row.IT_Contact__c.replace("/", "");
            }
            else if(action == 'edit_detail'){
                idRecord = row.IT_Contact_Detail__c.replace("/", "");
            }
            // navigate to sObject detail page     
            var navEvt = $A.get("e.force:editRecord");
            navEvt.setParams({
                "recordId": idRecord,
            });
            navEvt.fire();
        }
        
        else if(action == 'edit_association'){
            var flowName = 'IT_Create_Contact_Association';
            var recordId = row.IT_Contact_Detail__c.replace("/", "");
            helper.helpOpenModel(cmp, event, flowName,recordId);
        }
        

     },
    
    openAllOrders: function (cmp, event, helper){
        var showButton = cmp.get("v.showButton");
        var flowName = cmp.get("v.flowName");
        var idCase = cmp.get("v.recordId");
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT17_ContactDetailRelatedList",
            componentAttributes : {
                isViewAll : true,
                recordId : idCase,
                showButton : showButton,
                flowName : flowName
            }    
        });
        evt.fire();
    },
    
    onRefresh : function(component, event, helper) {
        var icona = component.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');
        component.set('v.loaded', false);
        helper.updateTable( component, event );

        // SETTHISDELAYED$A.util.toggleClass(icona, 'rotator');
    },
})