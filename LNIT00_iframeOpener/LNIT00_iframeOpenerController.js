({
    init : function(component, event, helper) {
		var action = component.get('c.callLegacyLink');
        action.setCallback(this, function(response) {
			if (response.getState() == "SUCCESS") {
 
				var linkList = response.getReturnValue();
			
				var calledSystem = component.get("v.calledSystem");
				var isIframe = component.get('v.isIframe');
				var jiraSub = component.get("v.jiraSubject");
				var queryString = component.get("v.queryString");
				var secondFrame;
				console.log("JIRA SUB :: " + jiraSub);
				if (calledSystem == null || calledSystem == ""){
					calledSystem = component.get("v.pageReference").state.c__calledSystem;
					isIframe = component.get("v.pageReference").state.c__isIframe;
					queryString = component.get("v.pageReference").state.c__queryString;
				}
				
				console.log ("COMPONENT CALLED SYS:: "+calledSystem);
				console.log ("COMPONENT CALLED IFRAME?:: "+isIframe);
				console.log ("QUERYSTRING??:: "+queryString);
				console.log ("QUERYSTRING PARSATA??:: "+decodeURIComponent(queryString));
				var workspaceAPI = component.find("workspace");
				component.set("v.isIframe" , isIframe);
                component.set("v.calledSystem" , calledSystem);
				component.set("v.extUrl" , linkList.IT_SsoBridge__c+decodeURIComponent(queryString));
				var icon;
				
				if(isIframe ==="true"){
					icon = "action:web_link";
				}
				
				else {
					icon = "action:share_link";
				}
				
				if (calledSystem == "SGOP" || calledSystem == "SGOC"){
					component.set("v.extUrl", linkList.IT_SgopSgoc__c+calledSystem+decodeURIComponent(queryString));
				}
				else if(calledSystem === "KIWI"){
					component.set("v.extUrl", linkList.IT_Kiwi__c);
				}
				else if (calledSystem === "Portale Intesa"){
					component.set("v.extUrl", linkList.IT_PortaleIntesa__c);
					var cmpTarget = component.find('hiddenFrame');
					$A.util.removeClass(cmpTarget, 'slds-hide');
				}
				else if (calledSystem === "Portale Clienti Elettronico" || calledSystem === "Portale Clienti Cartaceo"){
					component.set("v.extUrl", linkList.IT_PortaliClienti__c);
				}
				else if (calledSystem === "Portale Clienti"){
					component.set("v.extUrl", linkList.IT_PortaliClienti__c);
				}
				else if (calledSystem === "Portale Beneficiari"){
					component.set("v.extUrl", linkList.IT_PortaleBeneficiari__c);
				}
				else if (calledSystem === "MYDHL"){
					component.set("v.extUrl", linkList.IT_MYDHL__c);
				}
				else if(calledSystem === "MYTNT"){
					component.set("v.extUrl", linkList.IT_MYTNT__c);
				}
				else if(calledSystem === "JIRACreate"){
					component.set("v.extUrl", linkList.IT_JIRACreate__c);
				}
				else if(calledSystem === "JIRAIssue"){
					component.set("v.extUrl", linkList.IT_JIRAIssue__c+component.get("v.jiraCode"));
				}  
				else if(calledSystem === "GestCred"){
					component.set("v.extUrl", linkList.IT_GestCred__c);
				}
				else if(calledSystem === "Operations"){
					component.set("v.extUrl", linkList.IT_Operations__c);
				}
				else if(calledSystem === "Apex"){
					component.set("v.extUrl", linkList.IT_Apex__c);
				}
                else if(calledSystem === "Chopin"){
					component.set("v.extUrl", linkList.IT_Chopin__c);
				}
                else if(calledSystem === "Expendia"){
					component.set("v.extUrl", linkList.IT_Expendia_Portal__c);
				}
                else if(calledSystem === "Dashboard UTA"){
					component.set("v.extUrl", linkList.IT_Dashboard_UTA__c);
				}
                else if(calledSystem === "Galitt"){
					component.set("v.extUrl", linkList.IT_Galitt__c);
				}
                else if(calledSystem === "Portale Affiliati"){
					component.set("v.extUrl", linkList.IT_PortaleAffiliati__c);
				}
                else if(calledSystem === "Affi"){
					component.set("v.extUrl", linkList.IT_SsoBridge__c+decodeURIComponent(queryString));
				}
                
				
								
				workspaceAPI.getTabInfo().then(function(response) {
					component.set("v.tabId", response.tabId);
					var focusedTabId = response.tabId;
					component.set("v.parentTabId" , focusedTabId.split("_")[0]);  
					workspaceAPI.getAllTabInfo().then(function(response) {
					//workspaceAPI.getTabInfo({tabId : component.get("v.parentTabId")}).then(function(response) {
						var isOpen = false;
						for(var i = 0 ; i<response.length ; i++){
							var subTabs = response[i].subtabs;
							var index = 0;
							for (index = 0 ; index < subTabs.length; ++index){
								if(subTabs[index].customTitle === calledSystem){
									var openedTabId = subTabs[index].tabId;
									isOpen = true;
									console.log("TAB TROVATA" +openedTabId);
								} 
							}
						}
						if (isOpen && openedTabId != focusedTabId ){
							//HERE
							workspaceAPI.closeTab({tabId : openedTabId}); //switch these two to revert changes
							//workspaceAPI.focusTab({tabId : focusedTabId});    
						}
						//else{
							//console.log("TAB NON TROVATA" +focusedTabId);
							workspaceAPI.setTabIcon({
								tabId: focusedTabId,
								icon: icon
							});
							workspaceAPI.setTabLabel({
								tabId: focusedTabId,
								label: calledSystem 
							});
							if(isIframe ==="false"){
								console.log("FOCUS INIT ");
								var myWindow = window.open(component.get("v.extUrl"), "_blank");
								var windows = component.get("v.WindowRef");
								console.log("WINDOW REFERENCE:: "+myWindow);
								windows.push(myWindow);
								component.set("v.WindowRef" , windows);
							}
						//}  
					});
					
				}).then(function(response) {
					if(isIframe ==="false"){
						workspaceAPI.focusTab({tabId : component.get("v.parentTabId")})
					}else{
						component.set("v.nextUrl", linkList.IT_SsoBridge__c+decodeURIComponent(queryString)); 

					}
					//var intervalID = window.setInterval(helper.checkWindowClosed, 1000);
					var interval = window.setInterval(
						$A.getCallback(function() {
							helper.checkWindowClosed(component, event);
						}), 2000
					);  
					console.log("INTERVALS SET");
				}); 
			}
		});
		$A.enqueueAction(action);
    },
    
    onTabFocused : function(component, event, helper) {
        console.log("TRIGGER ONFOCUS ");
        if(component.get("v.isIframe")==="false"){
            var focusedTabId = event.getParam('currentTabId');
            var previousTab = event.getParam('previousTabId');
            var realTabId = component.get("v.tabId");
            if(focusedTabId !== component.get("v.parentTabId")){
                console.log("Tab Real + Focused:: " +realTabId+" / "+focusedTabId);
                var workspaceAPI = component.find("workspace");
                if(focusedTabId===realTabId && previousTab != focusedTabId && previousTab != realTabId){
                    var windows = component.get("v.WindowRef");
                    if(windows[0].closed != null && windows[0].closed){
                        var myWindow = window.open(component.get("v.extUrl"), "_blank");
                        console.log("CODICE FINESTRA:: "+myWindow);
                        windows[0] = myWindow;
                        component.set("v.WindowRef" , windows);
                    }
                    else{
                        windows[0].focus();
                        console.log("FOCUS WINDOW ");
                    }
                    workspaceAPI.focusTab({tabId : component.get("v.parentTabId")});
                    console.log("FOCUS EVENT " +component.get("v.parentTabId"));
                }
            }
        }
    },
    
    onClosedHelper : function(component, event) {
        console.log("STO CHIUDENDO");
        var closedTabId = event.getParam('tabId');
        var tabId = component.get("v.tabId");
        if (closedTabId === tabId){
            var myWindow = component.get("v.WindowRef");
            var index;
            if (myWindow !== null){
                for (index = 0; index < myWindow.length; ++index) {
                    myWindow[index].close();
                }
            }
        }
    },
    
    loadedFrame : function(component, event) {
        var workspaceAPI = component.find("workspace");
        if(component.get("v.logoutHandler") && component.get("v.isIframe")){
            /*if (component.get("calledSystem") == 'Portale Intesa'){
                console.log("PORTALE INTESA");
                component.set("v.logoutHandler" , false);
            }
            else{*/
            
            //CAMBIO QUA SOLO PER PORT CLIENTI
            console.log("LOGOUT EFFETTUATO");
            console.log('ELEK '+component.get("v.calledSystem"));
            if(component.get("v.calledSystem") == 'Portale Clienti Elettronico' || component.get("v.calledSystem") == "Portale Clienti Cartaceo" || component.get("v.calledSystem") == "Portale Affiliati" || component.get("v.calledSystem") == "Portale Beneficiari"){
                console.log('ELETTRO O AFFI');
                component.set("v.logoutHandler" , false);
                component.set("v.isIframe" , 'false');
                component.set("v.extUrl" , component.get("v.nextUrl"));
                var myWindow = window.open(component.get("v.nextUrl"), "_blank");
                var windows = component.get("v.WindowRef");
                console.log('ELETTRO2 O AFFI2');
                console.log("CODICE FINESTRA:: "+myWindow);
                windows[0] = myWindow;
                component.set("v.WindowRef" , windows);
                workspaceAPI.focusTab({tabId : component.get("v.parentTabId")});
            }
            else{
                component.set("v.logoutHandler" , false);
                component.set("v.extUrl" , component.get("v.nextUrl"));
                window.setTimeout(function(){ 
                    var cmpTarget = component.find('hiddenFrame');
                    $A.util.removeClass(cmpTarget, 'slds-hide');
                }, 5500); 
            }
            

        }
        
        //}
    },
    

    
})