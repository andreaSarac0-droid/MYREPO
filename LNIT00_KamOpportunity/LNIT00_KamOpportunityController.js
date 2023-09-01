({
    doInit : function(component, event, helper) {
    	component._set = function(value){
			for(let index in value) this.set(`v.${index}`, value[index]);
		}

    	const urlTemplates = $A.get("{!$Resource.kamEngineTemplates}");
    	helper.kam = new window.$K();

		helper.config = new window.$K();
    	helper.config.hook({
    		baseUrl: `${window.location.origin}${urlTemplates}`
    	});
		const recordId = component.get('v.recordId');
        const sObjectName = component.get('v.sObjectName');

        helper.invokeGetQRPCInfo(component, helper, recordId, sObjectName);
        
    	helper.config.loadExcel('config').then((workbook)=>{
    		const data = helper.applyConfig(component, helper, workbook);
    		component._set(data);
        }).then(()=>{
            return helper.invokeGetProductAndRegion(component, helper, recordId, sObjectName);
        }).then((response)=>{
            console.log('product&region',response.getReturnValue());
            var resp = response.getReturnValue().split('||');

            const product = resp[0];//'TICKET RESTAURANT';
            component.set('v.productSelect',product);
            
            const region = resp[1];//'LOMBARDIA';
            component.set('v.regionSelect',region);
            
            if(product && region){
                const configs = component.get('v.configs');
    
                const result = configs.filter((config)=>{
                    return config.Product_Name === product && config.State_Description === region;
                });
    
                const fixedSearch = configs.filter((config)=>{
                    return config.Product_Name === 'NULL' && config.State_Description === 'NULL';
                });
    
                if(result.length === 1){
            		
                    const configSelect = {};
                    
                    const fixedBase = fixedSearch[0];
                    for(let index in fixedBase){
                        const value = fixedBase[index];
    
                        if(value && value !== 'NULL') configSelect[index] = value;
                    }
    
                    const configFind = result[0];
                    for(let index in configFind){
                        const value = configFind[index];
    
                        if(value && value !== 'NULL') configSelect[index] = value;
                    }
            
            		var productConfig = component.get('v.productInfo');//
            		console.log('productConfig', productConfig);//
                    for(let index in productConfig){
                        const value = productConfig[index];
            
            			configSelect[index] = value
                    }
    				//configSelect[configSelect.lenght] = productConfig;//
            		console.log('configSelect', configSelect);//
                    component._set({configSelect, title: configSelect.title, template: configSelect.template, spinner: true, reaload: false});    			
                    setTimeout(()=>{component._set({spinner: false, reaload: true})}, 200);
                }
            }
        }).finally(()=>{
    		component._set({spinner: false});
    	})
    
    	
    }

})