({
	doInit : function(component, event, helper){ 
        console.log(component.get('v.opportunities'));
		helper.addProduct(component,event,helper);
	},
    
    handleAddProductSelection: function(component, event, helper){
        console.log('rows selected',event.getParam('selectedRows'))
        component.set('v.selectedMetadata', event.getParam('selectedRows'));
    },
    handleAddProductNext: function(component, event, helper){
        
        let selectedMetadata = component.get('v.selectedMetadata');
        console.log('selectedMetadata',selectedMetadata);
        
        let selectedMetadataIds = [];

        for(let i = 0; i < selectedMetadata.length; i++)
        {
            let element = selectedMetadata[i];
            selectedMetadataIds.push(element.Id);
        }
        
        helper.handleAddProductNextHelper(component, event, helper, selectedMetadataIds);

        
        var compEvents = component.getEvent("componentEventFired");// getting the Instance of event
        compEvents.setParams({ "showFlag" : false });// setting the attribute of event
        compEvents.fire();// firing the event.
        
        
        var navigate = component.get("v.navigateFlow");
        
        if(navigate)
            navigate("NEXT");
    },

    handleDismissShowAddProduct: function(component, event, helper)
    {
        var compEvents = component.getEvent("componentEventFired");// getting the Instance of event
        compEvents.setParams({ "showFlag" : false });// setting the attribute of event
        compEvents.fire();// firing the event.
    }
})