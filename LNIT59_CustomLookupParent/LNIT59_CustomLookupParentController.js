({
    doInit : function(component, event, helper) {
  helper.doInit(component, event, helper);
    },
    
    render : function(component, event, helper) {
  helper.render(component, event, helper);
    },
    
    onchange : function(component, event, helper) {
        helper.onchange(component, event, helper);
    },
    
    onblur : function(component, event, helper) {
        helper.onblur(component, event, helper);
    },
    
    onfocus : function(component, event, helper) {
        component.set("v.iconName" , "standard:account");
        component.set("v.sObject" , "Account");
        helper.onfocus(component, event, helper);
        console.log(component.get("v.sObject"));
    },
    onfocus2 : function(component, event, helper) {
        component.set("v.iconName" , "custom:custom61");
        component.set("v.sObject" , "ER_Financial_Center__c");
        helper.onfocus(component, event, helper);
        console.log(component.get("v.sObject"));
    },
    onfocus3 : function(component, event, helper) {
        component.set("v.iconName" , "custom:custom63");
        component.set("v.sObject" , "IT_Circuit__c");
        helper.onfocus(component, event, helper);
        console.log(component.get("v.sObject"));
    },
    onfocusContact : function(component, event, helper) {
        component.set("v.iconName" , "standard:contact");
        component.set("v.sObject" , "Contact");
        helper.onfocus(component, event, helper);
        console.log(component.get("v.sObject"));
    },
    
    handleRemoveOnly : function(component, event, helper) {
        helper.handleRemoveOnly(component, event, helper);
    },
    
    onOptionClick : function(component, event, helper) {
        helper.onOptionClick(component, event, helper);
    },
    
    handleEvent : function(component, event, helper) {
        helper.handleEvent(component, event, helper);
    },
    onSubmit : function(component, event, helper) {
        var icona = component.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');
        helper.onSubmit(component, event, helper);
		
        // SETTHISDELAYED$A.util.toggleClass(icona, 'rotator');
    },

})