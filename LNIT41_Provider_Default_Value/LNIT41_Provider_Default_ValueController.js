({
    runFlow : function( component, event, helper ) {
        component.set( "v.showModal", true );
        var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        var flow = component.find("flowData");

        flow.startFlow("IT103_Default_Value_Agreement_Provider",inputVariables);
         
    },

    statusChange : function (component, event, helper ) {
        if (event.getParam('status') === "FINISHED") {
            component.set('v.showModal', false);
            $A.get('e.force:refreshView').fire();
            
        }
    },
    
    closeModal:function(component,event,helper){    
        component.set('v.showModal', false);
    }
})