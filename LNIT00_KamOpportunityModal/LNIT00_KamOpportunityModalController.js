({
    onOpen : function(component, event, helper) {
    	component.set('v.show', true);
    },
    onClose : function(component, event, helper) {
    	component.set('v.show', false);
    },
})