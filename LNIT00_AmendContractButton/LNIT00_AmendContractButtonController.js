({
    doInit: function (component, event, helper) {
        var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");      //rf 25/05/22 IL-000493
        component.set('v.todayDate', today);                                          
        //var user = $A.get("$SObjectType.CurrentUser.Id");                           //rf 01/06/22 IL-000493
        //component.set("v.userId", userId);                                            
        component.set("v.toggleSpinner", false);
        var recordId = component.get("v.recordId");
        helper.pickListValues(component, helper, recordId);
        var pickVal = component.get("v.selectedValue");                                 
        //helper.getTypeOppy(component, helper, pickVal);
        var recordId = component.get("v.recordId");
        helper.getAccount(component, helper, recordId);
        helper.GetManager(component, helper, recordId);
        helper.CheckServiceExpRequired(component, helper);                             //rf 01/06/22 IL-000493

    },
    
    onChangeSelect: function (component, event, helper) {
        var pickVal = component.get("v.selectedValue");
        //helper.getTypeOppy(component, helper, pickVal);
        console.log("Selected value id: " + pickVal);
        if (pickVal == "03" || pickVal == "12") { //Cambio prodotto o cambio prodotto a parità di condizioni
            var recordId = component.get("v.recordId");
            helper.getListOfProduct(component, helper, recordId);
            component.set("v.productViewer", true);
            component.set("v.truthy", false);

        } else {
            component.set("v.productViewer", false);
            component.set("v.truthy", true);
        }
    },

    onChangeSelectProduct: function (component, event, helper) {
        var productID = component.get("v.selectedValueProduct");
        console.log("productID" + productID);


    },

    handleClick: function (component, event, helper) {

        var recordId = component.get("v.recordId");
        console.log("RecordID  = " + recordId);
        var pickVal = component.get("v.selectedValue");
        console.log("pickVal  = " + pickVal);
        var selectedRecordVal = component.get("v.selectedRecord");
        console.log("selectedRecordVal  = " + selectedRecordVal);
        var selectedRecord2Val = component.get("v.selectedRecord2");
        console.log("selectedRecord2Val  = " + selectedRecord2Val);
        var selectedRecord3Val = component.get("v.selectedRecord3");
        console.log("selectedRecord3Val  = " + selectedRecord3Val);
        var Owner = component.get("v.Owner");
        console.log("OwnerID:" + Owner);
        if (Owner != 'ERROR' && Owner != null && Owner != undefined) {
            helper.opportunityClon(component, helper, recordId, pickVal);
        } else {
            component.find('notifLib').showToast({
                "variant": "error",
                "message": "Sales Manager not found",
                "mode": "sticky"
            });
        }
    },

    handleClickProduct: function (component, event, helper) {
        component.set("v.toggleSpinner", true);
        var recordId = component.get("v.recordId");
        console.log("RecordID  = " + recordId);
        var pickVal = component.get("v.selectedValue");
        var idProduct = component.get("v.selectedValueProduct");
        console.log("selectedValueProduct  = " + idProduct);

        var selectedRecordVal = component.get("v.selectedRecord");
        console.log("selectedRecordVal  = " + selectedRecordVal);
        var selectedRecord2Val = component.get("v.selectedRecord2");
        console.log("selectedRecord2Val  = " + selectedRecord2Val);
        var selectedRecord3Val = component.get("v.selectedRecord3");
        console.log("selectedRecord3Val  = " + selectedRecord3Val);

        var Owner = component.get("v.Owner");
        if(component.get("v.selectedDate") < component.get("v.todayDate")){
            component.find('notifLib').showToast({
                "variant": "error",
                "message": "La data prevista partenza servizio non può essere minore della data di creazione",
                "mode": "sticky"
            });
            component.set("v.toggleSpinner", false);
            return;
        }else{
            if (Owner != 'ERROR' && Owner != null && Owner != undefined) {
            helper.opportunityClonProduct(component, helper, recordId, pickVal, idProduct);
            } else {
                component.find('notifLib').showToast({
                    "variant": "error",
                    "message": "Sales Manager not found, proceed with reassignment request",
                    "mode": "sticky"
                });
            }
        }

    },

    onCheck: function (component, event, helper) {
        component.set("v.Group", true);
    },
    onCheckFrame: function (component, event, helper) {
        component.set("v.CapoQuadro", true);
    },
    MostraGruppo: function (component, event, helper) {
        component.set("v.Wizard", true);
        component.set("v.isFlexbenefit", true);
    },
    handleComponentEvent: function (component, event, helper) {

        var selectedRecordtGetFromEvent = event.getParam("RecordByEvent");
        if (selectedRecordtGetFromEvent.includes('003')) {
            component.set("v.selectedRecord", selectedRecordtGetFromEvent);
        } else if (selectedRecordtGetFromEvent.includes('701')) {
            component.set("v.selectedRecord2", selectedRecordtGetFromEvent);
        } else if (selectedRecordtGetFromEvent.includes('a07')) {
            component.set("v.selectedRecord3", selectedRecordtGetFromEvent);

        }

        console.log("selectedRecordtGetFromEvent:" + selectedRecordtGetFromEvent);
    }
})