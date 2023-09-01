({
	init : function(cmp, event, helper) {
        let listValueCheckbox = [{label: 'valore di default', value: 'default'}];      
        let listObj;
        let stringReturn;
        let query = cmp.get('v.NomeCampo');
        let action = cmp.get('c.picklistValue');
        console.log('vediamoo');
        action.setParams({'query':query});
        action.setCallback(this, (response) => {
            let state = response.getState();
            console.log(state);
            if(state == 'SUCCESS'){
            listObj  = response.getReturnValue();
            
            listObj.map((element) =>{
            let objCheckbox = {};
                objCheckbox.label = element.Name;
                objCheckbox.value = element.Id;
                listValueCheckbox.push(objCheckbox);           
        
    		})
    
    
    			console.log(listValueCheckbox)
    			cmp.set('v.options', listValueCheckbox);
			}
 			else{
 				console.log(JSON.stringify(response.getError()));
			}               
		});
		$A.enqueueAction(action);


	},
    
    handleChange : function(cmp, event, helper) {
        helper.handleChange(cmp, event, helper);
        
	},
    
    selectAll : function(cmp, event, helper) {
        let checkSelAll = cmp.find('checkbox');
        let options =  cmp.get('v.options');
        let value= [];
        let str = '';
        if(checkSelAll.get('v.value')){
            options.map((element) => {
                
                value.push(element.value);
                
            });
                console.log('sono qua')
            str = value.join('; ')
            console.log(value);
            console.log('stringa '+str);
        	cmp.set('v.value' , value);
            helper.handleChange(cmp, event, helper,str);
			console.log('è passato di qua?')        	
        }
        else{
           cmp.set('v.value' , value); 
        }
        
	}
})