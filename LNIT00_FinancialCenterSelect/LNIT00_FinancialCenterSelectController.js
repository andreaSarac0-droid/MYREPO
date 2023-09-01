({
    onInit : function(component, event, helper) {
    	helper.loadFinancialCenter(component, helper);
    },
    onChange: function(component, event, helper){
    	const onChangeCallback = component.get('v.onChangeCallback');

    	if(onChangeCallback){
    		onChangeCallback(this);
    	}
    }
})