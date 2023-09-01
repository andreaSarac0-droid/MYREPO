({
	 alert: function(component, event, helper, variant, title, message){
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode" : "sticky"/*,
            "duration": duration*/
        });
     }
})