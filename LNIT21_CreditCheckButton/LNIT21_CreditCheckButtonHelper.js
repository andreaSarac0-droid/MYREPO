({
	mainMethod: function(component,helper,recordId,userId) {
      
        var action = component.get('c.retiveAnyPointData');
        action.setParams({objectid:recordId,userIDstr:userId});
        action.setCallback(this, (response)=>{
            const state = response.getState();
            console.log('state',state);
            if(state === "SUCCESS"){
            component.set("v.loaded", false);
            const result = response.getReturnValue();
            if(result == "success"){
            component.find('notifLib').showToast({
                    "variant": "success",
                    "message": "Credit check succeeded.",
                    "mode" : "sticky"
				});
            }else if((result != "success") && (result != "error")){
                  component.find('notifLib').showToast({
                        "variant": "error",
                        "message": "This Error occured while retriving data: " +result,
                        "mode" : "sticky"
                        });
            }
            else{
            component.find('notifLib').showToast({
                    "variant": "error",
                    "message": "An Error occured while retriving data.",
                    "mode" : "sticky"
        		});
			}	
            
			}else if( state === "ERROR"){
                component.set("v.loaded", false);
              component.find('notifLib').showToast({
                    "variant": "error",
                    "message": "An Error occured while retriving data.",
                    "mode" : "sticky"
        		});
			}			               
		});
		$A.enqueueAction(action);
	}
})