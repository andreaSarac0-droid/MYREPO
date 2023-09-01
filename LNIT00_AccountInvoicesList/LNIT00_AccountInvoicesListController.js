({
    init: function (component, event, helper){
        helper.setLayoutTable(component, helper);
        helper.setLayout(component, helper);
        
        helper.loadFinancialCenter(component, helper).then((response)=>{
        	const financialCenters = component.get('v.financialCenters');

        	if(financialCenters.length === 0) throw new Error('Not financial found');
    		const initFinancialCenter = component.get('v.initFinancialCenter');

    		const showAll = component.get('v.showAll');
    		if(showAll) helper.updateTitle(component, helper, "Invoices List", "action:quote");

        	if(!initFinancialCenter){
	        	const financialCenter = financialCenters[0];
	        	component.set('v.financialCenterSelected', financialCenter.IT_Financial_Center__c);
        	}else{
        		component.set('v.financialCenterSelected', initFinancialCenter);
        	}

        	return helper.invoicesListSet(component, helper);
        }).then((response)=>{
        	debugger;
        }).catch((err)=>{
        	debugger;
        })
    },

    showInvoices: function (component, event, helper) {
        let icon = component.find('iconRef');
        $A.util.toggleClass(icon, 'rotator');
        
        component.set('v.loaded', false);

        helper.invoicesListSet(component, helper);   
    },

    openAllInvoices: function (component, event, helper){
        let recordId = component.get("v.recordId");
        let initFinancialCenter = component.get("v.financialCenterSelected");

        let evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:LNIT00_AccountInvoicesList",
            componentAttributes : {
                recordId,
                initFinancialCenter,
                showAll: true,
                maxValues: 20,
                dataStart : component.get('v.dataStart'),
                dataEnd : component.get('v.dataEnd') 
            }     
        });
        evt.fire();
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