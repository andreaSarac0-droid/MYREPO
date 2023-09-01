(
    {
     doInit : function(component, event, helper) { 
         var iconState = component.find("iconState");
         
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
               console.log('UserBU : '+UserBU);
                if ( UserBU == 'CZ')
                {
                    console.log(' BU = cz !');
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
                    message: "Functionality not yet available in your Business Unit !"
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
          component.set("v.sId", jsonVat.ER_Registration_Number__c);
          component.set("v.sExistingNace", jsonVat.ER_NaceList__c);  
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
            var btnUpdate = component.find("btnUpdate");
                if(stateCallAres === "SUCCESS") 
                {
                    console.log('15');
                    var jsonAres = JSON.parse(response.getReturnValue());
                    console.log('16');
                    //legal_name,street,city,zip_code 
                    component.set('v.loaded', !component.get('v.loaded'));
                    console.log('17');
                    if(jsonAres.n03_OF_Name != null)
                    {
                     console.log('17.1');   
                    iconState.set("v.iconName", "action:approval");
                     console.log('17.2');       
                    component.find("txtName").set("v.value",jsonAres.n03_OF_Name);
                        console.log('17.3');
                    component.find("txtVatNumber").set("v.value",jsonAres.n03_DIC_VatNumber);
                    console.log('17.4');
                        component.find("txtLegalForm").set("v.value",jsonAres.n04_NPF_LegalForm);    
                    console.log('17.15');
                        component.find("txtStreet").set("v.value",jsonAres.n04_StreetFull);
                    console.log('17.6');
                        component.find("txtZipCode").set("v.value",jsonAres.n04_PSC_ZipCode);
                        console.log('17.7');
                    component.find("txtCity").set("v.value",jsonAres.n04_N_City); 
                    console.log('18');
                    btnUpdate.set("v.disabled",false);
                    console.log('19');    
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
                else if (state === "ERROR") {
                    console.log('Problem saving, response state: ' + state);
                }
                else {
                    console.log('Unknown problem, response state: ' + state);
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
        //alert('checkAllNaceValue'+checkAllNaceValue);
        //alert('checkNaceList'+checkNaceList);
        if(checkAllNaceValue == true) {  
            for (var i = 0; i < checkNaceList.length; i++) {
                 checkNaceList[i].set("v.value", true);
                //alert('Khad test : '+ checkNaceList[i].get("v.text"));
                 selectedNace.push(checkNaceList[i].get("v.text"));
            }
            //alert('selectedNace'+selectedNace);
        }
       else if(checkAllNaceValue == false)
       {
          for (var i = 0; i < checkNaceList.length; i++) {
              checkNaceList[i].set("v.value",false);
            }        
       }
        component.set("v.listNaceSeleced", selectedNace);       
    }//check all Nace
})