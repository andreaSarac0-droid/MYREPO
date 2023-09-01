({
    init: function (component, event, helper){
        helper.setLayoutTable(component, helper);
        helper.setLayout(component, helper);

        const sObjectName = component.get("v.sObjectName");

        helper.getContext(component, helper).then(()=>{
            if(sObjectName === "Account"){
                return helper.loadFinancialCenter(component, helper);
            }

            return Promise.resolve();
        }).then(()=>{
            if(sObjectName === 'Account'){
                const financialCenters = component.get('v.financialCenters');

                if(financialCenters.length === 0) throw new Error('Not financial found');
                const initFinancialCenter = component.get('v.initFinancialCenter');

                if(!initFinancialCenter){
                    const financialCenter = financialCenters[0];
                    component.set('v.financialCenterSelected', financialCenter.IT_Financial_Center__c);
                }else{
                    component.set('v.financialCenterSelected', initFinancialCenter);
                }
            }

            return helper.getOrders(component, helper, false);
        }).then(()=>{
            const showAll = component.get('v.showAll');
            if(showAll) helper.updateTitle(component, helper, "Order List", "action:quote");

            console.log('init success');
        }).catch((err)=>{
            console.log(err);
        })
    },
    openAllOrders: function (component, event, helper){
        const sObjectName = component.get("v.sObjectName");            
        const recordId = component.get("v.recordId");

        const listOrders = component.get("v.dataComplete");
        const listHeaders = component.get("v.columns");
        const listSizeJS = component.get("v.listSize");
        const productSet = component.get("v.productListName");
        const dataStart = component.get("v.dataStart");
        const dataEnd = component.get("v.dataEnd");
        const evt = $A.get("e.force:navigateToComponent");
        const initFinancialCenter = component.get("v.financialCenterSelected");

        evt.setParams({
            componentDef : "c:LNIT08_OrderList",
            componentAttributes : {
                sObjectName,
                recordId,
                initFinancialCenter,
                data : listOrders,
                listSize : listSizeJS,
                productListName : productSet,
                dataStart : dataStart,
                dataEnd : dataEnd,
                showAll: true
            }    
        });
        evt.fire();
    },
    
    showOrders: function (component, event, helper) {
        var icona = component.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');
        component.set('v.productListName', null);
        component.set('v.loaded', false);
        helper.getOrders(component, helper, false).then(()=>{
            console.log('showOrders success');
        })
    },
    
    filterOrders: function (component, event, helper) {
        //var codServizio = component.get('v.CodServizio');
        var codServizio = component.find("levels").get("v.value");
        var fullData = component.get('v.fullData');
        console.log('SERVIZIO SELEZIONATO:: '+codServizio);  
        if(codServizio != false ){
            var returnData = [];
            fullData.forEach(function(singleData) {
                if(singleData.service_description == codServizio){
                    returnData.add(singleData);
                }
            });
            component.set('v.data' , returnData.slice(0,5));
        }
        
        else{
            component.set('v.data' , fullData.slice(0,5));
        }
    },
    openOrderSGOP : function (cmp, event, helper) {
        let cintenstCase = cmp.get("v.caseContestualize");
        let financialCenter = cmp.get("v.financialCenterSelected");
        let codCli;
        let startDate = cmp.get("v.dataStart");
        let dateParam;

        if(startDate != null && startDate != undefined){
            console.log('startDate:: '+ startDate);
            dateParam = startDate.split('-')[0];
            console.log('DATE:: '+ dateParam);
        }

        if(cintenstCase && cintenstCase.IT_Financial_Center__c != null)
            codCli = cintenstCase.IT_Financial_Center__r.IT_Financial_Center__c;  

        if(financialCenter) codCli = financialCenter;

        let querystring = '?para_funzione=RicOrdiniCaricaDatiCombo';
        if(codCli){
            querystring += '&para_codice_cliente='+codCli;
        }

        let evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:LNIT00_iframeOpener",
            componentAttributes: {
                calledSystem : 'SGOP',
                isIframe : 'false',
                queryString : querystring
            }
        });
        evt.fire();
        
    },
    openOrderSGOC : function (cmp, event, helper) {
        let cintenstCase = cmp.get("v.caseContestualize");
        let financialCenter = cmp.get("v.financialCenterSelected");
        let codCli;
        let startDate = cmp.get("v.dataStart");
        let dateParam;

        if(startDate != null && startDate != undefined){
            console.log('startDate:: '+ startDate);
            dateParam = startDate.split('-')[0];
            console.log('DATE:: '+ dateParam);
        }
        if(cintenstCase && cintenstCase.IT_Financial_Center__c != null)
            codCli = cintenstCase.IT_Financial_Center__r.IT_Financial_Center__c;  
        
        if(financialCenter) codCli = financialCenter;

        let querystring = '?para_funzione=RicOrdiniCaricaDatiCombo';
        if(codCli != null && codCli != undefined){
            querystring += '&para_codice_cliente='+codCli;
        }
        
        let evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:LNIT00_iframeOpener",
            componentAttributes: {
                calledSystem : 'SGOC',
                isIframe : 'false',
                queryString : querystring
            }
        });
        evt.fire();
        
    }
});