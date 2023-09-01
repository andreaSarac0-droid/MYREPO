({
    doInit: function (component, event, helper) {
        component.set('v.mycolumns', [ 
            { label: 'Nome File', fieldName: 'IT_Record_Link__c', type: 'url', typeAttributes: {label: { fieldName: 'Name' }}},
            { label: 'Versione', fieldName: 'IT_Version__c', type: 'number'},
            { label: 'Caricato il', fieldName: 'CreatedDate', type: 'date'}
            //{ label: 'Data Approvazione', fieldName: 'Data_Approvazione__c', type: 'date'}
        ]);
        var typePicklist;
        var recordId = component.get('v.recordId');
        var action2 = component.get('c.getPickListValuesIntoList');
        action2.setParams({
            "caseId": recordId,
        })
        action2.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                typePicklist = response.getReturnValue();
                typePicklist.sort((a, b) => (a.MasterLabel > b.MasterLabel) ? 1 : -1);
                typePicklist.unshift({"MasterLabel":"--Nessuno--","IT_Multi_Upload__c":false,"IT_View_Detail__c":false});
                console.log("typePicklist" + JSON.stringify(typePicklist));
                component.set("v.listaMetadata", typePicklist);
                component.set("v.selectedType", typePicklist[0].MasterLabel);
                component.set("v.hideCheckbox", typePicklist[0].IT_Multi_Upload__c);
                component.set("v.vediDettaglio", typePicklist[0].IT_View_Detail__c);
                //component.find("fileTypeList").set("v.value", typePicklist[0]);
                //helper.typeHelper(component , typePicklist[0].MasterLabel);
                
                
            }
        });
        $A.enqueueAction(action2);
        helper.getMilestoneNameHelper(component, '');

    },
    
    
    handleUploadFinished: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var uploadedFiles = event.getParam("files");
        var selectedType = component.get("v.selectedType");
        var caricamentoMultiplo = component.get("v.hideCheckbox");
        var recievedDate = component.get("v.recievedDate");
        var cigFlag = component.get("v.cigFlag");
        var ipaFlag = component.get("v.ipaFlag");
        var isAccepted = component.get("v.isAccepted");
        if (component.get('v.vediDettaglio')) {
            if(component.get("v.otherType") != null){
                selectedType = selectedType + ' - ' + component.get("v.otherType");
            } 
        }
        var oldDocId = component.get('v.selectedRowIdOld');
        var fileName = uploadedFiles[0].name;
        console.log(fileName.substring(0,78));
        var action = component.get('c.newAttachmentVer');
        action.setParams({
            "recordId": recordId,
            "documentId": uploadedFiles[0].documentId,
            "title": fileName.substring(0, 78),
            "type": selectedType,
            "oldDocId" : oldDocId,
            "caricamentoMulti" : caricamentoMultiplo,
            "recievedDate" : recievedDate,
            "cigFlag" : cigFlag,
            "ipaFlag" : ipaFlag,
            "accepted" : isAccepted
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("New version Created");
                var bdocId = response.getReturnValue();
                console.log(bdocId + ' CDOC '+  uploadedFiles[0].documentId);
                var action2 = component.get('c.createLink');
                action2.setParams({
                    "bdocid": bdocId,
                    "documentId": uploadedFiles[0].documentId,
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("LINK CREATED");
                        if(isAccepted){
                            var action3 = component.get('c.completeCONSIPMilestones');
                            action3.setParams({
                                "caseId": recordId,
                                "fileType": selectedType
                            })
                            action3.setCallback(this, function (response) {
                                if (response.getState() == "SUCCESS") {
                                    console.log("Milestone Closed!");
                                    var numPhase = parseInt(component.get("v.milestonePhase") , 10);
                                    var numDoc = parseInt(component.get("v.numeroDocumenti") , 10);
                                    console.log('numPhase+:'+ numPhase);
                                    component.set("v.milestonePhase", numPhase + 1);
                                    component.set("v.numeroDocumenti", numDoc + 1);
                                    var action4 = component.get('c.updateMilestoneFields');
                                    action4.setParams({
                                        "caseId": recordId,
                                    })
                                    action4.setCallback(this, function (response) {
                                        if (response.getState() == "SUCCESS") {
                                            console.log("Case Updated!");
                                            workspaceAPI.isConsoleNavigation().then(function (response) {
                                                if (response) {
                                                    
                                                    workspaceAPI.getFocusedTabInfo().then(function (response2) {
                                                        var focusedTabId = response2.tabId;
                                                        workspaceAPI.refreshTab({
                                                            tabId: focusedTabId,
                                                            includeAllSubtabs: false
                                                        });
                                                    });
                                                } else {
                                                    location.reload();
                                                }
                                            });
                                        }
                                        
                                    });
                                    $A.enqueueAction(action4);
                                    
                                }
                            });
                            $A.enqueueAction(action3);
                        }
                        
                    }
                    
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    typeChange: function (component, event, helper) {
        var evntsource = event.getSource();
        var typePicklist = component.get("v.selectedType");
        var typeItem = component.find("fileTypeList").get("v.items");
        for (var i = 0 ; i < typeItem.length ; i++){
            if(typeItem[i].MasterLabel == typePicklist){
                //component.set("v.otherType" , ''); //could be a problem?
                component.set("v.hideCheckbox" , typeItem[i].IT_Multi_Upload__c);
                component.set("v.vediDettaglio" , typeItem[i].IT_View_Detail__c);
            }
        }
        if (component.get('v.vediDettaglio')) {
            if(component.get("v.otherType") != null && component.get("v.otherType") != ''){
                typePicklist = typePicklist + ' - ' + component.get("v.otherType");
            } 
        }
        
        helper.typeHelper(component , typePicklist);
        
        
        //component.set('v.predictions', []);
        
        
        
    },
    updateSelectedRow: function (component, event) {
        var selectedRows = event.getParam('selectedRows');
        var selectedRowIdOld = component.get('v.selectedRowIdOld');
        if(selectedRows != null && selectedRows.length > 0){
            component.set('v.uploadLabel', 'Aggiorna Selezionato');
            var selectedKeys = [];
            var i = 0;
            for(i=0 ; i < selectedRows.length; i++){
                if (selectedRows[i].Id != selectedRowIdOld){
                    console.log('NEW ID '+ selectedRows[i].Id);
                    selectedKeys.push(selectedRows[i].Id);
                    component.set('v.selectedRowIdOld' , selectedRows[i].Id);
                    component.find("dataTable1").set('v.selectedRows' , selectedKeys);
                }
            }	
        }else{
            component.set('v.selectedRowIdOld' , '');
            component.set('v.uploadLabel', 'Aggiungi File');
            console.log('VUOTO');
        }
        
    },
    
    
    getCityDetails: function (component, event, helper) {
        console.log("SELECTED CITY");
        var selectedItem = event.currentTarget;
        var placeid = selectedItem.dataset.placeid;
        component.set('v.otherType', placeid);
        helper.typeHelper(component , placeid);
        component.set('v.predictions', []);
        
    },
    
    getPredictions: function (component, event, helper) {
        console.log("GET CITIES");
        var selectedType = component.get("v.selectedType")
        var input = selectedType + ' - ' +component.get('v.otherType');
        var recordId = component.get('v.recordId');
        if (input.length > 1) {
            var action = component.get("c.getSuggestions");
            action.setParams({
                "input": input,
                "recordId" : recordId
            })
            action.setCallback(this, function (response) {
                if (response.getState() == "SUCCESS") {
                    var LOC = response.getReturnValue();
                    console.log("GET CITIES:: " + LOC);
                    component.set('v.predictions', LOC);
                }
            });
            $A.enqueueAction(action);
        } else {
            component.set('v.predictions', null);
        }
        
    },
    
    handleClickNext: function (component, event, helper) {
        console.log("SELECTED NEXT");
        var currentPhase = component.get('v.phase');
        if(currentPhase == 1){
            component.set('v.firstPhaseClass' , 'slds-transition-hide');
            window.setTimeout(function(){
                component.set('v.phase' , currentPhase + 1);
                component.set('v.secondPhaseClass' , 'slds-transition-show');
            },500)

        }
        else if (currentPhase == 2){
            //DOPO
        }
        
    },
    
    handleClickBack: function (component, event, helper) {
        console.log("SELECTED BACK");
        var currentPhase = component.get('v.phase');
        if(currentPhase == 1){
			//DOPO
        }
        else if (currentPhase == 2){
            component.set('v.secondPhaseClass' , 'slds-transition-hide');
            window.setTimeout(function(){
                component.set('v.phase' , currentPhase - 1);
                component.set('v.firstPhaseClass' , 'slds-transition-show');
            },500)
        }
        
    },
    
    handleClickNewPhaseTABELLE: function (component, event, helper) {
        console.log("SELECTED BACK");
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var action = component.get('c.completeCONSIPMilestones');
        action.setParams({
            "caseId": recordId,
            "fileType": 'tabelle esercizi'
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("Milestone Closed!");
                component.set("v.milestonePhase", component.get("v.milestonePhase") + 2);
                var action2 = component.get('c.updateMilestoneFields');
                action2.setParams({
                    "caseId": recordId
                    
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("Case Updated!");
                        workspaceAPI.isConsoleNavigation().then(function (response) {
                            if (response) {
                                workspaceAPI.getFocusedTabInfo().then(function (response2) {
                                    var focusedTabId = response2.tabId;
                                    workspaceAPI.refreshTab({
                                        tabId: focusedTabId,
                                        includeAllSubtabs: false
                                    });
                                });
                            } else {
                                location.reload();
                            }
                        });
                    }
                    
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    handleClickNewPhaseTABELLA: function (component, event, helper) {
        console.log("SELECTED BACK");
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var action = component.get('c.completeCONSIPMilestones');
        action.setParams({
            "caseId": recordId,
            "fileType": 'tabella esercizi'
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("Milestone Closed!");
                component.set("v.milestonePhase", component.get("v.milestonePhase") + 2);
                var action2 = component.get('c.updateMilestoneFields');
                action2.setParams({
                    "caseId": recordId
                    
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("Case Updated!");
                        workspaceAPI.isConsoleNavigation().then(function (response) {
                            if (response) {
                                workspaceAPI.getFocusedTabInfo().then(function (response2) {
                                    var focusedTabId = response2.tabId;
                                    workspaceAPI.refreshTab({
                                        tabId: focusedTabId,
                                        includeAllSubtabs: false
                                    });
                                });
                            } else {
                                location.reload();
                            }
                        });
                    }
                    
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    handleClickNewPhaseTICKET: function (component, event, helper) {
        console.log("SELECTED BACK");
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var action = component.get('c.completeCONSIPMilestones');
        action.setParams({
            "caseId": recordId,
            "fileType": 'Ticket cartacei'
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("Milestone Closed!");
                component.set("v.milestonePhase", component.get("v.milestonePhase") + 1);
                var action2 = component.get('c.updateMilestoneFields');
                action2.setParams({
                    "caseId": recordId
                    
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("Case Updated!");
                        workspaceAPI.isConsoleNavigation().then(function (response) {
                            if (response) {
                                workspaceAPI.getFocusedTabInfo().then(function (response2) {
                                    var focusedTabId = response2.tabId;
                                    workspaceAPI.refreshTab({
                                        tabId: focusedTabId,
                                        includeAllSubtabs: false
                                    });
                                });
                            } else {
                                location.reload();
                            }
                        });
                    }
                    
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    handleClickNewPhaseKIT: function (component, event, helper) {
        console.log("SELECTED BACK");
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        var action = component.get('c.completeCONSIPMilestones');
        action.setParams({
            "caseId": recordId,
            "fileType": 'invio Kit'
        })
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log("Milestone Closed!");
                component.set("v.milestonePhase", component.get("v.milestonePhase") + 1);
                var action2 = component.get('c.updateMilestoneFields');
                action2.setParams({
                    "caseId": recordId
                    
                })
                action2.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        console.log("Case Updated!");
                        workspaceAPI.isConsoleNavigation().then(function (response) {
                            if (response) {
                                workspaceAPI.getFocusedTabInfo().then(function (response2) {
                                    var focusedTabId = response2.tabId;
                                    workspaceAPI.refreshTab({
                                        tabId: focusedTabId,
                                        includeAllSubtabs: false
                                    });
                                });
                            } else {
                                location.reload();
                            }
                        });
                    }
                    
                });
                $A.enqueueAction(action2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
    handleClickViewAll: function (component, event) {
        var workspaceAPI = component.find("workspace");
        var recordId = component.get('v.recordId');
        workspaceAPI.getTabInfo().then(function(response) {
		workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                url: '/lightning/r/'+recordId+'/related/Documents__r/view',
                focus: true
            })
        });
        
    },

    
})