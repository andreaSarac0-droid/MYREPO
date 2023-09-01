({
    doInit: function (component, event, helper) {
        var caseId = component.get("v.recordId");
        var action = component.get("c.populateValues");
        console.log("CASEID "+caseId);
        action.setParams({
            "recordId" : caseId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var currentCase = response.getReturnValue();
              	component.set("v.initContactId",currentCase.ContactId);
                component.set('v.RecordTypeIdCase' , currentCase.RecordTypeId);
               
				component.set("v.CaseRecord",currentCase);
				component.set("v.CaseOrigin",currentCase.Origin);
                component.set("v.CaseRecordEmail",currentCase.SuppliedEmail);
                component.set("v.CaseRecordPhone",currentCase.SuppliedPhone);
				var selectedUser = [];

                if(currentCase.IT_User__c != null){
                    selectedUser.push(currentCase.IT_User__r);
                   
                    component.set("v.selectedUser" , selectedUser);
                    var Input = component.find("inputUser");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillUser");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenUser");
                    $A.util.removeClass(ToOpen, "slds-is-open");
				}
            }
        });
        $A.enqueueAction(action);

    },
    
    onchange: function (component, event, helper) {

        console.log("Onchange");
        var icon = component.get("v.iconName");
        var selectedObject = component.get("v.sObject");
        var methodName = "test";
        var term = "test";
        var userSelect = component.get("v.selectedUser");
        var additionalFilter;
        var filterField;
        console.log("icon:: " + icon);
        console.log("Object:: " + selectedObject);

        if(selectedObject == 'User'){
            methodName = "c.lookUpUser"
            term = component.get("v.sTermUser");
        } 
        console.log("METHOD:: " + methodName);
        var action = component.get(methodName);


        action.setParams({
            "searchTerm": term,
            "myObject": selectedObject, 
            "additionalFilter" : additionalFilter,
            "filterField" : filterField
        });

        if (term.length > 0) {
            action.setCallback(this, function (response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log(JSON.stringify(result));
                    console.log(result);
                    if (selectedObject == "User") {
                        component.set("v.userList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenUser");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenUser");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                }

            });

            $A.enqueueAction(action);
        }
    },

    onblur: function (component, event, helper) {
        const blurTimeout = window.setTimeout(
            $A.getCallback(() => {
                var toOpenUser = component.find("toOpenUser");
                $A.util.removeClass(toOpenUser, "slds-is-open");
            }),
            400
        );
    },
    
    onfocus: function (component, event, helper) {
        var toOpenUser = component.find("toOpenUser");
        $A.util.removeClass(toOpenUser, "slds-is-open");
        if (component.get("v.sObject") == "User") {
            var term = component.get("v.sTermUser");
            var returnedResults = component.get("v.userList");
            var action = component.get("c.lookUpUser");
                action.setParams({
                    "searchTerm": term,
                    "myObject": 'User',
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log("RESULT:: " + result);
                        if (result != null) {
                            component.set("v.userList", result);
                            var ToOpen = component.find("toOpenUser");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);

            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpenUser");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        }

    },

    handleRemoveOnly: function (component, event, helper) {

        var sel = event.getSource().get("v.name");
        console.log("REMOVEVENT: " + sel.Id);
        var toFind = 'inputUser';
        var pillToFind = 'lookup-pillUser';
        var toRemove = 'v.selectedUser';	

        component.set(toRemove, null);

        var Input = component.find(toFind);
        $A.util.removeClass(Input, "slds-hide");

        var lookupPill = component.find(pillToFind);
        $A.util.addClass(lookupPill, "slds-hide");

    },
    handleEvent: function (component, event, helper) {
        var Object = component.get("v.sObject");
        var selectedLookupUser = [];


       if (Object == "User") {
            var lookupEventToParent = event.getParam("User");

            console.log("In event handler");
            console.log(JSON.stringify(lookupEventToParent));
            var selectedList = [];
            selectedList.push(lookupEventToParent);
            selectedLookupUser.push(lookupEventToParent);
            console.log(JSON.stringify(selectedList));

        } 
        
        if (selectedLookupUser != null && selectedLookupUser != undefined && selectedLookupUser.length > 0 && selectedLookupUser [0] != null) {
            console.log("User found EVENT "+JSON.stringify(selectedLookupUser));
            
            component.set("v.selectedUser", selectedLookupUser);
            var Input = component.find("inputUser");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillUser");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenUser");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermUser", "");

        }

    },

    onSubmit: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var userSelect = component.get("v.selectedUser");
        var userId;
        if(userSelect != null && userSelect.length > 0){
            userId = userSelect[0].Id;
        }
        var action = component.get("c.saveRecord");
                action.setParams({
                    "userId": userId,
                    "caseId" : component.get("v.recordId")
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        workspaceAPI.getFocusedTabInfo().then(function (response) {
                            var focusedTabId = response.tabId;
                            workspaceAPI.refreshTab({
                                tabId: focusedTabId,
                                includeAllSubtabs: false
							});
                        });
                        console.log('torna qualcosa? '+ response.getReturnValue());
                    }
                    else{
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(action);
    },
    

})