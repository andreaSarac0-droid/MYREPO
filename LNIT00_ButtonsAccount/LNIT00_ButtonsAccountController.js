({
    oninit : function (component, event, helper)
    {
        if(component.get('v.AddCharge'))
            helper.getQuoteType(component)
        if (component.get('v.SendToCommittee') || component.get('v.CreditCheck')){
            helper.getProdutctUta(component)
        }
        if(component.get('v.GestCred')){
            var recordId = component.get("v.recordId");
			helper.buttonFilter(component, event, helper, recordId);
        }
          
    },

    init : function (component) {
        // Find the component whose aura:id is "flowId"
      
        var flow = component.find("ChangeVat");
        // In that component, start your flow. Reference the flow's Unique Name.
        flow.startFlow(component.find("IT56_ChangeVat"));
                // Find the component whose aura:id is "flowId"
      
        var flow = component.find("IT_New_Agreement");
        // In that component, start your flow. Reference the flow's Unique Name.
        flow.startFlow(component.find("IT_New_Agreement"));
    }
})