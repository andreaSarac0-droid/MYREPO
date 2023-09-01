({
    doInit : function(cmp, event, helper) {
        var action = cmp.get("c.getContacts");
        action.setParams({ 
            "masterContactId" : cmp.get("v.masterContactId"),
            "slaveContactId" : cmp.get("v.slaveContactId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var contactList = response.getReturnValue();
                cmp.set("v.masterContact",contactList[0]);
                cmp.set("v.slaveContact",contactList[1]);
                console.log("CONTACT SLAVE:: "+contactList[1]);
            }
        })
        $A.enqueueAction(action);
    },
    
    selectAllMaster : function(component, event, helper) {
        component.set("v.masterFirstName" , true);
        component.set("v.masterLastName" , true);
        component.set("v.masterEmail" , true);
        component.set("v.masterPhone" , true);
        component.set("v.masterFax" , true);
        component.set("v.masterPec" , true);
        component.set("v.masterMobile" , true);
        component.set("v.slaveFirstName" , false);
        component.set("v.slaveLastName" , false);
        component.set("v.slaveEmail" , false);
        component.set("v.slavePhone" , false);
        component.set("v.slaveFax" , false);
        component.set("v.slavePec" , false);
        component.set("v.slaveMobile" , false);
    },
    selectAllSlave : function(component, event, helper) {
        component.set("v.slaveFirstName" , true);
        component.set("v.slaveLastName" , true);
        component.set("v.slaveEmail" , true);
        component.set("v.slavePhone" , true);
        component.set("v.slaveFax" , true);
        component.set("v.slavePec" , true);
        component.set("v.slaveMobile" , true);
        component.set("v.masterFirstName" , false);
        component.set("v.masterLastName" , false);
        component.set("v.masterEmail" , false);
        component.set("v.masterPhone" , false);
        component.set("v.masterFax" , false);
        component.set("v.masterPec" , false);
        component.set("v.masterMobile" , false);
    },
    masterFirstName : function(component, event, helper) {
        component.set("v.slaveFirstName" , false);
    },
    masterLastName : function(component, event, helper) {
        component.set("v.slaveLastName" , false);
    },
    masterEmail : function(component, event, helper) {
        component.set("v.slaveEmail" , false);
    },
    masterPhone : function(component, event, helper) {
        component.set("v.slavePhone" , false);
    },
    masterFax : function(component, event, helper) {
        component.set("v.slaveFax" , false);
    },
    masterPec : function(component, event, helper) {
        component.set("v.slavePec" , false);
    },
    masterMobile : function(component, event, helper) {
        component.set("v.slaveMobile" , false);
    },
    slaveFirstName : function(component, event, helper) {
        component.set("v.masterFirstName" , false);
    },
    slaveLastName : function(component, event, helper) {
        component.set("v.masterLastName" , false);
    },
    slaveEmail : function(component, event, helper) {
        component.set("v.masterEmail" , false);
    },
    slavePhone : function(component, event, helper) {
        component.set("v.masterPhone" , false);
    },
    slaveFax : function(component, event, helper) {
        component.set("v.masterFax" , false);
    },
    slavePec : function(component, event, helper) {
        component.set("v.masterPec" , false);
    },
    slaveMobile : function(component, event, helper) {
        component.set("v.masterMobile" , false);
    },
    onButtonPressed: function(component, event, helper) {
        var actionClicked = event.getSource().getLocalId();
        if(actionClicked == 'BACK'){
            var navigate = component.get('v.navigateFlow');
            navigate(actionClicked);
        }
        else{        
            
            //I'm REALLY sorry for this
            
            if(component.get("v.masterFirstName")){
                component.set("v.chosenFirstName" , component.get('v.masterContact').FirstName);
            }
            else{
                component.set("v.chosenFirstName" , component.get('v.slaveContact').FirstName);
            }
            if(component.get("v.masterLastName")){
                component.set("v.chosenLastName" , component.get('v.masterContact').LastName);
            }
            else{
                component.set("v.chosenLastName" , component.get('v.slaveContact').LastName);
            }
            if(component.get("v.masterEmail")){
                component.set("v.chosenEmail" , component.get('v.masterContact').Email);
            }
            else{
                component.set("v.chosenEmail" , component.get('v.slaveContact').Email);
            }
            if(component.get("v.masterPhone")){
                component.set("v.chosenPhone" , component.get('v.masterContact').Phone);
            }
            else{
                component.set("v.chosenPhone" , component.get('v.slaveContact').Phone);
            }
            if(component.get("v.masterFax")){
                component.set("v.chosenFax" , component.get('v.masterContact').Fax);
            }
            else{
                component.set("v.chosenFax" , component.get('v.slaveContact').Fax);
            }
            if(component.get("v.masterPec")){
                component.set("v.chosenPec" , component.get('v.masterContact').IT_PEC__c);
            }
            else{
                component.set("v.chosenPec" , component.get('v.slaveContact').IT_PEC__c);
            }
            if(component.get("v.masterMobile")){
                component.set("v.chosenMobile" , component.get('v.masterContact').MobilePhone);
            }
            else{
                component.set("v.chosenMobile" , component.get('v.slaveContact').MobilePhone);
            }
            console.log(component.get('v.chosenFirstName'));
            console.log(component.get('v.chosenLastName'));
            console.log(component.get('v.chosenEmail'));
            console.log(component.get('v.chosenPhone'));
            console.log(component.get('v.chosenFax'));
            console.log(component.get('v.chosenPec'));
            console.log(component.get('v.chosenMobile'));
            var navigate = component.get('v.navigateFlow');
            navigate(actionClicked);
        }
        
    }
    
})