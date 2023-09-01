({
    KeyUpHandler: function (component, event, helper) {
        var searchString = component.get("v.searchString");
        helper.openListbox(component, searchString);
        helper.displayPredictions(component, searchString);
    },
    selectOption: function (component, event, helper) {
        var list = component.get("v.predictions");
        var placeId = component.get("v.placeId");
        var searchLookup = component.find("searchLookup");
        var iconPosition = component.find("iconPosition");
        var selection  = event.currentTarget.dataset.record;

        for (var i =0; i < list.length; i++) {
            if (list[i].label == selection ) {
                placeId = (list[i].PlaceId);
            }
        }

        component.set("v.selectedOption ", selection);
        component.set("v.searchString", selection);

        $A.util.removeClass(searchLookup, 'slds-is-open');
        $A.util.removeClass(iconPosition, 'slds-input-has-icon_left');
        $A.util.addClass(iconPosition, 'slds-input-has-icon_right');

        helper.displaySelectionDetails(component, placeId);
    },
    clear: function (component, event, helper) {
        helper.clearComponentConfig(component);
    },
    createRecord: function(component, event, helper) {
   
      var street = component.get("v.googleRoute");
      var zip_code = component.get("v.googlePostalCode");
      var city = component.get("v.googleCity");    
      var country = component.get("v.googleCountry");
      var longitude = component.get("v.googleLongitude");
      var latitude = component.get("v.googleLatitude");
      var eshop = component.get("v.eshop");
      var province = component.get("v.googleProvince");   
      var createRecordEvent = $A.get("e.force:createRecord"); 
      var value = helper.getParameterByName(component , event, 'inContextOfRef');
      if(value)
      {
         var context = JSON.parse(window.atob(value));
         component.set("v.parentRecordId", context.attributes.recordId);
      }
      var parentid = component.get("v.parentRecordId");  
      var accid = null;
      var fcid = null;
      if(parentid== undefined )
      {
       parentid = '';   
      }
        if((eshop == false && street !=null && zip_code !=null && city !=null && country !=null && street !="" && zip_code !="" && city !="" && country !="" && province !="" && province != null ) || eshop== true )
      {
        if(parentid.substring(0,3) == "001" )
      {
            accid=parentid;
            fcid = null;
      }
        else if (parentid.substring(0,3) == "a00" )
        {
      accid = null; 
      fcid = parentid;
        }
        else
        {
            accid = null;
            fcid = null;
        } 
      createRecordEvent.setParams({
          "entityApiName": "ER_Store__c", 
           "defaultFieldValues": {
            "ER_Street__c": street,
            "ER_Zip_Code__c": zip_code,
          "ER_City__c": city,
            "ER_Country__c": country,
            "ER_E_Shop__c": eshop,
            "ER_Latitude_Longitude__Latitude__s": latitude,
            "ER_Latitude_Longitude__Longitude__s": longitude,
            "ER_Merchant__c": accid,
            "ER_Financial_Center__c": fcid,
            "ER_State_Province__c" : province   
               }     
       });
       createRecordEvent.fire();
               
      }
      else
      {
       var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
               "title": "Missing Address!",
               "message": "Please fill the Address"
            });
            toastEvent.fire();    
      }    
   },
    CancelClose: function(component, event, helper) {
      var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
            
        })
        .catch(function(error) {
            component.set("v.isOpen", false);
            var parentid = component.get("v.parentRecordId");
      if(parentid!= undefined )
      {
          var navEvt = $A.get("e.force:navigateToSObject");
          navEvt.setParams({
            "recordId": parentid,
            "slideDevName": "related"
          });
      }
      else
      {
        var navEvt = $A.get("e.force:navigateToObjectHome");
          navEvt.setParams({
            "scope": "ER_Store__c"
          });
      }
      navEvt.fire();
        });
   },
    closeModel: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
        var focusedTabId = response.tabId;
        workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            component.set("v.isOpen", false);
          var parentid = component.get("v.parentRecordId");
      if(parentid!= undefined )
      {
          var navEvt = $A.get("e.force:navigateToSObject");
          navEvt.setParams({
            "recordId": parentid,
            "slideDevName": "related"
          });
      }
      else
      {
        var navEvt = $A.get("e.force:navigateToObjectHome");
          navEvt.setParams({
            "scope": "ER_Store__c"
          });
      }
      navEvt.fire();
        });
        
   },
    doInit: function(component, event, helper) {
    var value = helper.getParameterByName(component , event, 'inContextOfRef'); 
      if(value)
      {
         var context = JSON.parse(window.atob(value));
         component.set("v.parentRecordId", context.attributes.recordId);
          var parentid = component.get("v.parentRecordId");
      }
   },
})