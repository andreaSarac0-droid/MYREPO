({
	doInit : function(component, event, helper) {
		component.set('v.loaded', false);
		helper.showEDocument(component, event, helper); 
		
	},
    onButtonPressed1 : function(component, event, helper) {
        var changeType='Next';
        helper.changePage(component,event,changeType);
        helper.showEDocument(component, event, helper);
    },
     onButtonPressed2 : function(component, event, helper) {
        var changeType='Back';
        var pageNumber = component.get("v.pageNumber");
         if(pageNumber>1){
             helper.changePage(component,event,changeType);
         }
         else{
             button.set('v.isButtonActive',false);
         }
        helper.showEDocument(component, event, helper);
    }
})