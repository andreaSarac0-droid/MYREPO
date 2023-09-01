({
	init : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
        
        helper.balanceType(component, event, helper,recordId,recordObjectName).then(()=>{
            var prodTR = component.get("v.prod_TR");
            
            if(prodTR === 'ETR'){
                component.set('v.columns', [
                    {label: 'Tipo', fieldName: 'type', type: 'text', initialWidth: 200},
                    //{label: 'Codice Prodotto', fieldName: 'product_code', type: 'text', initialWidth: 150},
                    {label: 'Stato', fieldName: 'status', type: 'text', initialWidth: 190},
                    {label: 'Totale Buoni', fieldName: 'loaded_amount', type: 'number', initialWidth: 190},
                    {label: 'Saldo Buoni', fieldName: 'remaining_amount', type: 'number', initialWidth: 190},
                    {label: 'Buoni in Attesa', fieldName: 'pending_balance', type: 'text', initialWidth: 190},
                    //{label: 'Valuta', fieldName: 'currency', type: 'text', initialWidth: 80}
                            
                ]);
   	 		}else if(prodTR === 'WEL'){
    			component.set('v.columns', [ 
                    {label: 'Cash welfare', fieldName: 'flg_cash_welfare', type: 'text', initialWidth: 200},
                    {label: 'Premio', fieldName: 'premium_amount', type: 'text', initialWidth: 190},
                    {label: 'Data Scadenza', fieldName: 'expiration_date', type: 'text', initialWidth: 190},
                    {label: 'Totale Buoni', fieldName: 'loaded_amount', type: 'number', initialWidth: 190},
                    {label: 'Saldo Buoni', fieldName: 'remaining_amount', type: 'number', initialWidth: 190},
                    //{label: 'Valuta', fieldName: 'currency', type: 'text', initialWidth: 180}
                            
                ]);
			}else if(prodTR === 'TCW'){
    			component.set('v.columns', [ 
                    {label: 'Totale', fieldName: 'loaded_amount', type: 'number', initialWidth: 190},
                    {label: 'Saldo', fieldName: 'remaining_amount', type: 'number', initialWidth: 190},
                    //{label: 'Valuta', fieldName: 'currency', type: 'text', initialWidth: 180}
                            
                ]);
			}
            
            helper.invokeGetBalances(component, event, helper,recordId,recordObjectName);
    
        });
    }
        
})