({
    checkWindowClosed : function(component, event) {
        if(component.get("v.isIframe")==="false"){
            var realTabId = component.get("v.tabId");
            console.log("Tab Real:: " +realTabId);
            var workspaceAPI = component.find("workspace");
            var windows = component.get("v.WindowRef");
            if(windows[0].closed != null && windows[0].closed){
                workspaceAPI.closeTab({tabId : realTabId});
            }
        }
 
    },
})