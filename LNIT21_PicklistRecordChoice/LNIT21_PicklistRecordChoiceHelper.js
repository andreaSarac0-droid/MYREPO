({
	listSelectedAll : function(cmp, listItems) {
		return listItems
	},
    
    handleChange : function(cmp,event,helper,str){
        let strHandle = '';
    	let val = event.getParam('value');
        
        if(val == undefined){
            
            
            cmp.set('v.choisesId',str)
            console.log('vediamo cos aritorna ' +cmp.get('v.choisesId'))
        }
        else{
            strHandle = val.join('; ')
            console.log('string nell change '+strHandle)
            cmp.set('v.choisesId',strHandle);
        }
		
	}
})