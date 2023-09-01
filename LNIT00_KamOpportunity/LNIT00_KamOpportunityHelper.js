({
    applyConfig: function (component, helper, workbook) {    	
    	const configs = [];
    	const fields = [];
    	const products = new Set();
    	const regions = new Set();
    	
    	let colId = 1;
    	let cell;
    	while((cell = helper.config.cell('config', colId, 1)).value()){
    		fields.push(cell.value());

    		colId ++;
    	}

    	let rowId = 2;
    	let row;
    	while((row = helper.config.cell('config', 1, rowId)).value()){
    		const config = {};

    		fields.forEach((developerName, index) => {
    			const value = helper.config.cell('config', index + 1, rowId).value();

    			config[developerName] = value;
    		})
    		
    		if(config.Product_Name !== 'NULL') products.add(config.Product_Name);
    		if(config.State_Description !== 'NULL') regions.add(config.State_Description);

    		configs.push(config);

    		rowId ++;
    	}

    	return {
    		configs,
    		products: [...products.values()].sort(),
    		regions: [...regions.values()].sort()
    	}
    },
    invokeAura: function(component, methodName, params){
        console.log('invokeAuraMethod', methodName);
        
        return new Promise($A.getCallback((resolve, reject)=>{
            const action = component.get('c.' + methodName);
            
            if(params) action.setParams(params);
            console.log('params',params);
            action.setCallback(this, (response)=>{
                const state = response.getState();
            	console.log('state',state);
                if(state === 'SUCCESS'){
                    resolve(response);
                }else if(state === 'ERROR'){
                    throw new Error(response.getError());
                }
            });
            
            $A.enqueueAction(action);
        }));
    },
    invokeGetProductAndRegion: function(component, helper, recordId, sObjectName){

        return helper.invokeAura(component, 'getProductAndRegion', {
            recordId,
            sObjectName
        })
   	},
    invokeGetQRPCInfo: function(component, helper, recordId, sObjectName){
		console.log('invokeGetQRPCInfo');
        return helper.invokeAura(component, 'getQRPCInfo', {
            recordId,
            sObjectName
        }).then((response)=>{
            component.set('v.productInfo',response.getReturnValue());
        });
   	}
 })