({
    setLayoutTable: function(component, helper){
        component.set('v.columns', [
            {label: 'SGOP/SGOC', fieldName: 'detailURL', type: 'url' , typeAttributes: {label: { fieldName: 'counterNum' }, target: '_self'}},
            {label: 'Order Ref', fieldName: 'detailURLShippingLink', type: 'url' , typeAttributes: {label: { fieldName: 'counterLink' }, target: '_self'}},
            //{label: 'Order Ref', fieldName: 'detailURL', type: 'url' , typeAttributes: {target: '_self'}},
            {label: 'Delivery Date', fieldName: 'delivery_date', type: 'date'},
            {label: 'Order Status', fieldName: 'order_status_description', type: 'text'},
            {label: 'Totale Ordine', fieldName: 'order_amount', type: 'number'},
            {label: 'Upload Date', fieldName: 'upload_date', type: 'date'},
            {label: 'Quantity', fieldName: 'voucher_number', type: 'number', cellAttributes: { alignment: 'left' }}
        ]);
    },
    setLayout: function(component, helper){
        const layout = {};
        const row = {};

        const showAll = component.get('v.showAll');
        const sObjectName = component.get("v.sObjectName");
        
        switch (sObjectName){
            case 'Case':
                row.icon = 1;
                row.refresh = 1;
                row.finacialCenter = 0;
                
                if(showAll){
                    row.startDate = 2;
                    row.endDate = 2;
                    row.searchSGOP = 2;
                    row.searchSGOC = 2;
                }else{
                    row.startDate = 3;
                    row.endDate = 3;
                    row.product = 3;
                }

                break;
            case 'Account':
                row.icon = 1;
                row.refresh = 1;
                row.product = 0;

                if(showAll){
                    row.startDate = 2;
                    row.endDate = 2;
                    row.searchSGOP = 2;
                    row.searchSGOC = 2;
                    row.finacialCenter = 2;
                }else{
                    row.startDate = 3;
                    row.endDate = 3;
                    row.finacialCenter = 3;
                }

                break;
        }
       

        for(let key in row){
            const value = row[key];

            if(!value) {
                layout[key] = `slds-hide`;
            }else{
                layout[key] = `slds-col slds-size_${value}-of-12`;
            }
        }

        component.set('v.layout', layout);
    },
    invokeAura: function(component, methodName, params){
        console.log('invokeAuraMethod', methodName);
        
        return new Promise($A.getCallback((resolve, reject)=>{
            const action = component.get('c.' + methodName);
            
            if(params) action.setParams(params);
            
            action.setCallback(this, (response)=>{
                const state = response.getState();
                if(state === 'SUCCESS'){
                    resolve(response);  
                }else if(state === 'ERROR'){
                    throw new Error(response.getError());
                }
            });
            
            $A.enqueueAction(action);
        }));
    },
    updateTitle: function(component, helper, label, icon){
        const workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then((response)=>{
            const focusedTabId = response.tabId;

            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label
            });

            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon
            });
        })
    },
    getContext : function(component, helper) {
        const sObjectName = component.get("v.sObjectName");
        if(sObjectName === 'Account') return Promise.resolve();

        let caseId = component.get("v.recordId");

        return helper.invokeAura(component, 'callCase', {
            "caseId": caseId
        }).then((response)=>{
            const caseRes = response.getReturnValue();       
            
            component.set('v.caseContestualize', caseRes);

            return Promise.resolve(response);
        })
    },
    loadFinancialCenter : function(component, helper){
        const accountId = component.get('v.recordId');

        return helper.invokeAura(component, 'getFinancialCenter', {
            accountId
        }).then((response)=>{
            const result = response.getReturnValue();

            if(!result.isSuccess) throw new Error(result.errorMessage);

            console.log(result);

            component.set('v.financialCenters', result.listData);

            return Promise.resolve(response);
        })
    },
    getOrders : function(component, helper, filterAll){
        const startDate = component.get("v.dataStart");
        const endDate = component.get("v.dataEnd");
        const recordId = component.get("v.recordId");
        const finacialCenter = component.get("v.financialCenterSelected");

        const sObjectName = component.get("v.sObjectName"); 

        let actionName = '';
        let request = {};

        if(sObjectName === 'Case'){
            actionName = 'listOrder';
            request = {
                dataDa: startDate,
                dataA: endDate,
                caseId: recordId
            }
        }else if(sObjectName === 'Account'){
            actionName = 'listOrderAccount';
            request = {
                dataDa: startDate,
                dataA: endDate,
                accountId: recordId,
                finacialCenter
            };
        }
        
        return helper.invokeAura(component, actionName, request).then((response)=>{
            component.set('v.loaded', true);
            
            const result = response.getReturnValue();

            if(!result.isSuccess) throw new Error(result.errorMessage);
            const orderList = result.payload.data;

            if (!orderList){
                component.set('v.data', null);
                return Promise.resolve(response);
            }

            console.log('orderList::' + JSON.stringify(orderList));
            
            console.log('filterAll::' + filterAll);
            if(filterAll === false){
                component.set('v.dataComplete', orderList);
                component.set('v.listSize', orderList.length);
            }    
            component.set('v.fullData', orderList);
            //component.set('v.data', orderList.slice(0,5));
            component.set('v.data', orderList);
            console.log('orderList.length::' + orderList.length);

            let indexes = new Set();
            orderList.forEach(orderResp => indexes.add(orderResp.service_description));
            console.log('indexes list', indexes.size);
            
            let array = Array.from(indexes);
            array.push('');
            component.set('v.productListName', array);

            return Promise.resolve(response);
        }).catch((err)=>{
            console.log('err', err);
            component.set('v.loaded', true);

            /*const toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "message": err.message,
                "type": 'error'
            });
            toastEvent.fire();*/
        })

    }
})