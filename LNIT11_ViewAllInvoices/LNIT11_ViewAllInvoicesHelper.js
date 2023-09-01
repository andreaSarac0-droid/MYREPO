({
	invoicesListSet : function(cmp) {
        var startDate = cmp.get("v.dataStart");
        var endDate = cmp.get("v.dataEnd");
        var socCode = cmp.get("v.CodSociety");
        var idCase = cmp.get("v.caseID");
        
        cmp.set('v.columns', [
            {label: 'N° Doc', fieldName: 'document_number', type: 'text'},
            {label: 'Tipo Doc', fieldName: 'document_type', type: 'text'},
            {label: 'Data Doc', fieldName: 'document_date', type: 'date'},
            {label: 'Data Scadenza', fieldName: 'expiry_date', type: 'date'},
            {label: 'Importo', fieldName: 'amount_due', type: 'number'},
        ]);
            
        var codCli = cmp.get("v.codCli");
        console.log('codCli '+codCli);
        var action = cmp.get('c.listInvoices');
        action.setParams({
            "dataDa": startDate,
            "dataA": endDate,
            "caseId": idCase,
            "codCli": codCli
            
        })
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                console.log('orderListFirst::' + JSON.stringify(response));
				var controlInvoices = cmp.get('v.InvoicesType');
                var invoicesList = response.getReturnValue();
                if (invoicesList != null && invoicesList != '') {
            
            		for(var controlOrder = invoicesList.length -1; controlOrder >= 0 ; controlOrder--){
                        var orderNumber = invoicesList[controlOrder].order;
                        if(orderNumber == 0 && controlInvoices == "Operation4"){
                            invoicesList.splice(controlOrder, 1);
                        }else if(orderNumber == 4 && controlInvoices == "Operation1"){ 
                            invoicesList.splice(controlOrder, 1);    
                        }   
                    }

                    cmp.set('v.listSize', invoicesList.length);  
                    cmp.set('v.data', invoicesList.slice(0,20));

                    console.log('invoicesList.length::' + invoicesList.length); 
                    
                    var impTot = 0;
                    var i = 0;

                    for (i = 0; i < invoicesList.length; i++) { 
                        console.log('invoicesList[i].amount_due:: '+invoicesList[i].amount_due);
                        impTot = impTot + invoicesList[i].amount_due;
                        var myDate = new Date(invoicesList[i].expiry_date);
                        if(today > myDate ){
                            impScaduto = impScaduto +  invoicesList[i].amount_due;   
                        }
                    }
                    
                    var impScaduto = 15266.36;
                    
                    console.log('impTot:: '+impTot.toFixed(2));
                    cmp.set('v.importTotal',impTot.toFixed(2));
                    var today = new Date();
                    console.log('today:: '+today);
                    cmp.set('v.scaduto',impScaduto.toFixed(2));
                    
                    let indexes = new Set();
                    invoicesList.forEach(orderResp => indexes.add(orderResp.descrServizio));
                    console.log('indexes list', indexes.size);
                    let array = Array.from(indexes);
                    cmp.set('v.societyListName', array);

                }else{
                    cmp.set('v.data', null);
                }
            }
        });
        $A.enqueueAction(action);
    }
})