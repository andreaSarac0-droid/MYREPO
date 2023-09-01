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
                var selectedCirc = [];
                var selectedacc = [];
                var selectedFin = [];
                var selectedContact = [];
                component.set('v.contactEmail',currentCase.SuppliedEmail);
                component.set('v.contactPhone',currentCase.SuppliedPhone);
                if(currentCase.IT_Account__r != null){
                    selectedacc.push(currentCase.IT_Account__r);
                    component.set("v.selected" , selectedacc);
                    
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
                if(currentCase.IT_Circuit_Client__r != null){
                    selectedCirc.push(currentCase.IT_Circuit_Client__r);
                    component.set("v.selectedCircuit" , selectedCirc);
                    var Input = component.find("input3");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pill3");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpen3");
                    $A.util.removeClass(ToOpen, "slds-is-open");

                }
                if(currentCase.IT_Financial_Center_Client__r != null){
                    selectedFin.push(currentCase.IT_Financial_Center_Client__r);
                   
                    component.set("v.selectedFinCenter" , selectedFin);
                    var Input = component.find("input2");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pill2");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpen2");
                    $A.util.removeClass(ToOpen, "slds-is-open");

                }
                if(currentCase.Contact != null){
                    console.log('Contact trovato + '+currentCase.Contact);
                    selectedContact.push(currentCase.Contact);
                   
                    component.set("v.selectedContact" , selectedContact);
                    var Input = component.find("inputContact");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillContact");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenContact");
                    $A.util.removeClass(ToOpen, "slds-is-open");

                }
            }
            var action2 = component.get('c.verifyMatch');
            action2.setParams({
                "caseId" : caseId
            });
            action2.setCallback(this, function (response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    if(response.getReturnValue()){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "mode": 'sticky',
                            "title": "Attenzione!",
                            "message": "Il Circuito e l'Account non sembrano essere associati. Verificare.",
                            "type" : "warning"
                        });
                        toastEvent.fire();
                    }
                }
            });
            $A.enqueueAction(action2);
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
        var suppliedEmail = component.get("v.CaseRecord").SuppliedEmail;
        var suppliedPhone = component.get("v.CaseRecord").SuppliedPhone;
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
        } else if (selectedObject == 'Contact') {
            methodName = "c.lookUpContact"
            term = component.get("v.sTermContact");
            if(accoSelect != null && accoSelect.length > 0){
                console.log("Contact FOUND");
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
            "recordTypeId" : recordTypeId,
            "suppliedEmail": suppliedEmail,
            "suppliedPhone" : suppliedPhone,
            "caseId" : component.get("v.recordId")
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
                    if (selectedObject == "ER_Financial_Center__c") {
                        component.set("v.finList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpen2");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpen2");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "IT_Circuit__c") {
                        component.set("v.circList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpen3");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpen3");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "Contact") {
                        component.set("v.contactList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenContact");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenContact");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                }

            });

            $A.enqueueAction(action);
        }
    },

    onblur: function (component, event, helper) {

        /*if (component.get("v.sObject") == "Account") {
            //Setting timeout so that we can capture the value onclick
            const blurTimeout = window.setTimeout(
                $A.getCallback(() => {
                    var ToOpen = component.find("toOpen");
                    $A.util.removeClass(ToOpen, "slds-is-open");
                }),
                300
            );
            component.set('v.blurTimeout', blurTimeout);
        } else if (component.get("v.sObject") == "ER_Financial_Center__c") {
            //Setting timeout so that we can capture the value onclick
            const blurTimeout = window.setTimeout(
                $A.getCallback(() => {
                    var ToOpen = component.find("toOpen2");
                    $A.util.removeClass(ToOpen, "slds-is-open");
                }),
                300
            );
            component.set('v.blurTimeout', blurTimeout);
        } else if (component.get("v.sObject") == "IT_Circuit__c") {
            //Setting timeout so that we can capture the value onclick
            const blurTimeout = window.setTimeout(
                $A.getCallback(() => {
                    var ToOpen = component.find("toOpen3");
                    $A.util.removeClass(ToOpen, "slds-is-open");
                }),
                300
            );
            component.set('v.blurTimeout', blurTimeout);
        }*/
    },

    onfocus: function (component, event, helper) {
        var ToOpenContact = component.find("toOpenContact");
        $A.util.removeClass(ToOpenContact, "slds-is-open");
        if (component.get("v.sObject") == "Account") {
            var term = component.get("v.sTerm");
            var returnedResults = component.get("v.conList");
            var suppliedEmail = component.get("v.CaseRecord").SuppliedEmail;
            var suppliedPhone = component.get("v.CaseRecord").SuppliedPhone;
            console.log("in onfocus");
            console.log(term);
            console.log(suppliedEmail);
            console.log(suppliedPhone);
            var ToOpen3 = component.find("toOpen3");
            $A.util.removeClass(ToOpen3, "slds-is-open");
            var ToOpen2 = component.find("toOpen2");
            $A.util.removeClass(ToOpen2, "slds-is-open");
            var action = component.get("c.lookUp");
                action.setParams({
                    "searchTerm": term,
                    "myObject": 'Account',
                    "suppliedEmail": suppliedEmail,
                    "suppliedPhone" : suppliedPhone
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

            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpen");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        } else if (component.get("v.sObject") == "ER_Financial_Center__c") {
            var ToOpen3 = component.find("toOpen3");
            $A.util.removeClass(ToOpen3, "slds-is-open");
            var ToOpen2 = component.find("toOpen");
            $A.util.removeClass(ToOpen2, "slds-is-open");
            var selAccount = component.get("v.selected");
            var selCircuit = component.get("v.selectedCircuit");
            var recordTypeId = component.get("v.RecordTypeIdCase");
            console.log('RecordTypeIdCase '+recordTypeId);
            var addFilter;
            if (selCircuit != null && selCircuit.length > 0) {
                addFilter = selCircuit[0].Id;
            } else if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
            }
            console.log("POPULATED ACCOUNT:: " + addFilter);
            if (addFilter != null) {
                var action = component.get("c.lookUp3");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter,
                    "recordTypeId" : recordTypeId
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log("RESULT:: " + result);
                        if (result != null) {
                            component.set("v.finList", result);
                            console.log("finlist:: " + component.get("v.finList"));
                            var ToOpen = component.find("toOpen2");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                var term = component.get("v.sTermfin");
                var returnedResults = component.get("v.finList");
                console.log("FINLIST:: " + returnedResults);
                console.log("in onfocus");
                console.log(term);
                if (returnedResults.length > 0) {
                    var ToOpen = component.find("toOpen2");
                    $A.util.addClass(ToOpen, "slds-is-open");
                }
            }

        } else if (component.get("v.sObject") == "IT_Circuit__c") {
            var ToOpen3 = component.find("toOpen");
            $A.util.removeClass(ToOpen3, "slds-is-open");
            var ToOpen2 = component.find("toOpen2");
            $A.util.removeClass(ToOpen2, "slds-is-open");
            var selAccount = component.get("v.selected");
            var addFilter;
            if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
            }
            if (addFilter != null) {
                var action = component.get("c.lookUp2");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log("RESULT:: " + result);
                        if (result != null) {
                            component.set("v.circList", result);
                            console.log("circList:: " + component.get("v.circList"));
                            var ToOpen = component.find("toOpen3");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            }else {
            var term = component.get("v.sTermcirc");
            var returnedResults = component.get("v.circList");
            console.log("in onfocus");
            console.log(term);
            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpen3");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        }
        } else if (component.get("v.sObject") == "Contact") {
            var ToOpen3 = component.find("toOpen");
            $A.util.removeClass(ToOpen3, "slds-is-open");
            var ToOpen2 = component.find("toOpen2");
            $A.util.removeClass(ToOpen2, "slds-is-open");
            var ToOpen = component.find("toOpen3");
            $A.util.removeClass(ToOpen, "slds-is-open");
            var selAccount = component.get("v.selected");
            var addFilter;
            if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
            }
            if (addFilter != null) {
                //TODO AGGIUNGERE ANCHE MAIL E PHONE
                var action = component.get("c.lookUpContact");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log("RESULT:: " + result);
                        if (result != null) {
                            component.set("v.contactList", result);
                            console.log("contactList:: " + component.get("v.contactList"));
                            var ToOpenC = component.find("toOpenContact");
                            $A.util.addClass(ToOpenC, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            }else {
            var term = component.get("v.sTermContact");
            var returnedResults = component.get("v.contactList");
            console.log("in onfocus");
            console.log(term);
            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpenContact");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        }
        }

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

        } else if (ObjType == 'a07') {
            component.set("v.selectedFinCenter", null);

            var Input = component.find("input2");
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pill2");
            $A.util.addClass(lookupPill, "slds-hide");

        } else if (ObjType == 'a0O') {
            component.set("v.selectedCircuit", null);

            var Input = component.find("input3");
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pill3");
            $A.util.addClass(lookupPill, "slds-hide");

        } else if (ObjType == '003') {
            component.set("v.selectedContact", null);

            var Input = component.find("inputContact");
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillContact");
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
        } else if (Object == "ER_Financial_Center__c") {
            var lookupEventToParent = event.getParam("FinCenter");
            /* selectedValue attribute is used to de duplicate the list box options in dropdown after selecting a value. so that the value does not repeat in box after selecting once*/

            console.log("In event handler");
            console.log(JSON.stringify(lookupEventToParent));
            var singleSel = component.get("v.singleSelect");
            var selectedLookupCirc = [];
            var selectedLookupacc = [];
            var selectedList = [];
            //var existing = component.get("v.selected");
            selectedList.push(lookupEventToParent);
            selectedLookupCirc.push(lookupEventToParent.IT_Circuit__r);
            selectedLookupacc.push(lookupEventToParent.ER_Account_Name__r);
            console.log(JSON.stringify(selectedList));
            component.set("v.selectedFinCenter", selectedList);

            if (selectedLookupacc != null && selectedLookupacc != undefined ) {

                component.set("v.selected", selectedLookupacc);
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
            if (lookupEventToParent.IT_Circuit__r != null) {

                component.set("v.selectedCircuit", selectedLookupCirc);
                var Input3 = component.find("input3");
                $A.util.addClass(Input3, "slds-hide");

                var lookupPill3 = component.find("lookup-pill3");
                $A.util.removeClass(lookupPill3, "slds-hide");

                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {
                    clearTimeout(blurTimeout);
                }
                var ToOpen3 = component.find("toOpen3");
                $A.util.removeClass(ToOpen3, "slds-is-open");
                //Empty Search string
                component.set("v.sTermcirc", "");

            }

            var Input2 = component.find("input2");
            $A.util.addClass(Input2, "slds-hide");

            var lookupPill2 = component.find("lookup-pill2");
            $A.util.removeClass(lookupPill2, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen2 = component.find("toOpen2");
            $A.util.removeClass(ToOpen2, "slds-is-open");
            //Empty Search string
            component.set("v.sTermfin", "");
        } else if (Object == "IT_Circuit__c") {
            var lookupEventToParent = event.getParam("Circuit");
            /* selectedValue attribute is used to de duplicate the list box options in dropdown after selecting a value. so that the value does not repeat in box after selecting once*/

            console.log("In event handler");
            console.log(JSON.stringify(lookupEventToParent));
            var singleSel = component.get("v.singleSelect");

            var lookupAcc = [];
            var selectedList = [];
            //var existing = component.get("v.selected");
            selectedList.push(lookupEventToParent);
            lookupAcc.push(lookupEventToParent.IT_Account__r);
            console.log(JSON.stringify(selectedList));
            if (lookupEventToParent.IT_Account__r) {

                component.set("v.selected", lookupAcc);
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
            component.set("v.selectedCircuit", selectedList);

            var Input = component.find("input3");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pill3");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpen3");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermcirc", "");
        } else if (Object == "Contact") {
            var lookupEventToParent = event.getParam("Contact");
            /* selectedValue attribute is used to de duplicate the list box options in dropdown after selecting a value. so that the value does not repeat in box after selecting once*/

            console.log("In event handler");
            console.log(JSON.stringify(lookupEventToParent));
            var singleSel = component.get("v.singleSelect");

            var lookupAcc = [];
            var selectedList = [];
            //var existing = component.get("v.selected");
            selectedList.push(lookupEventToParent);
            lookupAcc.push(lookupEventToParent.IT_Account__r);
            console.log(JSON.stringify(selectedList));
            if (lookupEventToParent.IT_Account__r) {

                component.set("v.selectedContact", lookupAcc);
                var Input = component.find("inputContact");
                $A.util.addClass(Input, "slds-hide");

                var lookupPill = component.find("lookup-pillContact");
                $A.util.removeClass(lookupPill, "slds-hide");

                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {
                    clearTimeout(blurTimeout);
                }
                var ToOpen = component.find("toOpenContact");
                $A.util.removeClass(ToOpen, "slds-is-open");
                //Empty Search string
                component.set("v.sTermContact", "");

            }
            component.set("v.selectedContact", selectedList);

            var Input = component.find("inputContact");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillContact");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenContact");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermContact", "");
        }


    },

    onSubmit: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var accoSelect = component.get("v.selected");
        var circSelect = component.get("v.selectedCircuit");
        var finSelect = component.get("v.selectedFinCenter");
        var accId;
        var finId;
        var circId = null;
        if(accoSelect != null && accoSelect.length > 0){
            accId = accoSelect[0].Id;
        }
        if(finSelect != null && finSelect.length > 0){
            finId = finSelect[0].Id;
        }
        if(circSelect != null && circSelect.length > 0){
            circId = circSelect[0].Id;
        }
        console.log('circuito ' +circId);
        var action = component.get("c.saveRecord");
                action.setParams({
                    "accountId": accId,
                    "finCenterId": finId,
                    "circuitId": circId,
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
                        $A.get('e.force:refreshView').fire();
                        console.log('torna qualcosa? '+ response.getReturnValue());
                    }
                    else{
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(action);
        
		//this.onSubmitContact(component, event, helper);
    },
    
    onSubmitContact: function (component, event, helper) {
         console.log('sono in onSubmit Contact');
       	var finalContactid = '';
        var contEmail = component.get('v.contactEmail');
         console.log('sono in onSubmit Contact1');
        var contPhone = component.get('v.contactPhone');
         console.log('sono in onSubmit Contact2');
        var contName = component.get('v.sTermContact');
         console.log('sono in onSubmit Contact3');
        var initContactId = component.get('v.initContactId');
         console.log('sono in onSubmit Contact4');
        var selectedContact = component.get('v.selectedContact');
        console.log('sono in onSubmit ContactSELECT'+JSON.stringify(selectedContact));
        var contactId = null;
        if(selectedContact != null && selectedContact != undefined && selectedContact.length > 0){
            contactId = selectedContact[0].Id;
        }
        var action = component.get("c.saveRecordContact");       
                action.setParams({
                    caseId:component.get('v.recordId'),
                    initContactId: initContactId == undefined || initContactId == null ? null : initContactId,
                    selectedContactId: contactId,
                    contactName: contName == undefined || contName == null ? null : contName,
                    contactEmail: contEmail == undefined || contEmail == null ? null : contEmail,
                    contactPhone: contPhone == undefined || contPhone == null ? null : contPhone
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log('vediamo lo stato '+state);
                    if (state === "SUCCESS") {
                        console.log('ma sono dentro lif?');
                        console.log('vediamo cosa ritorna '+ JSON.stringify(response.getReturnValue()));
                        
                        component.set('v.sTermContact','');
                        
                        	//var childCmp = component.find("compFiglio");
 								//childCmp.doInit();
                        
                      
                    }
                    else{
                        console.log(JSON.stringify(response.getError()));
                    }
                });
                $A.enqueueAction(action);
        		

    }

})