({
	helperSystemCaller : function(cmp , evt , calledSystem , isIframe , queryString) {
    
        var action = cmp.get("c.getRecordType");
        action.setParams({ 
            "recordId" : cmp.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var recTypeName = response.getReturnValue();
                var splittedResponse = recTypeName.split('§');
                cmp.set("v.rType",splittedResponse[0]);
                cmp.set("v.portalVariable",splittedResponse[1]);
                cmp.set("v.circCD" , splittedResponse[2]);
                console.log("RTYPENAME:: "+splittedResponse[0]);
                console.log("portalVariable:: "+splittedResponse[1]);
                console.log("circCD:: "+splittedResponse[2]);
                var realQueryString;
                if(calledSystem === 'Portale Clienti Elettronico'){
                    var redirectPage = cmp.get('v.portalVariable');
                    var circCD = cmp.get('v.circCD');
                    
                    realQueryString = 'portale-clienti?redirect_page='+redirectPage+'&user_type=card';
                    if(circCD != null && circCD != undefined && circCD != ''){
                        realQueryString += '&circ_cd='+circCD;
                    }
                }
                else{
                    realQueryString = queryString;
                }
                /*var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:LNIT00_iframeOpener",
                    componentAttributes: {
                        calledSystem : calledSystem,
                        isIframe : isIframe,
                        queryString : realQueryString
                    }
                });
                evt.fire();*/
                var workspaceAPI = cmp.find("workspaceAPI");
                workspaceAPI.generateConsoleURL({
                    "pageReferences": [
                        {
                            "type": "standard__component",
                            "attributes": {
                                "componentName": "c__LNIT00_iframeOpener" 
                            },
                            "state": {
                                "c__calledSystem": calledSystem,
                                "c__isIframe": isIframe,
                                "c__queryString": realQueryString
                            }
                        }
                    ]
                }).then(function(url) {
                    console.log(url);
                    console.log(calledSystem);
                    workspaceAPI.openSubtab({
                        url: url,
                        focus: true
                    });
                })
                .catch(function(error) {
                    console.log('ERROR'+error);
                });
            }
            else{
                console.log('ERROR: '+response.getError());
            }
        })
        $A.enqueueAction(action);
	}
})