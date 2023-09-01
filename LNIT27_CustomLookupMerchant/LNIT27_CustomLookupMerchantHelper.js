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
                component.set("v.CaseRecordEmail",currentCase.SuppliedEmail);
                component.set("v.CaseRecordPhone",currentCase.SuppliedPhone);
                var selectedStore = [];
                var selectedacc = [];
				var selectedFin = [];
				var selectedPos = [];
				var selectedCon = [];
				if(currentCase.ER_Store__r != null){
                    selectedStore.push(currentCase.ER_Store__r);
                    component.set("v.selectedStore" , selectedStore);
                    var Input = component.find("inputStore");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillStore");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenStore");
                    $A.util.removeClass(ToOpen, "slds-is-open");

                }
                if(currentCase.Account != null){
                    selectedacc.push(currentCase.Account);
                    component.set("v.selectedAcc" , selectedacc);
                    
                    var Input = component.find("inputAcc");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillAcc");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenAcc");
                    $A.util.removeClass(ToOpen, "slds-is-open");
                }
                if(currentCase.IT_Financial_Center__r != null){ 
                    // console.log('currentCase FC1 '+ JSON.stringify(currentCase.IT_Financial_Center__r) );
                    // if(currentCase.IT_Financial_Center__r.IT_Merchant_Status__c != null) {
                    //     currentCase.IT_Financial_Center__r.newLabel = currentCase.IT_Financial_Center__r.Name +' ('+currentCase.IT_Financial_Center__r.IT_Merchant_Status__c+')';
                    // }
                    selectedFin.push(currentCase.IT_Financial_Center__r);
                    
                    component.set("v.selectedFinCenter" , selectedFin);
                    var Input = component.find("inputFinCent");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillFinCent");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenFinCent");
                    $A.util.removeClass(ToOpen, "slds-is-open");

				}
				if(currentCase.ER_Acceptor__r != null){
                    selectedPos.push(currentCase.ER_Acceptor__r);
                   
                    component.set("v.selectedPos" , selectedPos);
                    var Input = component.find("inputPos");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillPos");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenPos");
                    $A.util.removeClass(ToOpen, "slds-is-open");

				}
				if(currentCase.Contact != null){
                    selectedCon.push(currentCase.Contact);
                   
                    component.set("v.selectedContact" , selectedCon);
                    var Input = component.find("inputCon");
                    $A.util.addClass(Input, "slds-hide");
        
                    var lookupPill = component.find("lookup-pillCon");
                    $A.util.removeClass(lookupPill, "slds-hide");
        
                    const blurTimeout = component.get('v.blurTimeout');
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                    }
                    var ToOpen = component.find("toOpenCon");
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
        var accoSelect = component.get("v.selectedAcc");
        var storeSelect = component.get("v.selectedStore");
        var finCentSelect = component.get("v.selectedFinCenter");
        var additionalFilter;
        var filterField;
        var recordTypeId = component.get("v.RecordTypeIdCase");
        // console.log("icon:: " + icon);
        // console.log("Object:: " + selectedObject);
        // console.log("Accoselect:: " + accoSelect);

        if (selectedObject == 'Account') {
            methodName = "c.lookUpAcc"
            term = component.get("v.sTermAcc");
        } else if (selectedObject == 'ER_Financial_Center__c') {
            methodName = "c.lookUpFinCent"
            term = component.get("v.sTermfin");
            // console.log('RecordTypeIdCase '+recordTypeId);

            if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selectedAcc")[0].Id;
                filterField = 'ER_Account_Name__c';
                console.log("FILTER ID "+additionalFilter);
            }

        } else if (selectedObject == 'ER_Store__c') {
            methodName = "c.lookUpStore"
            term = component.get("v.sTermStore");
            if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selectedAcc")[0].Id;
                filterField = 'ER_Financial_Center__r.ER_Account_Name__c';
                console.log("FILTER ID "+additionalFilter);
            }
            else if(finCentSelect != null && finCentSelect.length > 0){
                console.log("FINCENT FOUND");
                additionalFilter = component.get("v.selectedFinCenter")[0].Id;
                filterField = 'ER_Financial_Center__c';
                console.log("FILTER ID "+additionalFilter);
            }
        } else if (selectedObject == 'ER_Acceptor__c') {
            methodName = "c.lookUpPos"
            term = component.get("v.sTermPos");
            if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selectedAcc")[0].Id;
                filterField = 'ER_Store__r.ER_Financial_Center__r.ER_Account_Name__c';
                console.log("FILTER ID "+additionalFilter);
            }
            else if(finCentSelect != null && finCentSelect.length > 0){
                console.log("FINCENT FOUND");
                additionalFilter = component.get("v.selectedFinCenter")[0].Id;
                filterField = 'ER_Store__r.ER_Financial_Center__c';
                console.log("FILTER ID "+additionalFilter);
            }
            else if(storeSelect != null && storeSelect.length > 0){
                console.log("STORE FOUND");
                additionalFilter = component.get("v.selectedStore")[0].Id;
                filterField = 'ER_Store__c';
                console.log("FILTER ID "+additionalFilter);
            }
        } else if (selectedObject == 'Contact') {
            methodName = "c.lookUpCon"
            term = component.get("v.sTermCon");
            if(accoSelect != null && accoSelect.length > 0){
                console.log("ACCOUNT FOUND");
                additionalFilter = component.get("v.selectedAcc")[0].Id;
                filterField = 'AccountId';
                console.log("FILTER ID "+additionalFilter);
            }
            /*else if(finCentSelect != null && finCentSelect.length > 0){
                console.log("FINCENT FOUND");
                additionalFilter = component.get("v.selectedFinCent")[0].Id;
                filterField = 'ER_Store__r.ER_Financial_Center__c';
                console.log("FILTER ID "+additionalFilter);
            }
            else if(storeSelect != null && storeSelect.length > 0){
                console.log("STORE FOUND");
                additionalFilter = component.get("v.selectedStore")[0].Id;
                filterField = 'ER_Store__c';
                console.log("FILTER ID "+additionalFilter);
            }*/
        }
        /*Send this value to server to get values other than in this list*/
        //var selected = component.get("v.selected");
        //console.log("selected");
        // console.log(JSON.stringify(selected));
        console.log("METHOD:: " + methodName);
        var action = component.get(methodName);
		
        if(selectedObject == 'ER_Store__c'){
            action.setParams({
                "searchTerm": term,
                "myObject": selectedObject, //Updated Add this line in your code
                "additionalFilter" : additionalFilter,
                "filterField" : filterField,
                "caseid" : component.get("v.recordId")
            });
        }else{
            action.setParams({
                "searchTerm": term,
                "myObject": selectedObject, //Updated Add this line in your code
                "additionalFilter" : additionalFilter,
                "filterField" : filterField
            });
        }
        
		console.log("NON MI SPACCO:: " + methodName + term);
        if (term.length > 0) {
            action.setCallback(this, function (response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    console.log(JSON.stringify(result));
                    // console.log(result);
                    if (selectedObject == "Account") {
                        component.set("v.accList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenAcc");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenAcc");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "ER_Financial_Center__c") {
                        component.set("v.finList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenFinCent");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenFinCent");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "ER_Store__c") {
                        component.set("v.storeList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenStore");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenStore");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "ER_Acceptor__c") {
                        component.set("v.posList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenPos");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenPos");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                    if (selectedObject == "Contact") {
                        component.set("v.conList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenCon");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenCon");
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
        console.log('onfocus');

        var ToOpenAcc = component.find("toOpenAcc");
        $A.util.removeClass(ToOpenAcc, "slds-is-open");
        var ToOpenFinCent = component.find("toOpenFinCent");
        $A.util.removeClass(ToOpenFinCent, "slds-is-open");
        var ToOpenStore = component.find("toOpenStore");
        $A.util.removeClass(ToOpenStore, "slds-is-open");
        var ToOpenPos = component.find("toOpenPos");
        $A.util.removeClass(ToOpenPos, "slds-is-open");
        var ToOpenCon = component.find("toOpenCon");
        $A.util.removeClass(ToOpenCon, "slds-is-open");
        if (component.get("v.sObject") == "Account") {
            var term = component.get("v.sTermAcc");
            var returnedResults = component.get("v.accList");
            var action = component.get("c.lookUpAcc");
                action.setParams({
                    "searchTerm": term,
                    "myObject": 'Account',
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        // console.log("RESULT:1: " + result);
                        if (result != null) {
                            component.set("v.accList", result);
                            // console.log("accList:: " + component.get("v.conaccListList"));
                            var ToOpen = component.find("toOpenAcc");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);

            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpenAcc");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        } else if (component.get("v.sObject") == "ER_Financial_Center__c") {
            var selAccount = component.get("v.selectedAcc");
            var addFilter;
            if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
            }
            console.log("POPULATED ACCOUNT:: " + addFilter);
            if (addFilter != null) {
                var action = component.get("c.lookUpFinCent");
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
                        // console.log("RESULT2 " + JSON.stringify(result));
                        if (result != null) {
                            component.set("v.finList", result);
                            // console.log("finlist:: " + component.get("v.finList"));
                            var ToOpen = component.find("toOpenFinCent");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                var term = component.get("v.sTermfin");
                var returnedResults = component.get("v.finList");
                console.log("FINLIST:: " + returnedResults);
                // console.log("in onfocus1");
                // console.log(term);
                if (returnedResults.length > 0) {
                    var ToOpen = component.find("toOpenFinCent");
                    $A.util.addClass(ToOpen, "slds-is-open");
                }
            }

        } else if (component.get("v.sObject") == "ER_Store__c") {
            var selAccount = component.get("v.selectedAcc");
            var selFinCent = component.get("v.selectedFinCenter");
            var addFilter;
            var filterField;
            if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
                filterField = 'ER_Financial_Center__r.ER_Account_Name__c';
            }
            else if (selFinCent != null && selFinCent.length > 0) {
                addFilter = selFinCent[0].Id;
                filterField = 'ER_Financial_Center__c';
            }
            //Perchè faccio la action solo se c'è un addfilter? TODO: faccio l'if DOPO aver chiamato la action
            if (addFilter != null) {
                 console.log("addfilter:: " + addFilter);
                 console.log("filterfield:: " + filterField);
                var action = component.get("c.lookUpStore");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter,
                    "filterField" : filterField,
                    "caseid" : component.get("v.recordId")
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        console.log("RESULT3 " + JSON.stringify(result));
                        if (result != null) {
                            component.set("v.storeList", result);
                            // console.log("storeList:: " + component.get("v.storeList"));
                            var ToOpen = component.find("toOpenStore");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                var term = component.get("v.sTermStore");
                var returnedResults = component.get("v.storeList");
                // console.log("in onfocus2");
                // console.log(term);
                if (term && returnedResults.length > 0) {
                    var ToOpen = component.find("toOpenStore");
                    $A.util.addClass(ToOpen, "slds-is-open");
                }
            }       
        } else if (component.get("v.sObject") == "ER_Acceptor__c") {
            var selAccount = component.get("v.selectedAcc");
            var selFinCent = component.get("v.selectedFinCenter");
            var selStore = component.get("v.selectedStore");
            var addFilter;
            var filterField;
            if (selAccount != null && selAccount.length > 0 && (selFinCent==null || selFinCent.length==0 || selStore == null || selStore.length == 0) ) {
                addFilter = selAccount[0].Id;
                filterField = 'ER_Store__r.ER_Financial_Center__r.ER_Account_Name__c';
            }
            else if (selAccount != null && selAccount.length > 0 && selFinCent != null && selFinCent.length > 0 && (selStore == null || selStore.length == 0)) {
                addFilter = selFinCent[0].Id;
                filterField = 'ER_Store__r.ER_Financial_Center__c';
            }
            else if ( selAccount != null && selAccount.length > 0 && selFinCent != null && selFinCent.length > 0 && selStore != null && selStore.length > 0) {
                addFilter = selStore[0].Id;
                filterField = 'ER_Store__c';
            }
            //Perchè faccio la action solo se c'è un addfilter? TODO: faccio l'if DOPO aver chiamato la action
            if (addFilter != null) {
                var action = component.get("c.lookUpPos");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter,
                    "filterField" : filterField
                });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log(state);
                    if (state === "SUCCESS") {
                        var result = response.getReturnValue();
                        // console.log("RESULT:: " + result);
                        console.log("RESULT:4 " + JSON.stringify(result));
                        if (result != null) {
                            component.set("v.posList", result);
                            // console.log("posList:: " + component.get("v.posList"));
                            var ToOpen = component.find("toOpenPos");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                var term = component.get("v.sTermPos");
                var returnedResults = component.get("v.posList");
                console.log("in onfocus3");
                console.log(term);
                if (term && returnedResults.length > 0) {
                    var ToOpen = component.find("toOpenPos");
                    $A.util.addClass(ToOpen, "slds-is-open");
                }
            }       
        } else if (component.get("v.sObject") == "Contact") {
            var selAccount = component.get("v.selectedAcc");
            var addFilter;
            var filterField;
            if (selAccount != null && selAccount.length > 0) {
                addFilter = selAccount[0].Id;
                filterField = 'AccountId';
            }
            //Perchè faccio la action solo se c'è un addfilter? TODO: faccio l'if DOPO aver chiamato la action
            if (addFilter != null) {
                var action = component.get("c.lookUpStore");
                action.setParams({
                    "searchTerm": null,
                    "myObject": null,
                    "additionalFilter": addFilter,
                    "filterField" : filterField,
                    "caseid" : null
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
                            var ToOpen = component.find("toOpenCon");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                var term = component.get("v.sTermCon");
                var returnedResults = component.get("v.conList");
                console.log("in onfocus4");
                console.log(term);
                if (term && returnedResults.length > 0) {
                    var ToOpen = component.find("toOpenCon");
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
        var toFind = '';
        var pillToFind = '';
        var toRemove = '';	
        switch(ObjType) {
          case '001':
            toRemove = 'v.selectedAcc';
            toFind = 'inputAcc';
            pillToFind = 'lookup-pillAcc';
            break;
          case 'a07':
            toRemove = 'v.selectedFinCenter';
            toFind = 'inputFinCent';
            pillToFind = 'lookup-pillFinCent';
            break;
          case 'a09':
            toRemove = 'v.selectedStore';
            toFind = 'inputStore';
            pillToFind = 'lookup-pillStore';

            var Input = component.find(toFind);
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find(pillToFind);
            $A.util.addClass(lookupPill, "slds-hide");

            component.set(toRemove, null);

            toRemove = 'v.selectedPos';

            var Input = component.find('inputPos');
            $A.util.removeClass(Input, "slds-hide");

            var lookupPill = component.find('lookup-pillPos');
            $A.util.addClass(lookupPill, "slds-hide");

            break;
          case 'a00':
            toRemove = 'v.selectedPos';
            toFind = 'inputPos';
            pillToFind = 'lookup-pillPos';
            break;
          case '003':
            toRemove = 'v.selectedContact';
            toFind = 'inputCon';
            pillToFind = 'lookup-pillCon';
            break;
          default:
            break;
        } 

        component.set(toRemove, null);

        var Input = component.find(toFind);
        $A.util.removeClass(Input, "slds-hide");

        var lookupPill = component.find(pillToFind);
        $A.util.addClass(lookupPill, "slds-hide");

    },

    handleEvent: function (component, event, helper) {
        var Object = component.get("v.sObject");
        var selectedLookupFinCent = [];
        var selectedLookupacc = [];
        var selectedLookupStore = [];
        var selectedLookupContact = [];
        var selectedLookupPos = [];
        
        if (Object == "Account") {
            var lookupEventToParent = event.getParam("selectedItem");
            /* selectedValue attribute is used to de duplicate the list box options in dropdown after selecting a value. so that the value does not repeat in box after selecting once*/

            // console.log("In event handler1");
            console.log(JSON.stringify(lookupEventToParent));
            var singleSel = component.get("v.singleSelect");

            var selectedList = [];
            //var existing = component.get("v.selected");
            selectedList.push(lookupEventToParent);
            // console.log(JSON.stringify(selectedList));
            component.set("v.selectedAcc", selectedList);

            var Input = component.find("inputAcc");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillAcc");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenAcc");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermAcc", "");
        } else if (Object == "ER_Financial_Center__c") {
            var lookupEventToParent = event.getParam("FinCenter");

            console.log("In event handler2");
            console.log(JSON.stringify(lookupEventToParent));

            // if(lookupEventToParent.hasOwnProperty('IT_Merchant_Status__c')) {
            //     lookupEventToParent.newLabel = lookupEventToParent.Name +' ('+lookupEventToParent.IT_Merchant_Status__c+')';
            //     console.log('yes Merchant');
            // }
            // else {
            //     lookupEventToParent.newLabel = lookupEventToParent.Name;
            //     console.log('no');
            // }

            var selectedList = [];
            selectedList.push(lookupEventToParent);
            selectedLookupFinCent.push(lookupEventToParent);
            selectedLookupacc.push(lookupEventToParent.ER_Account_Name__r);
            // console.log(JSON.stringify(selectedList));

        } 
        else if (Object == "ER_Store__c") {
            var lookupEventToParent = event.getParam("Store");

            console.log("In event handler3");
            // console.log('testjson '+ JSON.stringify(lookupEventToParent));
            var selectedList = [];
            selectedList.push(lookupEventToParent);
            selectedLookupFinCent.push(lookupEventToParent.ER_Financial_Center__r);
            selectedLookupacc.push(lookupEventToParent.ER_Financial_Center__r.ER_Account_Name__r);
            selectedLookupStore.push(lookupEventToParent);
            // console.log(JSON.stringify(selectedList));

        } 
        else if (Object == "ER_Acceptor__c") {
            var lookupEventToParent = event.getParam("Pos");

            console.log("In event handler4");
            // console.log('*1 '+JSON.stringify(lookupEventToParent));
            var selectedList = [];
            selectedList.push(lookupEventToParent);
            selectedLookupFinCent.push(lookupEventToParent.ER_Store__r.ER_Financial_Center__r);
            selectedLookupacc.push(lookupEventToParent.ER_Store__r.ER_Financial_Center__r.ER_Account_Name__r);
            selectedLookupPos.push(lookupEventToParent);
            selectedLookupStore.push(lookupEventToParent.ER_Store__r);
            // console.log('*2 '+JSON.stringify(selectedList));

        } 
        else if (Object == "Contact") {
            var lookupEventToParent = event.getParam("Contact");

            console.log("In event handler5");
            // console.log(JSON.stringify(lookupEventToParent));
            var selectedList = [];
            selectedList.push(lookupEventToParent);
            selectedLookupContact.push(lookupEventToParent);
            selectedLookupacc.push(lookupEventToParent.Account);
            // console.log(JSON.stringify(selectedList));

        } 


        if (selectedLookupacc != null && selectedLookupacc != undefined && selectedLookupacc.length > 0 ) {
            console.log("Account found EVENT");
            component.set("v.selectedAcc", selectedLookupacc);
            var Input = component.find("inputAcc");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillAcc");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenAcc");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermAcc", "");

        }
        if (selectedLookupFinCent != null && selectedLookupFinCent != undefined && selectedLookupFinCent.length > 0) {
            console.log("FINCENT found EVENT");
            // console.log('fff2 '+JSON.stringify(selectedLookupFinCent[0]));
            // if(selectedLookupFinCent[0].hasOwnProperty('IT_Merchant_Status__c')) {
            //     selectedLookupFinCent[0].newLabel = selectedLookupFinCent[0].Name +' ('+selectedLookupFinCent[0].IT_Merchant_Status__c+')';
            // }
            // else {
            //     selectedLookupFinCent[0].newLabel = selectedLookupFinCent[0].Name;
            // }

            component.set("v.selectedFinCenter", selectedLookupFinCent);
            var Input = component.find("inputFinCent");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillFinCent");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenFinCent");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermfin", "");

        }
        if (selectedLookupStore != null && selectedLookupStore != undefined && selectedLookupStore.length > 0) {
            console.log("STORE found EVENT");
            component.set("v.selectedStore", selectedLookupStore);
            var Input = component.find("inputStore");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillStore");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenStore");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermStore", "");

        }
        if (selectedLookupPos != null && selectedLookupPos != undefined && selectedLookupPos.length > 0) {
            console.log("POS found EVENT");
            component.set("v.selectedPos", selectedLookupPos);
            var Input = component.find("inputPos");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillPos");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenPos");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermPos", "");

        }
        if (selectedLookupContact != null && selectedLookupContact != undefined && selectedLookupContact.length > 0) {
            console.log("CONTACT found EVENT");
            component.set("v.selectedContact", selectedLookupContact);
            var Input = component.find("inputCon");
            $A.util.addClass(Input, "slds-hide");

            var lookupPill = component.find("lookup-pillCon");
            $A.util.removeClass(lookupPill, "slds-hide");

            const blurTimeout = component.get('v.blurTimeout');
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            var ToOpen = component.find("toOpenCon");
            $A.util.removeClass(ToOpen, "slds-is-open");
            //Empty Search string
            component.set("v.sTermCon", "");

        }

    },

    onSubmit: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var accoSelect = component.get("v.selectedAcc");
        var storeSelect = component.get("v.selectedStore");
        var finSelect = component.get("v.selectedFinCenter");
        var posSelect = component.get("v.selectedPos");
        var conSelect = component.get("v.selectedContact");
        var accId;
        var finId;
        var conId;
        var storeId;
        var posId;
        console.log('onSubmit*** ' +JSON.stringify(finSelect));
        if(accoSelect != null && accoSelect.length > 0){
            accId = accoSelect[0].Id;
            console.log('accId:accoSelect[0].Id'+ accoSelect[0].Id);
        }
        if(finSelect != null && finSelect.length > 0){
            finId = finSelect[0].Id;
            console.log('finId:finSelect[0].Id'+ finSelect[0].Id);
        }
        if(storeSelect != null && storeSelect.length > 0){
            storeId = storeSelect[0].Id;
            console.log('storeId:storeSelect[0].Id'+ storeSelect[0].Id);
        }
        if(posSelect != null && posSelect.length > 0){
            posId = posSelect[0].Id;
        }
        if(conSelect != null && conSelect.length > 0){
            conId = conSelect[0].Id;
        }
        var action = component.get("c.saveRecord");
                action.setParams({
                    "accountId": accId,
                    "finCenterId": finId,
                    "storeId": storeId,
                    "posId": posId,
                    "contactId": conId,
                    "caseId" : component.get("v.recordId")
                });
                console.log('storeId prima chiamata::'+ storeId);
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    console.log('state::'+state);
                    console.log('storeId successo::'+ storeId);
                    if (state === "SUCCESS") {
                        workspaceAPI.getFocusedTabInfo().then(function (response) {
                            var focusedTabId = response.tabId;
                            workspaceAPI.refreshTab({
                                tabId: focusedTabId,
                                includeAllSubtabs: false
                            });
                        });
                        console.log('storeId dopo chiamata::'+ storeId);
                        console.log('torna qualcosa? '+ response.getReturnValue());
                    }
                    else{
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(action);
    },
    

})