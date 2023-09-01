(
    {
        doInit : function(component, event, helper) { 
            var iconState = component.find("iconState");
            var btnUpdate = component.find("btnUpdate");
            var recId = component.get("v.recordId");
            //////////////////////////////////////////////////////////////
            var UserBU = '' ;
            var GetUserinfoaction = component.get("c.fetchUser");
            GetUserinfoaction.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    // set current user information on userInfo attribute
                    // component.set("v.userInfo", storeResponse);
                    UserBU = storeResponse.ER_Business_Unit__c ; 
                    
                    component.set("v.businessUnit", UserBU);
                    console.log('UserBU : '+UserBU);
                    if ( UserBU == 'CZ' ||UserBU == 'SK')
                    {
                        console.log(' BU = '+UserBU);
                        //component.find("loadedall").set("v.value","true");
                        component.set('v.loadedall', !component.get('v.loadedall'));
                        var recload = component.get("v.loadedall");
                        console.log('recid : '+recload);
                    }
                    else
                    {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            type: "Error",
                            mode: "dismissible",
                            duration:"3000",
                            message: "$Label.c.LAB_SF_PublicRegister_FunctionalityNotAvailable"
                        });
                        $A.get("e.force:closeQuickAction").fire();   
                        toastEvent.fire();
                    }
                    
                }
            });
            $A.enqueueAction(GetUserinfoaction);
            
            
            
            ////////////////////////////////////////////////////////// 
            
            
            
            var initWsName = "";  
            
            if(recId.substring(0,3) == "001")
            {
                initWsName = "c.getAccountWS";
            }
            else 
            {
                initWsName = "c.getLeadWS";
            }
            
            //var actionGetVat = component.get("c.getAccountWS");
            var actionGetVat = component.get(initWsName);
            actionGetVat.setParams({"objId": component.get("v.recordId")}); 
            //Account call
            actionGetVat.setCallback(this, function(response) {
                
                var stateCallAcc = response.getState();
                
                if(stateCallAcc === "SUCCESS") 
                {
                    var jsonVat = response.getReturnValue();
                    if(!jsonVat.ER_Registration_Number__c){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            type: "Error",
                            mode: "dismissible",
                            duration:"5000",
                            message: $A.get("$Label.c.LAB_SF_PublicRegister_NoRegistrationNumberFound")
                        });  
                        toastEvent.fire();
                        $A.get("e.force:closeQuickAction").fire();   
                    }
                    else{
                        component.set("v.sId", jsonVat.ER_Registration_Number__c);
                        component.set("v.sExistingNace", jsonVat.ER_NaceList__c);  
                        
                        if(UserBU == 'CZ'){
                            console.log('10');
                            var actionCallAres = component.get("c.getDarvBasWS");
                            console.log('11');
                            actionCallAres.setParams({"sId": component.get("v.sId")});
                            console.log('12');
                            //Ares call
                            actionCallAres.setCallback(this, function(response) {
                                console.log('13');
                                var stateCallAres = response.getState();
                                console.log('14');
                                
                                if(stateCallAres === "SUCCESS") 
                                {
                                    var jsonAres = JSON.parse(response.getReturnValue());
                                    
                                    component.set('v.loaded', !component.get('v.loaded'));
                                    
                                    if(jsonAres.n03_OF_Name != null)
                                    {  
                                        iconState.set("v.iconName", "action:approval");    
                                        component.find("txtName").set("v.value",jsonAres.n03_OF_Name);
                                        component.find("txtVatNumber").set("v.value",jsonAres.n03_DIC_VatNumber);
                                        component.find("txtLegalForm").set("v.value",jsonAres.n04_NPF_LegalForm);    
                                        component.find("txtStreet").set("v.value",jsonAres.n04_StreetFull);
                                        component.find("txtZipCode").set("v.value",jsonAres.n04_PSC_ZipCode);
                                        component.find("txtCity").set("v.value",jsonAres.n04_N_City); 
                                        btnUpdate.set("v.disabled",false);   
                                    }
                                    else 
                                    {
                                        iconState.set("v.iconName", "action:close"); 
                                        btnUpdate.set("v.disabled",true);
                                    }    
                                } 
                                else 
                                {
                                    component.set('v.loaded', !component.get('v.loaded'));
                                    console.log('Problem getting Ares Json, response state: ' + stateCallAres);
                                }
                            });
                            $A.enqueueAction(actionCallAres);
                            //********** second call
                            
                            var actionDarvRes = component.get("c.getDarvResWS");      
                            actionDarvRes.setParams({"sId": component.get("v.sId"), "sExistingNace": component.get("v.sExistingNace") });
                            
                            //Ares call
                            actionDarvRes.setCallback(this, function(response) {
                                
                                var stateDarvRes = response.getState();
                                //SUCCESS
                                if(stateDarvRes === "SUCCESS") 
                                {
                                    var jsonAresRes = JSON.parse(response.getReturnValue()); 
                                    //alert(jsonAresRes);  
                                    
                                    var selectedNace = [];
                                    
                                    for(var row in jsonAresRes){
                                        var rowJson = jsonAresRes[row];
                                        if(rowJson.isSelected == true){
                                            selectedNace.push(rowJson.n04_NACE); 
                                        }
                                    }
                                    console.log('jsonAresRes: ' + JSON.stringify(jsonAresRes));
                                    component.set("v.listNace", jsonAresRes);
                                    //charger la liste d'Ares déjà cochés
                                    component.set("v.listNaceSeleced", selectedNace);
                                } 
                                else 
                                {
                                    console.log('Problem getting Ares Json, response state: ' + stateDarvRes);
                                }
                            });
                            $A.enqueueAction(actionDarvRes);
                            //***************second call end
                        }
                        else if(UserBU == 'SK'){
                            
                            var selectedNace = [];
                            var actionCallFinstat = component.get("c.getFinStatWS");
                            actionCallFinstat.setParams({"sId": component.get("v.sId")});
                            actionCallFinstat.setCallback(this, function(response) {
                                
                                component.set('v.loaded', true);
                                var stateCallFinstat = response.getState();                            
                                if(stateCallFinstat === "SUCCESS") {
                                    
                                    var jsonFinstat = response.getReturnValue();
                                    iconState.set("v.iconName", "action:approval");
                                    component.find("txtName").set("v.value",jsonFinstat.Name);
                                    component.find("txtVatNumber").set("v.value",jsonFinstat.Dic);
                                    component.find("txtLegalForm").set("v.value",jsonFinstat.LegalFormText);    
                                    component.find("txtStreet").set("v.value",jsonFinstat.StreetNumber+' '+jsonFinstat.Street);
                                    component.find("txtZipCode").set("v.value",jsonFinstat.ZipCode);
                                    component.find("txtCity").set("v.value",jsonFinstat.City); 
                                    
                                    var obj = { "n04_Nazev": jsonFinstat.NaceText, "n04_NACE": jsonFinstat.NaceCode,"isSelected":true};
                                    console.log('obj : '+obj);
                                    component.set("v.listNace", obj);
                                    selectedNace.push(jsonFinstat.NaceCode); 
                                    component.set("v.listNaceSeleced", selectedNace);
                                    btnUpdate.set("v.disabled",false);
                                    
                                }
                                else{
                                    iconState.set("v.iconName", "action:close"); 
                                    var toastEvent = $A.get("e.force:showToast");
                                    var error = '';
                                    if(response.getError().length>0 && response.getError()[0].message){
                                        
                                        error = response.getError()[0].message;
                                    }
                                    else{
                                        
                                        error =  $A.get("$Label.c.LABS_SF_WS_GenericError1");
                                    }
                                    toastEvent.setParams({
                                        type: "Error",
                                        mode: "dismissible",
                                        duration:"5000",
                                        message: error
                                    });  
                                    toastEvent.fire();
                                }
                            });
                            $A.enqueueAction(actionCallFinstat);
                        }
                    }
                    
                }//end if get account 
                else 
                {
                    console.log('Problem getting Account Json, response state: ' + stateCallAcc);
                }
            });
            $A.enqueueAction(actionGetVat);
        },
        //******************bindAres****************
        bindAres: function(component, event, helper) {
            
            if(helper.validateAresForm(component)) 
            {
                var recId = component.get("v.recordId");
                var updateWsName = "";  
                
                if(recId.substring(0,3) == "001")
                {
                    updateWsName = "c.updateAccountWS";
                }
                else 
                {
                    updateWsName = "c.updateLeadWS";
                }
                
                var updateAction = component.get(updateWsName);
                
                var sJson = '{'
                +'"oId" : "' + component.get("v.recordId") + '",'
                +'"sName" : "' + component.find("txtName").get("v.value") + '",'
                +'"sVatNumber" : "' + component.find("txtVatNumber").get("v.value") + '",'
                +'"sStreet" : "' + component.find("txtStreet").get("v.value") + '",'
                +'"sPostalCode" : "' + component.find("txtZipCode").get("v.value") + '",'
                +'"sCity" : "' + component.find("txtCity").get("v.value") + '",'
                +'"bGetName" : ' + component.find("chkName").get("v.value") + ','
                +'"bGetVatNumber" : ' + component.find("chkVatNumber").get("v.value") + ','
                +'"bGetLegalForm" : ' + component.find("chkLegalForm").get("v.value") + ','
                +'"bGetZipCode" : ' + component.find("chkZipCode").get("v.value") + ','
                +'"bGetStreet" : ' + component.find("chkStreet").get("v.value") + ','	
                +'"bGetCity" : ' + component.find("chkCity").get("v.value") + ','
                +'"sNaceList" : "' + component.get("v.listNaceSeleced") + '"'		
                +'}';
                console.log("sJson : "+sJson);
                var sJsonNace = JSON.stringify(component.get("v.listNace"));
                //alert("List Nace 155"+component.get("v.listNace"));
                
                updateAction.setParams({
                    "sJson":sJson,
                    "sJsonNace":sJsonNace
                });
                
                updateAction.setCallback(this, function(response) {
                    
                    var listNaceSeleced = component.get("v.listNaceSeleced");
                    
                    var state = response.getState();
                    if(state === "SUCCESS") {
                        
                        var jsonUpdateInfo = response.getReturnValue();
                        // Prepare a toast UI message
                        
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            type: "success",
                            mode: "dismissible",
                            duration:"3000",
                            message: jsonUpdateInfo.Name + " is updated!"
                        });
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();    
                        toastEvent.fire();
                    }
                    else {
                        var toastEvent = $A.get("e.force:showToast");
                        var error = '';
                        console.log('ERROR : '+JSON.stringify(response));
                        if(response.getError().length>0 && response.getError()[0].message){
                            
                            error = response.getError()[0].message;
                        }
                        else{
                            
                            error =  $A.get("$Label.c.LABS_SF_WS_GenericError1");
                        }
                        toastEvent.setParams({
                            type: "Error",
                            mode: "dismissible",
                            duration:"5000",
                            message: error
                        });  
                        toastEvent.fire();
                    }
                });
                $A.enqueueAction(updateAction);
            }//helper validator
        },
        //******************closePopUp**************** 
        closePopUp: function(component, event, helper) {
            $A.get("e.force:closeQuickAction").fire();
        },
        //******************checkAll**************** 
        checkAll: function(component, event, helper) {
            var allValue = component.find("chkCheckAll").get("v.value");  
            
            var chkName = component.find("chkName");     
            if(allValue == true){ 
                chkName.set("v.value",true);
            }
            else{ 
                chkName.set("v.value",false);
            }
            
            var chkVatNumber = component.find("chkVatNumber");     
            if(allValue == true){ 
                chkVatNumber.set("v.value",true);
            }
            else{ 
                chkVatNumber.set("v.value",false);
            }
            
            var chkLegalForm = component.find("chkLegalForm");     
            if(allValue == true){ 
                chkLegalForm.set("v.value",true);
            }
            else{ 
                chkLegalForm.set("v.value",false);
            }
            //chkStreet
            var chkStreet = component.find("chkStreet");     
            if(allValue == true){ 
                chkStreet.set("v.value",true);
            }
            else{ 
                chkStreet.set("v.value",false);
            }
            //chkZipCode   
            var chkZipCode = component.find("chkZipCode");     
            if(allValue == true){ 
                chkZipCode.set("v.value",true);
            }
            else{ 
                chkZipCode.set("v.value",false);
            }
            //chkCity
            var chkCity = component.find("chkCity");     
            if(allValue == true){ 
                chkCity.set("v.value",true);
            }
            else{ 
                chkCity.set("v.value",false);
            }
        },
        
        //Process the selected contacts
        checkboxSelect: function(component, event, helper) {
            
            var selectedNace = [];      
            var checkvalue = component.find("checkNace");
            //alert('checkvalue'+checkvalue);
            if(!Array.isArray(checkvalue)){
                if (checkvalue.get("v.value") == true) {
                    selectedNace.push(checkvalue.get("v.text"));
                }
            }else{
                for (var i = 0; i < checkvalue.length; i++) {
                    if (checkvalue[i].get("v.value") == true) {
                        selectedNace.push(checkvalue[i].get("v.text"));
                    }
                }
            }
            component.set("v.listNaceSeleced", selectedNace);
        },
        checkAllNace: function(component, event, helper) {
            var checkAllNaceValue = component.find("chkCheckAllNace").get("v.value");
            var checkNaceList = component.find("checkNace"); 
            var selectedNace = [];
            if(checkAllNaceValue == true) {  
                if(checkNaceList.length === undefined){
                    console.log('get checkNaceList : '+checkNaceList.get("v.text"));
                    checkNaceList.set("v.value", true);
                    selectedNace.push(checkNaceList.get("v.text"));
                }
                else{
                    for (var i = 0; i < checkNaceList.length; i++) {
                        checkNaceList[i].set("v.value", true);
                        selectedNace.push(checkNaceList[i].get("v.text"));
                    }
                }                
            }
            else if(checkAllNaceValue == false)
            {
                if(checkNaceList.length === undefined){
                    
                    checkNaceList.set("v.value",false);
                }
                else{
                    for (var i = 0; i < checkNaceList.length; i++) {
                        
                        checkNaceList[i].set("v.value",false);
                    }   
                }
                
            }
            component.set("v.listNaceSeleced", selectedNace);       
        }//check all Nace
    })