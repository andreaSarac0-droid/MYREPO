({
    setLayoutTable: function(component, helper){
        var controlInvoicesStart = component.get('v.InvoicesType');
        console.log('controlInvoicesStart::' +controlInvoicesStart);

        if(controlInvoicesStart == "Operation4"){
            component.set('v.columns', [

                {label: 'Stato Amministrativo', fieldName: 'document_number', type: 'text'},
                {label: 'Data Modifica', fieldName: 'document_date', type: 'date'},
                {label: 'Utente', fieldName: 'e_invoice_status', type: 'text'},
    
            ]);
        }else{
            component.set('v.columns', [

                {label: 'N° Doc', fieldName: 'document_number', type: 'text'},
                {label: 'Tipo Doc', fieldName: 'document_type', type: 'text'},
                {label: 'Stato', fieldName: 'e_invoice_status', type: 'text'},
                {label: 'Data Doc', fieldName: 'document_date', type: 'date'},
                {label: 'Data Scadenza', fieldName: 'expiry_date', type: 'date'},
                {label: 'Importo', fieldName: 'amount_due', type: 'number'},
                {label: 'PDF', fieldName: 'detailURL', type: 'url' , typeAttributes: {label: 'PDF', target: '_blank'}},
    
            ]);
        }
    },
    setLayout: function(component, helper){
        const layout = {};
        const row = {};
        
        const showAll = component.get('v.showAll');
        const sObjectName = component.get("v.sObjectName");

        switch (sObjectName){
            case 'Case':
                row.icon = 1;
                row.finacialCenter = 0;

                if(showAll){
                    row.startDate = 2;
                    row.endDate = 2;
                    row.refresh = 1;
                    row.search = 2;
                    row.importTotal = 2;
                    row.importExpired = 2;
                }else{
                    row.startDate = 5;
                    row.endDate = 5;
                    row.refresh = 1;
                    row.search = 0;
                    row.importTotal = 6;
                    row.importExpired = 6;
                }
                break;
            case 'Account':
                row.icon = 1;

                if(showAll){
                    row.startDate = 2;
                    row.endDate = 2;
                    row.finacialCenter = 2;
                    row.refresh = 1;
                    row.search = 2;
                    row.importTotal = 1;
                    row.importExpired = 1;
                }else{
                    row.startDate = 3;
                    row.endDate = 3;
                    row.finacialCenter = 3;
                    row.refresh = 2;
                    row.search = 0;
                    row.importTotal = 6;
                    row.importExpired = 6;
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

    invoicesListSet : function(component, helper) {
        const sObjectName = component.get("v.sObjectName");

        let maxValues = component.get("v.maxValues");
        let startDate = component.get("v.dataStart");
        let endDate = component.get("v.dataEnd");
        let recordId = component.get("v.recordId");
        let socCode = component.get("v.CodSociety");
        let finacialCenter = component.get("v.financialCenterSelected");
        let codCli = component.get("v.codCli");
        
        let actionName = '';
        let request = {};

        if(sObjectName === 'Case'){
            actionName = 'listInvoices';
            request = {
                "dataDa": startDate,
                "dataA": endDate,
                "caseId": recordId,
                "codCli" : codCli
            }
        }

        if(sObjectName === 'Account'){
            actionName = 'listAccountInvoices';
            request = {
                startDate,
                endDate,
                accountId: recordId,
                finacialCenter
            }
        }

        if(sObjectName === 'ER_Financial_Center__c'){
            actionName = 'listAccountInvoices';
            request = {
                startDate,
                endDate,
                accountId: recordId,
                finacialCenter
            }
        }

        return helper.invokeAura(component, actionName, request).then((response)=>{
            component.set('v.loaded', true);

            const result = response.getReturnValue()
            if(!result.isSuccess) throw new Error(result.errorMessage);

            console.log('result', result);

            const invoicesList = result.payload.data;

            component.set('v.listSize', invoicesList.length);
                var sortedList = invoicesList.sort((a,b)=>(new Date(a.document_date)-new Date(b.document_date))*-1);
            console.log('sortedList.sortedList::' + JSON.stringify(sortedList));
                var controlInvoices = component.get('v.InvoicesType');
                for(var controlOrder = sortedList.length -1; controlOrder >= 0 ; controlOrder--){
                	var orderNumber = sortedList[controlOrder].order;
                	if(orderNumber == 0 && controlInvoices == "Operation4"){
                        sortedList.splice(controlOrder, 1);
                    }else if(orderNumber == 4 && controlInvoices == "Operation1"){ 
                        sortedList.splice(controlOrder, 1);    
                    }   
                }
                component.set('v.data', sortedList.slice(0, maxValues));
            
            console.log('invoicesList.length::' + invoicesList.length);
            
            let today = new Date();
            let impTot = 0;
            let impScaduto = 0;

            for(let index in invoicesList){
                const invoice = invoicesList[index];

                impTot += invoice.amount_due;

                const myDate = new Date(invoice.expiry_date);
                if(today > myDate){
                    impScaduto += invoice.amount_due;   
                }
            }
            
            console.log('impTot:: '+impTot.toFixed(2));
            
            component.set('v.importTotal',impTot.toLocaleString('it-IT', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
            component.set('v.scaduto',impScaduto.toLocaleString('it-IT', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
        }).catch((err)=>{
            console.log('err', err);
            component.set('v.loaded', true);
			/*
            const toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "message": err.message,
                "type": 'error'
            });
            toastEvent.fire();*/
        })
    }
})