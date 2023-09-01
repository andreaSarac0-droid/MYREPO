({  
doInit : function(component, event, helper) {
    // console.log('***doInit');
    helper.doInit(component, event, helper);
},
render : function(component, event, helper) {
    // console.log('***render');
    helper.render(component, event, helper);
},
onchange : function(component, event, helper) {
    // console.log('***onchange');
    // helper.onchange(component, event, helper);
    var timer = component.get("v.timer");
    window.clearTimeout(timer);
    timer=window.setTimeout(helper.onchange,600, component, event, helper);
    component.set("v.timer",timer);
},
onblur : function(component, event, helper) {
    // console.log('***onblur');
    helper.onblur(component, event, helper);
},
onfocusAcc : function(component, event, helper) {
    // console.log('***onfocusAcc');
    component.set("v.iconName" , "standard:account");
    component.set("v.sObject" , "Account");
    helper.onfocus(component, event, helper);
},
onfocusProd : function(component, event, helper) {
    // console.log('***onfocusProd');
    component.set("v.iconName" , "standard:product_service_campaign_item");
    component.set("v.sObject" , "Product");
    helper.onfocus(component, event, helper);
},
onfocusAsset : function(component, event, helper) {
    // console.log('***onfocusAsset');
    component.set("v.iconName" , "standard:asset_object");
    component.set("v.sObject" , "Asset");
    helper.onfocus(component, event, helper);
},
onfocusIndividual : function(component, event, helper) {
    // console.log('***onfocusIndividual');
    component.set("v.iconName" , "standard:individual");
    component.set("v.sObject" , "Individual");
    helper.onfocus(component, event, helper);
},
onfocusCRMEmail : function(component, event, helper) {
    // console.log('***onfocusCRMEmail');
    component.set("v.sObject" , "CRMEmail");
    helper.onfocus(component, event, helper);
},
onfocusCRMPhone : function(component, event, helper) {
    // console.log('***onfocusCRMPhone');
    component.set("v.sObject" , "CRMPhone");
    helper.onfocus(component, event, helper);
},
handleRemoveOnly : function(component, event, helper) {
    // console.log('***handleRemoveOnly');
    helper.handleRemoveOnly(component, event, helper);
},
handleRemoveIndividual : function(component, event, helper) {
    // console.log('***handleRemoveIndividual');
    component.set('v.selectedIndividual', null);
    var Input = component.find('inputIndividual');
    $A.util.removeClass(Input, "slds-hide");
    var lookupPill = component.find('lookup-pillIndividual');
    $A.util.addClass(lookupPill, "slds-hide");
},
handleEvent : function(component, event, helper) {
    // console.log('***handleEvent');
    helper.handleEvent(component, event, helper);
        if ( (component.get("v.selectedAsset")[0].IT_FID_Product__c != component.get("v.selectedProd")[0].Name) 
        || (component.get("v.selectedAsset")[0].ER_Individual__c != component.get("v.selectedIndividual")[0].Id) 
        || (component.get("v.selectedAsset")[0].AccountId != component.get("v.selectedAcc")[0].Id) ){
        component.set("v.selectedAsset", null);
        var Input = component.find("inputAsset");
        $A.util.removeClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillAsset");
        $A.util.addClass(lookupPill, "slds-hide");
    }
},
onSubmit : function(component, event, helper) {
    // console.log('***onSubmit');
    var icona = component.find('iconRef');
    $A.util.toggleClass(icona, 'rotator');
    component.find('notifLib').showToast({
        "variant": 'info',
        "message": "Attendere salvataggio"
    });
    helper.onSubmit(component, event, helper);
    // SETTHISDELAYED$A.util.toggleClass(icona, 'rotator');
},
closeModel: function(component, event, helper) {
    // console.log('***flow closeModel');
    component.set("v.isModalOpen", false);
    component.set("v.selectedIndividual", null);
    var Input = component.find('inputIndividual');
    $A.util.removeClass(Input, "slds-hide");
    var lookupPill = component.find('lookup-pillIndividual');
    $A.util.addClass(lookupPill, "slds-hide");
},
submitDetails: function(component, event, helper) {
    // console.log('***flow submitDetails');
    component.set("v.isModalOpen", false);
},
statusChange: function (component, event) {
    // console.log('JSON:flow:'+event.getParam('status'));
    if (event.getParam('status') === "FINISHED") {
        component.set("v.isModalOpen", false);
        var outputVariables = event.getParam('outputVariables');
        // console.log('JSON:outputVariables:'+JSON.stringify(outputVariables));
        // ??? ottimizza find array src obj
        let inpCaseProd=component.get("v.selectedProd");
        let inpCaseAcc=component.get("v.selectedAcc");
        if((inpCaseProd != null && inpCaseProd.length > 0 && event.getParam('outputVariables')[8].value != inpCaseProd[0].Name ) ||
            (inpCaseProd == null) ||
            (inpCaseAcc != null && inpCaseAcc.length > 0 && event.getParam('outputVariables')[3].value != inpCaseProd[0].Name ) ||
            (inpCaseAcc == null)){
            component.set("v.selectedAsset", null);
            var Input = component.find("inputAsset");
            $A.util.removeClass(Input, "slds-hide");
            var lookupPill = component.find("lookup-pillAsset");
            $A.util.addClass(lookupPill, "slds-hide");
        }
        // var varOut =event.getParam('outputVariables');
        // console.log('varOut: '+JSON.stringify(varOut));
        component.set("v.daFlowIndivNEW", event.getParam('outputVariables')[4].value);
        let nw =[{"Id":event.getParam('outputVariables')[4].value,"Name":event.getParam('outputVariables')[6].value}];
        component.set("v.selectedIndividual",nw);
        component.set("v.selectedEmployeeNew",event.getParam('outputVariables')[2].value);
        component.set("v.EmplRecordEmailNEW", event.getParam('outputVariables')[1].value);
        component.set("v.sTermCRMEmail", event.getParam('outputVariables')[1].value);
        component.set("v.sTermCRMPhone", event.getParam('outputVariables')[7].value);
        component.set("v.EmplRecordPhoneNEW", event.getParam('outputVariables')[7].value);
        component.set("v.assetCiruit", event.getParam('outputVariables')[0].value);
        let newLabel = '';
        let tabPrd = component.get("v.prodListDflt");
        for (let tp of tabPrd){
            if (tp.Name.toUpperCase().includes( event.getParam('outputVariables')[8].value )) {
                newLabel = tp.Label;
            }
        };
        component.set("v.selectedProd", [{"Id":"PPP","Label": newLabel, "Name":event.getParam('outputVariables')[8].value }]);
        var Input = component.find("inputProd");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillProd");
        $A.util.removeClass(lookupPill, "slds-hide");
        const blurTimeout = component.get('v.blurTimeout');
        if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("ToOpenProd");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermProd", "");

        let nwComp =[{"Id":event.getParam('outputVariables')[3].value,"Name":event.getParam('outputVariables')[5].value}];
        component.set("v.selectedAcc",nwComp);
        var Input = component.find("inputAcc");
        $A.util.addClass(Input, "slds-hide");
        var lookupPill = component.find("lookup-pillAcc");
        $A.util.removeClass(lookupPill, "slds-hide");
        // const blurTimeout = component.get('v.blurTimeout');
        // if (blurTimeout) {clearTimeout(blurTimeout);}
        var ToOpen = component.find("toOpenAcc");
        $A.util.removeClass(ToOpen, "slds-is-open");
        component.set("v.sTermAcc", "");
    }
},
})

// onOptionClick : function(component, event, helper) {   // fff code died
//     console.log('***onOptionClick');
//     helper.onOptionClick(component, event, helper);
// },
// console.log("selectedAcc"+JSON.stringify( component.get("v.selectedAcc")) );
// console.log("selectedProd"+JSON.stringify( component.get("v.selectedProd")) );
// console.log("selectedIndividual"+JSON.stringify( component.get("v.selectedIndividual")) );
// console.log("selectedEmployeeNew"+JSON.stringify( component.get("v.selectedEmployeeNew")) );
// console.log("daFlowIndivNEW"+JSON.stringify( component.get("v.daFlowIndivNEW")) );
// console.log("EmplRecordPhoneNEW"+JSON.stringify( component.get("v.EmplRecordPhoneNEW")) );
// console.log("EmplRecordEmailNEW"+JSON.stringify( component.get("v.EmplRecordEmailNEW")) );
// console.log("sTermAcc"+JSON.stringify( component.get("v.sTermAcc")) );
// console.log("sTermProd"+JSON.stringify( component.get("v.sTermProd")) );