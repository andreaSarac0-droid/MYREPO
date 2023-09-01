({
    doInit : function(component, event, helper) {

        
       //1) Prendo gli input, prendo il ritorno dei webservice.
        
        var controlServiceType = component.get('v.ServicesType');
        var recordObjectId = component.get("v.recordId");
        var inputStringFlow = component.get("v.InputStringField");
        var InputLicense = component.get("v.InputLicense");
        var InputSubject = component.get("v.InputSubject");
        var InputOpportunityId = component.get("v.InputOpportunityId");
        
        
        var jsonteststring = '[{"client_exemption_ref":"22","client_rate":"0,00","client_vat_code":"7","company_ref":"832","exemption_desc":"NON IMPONIBILE IVA ART.74/TER  DPR 633/72","merchant_exemption_ref":"22","merchant_rate":"0,00","merchant_vat_code":"7","product_desc":"23 - PERNOT. ALBERGO/HOTEL","product_ref":"23","service_ref":"2X","vat_desc":"74-TER,D.IVA"}]';
        
        
        if (controlServiceType == "GetCommercialLicense"){
            
            var action = component.get("c.GetCommercialLicense");  
            component.set('v.columns', [
                  
                
                {label: 'Subject', fieldName: 'subject', type: 'text'},
                {label: 'Commercial License Desc', fieldName: 'commercial_license_desc', type: 'text'},   
                {label: 'Commercial License', fieldName: 'commercial_license', type: 'text'}, 
                {label: 'Subject Desc', fieldName: 'subject_desc', type: 'text'}
                
                
            ]);                  
        }
        
        
        
        
        
        
        
        if (controlServiceType == "GetWelfareProducts"){
            
            var action = component.get("c.GetWelfareProducts");  
            component.set('v.columns', [
                
                
                
                // {label: 'Client Exemption', fieldName: 'client_exemption_ref', type: 'text'},
                //  {label: 'Service Ref', fieldName: 'service_ref', type: 'text'},   
                //   {label: 'Merchant Exemption', fieldName: 'merchant_exemption_ref', type: 'text'}, 
                {label: 'Ambito', fieldName: 'vat_desc', type: 'text'},
                {label: 'Aliquota', fieldName: 'merchant_rate' , type: 'text'},
                //   {label: 'Product Ref', fieldName: 'product_ref', type: 'text'},
                
                //  {label: 'Client Rate', fieldName: 'client_rate', type: 'text'},
                //     {label: 'Company Ref', fieldName: 'company_ref', type: 'text'},
                //   {label: 'Client Vat Code', fieldName: 'client_vat_code', type: 'text'},
                //    {label: 'Merch Vat Code', fieldName: 'merchant_vat_code', type: 'text'},
                {label: 'Esenzione', fieldName: 'exemption_desc', type: 'text'},
                {label: 'Prodotto', fieldName: 'product_desc', type: 'text'}
                
                
            ]);                  
        }
        
        
        
        
        
        
        
        
        
        if (controlServiceType == "GetPromotion"){
            
            var action = component.get("c.GetPromotion");  
            component.set('v.columns', [
                
                
                
                {label: 'Data decorrenza', fieldName: 'start_date', type: 'date'},   
                {label: 'Data chiusura', fieldName: 'end_date', type: 'date'}, 
                {label: 'Corrispettivo', fieldName: 'corresponding', type: 'text'},
                {label: 'Barcode', fieldName: 'barcode', type: 'text'},
                //{label: 'Documento', fieldName: 'barcodelink', type: 'url', typeAttributes: {label: 'Doc' , target: '_blank'}} 
                {label: 'PDF',type: 'button',typeAttributes:{label: 'PDF',name: 'Carica', title: '', disabled: false, value: 'test',},cellAttributes: { alignment: 'left' },initialWidth: 100}
                
                
            ]);                  
        }
        
        
        
        if(controlServiceType == "GetDiscount"){
            
            var action = component.get("c.GetDiscount");
            
            component.set('v.columns', [
                
                //	{label: 'Store Code', fieldName: 'store_ref', type: 'text'},
                
                {label: 'Data decorrenza', fieldName: 'start_date', type: 'date'},   
                {label: 'Data chiusura', fieldName: 'end_date', type: 'date'},   
                {label: 'Data effettiva', fieldName: 'effective_date', type: 'text'},   
                {label: 'Cashback', fieldName: 'acquiring_post_cashback', type: 'text'},
                {label: 'Fee Cashback', fieldName: 'acquiring_post_cashback_fee', type: 'text'},
                {label: 'Codice sconto', fieldName: 'acquiring_post_discount_code', type: 'text'},
                {label: 'Codice sconto Fee', fieldName: 'acquiring_post_discount_code_fee', type: 'text'},
                {label: 'Occasionale', fieldName: 'acquiring_post_occasional', type: 'text'},
                {label: 'Stato', fieldName: 'status', type: 'text'},
                {label: 'Nome banca', fieldName: 'bank_name', type: 'text'},
                {label: 'BIC', fieldName: 'bic', type: 'text'},
                //    {label: 'S.Symbol', fieldName: 'specific_symbol', type: 'number'},
                //    {label: 'V.Symbol', fieldName: 'variable_symbol', type: 'number'},
                //    {label: 'Country Code', fieldName: 'country_code', type: 'text'},
                //    {label: 'Key Code', fieldName: 'key_code', type: 'text'},
                //    {label: 'BBan', fieldName: 'bban', type: 'text'},
                {label: 'Iban', fieldName: 'iban', type: 'text'},
                {label: 'Barcode', fieldName: 'barcode', type: 'text'},    
                {label: 'PDF',type: 'button',typeAttributes:{label: 'PDF',name: 'Carica', title: '', disabled: false, value: 'test',},cellAttributes: { alignment: 'left' },initialWidth: 100}
                //{label: 'Documento', fieldName: 'barcodelink', type: 'url', typeAttributes: {label: 'Doc' , target: '_blank'}} 
            ]);    
            
        }
        
        
        
        
        
        
        
        action.setParams({
            "objectid": recordObjectId,
            "stringInput": inputStringFlow ,  
            "stringlicense": InputLicense,
            "stringsubject": InputSubject ,
            "opportunityid" : InputOpportunityId
            
        })
        
        
        
        
        
        action.setCallback(this, function (response) {
            
            if (action.getState() == "SUCCESS") {
                console.log ('WebService andato in success');
                
                
                var responseCall = response.getReturnValue();  
                
                
                console.log ('stringify del ritorno dei WS:'+ JSON.stringify(responseCall));
                
                
                
                
                if (responseCall != null && responseCall != '') {
                    
                    component.set('v.data', responseCall );
                   
                    
                    
                }
                
               //2) Ora che data v.data è valorizzato, chiamo l'helper  per preselezionare righe.
               helper.preselect(component,helper);  
                
                
            }
            
            
            else if(action.getState() == "ERROR"){			
                var errors = response.getError();
                component.set("v.showErrors",true);
                component.set("v.errorMessage",errors[0].message);
                console.log(errors);
                console.log ('lo stato è andato in error');              
            }     
            
            
        })
        $A.enqueueAction(action);           
    },
    
   
    
    //3)premo salva, trasformo righe selezionate in opplines e passo ad apex, che prima cancellerà tutto e poi inserirà le selezionate
    handleSelect: function (cmp, event) {
        
            cmp.set("v.loaded",true);
        
        
            let lines = [];
            lines = cmp.find('partnerTable').getSelectedRows();
            console.log('Righe selezionate dopo aver premuto salva:'+JSON.stringify(lines));
        
            var output = [];
        
        
        
            var locale = $A.get("$Locale.userLocaleCountry");
        
            console.log("il tuo locale e': " + locale);           

            if (locale == 'CH'){
                
            console.log("il tuo locale e' svizzera" + locale); 
                
            lines.forEach(function (element) {
             
                element.merchant_rate = element.merchant_rate.replace (',','.')
                           
             });  
               
                }
            

        
        
        
            lines.forEach(function (element) {
            output.push({ 'sObjectType':'OpportunityLineItem',
                         
                         'IT_Vat_Free_Code__c':element.merchant_exemption_ref,
                         
                         'IT_Product_Code__c':element.product_ref,
                         
                         'IT_VAT_Percentage__c':element.merchant_rate,
                         
                         'IT_Product_Name__c': element.product_desc,
                         'IT_Exemption__c' : element.exemption_desc
                         
                        });
        });
        
        console.log('opplines passate ad apex' + JSON.stringify(output));
       
        
        var action = cmp.get("c.DeleteInsertOppLine");
        action.setParams({ "vdata" : output,
                          "InputOpportunityId" : cmp.get("v.InputOpportunityId"),
                          "objectid" : cmp.get("v.recordId")
                          
                         });
        
        
        
        action.setCallback(this, function(response) {
            
            
            
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.loaded",false);
                
            }
            else if (state === "INCOMPLETE") {
                cmp.set("v.loaded",false);
            }
                else if (state === "ERROR") {
                    cmp.set("v.loaded",false);
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        
        
        $A.enqueueAction(action);
        
        

        
    },
    getBarcode :function(component,event,helper){
		helper.getDocument(component,event,helper);
    },
    exitModal : function(cmp,event,helper){
        cmp.set("v.isModalOpen",false);
    }
    

    
})