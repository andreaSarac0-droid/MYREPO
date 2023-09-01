({
  KeyUpHandler: function(component, event, helper) {
    var searchString = component.get("v.searchString");
    helper.openListbox(component, searchString);
    helper.displayPredictions(component, searchString);
  },
  selectOption: function(component, event, helper) {
    var list = component.get("v.predictions");
    var placeId = component.get("v.placeId");
    var searchLookup = component.find("searchLookup");
    var iconPosition = component.find("iconPosition");
    var selection = event.currentTarget.dataset.record;

    for (var i = 0; i < list.length; i++) {
      if (list[i].label == selection) {
        placeId = list[i].PlaceId;
      }
    }

    component.set("v.selectedOption ", selection);
    component.set("v.searchString", selection);

    $A.util.removeClass(searchLookup, "slds-is-open");
    $A.util.removeClass(iconPosition, "slds-input-has-icon_left");
    $A.util.addClass(iconPosition, "slds-input-has-icon_right");

    helper.displaySelectionDetails(component, placeId);
  },
  clear: function(component, event, helper) {
    helper.clearComponentConfig(component);
  },
  UpdateRecord: function(component, event, helper) {
    var street = component.get("v.googleRoute");
    var zip_code = component.get("v.googlePostalCode");
    var province = component.get("v.googleProvince");   
    var city = component.get("v.googleCity");
    var country = component.get("v.googleCountry");
 
    if (street != null && zip_code != null && city != null && country != null && province != null && street != "" && zip_code != "" && city != "" && country != "" && province != "") {
      var recId = component.get("v.recordId");
      var updateAction = component.get("c.updateStore");
      if(component.get("v.googleLatitude")!=undefined || component.get("v.googleLongitude")!=undefined)
      {
       var sJson = "{" +'"oId" : "' +component.get("v.recordId") +'",' +'"sStreet" : "' +component.get("v.googleRoute") +'",' +'"sPostalCode" : "' +component.get("v.googlePostalCode") +'",' +'"sProvince" : "' +component.get("v.googleProvince") +'",' +'"sCity" : "' +component.get("v.googleCity") +'",' +'"sLat" : "' +component.get("v.googleLatitude") +'",' +'"sLong" : "' +component.get("v.googleLongitude") +'",' +'"sCountry" : "' +component.get("v.googleCountry") +'"' +"}";
      }
      else
      {
       var sJson = "{" +'"oId" : "' +component.get("v.recordId") +'",' +'"sStreet" : "' +component.get("v.googleRoute") +'",' +'"sPostalCode" : "' +component.get("v.googlePostalCode") +'",' +'"sProvince" : "' +component.get("v.googleProvince") +'",' +'"sCity" : "' +component.get("v.googleCity") +'",' +'"sCountry" : "' +component.get("v.googleCountry") +'"' +"}";
      }     
      updateAction.setParams({
        sJson: sJson
      });

      updateAction.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          var jsonUpdateInfo = response.getReturnValue();
          // Prepare a toast UI message

          var toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
            type: "success",
            mode: "dismissible",
            duration: "3000",
            //message: jsonUpdateInfo.Name + " is updated!"
            message: "Address is updated!"
          });
          $A.get("e.force:closeQuickAction").fire();
          $A.get("e.force:refreshView").fire();
          toastEvent.fire();
        } else if (state === "ERROR") {
          console.log("Problem saving, response state: " + state);
        } else {
          console.log("Unknown problem, response state: " + state);
        }
      });
      $A.enqueueAction(updateAction);
    } else {
      var toastEvent = $A.get("e.force:showToast");
      toastEvent.setParams({
        title: "Missing Address!",
        message: "Please fill the Address"
      });
      toastEvent.fire();
    }
  },
  CancelClose: function(component, event, helper) {
    $A.get("e.force:closeQuickAction").fire();
  }
});