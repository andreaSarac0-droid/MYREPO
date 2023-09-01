({
    doInit : function(component, event, helper) {
        var selectedValue = component.get('v.selectedValue');
        console.log('selectedValue '+ selectedValue);
        component.set('v.spinner', true);
            //    helper.fetchAccounts(component, event,helper);
       helper.getCampaigns(component, helper).then((response)=>{
            const result = response.getReturnValue();
            if(result.length > 0){
            	const campaign = result[0];
                       helper.getCampaignsDoneCount(component, helper, campaign.recordId);
                       helper.getCampaignsToDoCount(component, helper, campaign.recordId);
            		   helper.getCampaignsToDoCountNotResponded(component, helper, campaign.recordId);
              //  return helper.getCampaignContacts(component, helper, campaign.recordId);
                return helper.fetchAccounts(component, event,helper,campaign.recordId);
           }
            return Promise.resolve();
        }).finally(()=>{
    if(selectedValue != null && selectedValue != undefined){
        component.set('v.selectedValue',selectedValue);
    console.log('selectedValue PRIMA DEL METODO '+ selectedValue);
    $A.enqueueAction(component.get('c.onChangeSelect'));
    	//this.onChangeSelect(component, event, helper);
    	
    }
            component.set('v.spinner', false);
        }) 
    },
        
        
    goToObject : function (component, event, helper) {
        const accountId = event.target.dataset.accountId;

        const navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": accountId,
            "slideDevName": "related"
        });

        navEvt.fire();
    },
    onChangeSelect: function(component, event, helper){
        const recordId = component.get('v.selectedValue');
        
        component.set('v.spinner', true);
        helper.getCampaignsDoneCount(component, helper, recordId);
        helper.getCampaignsToDoCount(component, helper, recordId);
        helper.getCampaignsToDoCountNotResponded(component, helper, recordId);
/*        helper.getCampaignContacts(component, helper, recordId).finally(()=>{
            component.set('v.spinner', false); */
        helper.fetchAccounts(component, event,helper,recordId).finally(()=>{
            component.set('v.spinner', false);
            component.set('v.selectedValue',recordId);
        });
    },
                updateColumnSorting: function(component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
       helper.sortData(component, fieldName, sortDirection);
    },
            handleNext : function(component, event, helper) { 
                var pageNumber = component.get("v.pageNumber");
                component.set("v.pageNumber", pageNumber+1);
                helper.paginate(component, event, pageNumber);
            },
            
            handlePrev : function(component, event, helper) {        
                var pageNumber = component.get("v.pageNumber");
                component.set("v.pageNumber", pageNumber-1);
                helper.paginate(component, event, pageNumber-2);
            },
})