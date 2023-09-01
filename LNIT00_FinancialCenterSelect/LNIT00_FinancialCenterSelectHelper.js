({
    invokeAura: function(component, methodName, params){
        console.log('invokeAuraMethod', methodName);
        
        return new Promise($A.getCallback((resolve, reject)=>{
            const action = component.get('c.' + methodName);
            
          	if(params) action.setParams(params);
            
            action.setCallback(this, (response)=>{
                const state = response.getState();
                if(state === 'SUCCESS'){
                    resolve(response);  
                }else if(state === 'ERROR'){
                    throw new Error(response.getError());
                }
            });
            
            $A.enqueueAction(action);
        }));
    },
    loadFinancialCenter : function(component, helper){
    	const accountId = component.get('v.recordId');

    	return helper.invokeAura(component, 'getFinancialCenter', {
			accountId
    	}).then((response)=>{
    		const result = response.getReturnValue();

    		if(!result.isSuccess) throw new Error(result.errorMessage);
            /*if(result.listData.length != 0){
            	component.set('v.financialCenters', result.listData);
        	}*/
    		component.set('v.financialCenters', result.listData);
    		
    		if(result.listData.length > 0){
    			const firstFinancialCenter = result.listData[0];
    			component.set('v.value', firstFinancialCenter.IT_Financial_Center__c);
    		}

    		const onChangeCallback = component.get('v.onChangeCallback');

    		if(onChangeCallback){
    			onChangeCallback(this);
    		}
    		return Promise.resolve(response);
    	})
    },

})