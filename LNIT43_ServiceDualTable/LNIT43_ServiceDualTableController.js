({
    doInit : function(cmp, event, helper) {
        
    
        
        console.log('INIT');
        console.log("recordId: " + cmp.get('v.recordId'));
        cmp.set('v.columns', [
            {label: 'Prodotti', sortable: false, fieldName: 'Name', type: 'text', editable: false},
            {label: 'Iva', sortable: false, fieldName: 'IT_VAT_Percentage__c', type: 'text', editable: false},
            {label: 'Detrazione', sortable: false, fieldName: 'IT_Deduction__c', type: 'boolean', editable: false},
            {label: 'Sconto Attuale', sortable: false, fieldName: 'IT_Current_Discount__c', type: 'text', editable: false,initialWidth: 133},
            {label: 'Sconto%', sortable: false, fieldName: 'IT_Commission_Discount__c', type: 'text', editable: true },
            //{label: 'Contratto Attuale', sortable: false, fieldName: 'IT_Current_Barcode__c', type: 'text', editable: false },
            // {label: 'Contratto Attuale', fieldName: 'BarcodeLink', type: 'url' , typeAttributes: { label: { fieldName: 'IT_Current_Barcode__c'}, target: '_blank'}},
            {type:  'button', typeAttributes:{iconName: 'utility:refresh',label: '',name: 'Default', title: '', disabled: false, value: 'test'},cellAttributes: { alignment: 'right' }}
        ]);
        cmp.set('v.columns2', [
            {label: 'Soluzione', sortable: false, fieldName: 'SolutionName', type: 'text', editable: false},
            {label: 'Prodotti', sortable: false, fieldName: 'Name', type: 'text', editable: false},
            {label: 'Sconto Attuale', sortable: false, fieldName: 'IT_Current_Discount__c', type: 'text', editable: false,initialWidth: 133},
            {label: 'Sconto%', sortable: false, fieldName: 'IT_Commission_Discount__c', type: 'text', editable: true},
            {type:  'button', typeAttributes:{iconName: 'utility:refresh',label: '',name: 'Default2', title: '', disabled: false, value: 'test'},cellAttributes: { alignment: 'right' }}
        ]);
        console.log("serviceName: " + cmp.get("v.serviceName"));
        console.log("contractName: " + cmp.get("v.contractName"));
        console.log("storeRef: " + cmp.get("v.storeRef"));
        console.log("marketingId: " + cmp.get("v.marketingId"));
        console.log("isFlow: " + cmp.get("v.isFlow"));
        console.log("recordId: " + cmp.get("v.recordId"));
        
       
        
        if(cmp.get('v.isFlow')){
              helper.Preselect (cmp, event, helper ); //13.04.2021 fix
             helper.Preselect2 (cmp, event, helper ); //13.04.2021 fix
           
            
             helper.findopplinespresent (cmp,event,helper);//14.04.2021 fix, per valorizzare la lista di tutte le opplines presenti
             console.log ('siamo in un flow ed è partito helper.findopplines');
            
            /*
            //27.04.2021 questa parte di codice è stata inserita dentro helper.findopplinespresent altrimenti non rispettava il timing
            var opplinespresent = cmp.get ("v.allopplinespresenti");
            console.log ('le opp lines presenti dentro isflow:'+ JSON.stringify(opplinespresent));
            
            if (opplinespresent == null || opplinespresent.length == 0){
                
                if(cmp.get("v.storeRef") != undefined && cmp.get("v.storeRef") != null){
                    const promise1 = new Promise((resolve, reject) => {
                        helper.loadDefault( cmp, event, true )
                        resolve('Success!');
                    });
                        
                        promise1.then((value) => {
                        helper.callWS( cmp, event );
                    });
                    }
                        else{
                        helper.loadDefault( cmp, event, true );   
                    }                
                        
                    }
                        
                        
                        
                       
                  else  if(cmp.get("v.storeRef") != undefined && cmp.get("v.storeRef") != null){
                        const promise1 = new Promise((resolve, reject) => {
                        helper.updateTable( cmp, event, true )
                        resolve('Success!');
                    });
                        
                        promise1.then((value) => {
                        helper.callWS( cmp, event );
                    });
                    }
                        else{
                        helper.updateTable( cmp, event, true );   
                    }  
                        
                        */
                        
                    }
                        
                        //if its not flow:         
                        
                        else{
                        var recordId = cmp.get('v.recordId');
                        var action = cmp.get( "c.getStoreCode" );
                        console.log("recordId: " + recordId);
                        action.setParams({"recordId" : recordId});
                    
                    action.setCallback(this,function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            //cmp.set('v.loaded', true);
                            var result = response.getReturnValue();
                            console.log("result di c.getStoreCode:" + result);
                            cmp.set("v.marketingId", result.split('§')[1] );
                            cmp.set("v.storeRef", result.split('§')[0] );
                            cmp.set("v.contractName", result.split('§')[2] );
                            /*if(cmp.get("v.storeRef") != undefined && cmp.get("v.storeRef") != null && cmp.get("v.storeRef") != 'null'){
                        const promise1 = new Promise((resolve, reject) => {
                            helper.loadDefault( cmp, event )
                            resolve('Success!');
                        });
                            
                        promise1.then((value) => {
                            helper.callWS( cmp, event );
                        });
                    }
                    else{*/
                    helper.updateTable( cmp, event, helper ); 
                    helper.Preselect (cmp, event, helper ); //13.04.2021 fix
                    helper.Preselect2 (cmp, event, helper ); //13.04.2021 fix
                    //}
                } else if (state === 'ERROR'){
                    cmp.set('v.loaded', true);
                    var errors = response.getError();
                    console.log(JSON.stringify(errors));
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type":"error",
                        "title": "Errore!",
                        "message": "Qualcosa è andato storto durante il salvataggio, contatta un amministratore (Codice errore 114) "
                    });
                    toastEvent.fire();
                } else{
                    console.log('Something went wrong, Please check with your admin');
                }
            });
                    $A.enqueueAction(action);
                }
                
                //cmp.set("v.loaded", true );
            },
                
                refreshTable : function(cmp, event, helper) {
                    const promise1 = new Promise((resolve, reject) => {
                        helper.loadDefault( cmp, event, false )
                        resolve('Success!');
                    });
                        
                        promise1.then((value) => {
                        helper.callWS( cmp, event );
                    });
                    },
                        updateTable : function(cmp, event, helper) {
                            helper.updateTable( cmp, event );
                        },
                        
                        handleRowAction: function (cmp, event, helper) {
                            var action = event.getParam('action');
                            var row = event.getParam('row');
                            switch (action.name) {
                                case 'Default':
                                    helper.getDefault(cmp,row,1);
                                    break;
                                case 'Default2':
                                    helper.getDefault(cmp,row,2);
                                    break;
                            }
                        },
                        
                        
                        posChanged : function(cmp, event, helper) {
                            //cmp.set("v.xPosChecked", !cmp.get("v.posChecked"));
                            var pos = cmp.get ("v.posChecked");
                            var xpos =cmp.get ("v.xPosChecked");
                            
                            if (pos == true && xpos == true){
                                
                                cmp.set("v.xPosChecked", !cmp.get("v.posChecked"));
                            }
                                    
                        },
                        
                        
                        xposChanged : function(cmp, event, helper) {
                            //cmp.set("v.posChecked", !cmp.get("v.xPosChecked"));
                              var pos = cmp.get ("v.posChecked");
                            var xpos =cmp.get ("v.xPosChecked");
                            
                            if (pos == true && xpos == true){
                                
                                cmp.set("v.posChecked", !cmp.get("v.xPosChecked"));
                            }
                                                  
                        },
                        
                        nuovoChanged : function(cmp, event, helper) {
                            //cmp.set("v.rinegoziazione", !cmp.get("v.Nuovo"));
                            var nuovo = cmp.get ("v.Nuovo");
                            var rinegoz =cmp.get ("v.rinegoziazione");
                            
                               if (nuovo == true && rinegoz == true){
                                
                                cmp.set("v.rinegoziazione", !cmp.get("v.Nuovo"));
                            }
                            
                            
                        },
                        rinegoziazioneChanged : function(cmp, event, helper) {
                            //cmp.set("v.Nuovo", !cmp.get("v.rinegoziazione"));
                              var nuovo = cmp.get ("v.Nuovo");
                              var rinegoz =cmp.get ("v.rinegoziazione");
                            
                               if (nuovo == true && rinegoz == true){
                                
                                cmp.set("v.Nuovo", !cmp.get("v.rinegoziazione"));
                                   
                            }
                            
                            
                        },
                        callWS : function(cmp, event, helper) {
                            cmp.set("v.loaded", false );
                            helper.callWS( cmp, event );
                        },
                        handlecellchange : function(cmp, event, helper) {
                            var draftValue = event.getParam("draftValues")[0];
                            console.log('VALUE: '+JSON.stringify(draftValue));
                            var data = cmp.get('v.data');
                            function getOriginalRow(element) {
                                return element.Id == draftValue.Id;
                            }        
                            var index = data.findIndex(getOriginalRow);
                            var dataObj = data.find(getOriginalRow);
                            var finalResultdraftValue = Object.assign(dataObj , draftValue);
                            console.log('VALUEAFTER: '+JSON.stringify(finalResultdraftValue));
                            data.splice(index, 1, finalResultdraftValue);
                            cmp.set('v.data',data);
                        },
                        handlecellchange2 : function(cmp, event, helper) {
                            var draftValue = event.getParam("draftValues")[0];
                            console.log('VALUE: '+draftValue);
                            var data2 = cmp.get('v.data2');
                            function getOriginalRow(element) {
                                return element.Id == draftValue.Id;
                            }        
                            var index = data2.findIndex(getOriginalRow);
                            var dataObj = data2.find(getOriginalRow);
                            var finalResultdraftValue = Object.assign(dataObj , draftValue);
                            console.log('VALUEAFTER: '+JSON.stringify(finalResultdraftValue));
                            data2.splice(index, 1, finalResultdraftValue);
                            cmp.set('v.data2',data2);
                        },
                        
                        handleSave: function (cmp, event, helper) {
                            helper.checkopportunitypathmerchant (cmp, event, helper );
                            
                            /*
                            const promise1 = new Promise((resolve, reject) => {
                                helper.checkopportunitypathmerchant (cmp, event, helper );
                                resolve('partito il check path merch!');
                                console.log ('STO NELLA PROMISE'); 
                            }   );
                                
                                
                                promise1.then((value) => {
                                console.log ('DOPO');
                                var pathmerchantbeforesave = cmp.get ("v.pathmerchant");
                                console.log ('pathmerchant DOPO:'+ pathmerchantbeforesave);        
                                
                            });
                                
                            
                            
                            //20.04.2021 before save check the path merchant of the opportunity and block everything if its not draft
                            
                            var pathmerchantbeforesave = cmp.get ("v.pathmerchant");
                            console.log ('pathmerchant nel save:'+ pathmerchantbeforesave);
                            
                            
                            if (pathmerchantbeforesave != 'Draft'){
                                console.log ('ferma tutto');
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    "type":"error",
                                    "title": "Errore!",
                                    "message": "Il path merchant dell'opportunità non è Draft."
                                });
                                toastEvent.fire();
                                
                            }
                            
                            //else{
                            
                            
                            var draftValues = cmp.get('v.data');
                            
                            
                            console.log ('DRAFTValues?:'+JSON.stringify(draftValues));
                            
                            var values2 = cmp.get('v.data2');
                            
                            console.log ('ValuesDue?:'+JSON.stringify(values2));
                            
                            var recordId = cmp.get('v.recordId');
                            var posChecked = cmp.get('v.posChecked');
                            //fix 14.04.2021 se entrambi i pulsanti sono spenti non deve mettere lettere. Svuotata la Var(prima N) e aggiunto else if.
                            
                            var rinegoziazione = '';
                            
                            if(cmp.get('v.rinegoziazione')){
                                rinegoziazione = 'R';
                            }
                            
                           else if(cmp.get('v.Nuovo')){
                                rinegoziazione = 'N';
                            }
                            
                            
                            var fterzi = '';
                            if(cmp.get('v.fterzi')){
                                fterzi = 'S';
                            }
                            var output = [];
                            if(draftValues != undefined && draftValues != null){
                                draftValues.forEach(function (element) {
                                    
                                   
                                    
                                    var ObjType = element.Id.toString().substring(0, 3);
                                    var ProductId = null;
                                    if(ObjType == '01t'){
                                        ProductId = element.Id;
                                    }
                                    else{
                                        ProductId = element.Product2Id;
                                    }
                                    output.push({'sobjectType':'OpportunityLineItem',
                                                 'IT_Standard_Price__c': element.IT_Standard_Price__c,
                                                 'IT_Product_Name__c':element.Name,
                                                 'IT_VAT_Percentage__c':element.IT_VAT_Percentage__c,
                                                 'IT_Deduction__c':element.IT_Deduction__c,
                                                 'IT_Current_Discount__c':element.IT_Current_Discount__c,
                                                 'IT_Commission_Discount__c':element.IT_Commission_Discount__c,
                                                 'IT_Current_Barcode__c':element.IT_Current_Barcode__c,
                                                 'IT_POS_Installation_Fee__c':rinegoziazione,
                                                 'IT_POS_Third_Party_Installation_Fee__c':fterzi,
                                                 'IT_Service_Code__c':element.Product2.IT_Affi_Code__c,
                                                 'OpportunityId':recordId,
                                                 'Product2Id': ProductId
                                                });
                                });
                            }
                            if(values2 != undefined && values2 != null){
                                values2.forEach(function (element) {
                                    var ObjType = element.Id.toString().substring(0, 3);
                                    var ProductId = null;
                                    if(ObjType == '01t'){
                                        ProductId = element.Id;
                                    }
                                    else{
                                        ProductId = element.Product2Id;
                                    }
                                    output.push({'sobjectType':'OpportunityLineItem',
                                                 'IT_Standard_Price__c': element.IT_Standard_Price__c,
                                                 'IT_Product_Name__c':element.Name,
                                                 'IT_VAT_Percentage__c':element.IT_VAT_Percentage__c,
                                                 'IT_Deduction__c':element.IT_Deduction__c,
                                                 'IT_Current_Discount__c':element.IT_Current_Discount__c,
                                                 'IT_Commission_Discount__c':element.IT_Commission_Discount__c,
                                                 'OpportunityId':recordId,
                                                 'IT_POS_Installation_Fee__c':rinegoziazione,
                                                 'IT_POS_Third_Party_Installation_Fee__c':fterzi,
                                                 'Product2Id': ProductId,
                                                 //12.04.2021 fix:
                                                 'IT_Service_Code__c':element.Product2.IT_Affi_Code__c
                                                });
                                });
                            }
                            console.log('output: ' + JSON.stringify(output));
                            
                            //12.04.2021 fix: passo 2 booleani  a c.updateSaveOLI
                            console.log ('pos is checked?:'+ posChecked);
                            var xxposChecked = cmp.get('v.xPosChecked');
                            console.log ('xpos is checked?:'+ xxposChecked ); 
                            
                            
                            
                            var action = cmp.get( "c.updateSaveOLI" );
                            
                            action.setParams({"oliList" : output,"recordId" : recordId,"pos" : posChecked, "xpos" : xxposChecked });
                            
                            action.setCallback(this,function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    cmp.set('v.loaded', true);
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        "type":"success",
                                        "title": "Successo!",
                                        "message": "Record salvati con successo "
                                    });
                                    toastEvent.fire();
                                    helper.updateTable( cmp, event ) ;
                                    
                                } else if (state === 'ERROR'){
                                    cmp.set('v.loaded', true);
                                    var errors = response.getError();
                                    console.log(JSON.stringify(errors));
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        "type":"error",
                                        "title": "Errore!",
                                        "message": "Qualcosa è andato storto durante il salvataggio, contatta un amministratore (Codice errore 114) "
                                    });
                                    toastEvent.fire();
                                } else{
                                    console.log('Something went wrong, Please check with your admin');
                                }
                            });
                            
                            // Queue this action to send to the server
                            $A.enqueueAction(action);
                    
                            //}//fine else del toast    
                          */
                        },
                    })