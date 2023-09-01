({
	init : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
		var idCase = component.get("v.caseID");
        helper.callCaseField(component, idCase);
        var orderList = component.get('v.data');
        var indexes = new Set();
        if(orderList != null && orderList.length > 0 ){
            orderList.forEach(orderResp => indexes.add(orderResp.service_description));
            console.log('indexes list', indexes.size);
            var array = Array.from(indexes);
            component.set('v.productListName', array);
        }
        //self.showOrders(component, event, helper);

        
        window.setTimeout(function(){         
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.setTabLabel({
                    tabId: focusedTabId,
                    label: "Order List"
                });
                workspaceAPI.setTabIcon({
                    tabId: focusedTabId,
                    icon: "action:quote"
                });
            })}, 300);	


	},

	showOrders: function (cmp, event, helper) {
		var icona = cmp.find('iconRef');
        $A.util.toggleClass(icona, 'rotator');	

        var startDate = cmp.get("v.dataStart");
        var endDate = cmp.get("v.dataEnd");
        var stausOrder = cmp.get("v.orderStatus");
        var typeProdOrder = cmp.get("v.orderType");
        var codServ = cmp.get("v.CodServizio");
        var cintenstCase = cmp.get("v.caseContestualize");
        var codCli = null;
        var piva = null;
        var CodCir = null;

        if(cintenstCase.IT_Financial_Center__c != null)
            codCli = cintenstCase.IT_Financial_Center__r.IT_Financial_Center__c;   
        if(cintenstCase.Account != null)
            piva = cintenstCase.Account.ER_VAT_Number__c;
        if(cintenstCase.IT_Circuit__c != null)    
            CodCir = cintenstCase.IT_Circuit__r.Name;
        /*var codCli = cintenstCase.IT_Financial_Center__r.Name;
        var piva = cintenstCase.Account.ER_VAT_Number__c;
        var CodCir = cintenstCase.IT_Circuit__r.Name;*/
        
        
        cmp.set('v.columns', [
            {label: 'Order Ref', fieldName: 'detailURL', type: 'url' , typeAttributes: {label: { fieldName: 'order_ref' }, target: '_self'}},
            {label: 'Delivery Date', fieldName: 'delivery_date', type: 'date'},
            {label: 'Order Type', fieldName: 'order_type', type: 'text'},
            {label: 'Order Amount', fieldName: 'order_amount', type: 'number'},
            {label: 'Payment Description', fieldName: 'payment_description', type: 'text'},
            
            /*{label: 'Application', fieldName: 'application', type: 'text'},
            {label: 'Codice Circuito', fieldName: 'circuit_code', type: 'text'},
            {label: 'Company Ref', fieldName: 'company_ref', type: 'number'},
            {label: 'Client Ref', fieldName: 'client_ref', type: 'text'},
            {label: 'Order Year', fieldName: 'order_year', type: 'text'},
            {label: 'Upload Date', fieldName: 'upload_date', type: 'date'},
            {label: 'Dervice Description', fieldName: 'service_description', type: 'text'},
            {label: 'Channel Description', fieldName: 'channel_description', type: 'text'}, 
            {label: 'Voucher Number', fieldName: 'voucher_number', type: 'Integer'},
            {label: 'Order Status Description', fieldName: 'order_status_description', type: 'text'},
            {label: 'Customized', fieldName: 'customized', type: 'text'},
            {label: 'Modificabile', fieldName: 'is_modifiable', type: 'checkbox'},*/ 
        ]);

        var arrayOrder = [];
        var uri = encodeURIComponent("https://salesforce.it.dev.edenred.io/v1/orders").toLowerCase();
		console.log('uri '+uri);
		var today = new Date().toISOString();
		console.log('TODAY '+today);
		var requester = 'http://someHost.com';
		var rawHmac = uri + '#' + requester + '#' + today;
		console.log('RAWHMAC '+rawHmac);
        var action = cmp.get('c.listOrder');
        action.setParams({
            "dataDa": startDate,
            "dataA": endDate,
            "codeCirc": CodCir,
            "codeCli": codCli,
            "piva": piva,
            "codeServizio": codServ,
            "AllFilter": false,
            "rawHmac": rawHmac,
            "idCase" : cmp.get("v.caseID")
            
        })
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                console.log('RESPONSE RICEVUTA');
                console.log('orderListFirst::' + JSON.stringify(response));

                var orderList = response.getReturnValue();
                console.log('ORDERPARSATO');
                if (orderList != null && orderList != '') {
                    console.log('orderList::' + JSON.stringify(orderList));
                    //cmp.set('v.listSize', orderList.length);
					cmp.set('v.data', orderList);
                    console.log('orderList.length::' + orderList.length); 
                    let indexes = new Set();
                    orderList.forEach(orderResp => indexes.add(orderResp.service_description));
                    console.log('indexes list', indexes.size);
                    let array = Array.from(indexes);
                    cmp.set('v.productListName', array);
                }else{
                    cmp.set('v.data', null);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    openOrderSGOP : function (cmp, event, helper) {
        var cintenstCase = cmp.get("v.caseContestualize");
        var codCli;
        var startDate = cmp.get("v.dataStart");
        var dateParam;
        if(startDate != null && startDate != undefined){
            console.log('startDate:: '+ startDate);
            dateParam = startDate.split('-')[0];
            console.log('DATE:: '+ dateParam);
        }
        if(cintenstCase.IT_Financial_Center__c != null)
            codCli = cintenstCase.IT_Financial_Center__r.IT_Financial_Center__c;  
        var querystring = '?para_funzione=RicOrdiniCaricaDatiCombo';
        if(codCli != null && codCli != undefined){
            querystring += '&para_codice_cliente='+codCli;
        }
        /*if(dateParam != null && dateParam != undefined){
            querystring += '&para_anno_ordine='+dateParam;
        }*/
        var evt = $A.get("e.force:navigateToComponent");
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
        var cintenstCase = cmp.get("v.caseContestualize");
        var codCli;
        var startDate = cmp.get("v.dataStart");
        var dateParam;
        if(startDate != null && startDate != undefined){
            console.log('startDate:: '+ startDate);
            dateParam = startDate.split('-')[0];
            console.log('DATE:: '+ dateParam);
        }
        if(cintenstCase.IT_Financial_Center__c != null)
            codCli = cintenstCase.IT_Financial_Center__r.IT_Financial_Center__c;  
        var querystring = '?para_funzione=RicOrdiniCaricaDatiCombo';
        if(codCli != null && codCli != undefined){
            querystring += '&para_codice_cliente='+codCli;
        }
        /*if(dateParam != null && dateParam != undefined){
            querystring += '&para_anno_ordine='+dateParam;
        }*/
        var evt = $A.get("e.force:navigateToComponent");
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
})