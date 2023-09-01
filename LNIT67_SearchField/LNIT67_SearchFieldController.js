({
	init : function(component, event, helper) {
        console.log('init');
	},
    getRecordsFunction: function(component, event, helper){
        console.log('getRecordsFunction');
        //helper.getRecords(component, event);
        var inputvar = component.get('v.inputString');
        console.log('inputvar:'+inputvar);
        component.set('v.recordsList', []);
        console.log('recordsList:'+component.get('v.recordsList'));
		// Calling Apex Method
    	var action = component.get('c.getSearchResults');
        console.log('prova');
        console.log(component.get('v.filteringOptions'));
        console.log(component.get('v.additionalFilter'));
        action.setParams({
            'fieldObject' : component.get('v.filteringOptions'),
            'addFilter' : component.get('v.additionalFilter'),
            'searchString' : inputvar
        });
        
        action.setCallback(this,function(response){
        	var result = response.getReturnValue();
        	if(response.getState() === 'SUCCESS') {
    			if(result.length > 0) {
                    component.set('v.recordsList',result); 
    				// To check if value attribute is prepopulated or not
					/*if( $A.util.isEmpty(searchString) ) {
                        component.set('v.recordsList',result); 
					} else {
                        component.set('v.selectedRecord', result[0]);
					}*/
    			} /*else {
    				component.set('v.message', "No Records Found for '" + searchString + "'");
    			}*/
        	} else {
                // If server throws any error
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    //component.set('v.message', errors[0].message);
                    cosole.log('selectedrecordvaluerror2:'+result[0]);
                }
            }
        });
        $A.enqueueAction(action);
    },
    getSelectedRecord: function (component, event, helper){
        console.log("SELECTED EMAIL");
        var selectedItem = event.currentTarget;
        var placeid = selectedItem.dataset.placeid;
        console.log('placeid',JSON.stringify(placeid));
        var email = placeid;
        
        console.log('email',email);
        component.set('v.inputString',email);
        component.set('v.selectedResult',email);
        component.set('v.recordsList', []);
    },
})