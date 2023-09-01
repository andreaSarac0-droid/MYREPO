({
    init: function (component, event, helper) {
		console.log('helper:::');
		helper.getCustomMeta(component,event,helper);
     },
	 onChange: function(component,event,helper){
		 console.log(component.get("v.selectedPicklist"));
	 },
	 onCheck: function(component, event) {
		var checkbox = event.getSource();
		console.log(checkbox.get("v.value"));
		//resultCmp.set("v.value", ""+checkCmp.get("v.value"));
	}
})