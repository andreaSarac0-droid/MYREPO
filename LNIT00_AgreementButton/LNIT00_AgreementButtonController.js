({
    runFlow : function( component, event, helper ) {
        let flowName = event.getSource().get( "v.name" );
        var inputVariables = [ { name : "recordId", type : "String", value: component.get("v.recordId") }];
        component.set( "v.showModal", true );

        $A.createComponent(
            "lightning:flow",
            {
                "onstatuschange": component.getReference( "c.hideModal" )
            },
            ( flow, status, errorMessage ) => {
                if ( status === "SUCCESS" ) {
                    component.set( "v.body", flow );
                    component.set( "v.flow", flow );
                if (component.get("v.recordId")) {
flow.startFlow( flowName,inputVariables);
} else {
 flow.startFlow( flowName);
}
                    
                }
            }
        );
    },

    hideModal : function( component, event, helper ) {
        if ( event.getParam( "status" ).indexOf( "FINISHED" ) !== -1 ) {
            component.set( "v.showModal", false );
            component.get( "v.flow" ).destroy();
   $A.get('e.force:refreshView').fire();

        }

    },
      isRefreshed: function(component, event, helper) {
        location.reload();
    },
            closeModal:function(component,event,helper){    
        component.set('v.showModal', false);
    }
})