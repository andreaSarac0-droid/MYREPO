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
	financialCenter: function(component){
		const financialCenterCmp = component.find('finacial-center');
		const financialCenter = financialCenterCmp.get('v.value');
		console.log('TROVATO',financialCenter);
		let options = component.get('v.options');
		if(!options) options = {};
		
		if(financialCenter) options.financialCenter = financialCenter;

		component.set('v.options', options);
        var action = component.get("c.getCardType");
        action.setParams({ 
            "fcNumber" : financialCenter
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                console.log('RESPONSE',response.getReturnValue());
                component.set('v.isCard', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
	},
	initContext: function(component, helper){
		const recordId = component.get('v.recordId');
		const sObjectName = component.get("v.sObjectName");

		const options = component.get('v.options');

		return helper.invokeAura(component, 'initData', {
			sObjectName,
			recordId,
			options
		}).then((response)=>{
			const result = response.getReturnValue();

			if(!result.isSuccess) throw new Error(result.errorMessage);

			const configsOrder = result.configs.sort((configA, configB)=>{
				return (configA.IT_GroupIndex__c > configB.IT_GroupIndex__c) ? 1 : -1;
			})

			const groups = {};
			for(let index in configsOrder){
				const value = configsOrder[index];

				let group = groups[value.IT_Group__c];
				if(!group){
					group = { Name: value.IT_Group__c || value.IT_Group__c, links: [] };
				}

				group.links.push(value);

				groups[value.IT_Group__c] = group;

			}

			const groupsArray = [];
			for(let index in groups){
				let group = groups[index];

				group.links = group.links.sort((linkA, linkB)=>{
					return (linkA.IT_Index__c > linkB.IT_Index__c) ? 1 : -1;
				});

				groupsArray.push(group);
			}

			const configs = {};
			for(let index in result.configs){
				const value = result.configs[index];

				configs[value.Id] = value;
			}
			//console.log(component.get('v.profileName'));
			console.log('Deserialize: ' + JSON.stringify(groupsArray));
			component.set('v.configs', configs);
			component.set('v.groups', groupsArray);

			return Promise.resolve(response);
		}).catch((err)=>{
			console.log('err', err);
		    component.set('v.loaded', true);

		    const toastEvent = $A.get("e.force:showToast");
		    toastEvent.setParams({
		        "title": "Error!",
		        "message": err.message,
		        "type": 'error'
		    });
		    toastEvent.fire();
		})
	},
	navigateToUrl: function(component, helper, config){
		const workspaceAPI = component.find("workspaceAPI");

		const calledSystem = config.IT_CalledSystem__c;
		const isIframe = config.IT_IsIframe__c;
        var queryString = config.IT_QueryString__c || '';
        var isCard = component.get('v.isCard');
        if(queryString.includes('user_type=card') && !isCard){
            console.log('OKAY');
            var queryString = queryString.replace('user_type=card','user_type=ticket');
            console.log('OKAY'+queryString);
        }
        console.log('calledSystem: %s isIframe: %s queryString: %s', calledSystem, isIframe, queryString);
        
        return workspaceAPI.generateConsoleURL({
            "pageReferences": [
                {
                    "type": "standard__component",
                    "attributes": {
                        "componentName": "c__LNIT00_iframeOpener" 
                    },
                    "state": {
                        "c__calledSystem": calledSystem,
                        "c__isIframe": isIframe,
                        "c__queryString": queryString
                    }
                }
            ]
        }).then((url) => {
            workspaceAPI.openSubtab({
            url: url,
            focus: true
        });
        
        return Promise.resolve(url);
    }).catch(function(error) {
        console.log('ERROR'+error);
    });
}
})