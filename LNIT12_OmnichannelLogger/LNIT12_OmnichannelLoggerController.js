({
    init: function(cmp, evt, hlp) {
        setTimeout(function(){ hlp.LoginUser(cmp , evt , hlp); }, 3000);                    
    },
    
    onLoginSuccess : function(component, event, helper) {
        console.log("Login success.");
        var statusId = event.getParam('statusId');
        console.log(statusId);
    }, 
    
    onStatusChanged : function(component, event, helper) {
        console.log("Status changed.");
        var statusId = event.getParam('statusId');
        var channels = event.getParam('channels');
        var statusName = event.getParam('statusName');
        var statusApiName = event.getParam('statusApiName');
        if (statusApiName != 'Available_Case'){
            var omniAPI = component.find("omniToolkit");
            omniAPI.setServicePresenceStatus({statusId: "0N51t000000g1yq"}).then(function(result) {
                console.log('Current statusId is: ' + result.statusId);
                console.log('Channel list attached to this status is: ' + result.channels); 
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Attenzione!",
                    "message": "Non puoi cambiare il tuo stato."
                });
                //toastEvent.fire();
            }).catch(function(error) {
                console.log(error);
            });
        }
        console.log(statusId);
        console.log(channels);
        console.log(statusName);
        console.log(statusApiName);
    }, 
    
    onLogout : function(component, event, helper) {
        /*var action = component.get('c.getUserPresence');
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                var isOnline = response.getReturnValue();
                console.log('ONLINE? ' + isOnline);
                if(!isOnline ){
                    helper.LoginUser(component , event , helper);                  
                }
            }
        });
        $A.enqueueAction(action);*/
        //TO BE REVISED
        
    }, 
    
})