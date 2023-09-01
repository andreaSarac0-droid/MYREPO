({
    init: function (cmp, event, helper){
        //var idCase = cmp.get("v.recordId");
        var workspaceAPI = cmp.find("workspace");
        window.setTimeout(function(){         
            workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "Invoices List"
            });
                workspaceAPI.setTabIcon({
                    tabId: focusedTabId,
                    icon: "action:quote"
                });
        })}, 400);
        helper.invoicesListSet(cmp);	
    },

    showInvoices: function (cmp, event, helper) {
        var icona = cmp.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');
        helper.invoicesListSet(cmp);   
    },
    
    openKiwi: function (cmp, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:LNIT00_iframeOpener",
            componentAttributes: {
                calledSystem : 'KIWI',
                isIframe : 'false',
                queryString : ''
            }
        });
        evt.fire(); 
    }
});