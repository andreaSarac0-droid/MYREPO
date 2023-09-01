({
    doInit: function (component, event, helper) {
        var taskId = component.get("v.recordId");
        var action = component.get("c.populateValuesTASK");
        console.log("CASEID "+taskId);
        action.setParams({
            "recordId" : taskId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var currentTask = response.getReturnValue();
                console.log("CURRENT CASE: " +JSON.stringify(currentTask));
                var selectedacc = [];
                if(currentTask.Account != null){
                    selectedacc.push(currentTask.Account);
                    component.set("v.selected" , selectedacc);
                    component.set("v.partitaIva" , currentTask.IT_VAT_Number__c);
                    var Input = component.find("input");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pill");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpen");
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
        var accoSelect = component.get("v.selected");
        var circSelect = component.get("v.selectedCircuit");
        var additionalFilter;
        var recordTypeId = component.get("v.RecordTypeIdCase");
        console.log("icon:: " + icon);
        console.log("Object:: " + selectedObject);
        console.log("Accoselect:: " + accoSelect);
        console.log("circSelect:: " + circSelect);

        if (selectedObject == 'Account') {
            methodName = "c.lookUp"
            term = component.get("v.sTerm");
        } else if (selectedObject == 'ER_Financial_Center__c') {
            methodName = "c.lookUp3"
            term = component.get("v.sTermfin");
            console.log('RecordTypeIdCase '+recordTypeId);

            if(circSelect != null && circSelect.length > 0){
                console.log("CIRCUIT FOUND");
                additionalFilter = component.get("v.selectedCircuit")[0].Id;
                console.log("FILTER ID "+additionalFilter);
            }

            else if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selected")[0].Id;
                console.log("FILTER ID "+additionalFilter);
            }

        } else if (selectedObject == 'IT_Circuit__c') {
            methodName = "c.lookUp2"
            term = component.get("v.sTermcirc");
            if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selected")[0].Id;
                console.log("FILTER ID "+additionalFilter);
            }
        }
        /*Send this value to server to get values other than in this list*/
        //var selected = component.get("v.selected");
        //console.log("selected");
        // console.log(JSON.stringify(selected));
        console.log("METHOD:: " + methodName);
        var action = component.get(methodName);


        action.setParams({
            "searchTerm": term,
            "myObject": selectedObject, //Updated Add this line in your code
            "additionalFilter" : additionalFilter,
            "recordTypeId" : recordTypeId
        });

        if (term.length > 0) {
            action.setCallback(this, function (response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log(JSON.stringify(result));
                    console.log(result);
                    if (selectedObject == "Account") {
                        component.set("v.conList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpen");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpen");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                }

            });

            $A.enqueueAction(action);
        }
    },

    onblur: function (component, event, helper) {

        if (component.get("v.sObject") == "Account") {
            //Setting timeout so that we can capture the value onclick
            const blurTimeout = window.setTimeout(
                $A.getCallback(() => {
                    var ToOpen = component.find("toOpen");
                    $A.util.removeClass(ToOpen, "slds-is-open");
                }),
                300
            );
            component.set('v.blurTimeout', blurTimeout);
        }
    },

    onfocus: function (component, event, helper) {
            var term = component.get("v.sTerm");
            var returnedResults = component.get("v.conList");
            console.log("in onfocus");
            console.log(term);
            /*var ToOpen3 = component.find("toOpen3");
            $A.util.removeClass(ToOpen3, "slds-is-open");
            var ToOpen2 = component.find("toOpen2");
            $A.util.removeClass(ToOpen2, "slds-is-open");*/
            var action = component.get("c.lookUp");
            action.setParams({
                "searchTerm": null,
                "myObject": 'Account'
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log("RESULT:: " + result);
                    if (result != null) {
                        component.set("v.conList", result);
                        console.log("conList:: " + component.get("v.conList"));
                        var ToOpen = component.find("toOpen");
                        $A.util.addClass(ToOpen, "slds-is-open");
                    }
                }
            });
            $A.enqueueAction(action);
    },

    handleRemoveOnly: function (component, event, helper) {

        var sel = event.getSource().get("v.name");
        console.log("REMOVEVENT: " + sel.Id);
        var ObjType = sel.Id.toString().substring(0, 3);
        console.log("SUBSTR: " + ObjType);

        /*console.log("in remove");
        var sel = event.getSource().get("v.name");
        var lis = component.get("v.selected");
        for(var i = 0; i < lis.length; i++){
            if(lis[i].Id == sel.Id){
                
                lis.splice(i,1);
            }*/
        if (ObjType == '001') {

            component.set("v.selected", null);

            var Input = component.find("input");
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pill");
            $A.util.addClass(lookupPill, "slds-hide");

        } 
    },

    handleEvent: function (component, event, helper) {
        var Object = component.get("v.sObject");
        if (Object == "Account") {
            var lookupEventToParent = event.getParam("selectedItem");
            /* selectedValue attribute is used to de duplicate the list box options in dropdown after selecting a value. so that the value does not repeat in box after selecting once*/

            console.log("In event handler");
            console.log(JSON.stringify(lookupEventToParent));
            var singleSel = component.get("v.singleSelect");


            var selectedList = [];
            //var existing = component.get("v.selected");
            selectedList.push(lookupEventToParent);
            console.log(JSON.stringify(selectedList));
            component.set("v.selected", selectedList);

            var Input = component.find("input");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pill");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpen");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTerm", "");
        }

    },

    onSubmit: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var accoSelect = component.get("v.selected");
        var accId;
        if(accoSelect != null && accoSelect.length > 0){
            accId = accoSelect[0].Id;
        }
        var action = component.get("c.saveRecordTASK");
                action.setParams({
                    "accountId": accId,
                    "taskId" : component.get("v.recordId"),
                    "vatNumber" : component.get("v.partitaIva")
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
                    }
                });
                $A.enqueueAction(action);

    }

})