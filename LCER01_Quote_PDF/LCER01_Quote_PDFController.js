({  
    init : function(component, event, helper){

        //helper.toggleSpinner(component);
        /**/
        
        helper.getTemplates(component, event, helper);     
        //helper.toggleSpinner(component);
        //$A.enqueueAction(action);
    },
    cancelClick : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    Preview : function(component, event, helper) {
        
        helper.previewHelper(component, event, helper);
    },
    saveClick : function(component, event, helper) {
        
        helper.saveHelper(component, event, helper);
    },    
    closeModel: function(component, event, helper) {

        component.set("v.isOpen", false);
    }
})