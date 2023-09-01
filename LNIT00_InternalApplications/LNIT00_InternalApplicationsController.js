({
    init : function(component, event, helper) {
		var actionName = component.get("c.getProfileName");
        actionName.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var profName = response.getReturnValue();
                component.set("v.profileName",profName);
                console.log(profName);
            }
			else{
				console.log('ERRORE!!!');
			}
        });
        $A.enqueueAction(actionName);
		component.set('v.spinner', true);
		
		component.set('v.onSelectFinancialCode', (target)=>{
			component.set('v.spinner', true);

			helper.financialCenter(component, target);
			
			helper.initContext(component, helper).finally(()=>{
				component.set('v.spinner', false);
			})
		});

		const sObjectName = component.get("v.sObjectName");

		if(sObjectName == 'Case'){
	    	helper.initContext(component, helper).finally(()=>{
	    		component.set('v.spinner', false);
	    	})
		}
    },
    onClick: function(component, event, helper){
    	const recordId = event.target.dataset.recordId;
    	const configs = component.get('v.configs');

    	const config = configs[recordId];
		
		component.set('v.spinner', true);
    	helper.navigateToUrl(component, helper, config).finally(()=>{
    		component.set('v.spinner', false);
    	})
    }
})