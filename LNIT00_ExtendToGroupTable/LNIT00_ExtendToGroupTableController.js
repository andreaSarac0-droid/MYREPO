({
    doInit : function(component, event, helper) {
        var getQuoteAttributeAction = component.get('c.contractTypeSelected');
        getQuoteAttributeAction.setParams({
            "recordId": component.get("v.recordId")
        });
        
        getQuoteAttributeAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state == "SUCCESS")
            {
            	var res = response.getReturnValue();
            	component.set('v.quoteTypeIsTrue', res);
        	}
                                            
            helper.doInit(component, event, helper);
        })
                
        $A.enqueueAction(getQuoteAttributeAction);
        
    },
    handleRowAction: function (component, event, helper) {
        
        var action = event.getParam('action');
        var row1 = event.getParam('row');
        switch (action.name) {
            case 'view_details':
                helper.addToCase(component, row1);
                break;
            default:
                // helper.showRowDetails(row);
                break;
        }
    },
    CloneQuoteFuture : function(component){
        component.set("v.loaded",true);
        var rows = component.get('v.myRows');
        var serverAction = component.get("c.CallCloneQuote"); 
        var oppIds = [];
        var accIds = [];
        rows.forEach(function(element){
            oppIds.push(element.Id);
            accIds.push(element.AccountId);
        });
        serverAction.setParams({
            quoteId: component.get("v.recordId"),
            oppIds:oppIds,
            accIds:accIds,
            size:rows.length     
        });
        serverAction.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.loaded",false);
                //this.changeActionIcons(component, row);
                var navigate = component.get('v.navigateFlow');
                navigate('FINISH');
            }else {
                component.set("v.loaded",false);
                alert('error');
            }
        });
        $A.enqueueAction(serverAction);          
	},
    updateSelectedRows: function (cmp, event) {
        var selectedRows = event.getParam('selectedRows');
        console.log('ROWS: '+JSON.stringify(selectedRows));
        cmp.set('v.myRows', selectedRows);
    },
})