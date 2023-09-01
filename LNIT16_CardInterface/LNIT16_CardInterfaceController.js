({
    
    init: function (component, event, helper) {
        var recordId = component.get('v.recordId');
        var action = component.get('c.fetchDPData');
        action.setParams({
            "recordId": recordId,
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var responseDP = response.getReturnValue().split('§')[0];
                var singleDP = JSON.parse(responseDP);
                console.log('JSON:: '+responseDP );
                
                component.set('v.showTicketNaming',singleDP.IT_Naming_to_Display__c);
                component.set('v.showAddress',singleDP.IT_Address_to_Display__c);
                component.set('v.showLocality',singleDP.IT_Locality_to_Display__c); 
                component.set('v.freeAddress',singleDP.IT_Free_Description_to_Display_2__c);
                component.set('v.freeLocality',singleDP.IT_Free_Description_to_Display_3__c); 
                component.set('v.showTicketNamingOnAddressRow',singleDP.IT_Display_Naming_on_Address_Row__c);
                
                component.set('v.accountName',singleDP.IT_Financial_Center__r.ER_Account_Name__r.Name);
                component.set('v.ticketNaming',singleDP.IT_Financial_Center__r.IT_Short_Name__c);
                component.set('v.locality',singleDP.IT_Data_Type_To_Display_4__c + '§' + singleDP.IT_Data_To_Display_4__c);
                component.set('v.inputLocality',singleDP.IT_Data_To_Display_4__c);
                
                component.set('v.fixedCity',singleDP.ER_City__c);
                component.set('v.fixedAddress',singleDP.IT_Toponym__c + ' ' + singleDP.ER_Street__c);
                component.set('v.fixedStreet',singleDP.IT_Toponym__c + ' ' + singleDP.ER_Street__c);
                component.set('v.fixedName',singleDP.IT_Ticket_Naming__c);
                if(singleDP.IT_Display_Naming_on_Address_Row__c){
                   component.set('v.fixedAddress',singleDP.IT_Ticket_Naming__c); 
                }
                
                component.set('v.fullAddress',singleDP.IT_Data_Type_To_Display_3__c + '§' + singleDP.IT_Data_To_Display_3__c);
                component.set('v.inputAddress',singleDP.IT_Data_To_Display_3__c);
                if(singleDP.IT_Validity_Start_Date__c != null && singleDP.IT_Validity_Start_Date__c != undefined){
                    component.set('v.validityStartDateOLD',singleDP.IT_Validity_Start_Date__c);
                    component.set('v.validityStartDate',singleDP.IT_Validity_Start_Date__c);
                }
                else{
                    component.set('v.validityStartDateOLD',new Date());
                    component.set('v.validityStartDate',new Date());
                }
                if(!singleDP.IT_Financial_Center__r.IT_Single_Client_Multiactivity__c){
                    component.set('v.singleClient' , true);
                }
                if(response.getReturnValue().split('§').length > 1){
                    console.log('CLI TROVATO: ');
                    var singleCLI = response.getReturnValue().split('§')[1];
                    component.set('v.showTicketNamingCLI',singleCLI.IT_Display_Active_Name__c);
                    component.set('v.showAddressCLI',singleCLI.IT_Display_Address__c);
                    component.set('v.showLocalityCLI',singleCLI.IT_Display_Locale__c);
                }
                
                
                
                /*if(!singleDP.IT_Financial_Center__r.IT_Single_Client_Multiactivity__c){
                    component.set('v.singleClient' , true);
                    component.set('v.showTicketNaming',true);
                    component.set('v.showAddress',true);
                    component.set('v.showLocality',true);
                }
                if(singleDP.IT_Data_To_Display_4__c != null && singleDP.IT_Data_To_Display_4__c != undefined){
                    component.set('v.freeLocality',true);
                }
                if(singleDP.IT_Data_To_Display_3__c != null && singleDP.IT_Data_To_Display_3__c != undefined){
                    component.set('v.freeAddress',true);
                }*/
            }
            else{
                
                var errors = response.getError();
                console.log(JSON.stringify(errors));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"error",
                    "title": "Errore!",
                    "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                });
                toastEvent.fire();
            }
            var action2 = component.get('c.fetchDataType');
            action2.setParams({
                "recordId": recordId,
                "service" : singleDP.IT_Financial_Center__r.IT_Service__c
            });
            action2.setCallback(this, function(response2) {
                if (response2.getState() == "SUCCESS") {
                    var responseData = response2.getReturnValue();
                    var dataTypes = JSON.parse(responseData);
                    console.log('CONTROLS:: '+responseData );
                    var row3 = [];
                    var row4 = [];
                    dataTypes.forEach(function(element) {
                        if(element.IT_CLN_Line_number__c == '3'){
                            row3.push({'key' : element.IT_CLN_Ticket_exposure_type__c , 'value' : element.IT_CLN_Ticket_exposure_Code__c});
                        }
                        else{
                            row4.push({'key' : element.IT_CLN_Ticket_exposure_type__c , 'value' : element.IT_CLN_Ticket_exposure_Code__c});
                        }
                        //row4.push({'key' : element.IT_CLN_Ticket_exposure_type__c , 'value' : element.IT_CLN_Ticket_exposure_Code__c});
                    });
                    component.set('v.addressList' , row3);
                    if(!(row3.length > 0)){
                        //component.set('v.freeAddress' ,true);
                    }
                    component.set('v.localityList' , row4);
                    if(!(row4.length > 0)){
                        //component.set('v.freeLocality' ,true);
                    }
                }
                
            });
            $A.enqueueAction(action2);
            
        });
        $A.enqueueAction(action);
    },
    
    addressDeFlag : function(component, event, helper) {
        if(component.get('v.showAddress')){
            component.set('v.freeAddress',false);
            component.set('v.showTicketNamingOnAddressRow',false);
            component.set('v.inputAddress',component.get('v.fixedStreet'));
            component.set('v.fixedAddress',component.get('v.fixedStreet'));
        }
    },
    localityDeFlag : function(component, event, helper) {
		if(component.get('v.showLocality')){
            component.set('v.freeLocality',false);
            component.set('v.inputLocality',component.get('v.fixedCity'));
        }
    },
    denominationOnAddress : function(component, event, helper) {
        if(component.get('v.showTicketNamingOnAddressRow')){
            component.set('v.inputAddress', component.get('v.fixedName'));
            component.set('v.fixedAddress', component.get('v.fixedName'));
            component.set('v.freeAddress',false);
            component.set('v.showAddress',false);
        }
    },
    addressFreeFlag : function(component, event, helper) {
        if(component.get('v.freeAddress')){
            component.set('v.showAddress',false);
            component.set('v.showTicketNamingOnAddressRow',false);

        }
    },
    localityFreeFlag : function(component, event, helper) {
        if(component.get('v.freeLocality')){
            component.set('v.showLocality',false);
        }
    },
    
    handleSave : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var objName = component.get("v.sObjectName");
        var sObj = {'sobjectType':objName,'Id':recordId};
        var workspaceAPI = component.find("workspaceAPI");
        console.log('FLAGS' + component.get('v.showTicketNaming') + component.get('v.showAddress') + component.get('v.showLocality'));
        sObj.IT_Naming_to_Display__c = component.get('v.showTicketNaming');
        sObj.IT_Address_to_Display__c = component.get('v.showAddress');
        sObj.IT_Locality_to_Display__c = component.get('v.showLocality');
        console.log(sObj.IT_Locality_to_Display__c + sObj.IT_Address_to_Display__c + sObj.IT_Naming_to_Display__c);
        sObj.IT_Display_Naming_on_Address_Row__c = component.get('v.showTicketNamingOnAddressRow');
		sObj.IT_Free_Description_to_Display_2__c = component.get('v.freeAddress');
        sObj.IT_Free_Description_to_Display_3__c = component.get('v.freeLocality');
        if(component.get('v.validityStartDate') != component.get('v.validityStartDateOLD')){
            sObj.IT_Validity_Start_Date__c = component.get('v.validityStartDate');
        }
        else{
            sObj.IT_Validity_Start_Date__c = new Date();
        }

        var validated = true;
        if(component.get('v.freeAddress') || component.get('v.showAddress') || component.get('v.showTicketNamingOnAddressRow')){
            sObj.IT_Data_To_Display_3__c = component.get('v.inputAddress');
            sObj.IT_Data_Type_To_Display_3__c = null;
            if(component.get('v.showTicketNamingOnAddressRow')){
                sObj.IT_Data_Type_To_Display_3__c = '0000';            
            }
        }
        else{
            if(component.get('v.fullAddress') != null && component.get('v.fullAddress') != undefined && component.get('v.fullAddress') != 'undefined§undefined'){
                console.log('ADDRESS: '+component.get('v.fullAddress'));
                sObj.IT_Data_Type_To_Display_3__c = component.get('v.fullAddress').split('§')[0];
                sObj.IT_Data_To_Display_3__c = component.get('v.fullAddress').split('§')[1];
            }
            else{
                //sObj.IT_Data_To_Display_3__c = component.get('v.inputAddress');
                sObj.IT_Data_To_Display_3__c = null;
                sObj.IT_Data_Type_To_Display_3__c = null;
            }
            
        }
        if(component.get('v.freeLocality') || component.get('v.showLocality')){
            sObj.IT_Data_To_Display_4__c = component.get('v.inputLocality');
            sObj.IT_Data_Type_To_Display_4__c = null;
        }
        else{
            if(component.get('v.locality') != null && component.get('v.locality') != undefined && component.get('v.locality') != 'undefined§undefined'){
                console.log('LOCALITY: '+component.get('v.locality'));
                sObj.IT_Data_Type_To_Display_4__c = component.get('v.locality').split('§')[0];
                sObj.IT_Data_To_Display_4__c = component.get('v.locality').split('§')[1];
            }
            else{
                //sObj.IT_Data_To_Display_4__c = component.get('v.inputLocality');
                sObj.IT_Data_To_Display_4__c = null;
                sObj.IT_Data_Type_To_Display_4__c = null;
            }
        }
        if(component.get('v.showTicketNaming')){
            sObj.IT_Data_To_Display_2__c = component.get('v.fixedName');
        }
        else{
            sObj.IT_Data_To_Display_2__c = component.get('v.ticketNaming');
        }
        console.log('Distpoint Mandato: '+JSON.stringify(sObj , null , 2));
	    var action = component.get("c.updateRecord");
            action.setParams({
                "distPoint" : sObj,
                "AddressExpo" : component.get('v.showTicketNamingOnAddressRow')
            })
            action.setCallback(this, function (response) {
                if (response.getState() == "SUCCESS") {
                    console.log('SUCCESS');
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type":"success",
                        "title": "Successo!",
                        "message": "Valori salvati correttamente."
                    });
                    toastEvent.fire();
                }
                else{
                    
                    var errors = response.getError();
                    console.log(JSON.stringify(errors));
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type":"error",
                        "title": "Errore!",
                        "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);

    },
    returnToGeneric : function(component, event, helper) {
        if(component.get('v.returnGeneric')){
            var naming = component.get('v.showTicketNamingCLI');
            var address = component.get('v.showAddressCLI');
            var locality = component.get('v.showLocalityCLI');
            if(naming == undefined){
                naming = false;
            }
            if(address == undefined){
                address = false;
            }
            if(locality == undefined){
                locality = false;
            }
            component.set('v.showTicketNaming',naming);
            component.set('v.showAddress',address);
            component.set('v.showLocality',locality);
            component.set('v.returnGeneric',false);
        }
    },
    
    picklistChangeHandlerAdd : function(component, event, helper) {
        console.log(component.get('v.fullAddress'));
    },
    picklistChangeHandlerLoc : function(component, event, helper) {
        console.log(component.get('v.locality'));
    },
    
})