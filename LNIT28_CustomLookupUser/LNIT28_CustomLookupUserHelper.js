({  
doInit: function (component, event, helper) {
    var caseId = component.get("v.recordId");
    var action = component.get("c.populateValues");
    // console.log("doInit CASEID "+caseId);
    action.setParams({"recordId" : caseId});
    action.setCallback(this, function (response) {
        var state = response.getState();
        console.log(state);
        if (state === "SUCCESS") {
            var currentCase = response.getReturnValue();
            console.log('doInit currentCase::'+JSON.stringify(currentCase));
            component.set('v.RecordTypeIdCase',currentCase.RecordTypeId);
            component.set("v.CaseRecord",currentCase);
            if (currentCase.hasOwnProperty('SuppliedEmail')) {
                component.set("v.CaseRecordEmail",currentCase.SuppliedEmail); }
            if (currentCase.hasOwnProperty('SuppliedPhone')) {
                component.set("v.CaseRecordPhone",currentCase.SuppliedPhone);}
            if (currentCase.hasOwnProperty('ER_Employee__r')) {
                component.set("v.EmployeeIdCase", currentCase.ER_Employee__r.Id);
                if (currentCase.ER_Employee__r.hasOwnProperty('IT_Circuit__c')) { // rp 2023.06.07
                    component.set("v.assetCiruit",currentCase.ER_Employee__r.IT_Circuit__c);}

                if (currentCase.ER_Employee__r.hasOwnProperty('ER_Personal_Email__c')) {
                    component.set("v.EmplRecordEmail",currentCase.ER_Employee__r.ER_Personal_Email__c);}
                if (currentCase.ER_Employee__r.hasOwnProperty('ER_Personal_Email__c')) {
                    component.set("v.EmplRecordEmail",currentCase.ER_Employee__r.ER_Personal_Email__c);}
                if (currentCase.ER_Employee__r.hasOwnProperty('IT_PersonMobilePhone__c')) {
                    component.set("v.EmplRecordPhone",currentCase.ER_Employee__r.IT_PersonMobilePhone__c);}
                if (currentCase.ER_Employee__r.hasOwnProperty('IT_CRM_Email__c')) {
                    // component.set("v.EmplCRMEmail",currentCase.ER_Employee__r.IT_CRM_Email__c);
                    component.set("v.sTermCRMEmail",currentCase.ER_Employee__r.IT_CRM_Email__c);
                }
                if (currentCase.ER_Employee__r.hasOwnProperty('IT_CRM_Phone__c')) {
                    // component.set("v.EmplCRMPhone",currentCase.ER_Employee__r.IT_CRM_Phone__c);
                    component.set("v.sTermCRMPhone",currentCase.ER_Employee__r.IT_CRM_Phone__c);
                }
            }
            if (currentCase.hasOwnProperty('IT_User_Product__c')) {
                var newLabel = '';
                let tabPrd = component.get("v.prodListDflt");
                for (let tp of tabPrd){
                    if (tp.Name.includes(currentCase.IT_User_Product__c)) {
                        newLabel = tp.Label;
                    }
                };
                component.set("v.selectedProd", [{"Id":"PPP","Label": newLabel, "Name": currentCase.IT_User_Product__c}]);
            }
            var selectedAsset = [];
            var selectedAcc = [];
            var selectedIndividual = [];
            if(currentCase.AssetId != null){
                // console.log("**currentCase.AssetId");
                let el=currentCase.Asset;
                var tabPrd = component.get("v.prodListDflt");
                let newName = ''; 
                for (let tp of tabPrd){if (el.IT_FID_Product__c == tp.Name) {newName+=tp.Label; break;}};
                if(el.hasOwnProperty('Description')){newName+=' - '+el.Description;}
                if(el.hasOwnProperty('ER_Individual__r')){newName+=' - '+el.ER_Individual__r.Name;}
                if(el.hasOwnProperty('IT_Circuit_Code__c')){
                    newName+=' - '+el.IT_Circuit_Code__c;
                }
                if(el.hasOwnProperty('IT_Card_Face_Value__c')){newName+=' - '+el.IT_Card_Face_Value__c;}
                newName+=this.frmtDateSc(el.ER_Card_Activation_Date__c,el.ER_Card_Expiration_Date__c,el.Status);
                currentCase.Asset.Name=newName;
                currentCase.Asset.AccountId=currentCase.AccountId;
                if(el.Status=='DISATTIVATA MANUALME'){
                    currentCase.Asset.flgClr=true;
                    var lookupPill = component.find("lookup-pillAsset");
                    $A.util.addClass(lookupPill, "clsrpClr2");
                }else currentCase.Asset.flgClr=false;
                selectedAsset.push(currentCase.Asset);
                component.set("v.selectedAsset" , selectedAsset);
                var Input = component.find("inputAsset");
                $A.util.addClass(Input, "slds-hide");
                var lookupPill = component.find("lookup-pillAsset");
                $A.util.removeClass(lookupPill, "slds-hide");
                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {clearTimeout(blurTimeout);}
                var ToOpen = component.find("toOpenAsset");
                $A.util.removeClass(ToOpen, "slds-is-open");
            }
            if(currentCase.Account != null){
                selectedAcc.push(currentCase.Account);
                component.set("v.selectedAcc" , selectedAcc);
                var Input = component.find("inputAcc");
                $A.util.addClass(Input, "slds-hide");
                var lookupPill = component.find("lookup-pillAcc");
                $A.util.removeClass(lookupPill, "slds-hide");
                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {clearTimeout(blurTimeout);}
                var ToOpen = component.find("toOpenAcc");
                $A.util.removeClass(ToOpen, "slds-is-open");
            }
            if(currentCase.IT_User_Product__c != null){
                var Input = component.find("inputProd");
                $A.util.addClass(Input, "slds-hide");
                var lookupPill = component.find("lookup-pillProd");
                $A.util.removeClass(lookupPill, "slds-hide");
                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {clearTimeout(blurTimeout); }
                var ToOpen = component.find("toOpenProd");
                $A.util.removeClass(ToOpen, "slds-is-open");
            }
            if(currentCase.ER_Individual__r != null){
                selectedIndividual.push(currentCase.ER_Individual__r);
                component.set("v.selectedIndividual" , selectedIndividual);
                var Input = component.find("inputIndividual");
                $A.util.addClass(Input, "slds-hide");
                var lookupPill = component.find("lookup-pillIndividual");
                $A.util.removeClass(lookupPill, "slds-hide");
                const blurTimeout = component.get('v.blurTimeout');
                if (blurTimeout) {clearTimeout(blurTimeout);}
                var ToOpen = component.find("toOpenIndividual");
                $A.util.removeClass(ToOpen, "slds-is-open");
            }
        }
    });
    $A.enqueueAction(action);
},
onchange: function (component, event, helper) {
    // console.log("onchange ");
    var icon = component.get("v.iconName");
    var selectedObject = component.get("v.sObject");
    var methodName = "test";
    var term = "test";
    var additionalFilter;
    var filterField; // null
    var recordTypeId = component.get("v.RecordTypeIdCase");
    var lastName ='';
    var card ='';
    // console.log("Object:: " + selectedObject);
    if(selectedObject == 'Individual'){
        methodName = "c.lookUpIndividual"
        term = component.get("v.sTermIndividual");
    } else if (selectedObject == 'Account') {
        methodName = "c.lookUpAcc"
        term = component.get("v.sTermAcc");
    } else if (selectedObject == 'Product') {
        methodName = "c.lookUpProduct"
        term = component.get("v.sTermProd");
        component.set("v.prodList", null);
    } else if (selectedObject == 'Asset') {
        methodName = "c.lookUpAsset"
        term = component.get("v.sTermAsset");
        var accoSelect = component.get("v.selectedAcc");
        var prodSelect = component.get("v.selectedProd");
        var individualSelect = component.get("v.selectedIndividual");
        if(accoSelect != null && accoSelect.length > 0){
            // console.log("ACCOUNT FOUND");
            additionalFilter = ' AccountId = \'' + component.get("v.selectedAcc")[0].Id +'\'';
        }
        if(prodSelect != null && prodSelect.length > 0){
            // console.log("PRODUCT FOUND");
            if (additionalFilter) {additionalFilter += ' AND ';}
            else additionalFilter ='';
            additionalFilter += ' IT_FID_Product__c = \'' + component.get("v.selectedProd")[0].Name +'\'';
        }
        if(individualSelect != null && individualSelect.length > 0){
            // console.log("INDIVIDUAL FOUND");
            if (additionalFilter) {additionalFilter += ' AND ';}
            else additionalFilter ='';
            additionalFilter += ' ER_Individual__c = \'' + component.get("v.selectedIndividual")[0].Id +'\'';
        }
        // console.log("****onchange Asset additionalFilter: "+additionalFilter);
    }
    term=term.trim();
    if (selectedObject == 'Asset') { 
        let pos=term.search(" "); // src per cognome
        if (pos>=0) {
            lastName=term.substring(pos).trim();
            if (lastName != '') term=term.trim().substring(0, pos);
        }
        pos=term.search("-"); // src per circuito-tessera
        if (pos>=0) {
            card=term.substring(pos + 1);
            if (card != '') term=term.substring(0, pos);
        }
    }
    // console.log('**ln*> '+term+'*'+lastName+'*'+card);

    // console.log("term::" + term);
    // console.log("selectedObject::" + selectedObject);
    // console.log("methodName::" + methodName);
    // console.log("additionalFilter::" + additionalFilter);
    // console.log("lastName::" + lastName);
    // console.log("card::" + card);
    var action = component.get(methodName);
    action.setParams({
        "searchTerm": term,
        "myObject": selectedObject,
        "additionalFilter" : additionalFilter,
        "lastName" : lastName,
        "card" : card
    });
    if (term.length > 0) {
        // console.log("in term.length");
        action.setCallback(this, function (response) {
            var state = response.getState();
            // console.log('onchange '+state+' * '+term );
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                // console.log('result:onchange:6::'+JSON.stringify(result));
                // console.log('chg1 '+result.length +'*'+ term.length +'*'+ selectedObject)
                if (result.length==0 && term.length > 0 ) {
                    if (selectedObject == 'Asset') {
                        let msgErr1=selectedObject +" : < "+ term +" > non trovato";
                        if (lastName != '') {
                            msgErr1="Asset : < "+term+" >  e  Cognome : < "+lastName+" >\n\nNon trovati.";
                        }
                        component.find('notifLib').showToast({
                            "variant": 'info',
                            "message": msgErr1
                        });
                    }
                    if (selectedObject == 'Individual') {
                        component.find('notifLib').showToast({
                            "variant": 'info',
                            "message": "Individual : < "+ term +" > non trovato"
                        });
                    } 
                } else {
                    if (selectedObject == "Account") {
                        // console.log("**Onchange Account");
                        component.set("v.accList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenAcc");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenAcc");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    } else
                    if (selectedObject == "Product") {
                        let resultNew=[];
                        let termNew=term.toUpperCase();
                        let result2=component.get("v.prodListDflt");
                        result2.forEach(function (el) {
                            if (el.Label.toUpperCase().includes(termNew)) {
                                resultNew.push(el);
                            }
                        });
                        component.set("v.prodList", resultNew);
                        // console.log("prodList:new: " + JSON.stringify(component.get("v.prodList")) );
                        if (term != "" && resultNew.length > 0) {
                            var ToOpen = component.find("toOpenProd");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenProd");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    } else
                    if (selectedObject == "Asset") {
                        function fDIta(ymd){
                            let d=new Date(ymd);
                            let month=String(d.getMonth() + 1);
                            let day=String(d.getDate());
                            const year=String(d.getFullYear());
                            if(month.length<2)month='0'+month;
                            if(day.length<2)day='0'+day;
                            return `${day}/${month}/${year}`;
                        }
                        // component.set("v.assetList",this.listatoAsset(result,component.get("v.prodListDflt")));
                        let tabPrd = component.get("v.prodListDflt");
                        let resultNew=[];
                        let resultSort=[];
                        for(let el of result){
                            if(!el.hasOwnProperty('IT_FID_Product__c') || (el.IT_FID_Product__c=='BENEF' || el.IT_FID_Product__c=='ETC' || el.IT_FID_Product__c=='SALESFORCE')) {
                                continue;}
                            let newName = ''; 
                            for (let tp of tabPrd){if (el.IT_FID_Product__c == tp.Name) {newName+=tp.Label; break;}};
                            if(el.hasOwnProperty('Description')){newName+=' - '+el.Description; }
                            if(el.hasOwnProperty('ER_Individual__r')){newName+=' - '+el.ER_Individual__r.Name;}
                            if(el.hasOwnProperty('IT_Circuit_Code__c')){
                                newName+=' - '+el.IT_Circuit_Code__c;
                            }
                            if(el.hasOwnProperty('IT_Card_Face_Value__c')){newName+=' - '+el.IT_Card_Face_Value__c;}
                            // newName+=this.frmtDateSc(el.ER_Card_Activation_Date__c,el.ER_Card_Expiration_Date__c,el.Status);
                            let dt1=el.ER_Card_Activation_Date__c;
                            let dt2=el.ER_Card_Expiration_Date__c;
                            let stat=el.Status;
                            let din, dfi;
                            if(dt1==null||dt1==undefined)din='No Data';
                            else { //din=this.frmtDateIta(dt1); 
                            din=fDIta(dt1); 
                            }
                            if (dt2==null||dt2==undefined)dfi='No Data';
                            else { //dfi=this.frmtDateIta(dt2); 
                            dfi=fDIta(dt2); 
                            }
                            let rt=din+' - '+dfi;
                            if(rt=='No Data - No Data')rt='';
                            if(stat==null||stat==undefined)stat='Manca Status';
                            rt=' ('+stat.substr(0,12)+' '+rt+')';
                            // return rt;
                            newName+=rt;
                            el.Name=newName;
                            if(el.Status=='DISATTIVATA MANUALME'){
                                el.flgClr=true;
                            }else el.flgClr=false;
                            resultNew.push(el);
                        };
                        resultSort=resultNew.sort((a, b) => (a.IT_FID_Product__c > b.IT_FID_Product__c) ? 1 : (a.IT_FID_Product__c === b.IT_FID_Product__c) 
                            ? ((a.CreatedDate > b.CreatedDate) ? 1 : -1) : -1 )
                            .reverse();
                        component.set("v.assetList",resultSort);
                        // console.log("***v.assetList "+ component.get("v.assetList") );
                        // if (term != "" && result.length > 0) {
                        if (result.length > 0) {
                            var ToOpen = component.find("toOpenAsset");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenAsset");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    } else
                    if (selectedObject == "Individual") {
                        let resultNew=[];
                        let termNew=term.toUpperCase();
                        result.forEach(function (el) {
                            if (el.hasOwnProperty('IT_Fiscal_Code__c') ) {
                                if (el.IT_Fiscal_Code__c.toUpperCase().includes(termNew)) {
                                    el.Name='('+el.IT_Fiscal_Code__c+') '+el.Name;
                                    el.cf='cf';
                                } else el.Name=el.Name+' ('+el.IT_Fiscal_Code__c+')';
                            } else {el.Name=el.Name;}
                            resultNew.push(el);
                        });
                        resultNew.unshift({"Id":"","Name":"New Individual"});
                        result=resultNew;
                        component.set("v.individualList", result);
                        if (term != "" && result.length > 0) {
                            var ToOpen = component.find("toOpenIndividual");
                            $A.util.addClass(ToOpen, "slds-is-open");
                        } else {
                            var ToOpen = component.find("toOpenIndividual");
                            $A.util.removeClass(ToOpen, "slds-is-open");
                        }
                    }
                }
            }

        });
        $A.enqueueAction(action);
    }
},
onblur: function (component, event, helper) {
    // console.log("onblur ");
    const blurTimeout = window.setTimeout(
        $A.getCallback(() => {
            var ToOpenIndividual = component.find("toOpenIndividual");
            $A.util.removeClass(ToOpenIndividual, "slds-is-open");
            var ToOpenProd = component.find("toOpenProd");
            $A.util.removeClass(ToOpenProd, "slds-is-open");
            var ToOpenAcc = component.find("toOpenAcc");
            $A.util.removeClass(ToOpenAcc, "slds-is-open");
            var ToOpenAsset = component.find("toOpenAsset");
            $A.util.removeClass(ToOpenAsset, "slds-is-open");
        }),
        400
    );
},
onfocus: function (component, event, helper) {
    // console.log("onfocus ");
    var ToOpenAcc = component.find("toOpenAcc");
    $A.util.removeClass(ToOpenAcc, "slds-is-open");
    var ToOpenProd = component.find("ToOpenProd");
    $A.util.removeClass(ToOpenProd, "slds-is-open");
    var ToOpenAsset = component.find("toOpenAsset");
    $A.util.removeClass(ToOpenAsset, "slds-is-open");
    var ToOpenIndividual = component.find("toOpenIndividual");
    $A.util.removeClass(ToOpenIndividual, "slds-is-open");
    if (component.get("v.sObject") == "Individual") {
        var term = component.get("v.sTermIndividual");
        var returnedResults = component.get("v.individualList");
        // console.log("term: " + term);
        term=term.trim();
        if (term.length > 0) {
            var action = component.get("c.lookUpIndividual");
            action.setParams({
                "searchTerm": term,
                "myObject": 'Account',
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                // console.log('onfocus '+state+' * '+term );
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    // console.log("RESULT:1: " + JSON.stringify(result));
                    // if (result.length==0) {
                    //     component.find('notifLib').showToast({
                    //         "variant": 'info',
                    //         "message": "Individual : < "+ term +" > non trovato"
                    //     });
                    // }
                    let resultNew=[];
                    let termNew=term.toUpperCase();
                    result.forEach(function (el) {
                        if (el.hasOwnProperty('IT_Fiscal_Code__c') ) {
                            if (el.IT_Fiscal_Code__c.toUpperCase().includes(termNew)) {
                                el.Name='('+el.IT_Fiscal_Code__c+') '+el.Name;
                                el.cf='cf';
                            } else el.Name=el.Name+' ('+el.IT_Fiscal_Code__c+')';
                        } else {el.Name=el.Name;}
                        resultNew.push(el);
                    });
                    resultNew.unshift({"Id":"","Name":"New Individual"});
                    result=resultNew;
                    // console.log("*RESULT:onfocus: "+JSON.stringify(result));
                    if (result != null) {
                        component.set("v.individualList", result);
                        var ToOpen = component.find("toOpenIndividual");
                        $A.util.addClass(ToOpen, "slds-is-open");
                    }
                }
            });
            $A.enqueueAction(action);
        }
        if (term && returnedResults.length > 0) {
            var ToOpen = component.find("toOpenIndividual");
            $A.util.addClass(ToOpen, "slds-is-open");
        }
    } else if (component.get("v.sObject") == "Account") {
        // console.log("onfocus-acco ");
        var selectedObject = component.get("v.sObject");
        var term = component.get("v.sTermAcc");
        term=term.trim();
        var addFilter;
        var filterField;
        // console.log("term: " + term);
        if (term.length > 0) {
            var action = component.get("c.lookUpAcc");
            action.setParams({
                "searchTerm": term,
                "myObject": selectedObject,
                "additionalFilter": addFilter,
                "filterField" : filterField
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                // console.log('onfocus '+state+' * '+term );
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    if (result.length==0) {
                        component.find('notifLib').showToast({
                            "variant": 'info',
                            "message": "Account : < "+ term +" > non trovato"
                        });
                    }
                    // console.log("RESULT:3: " + JSON.stringify(result));
                    if (result != null) {
                        component.set("v.accList", result);
                        // console.log("acclist:: " + component.get("v.accList"));
                        var ToOpen = component.find("toOpenAcc");
                        $A.util.addClass(ToOpen, "slds-is-open");
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            // console.log("????? in onfocus else Account");
            var returnedResults = component.get("v.accList");
            // console.log("ACCLIST:: " + returnedResults);
            if (returnedResults.length > 0) {
                var ToOpen = component.find("toOpenAcc");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        }
    } else if (component.get("v.sObject") == "Product") {
        // console.log("onfocus produ ");
        let inzPord = component.get("v.prodList");
        if ((inzPord == "" && inzPord.length == 0) || inzPord == null) {
            component.set("v.prodList", component.get("v.prodListDflt"));
        }
        var ToOpen = component.find("toOpenProd");
        $A.util.addClass(ToOpen, "slds-is-open");
    } else if (component.get("v.sObject") == "Asset") {
        // console.log("onfocus asset ");
        var term = component.get("v.sTermAsset");
        term=term.trim();
        var accoSelect = component.get("v.selectedAcc");
        var prodSelect = component.get("v.selectedProd");
        var individualSelect = component.get("v.selectedIndividual");
        var additionalFilter;
        var lastName ='';
        var card ='';
        if(accoSelect != null && accoSelect.length > 0){
            // console.log("ACCOUNT FOUND");
            additionalFilter = ' AccountId = \'' + component.get("v.selectedAcc")[0].Id +'\'';
        }
        if(prodSelect != null && prodSelect.length > 0){
            // console.log("PRODUCT FOUND");
            if (additionalFilter) {additionalFilter += ' AND ';}
            else additionalFilter ='';
            additionalFilter += ' IT_FID_Product__c = \'' + component.get("v.selectedProd")[0].Name +'\'';
        }
        if(individualSelect != null && individualSelect.length > 0){
            // console.log("INDIVIDUAL FOUND");
            if (additionalFilter) {additionalFilter += ' AND ';}
            else additionalFilter ='';
            additionalFilter += ' ER_Individual__c = \'' + component.get("v.selectedIndividual")[0].Id +'\'';
        }
        console.log("onfocus Asset:"+term+'*'+additionalFilter);
        if (term.length > 0 || additionalFilter != null) {
            let pos=term.search(" "); // src per cognome
            if (pos>=0) {
                lastName=term.substring(pos).trim();
                if (lastName != '') term=term.trim().substring(0, pos);
            }
            pos=term.search("-"); // src per circuito-tessera
            if (pos>=0) {
                card=term.substring(pos + 1);
                if (card != '') term=term.substring(0, pos);
            }
            // console.log('**ln*> '+term+'*'+lastName+'*'+card);

            var action = component.get("c.lookUpAsset");
            action.setParams({
                "searchTerm": term,
                "myObject": 'Asset',
                "additionalFilter": additionalFilter,
                "lastName" : lastName,
                "card" : card
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                // console.log('**onfocus '+state+' * '+term );
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    // console.log("RESULT:5:: " + JSON.stringify(result));
                    console.log('onf1 '+result.length +'*'+ term.length +'*'+ component.get("v.sObject"))
                    if (result.length==0 && term.length > 0 && component.get("v.sObject") == "Asset") {
                        let msgErr1="Asset : < "+ term +" > non trovato";
                        if (lastName != '') {
                            msgErr1="Asset : < "+term+" >  e  Cognome : < "+lastName+" >\n\nNon trovati.";
                        }
                        component.find('notifLib').showToast({
                            "variant": 'info',
                            "message": msgErr1
                        });
                    }
                    function fDIta(ymd){
                        let d=new Date(ymd);
                        let month=String(d.getMonth() + 1);
                        let day=String(d.getDate());
                        const year=String(d.getFullYear());
                        if(month.length<2)month='0'+month;
                        if(day.length<2)day='0'+day;
                        return `${day}/${month}/${year}`;
                    }
                    // component.set("v.assetList",this.listatoAsset(result,component.get("v.prodListDflt")));
                    let tabPrd = component.get("v.prodListDflt");
                    let resultNew=[];
                    let resultSort=[];
                    for(let el of result){
                        if(!el.hasOwnProperty('IT_FID_Product__c') || (el.IT_FID_Product__c=='BENEF' || el.IT_FID_Product__c=='ETC' || el.IT_FID_Product__c=='SALESFORCE')) {
                            continue;}
                        let newName = ''; 
                        for (let tp of tabPrd){if (el.IT_FID_Product__c == tp.Name) {newName+=tp.Label; break;}};
                        if(el.hasOwnProperty('Description')){newName+=' - '+el.Description; }
                        if(el.hasOwnProperty('ER_Individual__r')){newName+=' - '+el.ER_Individual__r.Name;}
                        if(el.hasOwnProperty('IT_Circuit_Code__c')){
                            newName+=' - '+el.IT_Circuit_Code__c;
                        }
                        if(el.hasOwnProperty('IT_Card_Face_Value__c')){newName+=' - '+el.IT_Card_Face_Value__c;}
                        // newName+=this.frmtDateSc(el.ER_Card_Activation_Date__c,el.ER_Card_Expiration_Date__c,el.Status);
                        let dt1=el.ER_Card_Activation_Date__c;
                        let dt2=el.ER_Card_Expiration_Date__c;
                        let stat=el.Status;
                        let din, dfi;
                        if(dt1==null||dt1==undefined)din='No Data';
                        else { //din=this.frmtDateIta(dt1); 
                        din=fDIta(dt1); 
                        }
                        if (dt2==null||dt2==undefined)dfi='No Data';
                        else { //dfi=this.frmtDateIta(dt2); 
                        dfi=fDIta(dt2); 
                        }
                        let rt=din+' - '+dfi;
                        if(rt=='No Data - No Data')rt='';
                        if(stat==null||stat==undefined)stat='Manca Status';
                        rt=' ('+stat.substr(0,12)+' '+rt+')';
                        // return rt;
                        newName+=rt;
                        el.Name=newName;
                        if(el.Status=='DISATTIVATA MANUALME'){
                            el.flgClr=true;
                        }else el.flgClr=false;
                        resultNew.push(el);
                    };
                    resultSort=resultNew.sort((a, b) => (a.IT_FID_Product__c > b.IT_FID_Product__c) ? 1 : (a.IT_FID_Product__c === b.IT_FID_Product__c) 
                        ? ((a.CreatedDate > b.CreatedDate) ? 1 : -1) : -1 )
                        .reverse();
                    component.set("v.assetList",resultSort);
                    // console.log("**v.assetList "+ component.get("v.assetList") );
                    if (result.length > 0 || additionalFilter != null) {
                        var ToOpen = component.find("toOpenAsset");
                        $A.util.addClass(ToOpen, "slds-is-open");
                    } else {
                        var ToOpen = component.find("toOpenAsset");
                        $A.util.removeClass(ToOpen, "slds-is-open");
                    }
                } else {
                    component.find('notifLib').showToast({
                        "variant": 'info',
                        "message": "Non trovato"
                    });
                }
            });
            $A.enqueueAction(action);
        }
        else {
            // console.log("onfocus else Asset");
            var term = component.get("v.sTermAsset");
            var returnedResults = component.get("v.assetList");
            if (term && returnedResults.length > 0) {
                var ToOpen = component.find("toOpenAsset");
                $A.util.addClass(ToOpen, "slds-is-open");
            }
        }       
    }
},
handleRemoveOnly: function (component, event, helper) {
    // console.log("handleRemoveOnly ");
    var sel = event.getSource().get("v.name");
    var ObjType = sel.Id.toString().substring(0, 3);
    var toFind = '';
    var pillToFind = '';
    var toRemove = '';	
    switch(ObjType) {
    case '001':
        toRemove = 'v.selectedAcc';
        toFind = 'inputAcc';
        pillToFind = 'lookup-pillAcc';
        break;
    case 'PPP':
        toRemove = 'v.selectedProd';
        toFind = 'inputProd';
        pillToFind = 'lookup-pillProd';
        component.set("v.prodList", null);
        break;
    case '02i':
        toRemove = 'v.selectedAsset';
        toFind = 'inputAsset';
        pillToFind = 'lookup-pillAsset';
        var lookupPill2 = component.find(pillToFind);
        $A.util.removeClass(lookupPill2, "clsrpClr2");
        break;
    case '0PK':
        toRemove = 'v.selectedIndividual';
        toFind = 'inputIndividual';
        pillToFind = 'lookup-pillIndividual';
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
    // console.log("handleEvent::: "+ Object);
    var selectedLookupacc = [];
    var selectedLookupProduct = [];
    var selectedLookupAsset = [];
    var selectedLookupIndividual = [];
    // var selectedLookupCRMEmail = [];
    if (Object == "Account") {
        // console.log("In event handler1Account");
        var lookupEventToParent = event.getParam("selectedItem");
        var selectedList = [];
        selectedList.push(lookupEventToParent);
        selectedLookupacc.push(lookupEventToParent);
        // console.log(JSON.stringify(selectedList));
        component.set("v.selectedAcc", selectedList);
        var Input = component.find("inputAcc");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillAcc");
        $A.util.removeClass(lookupPill, "slds-hide");
        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("toOpenAcc");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermAcc", "");

    } else if (Object == "Individual") {
        // console.log("In event handler2Individual ");
        var lookupEventToParent = event.getParam("Individual");
        var selectedList = [];
        selectedList.push(lookupEventToParent);
        selectedLookupIndividual.push(lookupEventToParent);
    } else if (Object == "Product") {
        // console.log("In event handler9Product");
        var lookupEventToParent = event.getParam("Product");
        var selectedList = [];
        selectedList.push(lookupEventToParent);
        // ??? forse err
        selectedLookupProduct.push(lookupEventToParent);
    } else if (Object == "Asset") {
        var lookupEventToParent = event.getParam("Asset");
        // console.log("ToParent"+JSON.stringify(lookupEventToParent));
        var selectedList = [];
        selectedList.push(lookupEventToParent);
        selectedLookupAsset.push(lookupEventToParent);
        selectedLookupacc.push(lookupEventToParent.Account);
        selectedLookupIndividual.push(lookupEventToParent.ER_Individual__r);
        let tabPrd = component.get("v.prodListDflt");
        for (let tp of tabPrd){
            if (lookupEventToParent.IT_FID_Product__c == tp.Name) {
                selectedLookupProduct.push(tp);
                break;
            } 
        };
    } 
    // console.log("***selectedLOOKUP*****");
    if (selectedLookupacc != null && selectedLookupacc != undefined && selectedLookupacc.length > 0 && selectedLookupacc[0] != null) {
        // console.log("Account found EVENT");
        component.set("v.selectedAcc", selectedLookupacc);
        var Input = component.find("inputAcc");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillAcc");
        $A.util.removeClass(lookupPill, "slds-hide");
        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("toOpenAcc");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermAcc", "");
    }
    if (selectedLookupProduct != null && selectedLookupProduct != undefined && selectedLookupProduct.length > 0 && selectedLookupProduct[0] != null) {
        // console.log("Product found EVENT");
        component.set("v.selectedProd", selectedLookupProduct);
        var Input = component.find("inputProd");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillProd");
        $A.util.removeClass(lookupPill, "slds-hide");
        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("ToOpenProd");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermProd", "");
    }
    if (selectedLookupAsset != null && selectedLookupAsset != undefined && selectedLookupAsset.length > 0 && selectedLookupAsset[0] != null) {
        // console.log("Asset found EVENT");
        component.set("v.selectedAsset", selectedLookupAsset);
        component.set("v.assetEmployeeNew", lookupEventToParent.ER_Employee__c);
        // console.log("selectedAsset: "+  JSON.stringify( component.get("v.selectedAsset")) );
        // console.log("lookupEventToParent.ER_Employee__c: "+lookupEventToParent.ER_Employee__c);
        // console.log("assetEmployeeNew: "+  component.get("v.assetEmployeeNew") );
        var Input = component.find("inputAsset");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillAsset");
        $A.util.removeClass(lookupPill, "slds-hide");
        if (component.get("v.selectedAsset")[0].flgClr == true) {
            $A.util.addClass(lookupPill, "clsrpClr2");
        }else {$A.util.removeClass(lookupPill, "clsrpClr2");}

        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("toOpenAsset");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermAsset", "");
    }
    if (selectedLookupIndividual != null && selectedLookupIndividual != undefined && selectedLookupIndividual.length > 0 && selectedLookupIndividual [0] != null) {
        // console.log("Individual found EVENT "+JSON.stringify(selectedLookupIndividual));
        component.set("v.selectedIndividual", selectedLookupIndividual);
        var Input = component.find("inputIndividual");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillIndividual");
        $A.util.removeClass(lookupPill, "slds-hide");
        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("toOpenIndividual");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermIndividual", "");
        component.set("v.individualList", "");
        // fire flow 
        if (selectedLookupIndividual[0].Name == "New Individual") {
            component.set("v.isModalOpen",true);
            let inpRecordEmail=component.get("v.CaseRecordEmail");
            let inpRecordPhone=component.get("v.CaseRecordPhone");
            let inpCaseProd=component.get("v.selectedProd");
            let inpCaseAcc=component.get("v.selectedAcc");
            // console.log("**inputVariables1 e"+inpRecordEmail+'*t '+inpRecordPhone+'*p '+inpCaseProd+'*a '+inpCaseAcc) ;
            if (!inpRecordEmail) {
                inpRecordEmail='';
            }
            if (!inpRecordPhone) {
                inpRecordPhone='';
            }
            if(inpCaseProd != null && inpCaseProd.length > 0){
                inpCaseProd = inpCaseProd[0].Name;
            } else inpCaseProd='';
            if(inpCaseAcc != null && inpCaseAcc.length > 0){
                inpCaseAcc = inpCaseAcc[0].Id;
            } else inpCaseAcc='';
            // console.log("**inputVariables2 e"+inpRecordEmail+'*t '+inpRecordPhone+'*p '+inpCaseProd+'*a '+inpCaseAcc);
                var inputVariables = 
                [{name : "accRifId", type : "String", value: inpCaseAcc},
                {name : "Case_Circuit_Input", type : "String", value: "1234"},
                {name : "Case_Email_Input", type : "String", value: inpRecordEmail},
                {name : "Case_Phone_Input", type : "String", value: inpRecordPhone},
                {name : "Case_Product_Input", type : "String", value: inpCaseProd}
                ];
            var flow = component.find("flow");
            flow.startFlow("IT298_insAccPer_Employee",inputVariables); 
        }
    }
},
onSubmit: function (component, event, helper) {
    // console.log("onSubmit ");
    var workspaceAPI = component.find("workspace");
    var accoSelect = component.get("v.selectedAcc");
    var prodSelect = component.get("v.selectedProd");
    var assetSelect = component.get("v.selectedAsset");
    var EmployeeNew = component.get("v.selectedEmployeeNew");
    var assetEmployeeNew = component.get("v.assetEmployeeNew");
    var individualSelect = component.get("v.selectedIndividual");
    var crmEmail = component.get("v.sTermCRMEmail");
    var crmPhone = component.get("v.sTermCRMPhone");
    var daFlowInNw = component.get("v.daFlowIndivNEW");
    var accId;
    var employeeId;
    var assetId;
    var individualId;
    var circuitId=component.get("v.assetCiruit");
    var circuitItCode;
    var prodCase;
    if(accoSelect != null && accoSelect.length > 0){
        accId = accoSelect[0].Id;
    }else accoSelect='';
    if(prodSelect != null && prodSelect.length > 0){
        prodCase = prodSelect[0].Name;
    }else prodCase='';
    if(individualSelect != null && individualSelect.length > 0){
        individualId = individualSelect[0].Id;}
    if(crmEmail != null || crmPhone != null){
        employeeId = component.get("v.EmployeeIdCase");}
    if(EmployeeNew != null && (individualSelect[0].Id == daFlowInNw)){
        employeeId = EmployeeNew;}
    if(assetEmployeeNew != null){
        employeeId = assetEmployeeNew;}
    if(assetSelect != null && assetSelect.length > 0){
        assetId = assetSelect[0].Id;
        if (assetSelect[0].hasOwnProperty('IT_Circuit__c')){
            circuitId=assetSelect[0].IT_Circuit__c;
        }else if(assetSelect[0].hasOwnProperty('ER_Employee__r') && assetSelect[0].ER_Employee__r.hasOwnProperty('IT_Circuit__c')){
            circuitId=assetSelect[0].ER_Employee__r.IT_Circuit__c;
        }else if(assetSelect[0].hasOwnProperty('IT_Circuit_Code__c')) circuitItCode=assetSelect[0].IT_Circuit_Code__c;
    }
    if(individualId == null){
        employeeId = null;
    }
    console.log("**saveRecord ac"+accId+'*as '+assetId+'*i '+individualId+'*e '+employeeId+'*pC '+prodCase+'*c '+circuitId+'*cCode '+circuitItCode+'*e '+crmEmail+'*p '+crmPhone);
    // ottimizza parametri crea obj
    var action = component.get("c.saveRecord");
        action.setParams({
            "accountId": accId,
            "assetId": assetId,
            "individualId": individualId,
            "employeeId": employeeId,
            "caseId" : component.get("v.recordId"),
            "circuitId": circuitId,
            "circuitItCode": circuitItCode,
            "crmEmail": crmEmail,
            "crmPhone": crmPhone,
            "prodCase": prodCase
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            // console.log(state);
            if (state === "SUCCESS") {
                if(EmployeeNew != null && (individualSelect[0].Id == daFlowInNw)){
                    if (component.get("v.EmplRecordPhoneNEW")) {
                        component.set("v.EmplRecordPhone", component.get("v.EmplRecordPhoneNEW"));
                    }
                    if (component.get("v.EmplRecordEmailNEW")) {
                    }
                }
                component.set("v.sTermCRMEmail", crmEmail);
                component.set("v.sTermCRMPhone", crmPhone);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "mode": 'dismissible',
                    "type": 'success',
                    "duration": 100,
                    "message": 'Record salvato con successo.'
                });
                toastEvent.fire();
                workspaceAPI.getFocusedTabInfo().then(function (response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.refreshTab({
                        tabId: focusedTabId,
                        includeAllSubtabs: false
                    }); 
                });
                // console.log('torna qualcosa? '+ response.getReturnValue());
            }
            else{
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
},
listatoAsset: function(result,tabPrd) {
// console.log("**listatoAsset1 "+ cresult);
// console.log("**listatoAsset2 "+ tabPrd);
    let resultNew=[];
    let resultSort=[];
    for(let el of result){
        if(!el.hasOwnProperty('IT_FID_Product__c') || (el.IT_FID_Product__c=='BENEF' || el.IT_FID_Product__c=='ETC' || el.IT_FID_Product__c=='SALESFORCE')) {
            continue;}
        let newName = ''; 
        for (let tp of tabPrd){if (el.IT_FID_Product__c == tp.Name) {newName+=tp.Label; break;}};
        if(el.hasOwnProperty('Description')){newName+=' - '+el.Description; }
        if(el.hasOwnProperty('ER_Individual__r')){newName+=' - '+el.ER_Individual__r.Name;}
        if(el.hasOwnProperty('IT_Circuit_Code__c')){
            newName+=' - '+el.IT_Circuit_Code__c;
        }
        if(el.hasOwnProperty('IT_Card_Face_Value__c')){newName+=' - '+el.IT_Card_Face_Value__c;}
        newName+=this.frmtDateSc(el.ER_Card_Activation_Date__c,el.ER_Card_Expiration_Date__c,el.Status);
        el.Name=newName;
        if(el.Status=='DISATTIVATA MANUALME'){
            el.flgClr=true;
        }else el.flgClr=false;
        resultNew.push(el);
    };
    resultSort=resultNew.sort((a, b) => (a.IT_FID_Product__c > b.IT_FID_Product__c) ? 1 : (a.IT_FID_Product__c === b.IT_FID_Product__c) 
        ? ((a.CreatedDate > b.CreatedDate) ? 1 : -1) : -1 )
        .reverse();
    return resultSort;
},
frmtDateSc: function(dt1,dt2,stat){
    let din,dfi;
    if(dt1==null||dt1==undefined)din='No Data';
    else din=this.frmtDateIta(dt1); 
    if (dt2==null||dt2==undefined)dfi='No Data';
    else dfi=this.frmtDateIta(dt2); 
    let rt=din+' - '+dfi;
    if(rt=='No Data - No Data')rt='';
    if(stat==null||stat==undefined)stat='Manca Status';
    rt=' ('+stat.substr(0,12)+' '+rt+')';
    return rt;
},
frmtDateIta: function(ymd){
    let d=new Date(ymd);
    let month=String(d.getMonth() + 1);
    let day=String(d.getDate());
    const year=String(d.getFullYear());
    if(month.length<2)month='0'+month;
    if(day.length<2)day='0'+day;
    return `${day}/${month}/${year}`;
},
frmtDateIta: function(ymd){
    let d=new Date(ymd);
    let month=String(d.getMonth() + 1);
    let day=String(d.getDate());
    const year=String(d.getFullYear());
    if(month.length<2)month='0'+month;
    if(day.length<2)day='0'+day;
    return `${day}/${month}/${year}`;
},
})

// msgtoast1: function(term,lastName){
//     let msgErr1="Asset : < "+ term +" > non trovato";
//     if (lastName != '') {
//         msgErr1="Asset: < "+term+" >  e  Cognome: < "+lastName+" > non trovati.";
//     }
//     component.find('notifLib').showToast({
//         "variant": 'info',
//         "message": msgErr1
//     });
// },

// frmtDateN: function(dt1,dt2){
//     let din,dfi;
//     if(dt1==null||dt1==undefined)din='No Data';
//     else din=dt1;
//     if(dt2==null||dt2==undefined)dfi='No Data';
//     else dfi=dt2;
//     let rt=' ('+din+' - '+dfi+')';
//     if(rt==' (No Data - No Data)')rt='';
//     return rt;
// },

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