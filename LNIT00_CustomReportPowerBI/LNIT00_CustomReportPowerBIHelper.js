({
getReportUrl: function(component,helper,recordId,reportname) {
        var action = component.get('c.getPowerBiClassDev');
    action.setParams({sobject_id:recordId,report_name:reportname});
        action.setCallback(this, (response)=>{
            const state = response.getState();
            console.log('state',state);
            if(state === 'SUCCESS'){
             component.set("v.reportURL",response.getReturnValue());
			}else if( state === 'ERROR'){
    
			}			               
		});
		$A.enqueueAction(action);
	}
})