({
	doInit : function(component, event, helper) {
		//set columns
        var recordObjectId = component.get("v.objectCustomId");
        var recordObjectName = component.get("v.objectCustomName");
        console.log("recordObjectId  "+recordObjectId);
        console.log("recordObjectName  "+recordObjectName);
        var action = component.get("c.CreateGetCase");
        action.setParams({
            "objectId": recordObjectId,
            "objectType": recordObjectName 
        })
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {

                var caseList = response.getReturnValue();
                console.log("caseList::: "+caseList.cases);
                console.log("caseListworkflows::: "+caseList.workflows);
                if (caseList.cases != null && caseList.cases != '') {
                    var sortedList = caseList.cases.sort((a,b)=>(new Date(a.case_date)-new Date(b.case_date))*-1);
                    component.set('v.data', sortedList.slice(0,5));
                
                    if (caseList.activities != null && caseList.activities != '') {
                        var columnsAction = [];
                        caseList.activities.forEach(function(singleColumn){
                            columnsAction.push({label : singleColumn.activity_desc, name : singleColumn.activity_ref});
                        });
                        columnsAction.push({label : 'Visualizza Workflow', name : 'Visualizza Workflow'});
                    }
                    component.set('v.columns', [

                        {label: 'N° Caso', fieldName: 'caseNumberFromId', type: 'text'},
                        {label: 'Codice Terminale Pos', fieldName: 'terminal_ref', type: 'text'},
                        {label: 'Id Incident', fieldName: 'case_ref', type: 'text', sortable: true},
                        {label: 'Stato Richiesta', fieldName: 'case_status', type: 'text'},
                        {label: 'Tipo Richiesta', fieldName: 'case_type_ref', type: 'text'},
                        {label: 'Installatore', fieldName: 'installer_ref', type: 'text'},
                        {label: 'Modello', fieldName: 'terminal_model', type: 'text'},
                        {label: 'Note Intervento', fieldName: 'note_intervention', type: 'text'},
                        {label: 'Note Esito', fieldName: 'note_result', type: 'text'},
                        {label: 'Utente', fieldName: 'user', type: 'text'},
                        {label: 'Data Incident', fieldName: 'case_date', type: 'date', sortable: true, typeAttributes: {  
                            day: 'numeric',  
                            month: 'numeric',  
                            year: 'numeric'
                            }},
                        { type: 'action', typeAttributes: { rowActions: columnsAction } }  
                    ]);
                }    

                else if (caseList != null && caseList.workflows != '') {
                    component.set('v.controlViewWorkflowDetail', true);
                    component.set('v.dataWorkflow', caseList.workflows.slice(0,5));
                
                    if (caseList.sub_activities != null && caseList.sub_activities != '') {
                        var columnsActionWorkflow = [];
                        caseList.sub_activities.forEach(function(singleColumnWorkflow){
                            columnsActionWorkflow.push({label : singleColumnWorkflow.sub_activity_desc, name : singleColumnWorkflow.sub_activity_ref});
                        });
                    }  
                    component.set('v.columnsWorkflow', [

                        {label: 'N° Caso', fieldName: 'caseNumberFromId', type: 'text'},
                        {label: 'Id Incident', fieldName: 'refCase', type: 'text'},
                        {label: 'Descrizione Step', fieldName: 'step', type: 'text'},
                        {label: 'Resp. Attività', fieldName: 'owner', type: 'text'},
                        {label: 'Data', fieldName: 'step_date', type: 'date'},
                        {label: 'Utente Edenred', fieldName: 'step_user', type: 'text'},
                        {label: 'Note Step', fieldName: 'step_note', editable:'true', type: 'text'},
                        { type: 'action', typeAttributes: { rowActions: columnsActionWorkflow } } 
                    ]);    
                }else{
                    component.set('v.data', null); 
                }      
                
            }else if(action.getState() == "ERROR"){
                var errors = response.getError();
                component.set("v.showErrors",true);
                component.set("v.errorMessage",errors[0].message);
			}
        });
        $A.enqueueAction(action);
        
    },

    onSave : function (component, event, helper) {
        console.log('Controller Edit::::: ');
        helper.saveDataTable(component, event, helper);
    },
    
    handleRowAction : function(component,event,helper){
        var action = event.getParam('action').name;
        var row = event.getParam('row');
        var idRecord = '';
        console.log('row.terminal_ref::::: '+row.terminal_ref);
        console.log('row.installer_ref::::: '+row.installer_ref);
        console.log('row.terminal_model::::: '+row.terminal_model);
        console.log('row.case_ref::::: '+row.case_ref);
        console.log('row.refCase::::: '+row.refCase);
        console.log('row.step_note::::: '+row.step_note);
        console.log('ACTION::::: '+action);
        if(action != 'Visualizza Workflow'){
            var dinamicallyCaseId;
            if(row.case_ref != null)
                dinamicallyCaseId = row.case_ref;
            else if(row.refCase != null) 
                dinamicallyCaseId = row.refCase ;
            
            var recordObjId = component.get("v.objectCustomId");
            var actionPostCase = component.get("c.CreatePostCase");
            
            console.log('row.dinamicallyCaseId::::: '+dinamicallyCaseId);  
            console.log('recordObjId::::: '+recordObjId);  
            console.log('actionPostCase::::: '+actionPostCase); 
            
            actionPostCase.setParams({
                "caseId": recordObjId,
                "actionString": action,
                "terminalRef": row.terminal_ref,
                "installerRef": row.installer_ref,
                "terminalModel": row.terminal_model,
                "isComponent": true,
                "caseRef": dinamicallyCaseId,
                "noteString": row.step_note
            })
            actionPostCase.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Invio incident!! SUCCESS',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();

                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    var errors = response.getError();
                    toastEvent.setParams({
                        title : 'Error',
                        message:errors[0].message,
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(actionPostCase);    
        }else if(action == 'Visualizza Workflow'){
            var recordObjectId = component.get("v.objectCustomId");
            console.log("recordObjectId  "+recordObjectId);
            console.log("row.terminal_ref  "+row.terminal_ref);
            console.log("row.case_ref  "+row.case_ref);
            var actionWorkflow = component.get("c.CreateGetWorkflow");
            actionWorkflow.setParams({
                "caseId": recordObjectId,
                "terminalRef": row.terminal_ref,
                "caseRef": row.case_ref
            })
            actionWorkflow.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    component.set('v.controlViewWorkflowDetail', true);
                    console.log('currency data is:' + JSON.stringify(response.getReturnValue()));
                    var dataList = response.getReturnValue();
                    console.log("dataList::: "+dataList);
                    if (dataList != null && dataList.workflows != '') {
                        component.set('v.dataWorkflow', dataList.workflows);
                    }else{
                        component.set('v.dataWorkflow', null);
                    }
                    if (dataList.sub_activities != null && dataList.sub_activities != '') {
                        var columnsActionWorkflow = [];
                        dataList.sub_activities.forEach(function(singleColumnWorkflow){
                            columnsActionWorkflow.push({label : singleColumnWorkflow.sub_activity_desc, name : singleColumnWorkflow.sub_activity_ref});
                        });
                    }  
                    component.set('v.columnsWorkflow', [

                        {label: 'N° Caso', fieldName: 'caseNumberFromId', type: 'text'},
                        {label: 'Id Incident', fieldName: 'refCase', type: 'text'},
                        {label: 'Descrizione Step', fieldName: 'step', type: 'text'},
                        {label: 'Resp. Attività', fieldName: 'owner', type: 'text'},
                        {label: 'Data', fieldName: 'step_date', type: 'date'},
                        {label: 'Utente Edenred', fieldName: 'step_user', type: 'text'},
                        {label: 'Note Step', fieldName: 'step_note', editable:'true', type: 'text'},
                        { type: 'action', typeAttributes: { rowActions: columnsActionWorkflow } }
                    ]);    
                    
                }else if(action.getState() == "ERROR"){
                    var errors = response.getError();
                    console.log("errors[0]  "+errors[0]);
                    component.set("v.showErrors",true);
                    component.set("v.errorMessage",errors[0].message);
                }
            });
            $A.enqueueAction(actionWorkflow);        
        }
    },
    
    updateColumnSorting_present: function(component, event, helper) {
		
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy_present", fieldName);
        component.set("v.sortedDirection_present", sortDirection);
        helper.sortData_present(component, fieldName, sortDirection);
    },

})