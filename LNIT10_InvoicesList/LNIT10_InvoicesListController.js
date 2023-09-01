({
    init: function (component, event, helper){
        helper.setLayoutTable(component, helper);
        helper.setLayout(component, helper);
        
        const sObjectName = component.get("v.sObjectName");
        const idCase = component.get("v.recordId");

        helper.invokeAura(component, 'callCase', {
            "idCase": idCase
        }).then((response)=>{
            const caseRes = response.getReturnValue();        
            component.set("v.codCli" , caseRes);

            if(sObjectName === 'Account'){
                return helper.loadFinancialCenter(component, helper);
            }

            return Promise.resolve();
        }).then((response)=>{
            if(sObjectName === 'Account'){
                const financialCenters = component.get('v.financialCenters');

    if(financialCenters.length === 0) {component.set('v.loaded', true); throw new Error('Not financial found')};
                const initFinancialCenter = component.get('v.initFinancialCenter');

                if(!initFinancialCenter){
                    const financialCenter = financialCenters[0];
                    component.set('v.financialCenterSelected', financialCenter.IT_Financial_Center__c);
                }else{
                    component.set('v.financialCenterSelected', initFinancialCenter);
                }
            }

            return helper.invoicesListSet(component, helper);
        }).then(()=>{
            const showAll = component.get('v.showAll');
            if(showAll) helper.updateTitle(component, helper, "Invoices List", "action:quote");
        })
    },
    showInvoices: function (component, event, helper) {
        const icon = component.find('iconRef');
        $A.util.toggleClass(icon, 'rotator');
        
        component.set('v.loaded', false);

        helper.invoicesListSet(component, helper);   
    },

    openAllInvoices: function (component, event, helper){
        const sObjectName = component.get("v.sObjectName");            
        const recordId = component.get("v.recordId");
        const codCli = component.get("v.codCli");
        const initFinancialCenter = component.get("v.financialCenterSelected");

        const evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:LNIT10_InvoicesList",
            componentAttributes : {
                sObjectName,
                recordId,
                codCli,
                initFinancialCenter,
                showAll: true,
                maxValues: 20,
                InvoicesType : component.get("v.InvoicesType"),
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