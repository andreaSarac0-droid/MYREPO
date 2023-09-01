({
    
	alert: function(component, event, helper, variant, title, message){
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode" : "sticky"/*,
            "duration": duration*/
        });
     },
     buttonFilter: function (component,event,helper,recordId){
        console.log('Sei nella sezione del filtro sul pulsante');
        var action = component.get("c.filterDocuSignWelfare2");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();        
            if (state === "SUCCESS") {
                console.log('result: ' + result);
                component.set("v.showDocuSignButton",result);
            } else if (state === "ERROR") {
                helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
     },
    invokeShowButton: function(component, event, helper, recordId){
        console.log('show button');
        var action = component.get("c.disableDocusignButton");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();
            var bool = result.split('+')[0];
            var value = result.split('+')[1];
            
            if (state === "SUCCESS") {
                if (result != null) {
                    console.log(result);
                    
                    if(bool === 'true'){
                        console.log('1',bool);
                        component.set("v.disable", true);
                    }else if(bool === 'false' && value === 'Attivazione'){
                        console.log('2',bool);
                        component.set("v.activationVar",true);
                        component.set("v.disable2", false);
                        $A.util.addClass(component.find('button'), "slds-button_success");
                        component.set("v.buttonLabel",$A.get("$Label.c.IT_Onboarding_Email_Sent"));
                    }else if(bool === 'false' && value === 'Revisione'){
                        console.log('3',bool);
                        //component.set("v.disable", false);
                    	component.set("v.revisioneVar",true);
                    }/*else if(bool === 'false' && value === 'Revisione Merchant'){
                        console.log('3',bool);
                        $A.util.addClass(component.find('button'), "slds-button_success");
                        component.set("v.buttonLabel",$A.get("$Label.c.IT_Onboarding_Email_Sent"));
                    	component.set("v.revisioneMerchantVar",true);
                        component.set("v.disable2", false);
                    }*/else if(bool === 'false' && value == null){
                        console.log('4',bool);

                    }

                } 
            } else if (state === "ERROR") {
                //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    invokeInitDocusignButton: function(component, event, helper, recordId){
        console.log('docusign init');
        var action = component.get("c.disableDocusignButton");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('OK docusign');
                var result = response.getReturnValue();
                console.log('disable docusign button '+result);
                var check = result.split('+')[0];
                var status = result.split('+')[1];
                
                if(check === 'true'){
                    component.set("v.disableDocu",result);
                }else if(check === 'false' && status === 'Signed'){
                    component.set("v.disableDocu",false);
                    $A.util.addClass(component.find('buttonDocu'), "slds-button_success");
                	component.set("v.buttonLabelDocu",$A.get("$Label.c.IT_Contratto_Inviato_Docusign"));
                }else if(check === 'false' && status === 'Sent'){
                    component.set("v.disableDocu",false);
                    $A.util.addClass(component.find('buttonDocu'), "slds-button_success");
                	component.set("v.buttonLabelDocu",$A.get("$Label.c.IT_Contratto_Inviato_Docusign"));
                }/*else if(check === 'false' && status === 'Revision'){
                    component.set("v.disableDocu",false);
                }*/
                
            }else{
                component.set("v.loaded",false);
                helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    invokeDocusignLink: function(component, event, helper, recordId){
        console.log('docusign');
        var action = component.get("c.openDocuSign");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('OK docusign');
                var urlString = window.location.href;
                console.log('URLSTRING:: ' + urlString);
                var baseURL = urlString.substring(0, urlString.indexOf("/r/"));
                var result = response.getReturnValue();
                console.log('link docusign '+encodeURI(result));
                component.set("v.loaded",false);
                component.set("v.disable",true);
                var urlCall = baseURL + encodeURI(result);
                console.log('urlCall: ' + urlCall);
                /*$A.util.addClass(component.find('buttonDocu'), "slds-button_success");
                component.set("v.buttonLabelDocu",$A.get("$Label.c.IT_Contratto_Inviato_Docusign"));*/
                //var link = {!URLFOR("/apex/dfsle__gendocumentgenerator",null,)};
                //var link = encodeURIComponent(result);
                //EncodingUri funziona ma genera messaggio "The link you followed isn’t valid. This page requires a CSRF confirmation token. Report this error to your Salesforce administrator."
                //var link = encodeURI(result);
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({                      
                    //"url" : "/apex/dfsle__gendocumentgenerator',null,'[sId=0065r000004N4PMAA0,templateId=a2p5r000000HsF6AAK,recordId=0065r000004N4PMAA0,title=Contratto Ticket Restaurant cartaceo]"
                    "url": result
                    //"url":'/one/one.app#eyJjb21wb25lbnREZWYiOiJvbmU6YWxvaGFQYWdlIiwiYXR0cmlidXRlcyI6eyJhZGRyZXNzIjoiaHR0cHM6Ly9lci1pdGFseS0tZGV2MDAyLS1kZnNsZS52aXN1YWxmb3JjZS5jb20vYXBleC9nZW5kb2N1bWVudGdlbmVyYXRvcj9zSWQ9MDA2NXIwMDAwMDRONFBNJnRlbXBsYXRlSWQ9YTJwNXIwMDAwMDBIc0Y2QUFLJnJlY29yZElkPTAwNjVyMDAwMDA0TjRQTSZ0aXRsZT1Db250cmF0dG8rVGlja2V0K1Jlc3RhdXJhbnQrY2FydGFjZW8mX0NPTkZJUk1BVElPTlRPS0VOPVZtcEZQU3hOYWtGNVRXa3dkMDFwTUhoTk1WRjNUMFJ2TVU1NmIzZFBRelEwVGxST1lTeEhiSGhWU1RkeVFUQkRlV1U1VWtoVlRFNHlUbGR4TEUxRVRYbGFhbXMxJmNvbW1vbi51ZGQuYWN0aW9ucy5BY3Rpb25zVXRpbE9SSUdfVVJJPSUyRmFwZXglMkZkZnNsZV9fZ2VuZG9jdW1lbnRnZW5lcmF0b3IifSwic3RhdGUiOnt9fQ%3D%3D'
                });
                urlEvent.fire();
                //window.open(link,"_blank");//_parent//_blank
            }else{
                component.set("v.loaded",false);
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                	message += errors[0].message;
            	}
                console.error('errors',message);
                helper.alert(component,event,helper,"error",message,'');
                //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    invokeIsMerchant: function(component, event, helper, recordId){
        console.log('isMerchant');
        var action = component.get("c.isMerchant");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();
            
            if (state === "SUCCESS") {
                if (result != null) {
                    console.log(result);   
                    component.set("v.merchant", result);
                } 
            } else if (state === "ERROR") {
                //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    invokeActivation: function(component, event, helper, recordId){
        console.log('show button');
        var action = component.get("c.activation");
        action.setParams({
            "recordId" : recordId
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            var result = response.getReturnValue();
            
            if (state === "SUCCESS") {
                if (result != null) {
                    console.log(result.length);   
                    component.set("v.activationVar", result);
                    $A.util.addClass(component.find('button'), "slds-button_success");
                    component.set("v.buttonLabel",'Onboarding Email inviata');
                    /*if(result){
                        $A.util.addClass(component.find('button'), "slds-button_success");
    					component.set("v.buttonLabel",'Onboarding Email inviata');
                    }*/
                } 
            } else if (state === "ERROR") {
                //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
            }
        });
        $A.enqueueAction(action);
    },
    invokeResendLink: function(component, event, helper, recordId){
        console.log('show button');
            var action = component.get("c.isLinkSent");
            action.setParams({
                "recordId" : recordId
            })
            action.setCallback(this, function (response) {
                var state = response.getState();
                var result = response.getReturnValue();
                
                if (state === "SUCCESS") {
                    if (result != null) {
                        console.log(result);   
                        component.set("v.disable3", result);
                    } 
                } else if (state === "ERROR") {
                    //helper.alert(component, event, helper, 'error', 'ERROR', 'Please, contact your system administrator.');
                }
            });
            $A.enqueueAction(action);
		},
    //send onboarding merchant
    invokeSendOnboarding : function(component, event, helper,recordId) {

        
        //component.set("v.loaded",true);
        //var recordId = component.get("v.recordId");
        const action = component.get('c.activateOpportunity');
        action.setParams({
            recordId : recordId
        });
        action.setCallback(this, (response)=>{
            //var status = response.getState();
            var returnVal = response.getReturnValue();
            console.log('returnVal',returnVal);
            if(returnVal === null || returnVal === ''){
                var errors = response.getError();
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                	message += errors[0].message;
            	}
                console.error('errors',message);
                helper.alert(component,event,helper,"error",message,'');
                //helper.alert(component,event,helper,"Error",'An internal error occurred. Please, contact your administrator.','');
                component.set("v.loaded",false);
            }else {
                var status = returnVal.split('·')[0];
                if(status === 'MERCHANT'){
                component.set("v.loaded",false);
                helper.alert(component,event,helper,"success",'Invio onboarding in corso.','');
                //$A.util.addClass(component.find('button'), "slds-button_success");
                //component.set("v.buttonLabel",$A.get("$Label.c.IT_Onboarding_Email_Sent"));
                component.set("v.disable", false); 
                component.set("v.disable2", false);
                $A.get('e.force:refreshView').fire();
            
            }else if(status === 'ERROR'){
                component.set("v.loaded",false);
                var statusCode = returnVal.split('·')[1];
                var message = returnVal.split('·')[2];
                
                console.error('Error code: '+statusCode+' - '+message);
                helper.alert(component,event,helper,"error",'Errors activating opportunity: '+statusCode+message,message);
            }
        }
	});

	$A.enqueueAction(action);
        
	}
})