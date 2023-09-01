({
    
    updateTable : function( cmp, event, helper ) {
        
        var action = cmp.get( "c.getOppoLineItems" );
        var recordId = cmp.get("v.recordId");
        
        action.setParams({"recordId" : recordId});
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.loaded', true);
                if ( response.getReturnValue() != null ) {
                    var result = response.getReturnValue();
                    //console.log("result di c.getOppoLineItems:" + JSON.stringify(result));
                    console.log("result di c.getOppoLineItems:" + result);
                    var data = result[0];
                    var fetchData = [];
                    data.forEach(function (element) {
                        element.Name = element.IT_Product_Name__c
                        fetchData.push(element);
                    });
                    var data2 = result[1];
                    var fetchData2 = [];
                    data2.forEach(function (element) {
                        element.Name = element.IT_Product_Name__c
                        if (element.Product2.ER_Solution__c != null && element.Product2.ER_Solution__c != undefined) {
                            element.SolutionName = element.Product2.ER_Solution__r.Name;
                        }
                        fetchData2.push(element);
                    });
                    //var data = JSON.parse(result).data;
                    cmp.set('v.data',fetchData);
                    cmp.set('v.data2',fetchData2);
                    console.log("DATA OK: " + result);
                    if((fetchData == null || fetchData.length == 0)&&(fetchData2 == null || fetchData2.length == 0)) {
                        const promise1 = new Promise((resolve, reject) => {
                            helper.loadDefault( cmp, event, true )
                            resolve('Success!');
                        });
                            
                            promise1.then((value) => {
                            helper.callWS( cmp, event );
                        });
                        }
                            
                        }
                            else {
                            console.log("No Data Found");
                        }
                        } else if (state === 'ERROR'){
                            cmp.set('v.loaded', true);
                            var errors = response.getError();
                            console.log(JSON.stringify(errors));
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                            "type":"error",
                            "title": "Errore!",
                            "message": "Impossibile trovare servizi associati all'opportunità, contatta un amministratore (Codice errore 113) "
                        });
                        toastEvent.fire();
                    } else{
                        console.log('Something went wrong, Please check with your admin');
                    }
                });
                
                // Queue this action to send to the server
                $A.enqueueAction(action);
            },
                
                getDefault : function(cmp, row, tableNumber) {
                    console.log(JSON.stringify(row));
                    if(row.Id != undefined && row.Id != null){
                        console.log(row.Id);
                        var rowId = row.Id;
                        if(rowId.substring(0,3) == '00k'){
                            rowId = row.Product2Id;
                        }
                        var action = cmp.get( "c.getDefaultRow" );
                        
                        action.setParams({"rowId": rowId});
                        
                        action.setCallback(this,function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                                cmp.set('v.loaded', true);
                                if ( response.getReturnValue() != null ) {
                                    var result = response.getReturnValue();
                                    console.log("result: " + JSON.stringify(result));
                                    
                                    var data = cmp.get('v.data');
                                    var data2 = cmp.get('v.data2');
                                    
                                    function getOriginalRow(element) {
                                        /*if(rowId.substring(0,3) == '00k'){
                                return element.Product2Id == rowId;
                            }*/
                                        return element.Id == row.Id;
                                    }
                                    
                                    //var index = data.findIndex(getOriginalRow); 
                                    //if(index != null && index != undefined){
                                    if(tableNumber == 1){
                                        var index = data.findIndex(getOriginalRow);
                                        result.Name = result.Product2.Name;
                                        result.Id = result.Product2Id;
                                        data.splice(index, 1, result);
                                        cmp.set('v.data',data);
                                    }
                                    else{
                                        index = data2.findIndex(getOriginalRow);
                                        result.Name = result.Product2.Name;
                                        result.Id = result.Product2Id;
                                        result.SolutionName = result.Product2.ER_Solution__r.Name;
                                        data2.splice(index, 1, result);
                                        cmp.set('v.data2',data2);
                                    }
                                }
                                else {
                                    console.log("No Rows Found");
                                }
                            } else if (state === 'ERROR'){
                                cmp.set('v.loaded', true);
                                var errors = response.getError();
                                console.log(JSON.stringify(errors));
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    "type":"error",
                                    "title": "Errore",
                                    "message": "C'è stato un problema nel popolamento della tabella, contatta un amministratore. (Codice errore 111)"
                                });
                                toastEvent.fire();
                            } else{
                                console.log('Something went wrong, Please check with your admin');
                            }
                        });
                        $A.enqueueAction(action);
                        
                    }
                    else{
                        console.log(row.service_ref);
                    }
                    
                },
                    
                    
                    loadDefault : function(cmp, row, firstTime) {
                          cmp.set('v.loading', true);
                        
                        var action = cmp.get( "c.getDefaultValuesTAB2" );
                        var azioneMarketing = cmp.get("v.marketingId");
                        var contractType = cmp.get("v.contractName");
                        
                        console.log ('sto caricando il default e ho questi parametri:'+azioneMarketing+' e '+ contractType);
                        
                        action.setParams({"azioneMarketing": azioneMarketing,"contractType": contractType});
                        
                        action.setCallback(this,function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                              //  cmp.set('v.loaded', true);
                                if ( response.getReturnValue() != null ) {
                                    var result = JSON.parse(response.getReturnValue());
                                    console.log("result di c.getDefaultValuesTAB2: " + JSON.stringify(result));
                                    
                                    var data = result[0];
                                    var fetchData = [];
                                    data.forEach(function (element) {
                                        element.Name = element.Product2.Name;
                                        element.Id = element.Product2Id;
                                        fetchData.push(element);
                                        if(firstTime){
                                            element.IT_Commission_Discount__c = null;
                                        }
                                    });
                                    var data2 = result[1];
                                    var fetchData2 = [];
                                    data2.forEach(function (element) {
                                        element.Name = element.Product2.Name;
                                        element.Id = element.Product2Id;
                                        if (element.Product2.ER_Solution__c != null && element.Product2.ER_Solution__c != undefined) {
                                            element.SolutionName = element.Product2.ER_Solution__r.Name;
                                        }
                                        if(firstTime){
                                            element.IT_Commission_Discount__c = null;
                                        }
                                        fetchData2.push(element);
                                    });
                                    console.log("firstTime "+firstTime);
                                    console.log("data dentro load default "+JSON.stringify(fetchData));
                                    console.log("data2 dentro load default "+JSON.stringify(fetchData2));
                                    cmp.set('v.data',fetchData);
                                    cmp.set('v.data2',fetchData2);
                                    cmp.set('v.loading', false);
                                    cmp.set('v.loaded', true);
                                    
                                }
                                else {
                                    console.log("No Rows Found");
                                }
                            } else if (state === 'ERROR'){
                                cmp.set('v.loaded', true);
                                var errors = response.getError();
                                console.log(JSON.stringify(errors));
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    "type":"error",
                                    "title": "Errore",
                                    "message": "C'è stato un problema nel popolamento della tabella, contatta un amministratore. (Codice errore 111)"
                                });
                                toastEvent.fire();
                            } else{
                                console.log('Something went wrong, Please check with your admin');
                            }
                        });
                        $A.enqueueAction(action);
                        
                    },
                        
                        
                        callWS : function(cmp, event) {
                            var action = cmp.get( "c.getScontiWS" );
                            var storeRef = cmp.get("v.storeRef");
                            var contractName = cmp.get("v.contractName");
                            var marketingId = cmp.get("v.marketingId");
                            
                            action.setParams({"storeRef": storeRef,"azioneMarketing": marketingId,"contractType": contractName });
                            
                            action.setCallback(this,function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    cmp.set('v.loaded', true);
                                    if ( response.getReturnValue() != null ) {
                                        var result = response.getReturnValue();
                                        console.log("resultData di c.getScontiWS: " + result);
                                        
                                        var dataWS = JSON.parse(result);
                                        console.log ('DATAWS: '+ JSON.stringify(dataWS));
                                        
                                        var data = cmp.get('v.data');
                                        var fetchData = [];
                                        dataWS.forEach(function (element) {
                                            let singleElement = {};
                                            console.log("service_ref: " + element.service_ref);
                                            function getSameProductCode(element2) {
                                                return element2.Product2.IT_Affi_Code__c == element.service_ref;
                                            }
                                            var index = data.findIndex(getSameProductCode);
                                            console.log("DATA BEFORE: " + JSON.stringify(data[index]));
                                            if(data[index] != undefined){
                                                data[index].IT_Current_Discount__c = element.discount;                            
                                            }
                                            console.log("DATA AFTER: " + JSON.stringify(data[index]));
                                            //data.splice(index, 1, element);
                                            //console.log("element: " + element.service_desc);
                                            /*singleElement.Name = element.service_desc;
                        singleElement.IT_VAT_Percentage__c = element.vat;
                        singleElement.IT_Current_Discount__c = element.discount;
                        singleElement.IT_Commission_Discount__c = element.discount;
                        singleElement.IT_Deduction__c = false;
                        if(element.deduction == 'S'){
                            singleElement.IT_Deduction__c = true;
                        }
                        if(element.IT_Current_Barcode__c != null && element.IT_Current_Barcode__c != undefined){
                            singleElement.IT_Current_Barcode__c = element.barcode_contract;
                            singleElement.BarcodeLink = 'http://eit-kiwi-d.edenred.net/GetDoc/getdoc?MULTI=True&APPID=CA&KEY1='+element.barcode_contract;
                        }                    
                        fetchData.push(singleElement);*/
                            });
                            cmp.set('v.data',data);
                            console.log("DATA OK: " + data);
                            var data2 = cmp.get('v.data2');
                            
                            function findCity1(element) {
                                return element.Product2.IT_Affi_Code__c == 'city1';
                            }
                            function findcity1WSRow(element) {
                                return element.service_ref == '1S' && (element.closing_date == undefined || element.closing_date == null);
                            }
                            var WSRowCity = dataWS.find(findcity1WSRow);
                            console.log("WSRowCity: " + JSON.stringify(WSRowCity));
                            if(WSRowCity != undefined && WSRowCity != null){
                                var indexDataCity1 = data2.findIndex(findCity1);
                                
                                console.log ('VARIABILE INDEXDATACITY1:'+indexDataCity1 );
                                
                                console.log("DWSfindCity1: " + findCity1);
                                console.log("questo è ultimo log, non procede oltre");
                                
                                if (indexDataCity1 != '-1'){
                                data2[indexDataCity1].IT_Current_Discount__c = WSRowCity.discount;
                                    }
                                //cmp.set('v.data2',data2);
                                
                            }
                                        
                                        
                                        
                             
                            /*var action2 = cmp.get( "c.getDefaultValuesTAB2" );
                    var azioneMarketing = cmp.get("v.marketingId");
                    var contractType = cmp.get("v.contractName");
                    
                    action2.setParams({"azioneMarketing": azioneMarketing,"contractType": contractType});
                    
                    action2.setCallback(this,function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            cmp.set('v.loaded', true);
                            if ( response.getReturnValue() != null ) {
                                var result = JSON.parse(response.getReturnValue());
                                console.log("resultData2: " + JSON.stringify(result));
                                var data2 = result[1];
                                var fetchData2 = [];
                                data2.forEach(function (element) {
                                    element.Name = element.Product2.Name;
                                    element.Id = element.Product2Id;
                                    if (element.Product2.ER_Solution__c != null && element.Product2.ER_Solution__c != undefined) {
                                        element.SolutionName = element.Product2.ER_Solution__r.Name;
                                    }
                                    fetchData2.push(element);
                                });
                                console.log("data2 "+JSON.stringify(fetchData2));
                                cmp.set('v.data2',fetchData2);*/
                            
                                        
                            console.log ("questa parte non scatta");            
                                        
                            var action3 = cmp.get( "c.getFeeData" );
                          
                            var storeRef = cmp.get("v.storeRef");
                            
                            action3.setParams({"storeRef": storeRef });
                            
                            action3.setCallback(this,function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    cmp.set('v.loaded', true);
                                    var result = response.getReturnValue();
                                    if ( response.getReturnValue() != null ) {
                                        function findFee1(element) {
                                            return element.Product2.IT_Affi_Code__c == 'fee1';
                                        }
                                        function findFee2(element) {
                                            return element.Product2.IT_Affi_Code__c == 'fee2';
                                        }
                                        function findFee3(element) {
                                            return element.Product2.IT_Affi_Code__c == 'fee3';
                                        }
                                        function findCity2(element) {
                                            return element.Product2.IT_Affi_Code__c == 'city2';
                                        }
                                        function findFeeWSRow(element) {
                                            return element.service_ref == 'R ' && element.operator_type == 'E' && element.economic_group_ref == '000000';
                                        }
                                        function findcityWSRow(element) {
                                            return element.service_ref == '1S' && element.operator_type == 'E' && element.economic_group_ref == '000000';
                                        }
                                        var data2WS = JSON.parse(result);
                                        var realData2WS = data2WS.data;
                                        console.log("data2WS: " + JSON.stringify(data2WS));
                                        console.log("realData2WS: " + JSON.stringify(realData2WS));
                                        if(realData2WS != null && realData2WS != undefined){
                                            var WSRow = realData2WS.find(findFeeWSRow);
                                            console.log("WSRow: " + WSRow);
                                            var CityRow = realData2WS.find(findcityWSRow);
                                            //var data2 = cmp.get('v.data2');
                                            if(WSRow != undefined){
                                                var indexData2Fee1 = data2.findIndex(findFee1);
                                                var indexData2Fee2 = data2.findIndex(findFee2);
                                                var indexData2Fee3 = data2.findIndex(findFee3);
                                                data2[indexData2Fee1].IT_Current_Discount__c = WSRow.installation_cost;
                                                data2[indexData2Fee2].IT_Current_Discount__c = WSRow.fee_value;
                                                data2[indexData2Fee3].IT_Current_Discount__c = WSRow.monthly_fee;
                                            }
                                            if(CityRow != undefined){
                                                var indexData2City2 = data2.findIndex(findCity2);
                                                console.log ('INDEXCITY2:'+indexData2City2);
                                                
                                                
                                                 if (indexData2City2 != '-1'){
                                                data2[indexData2City2].IT_Current_Discount__c = CityRow.fee_value;
                                                 }
                                            }
                                            cmp.set('v.data2',data2);
                                            console.log("DATA2 OK: " + data2);
                                            
                                            console.log ('RECAP:');
                                            console.log("WSRowCity: " + JSON.stringify(WSRowCity));
                                            console.log("WSRow: " + WSRow);
                                            console.log ('citytrow:'+CityRow);
                                            
                                        }
                                    }
                                    else {
                                        console.log("No Columns Found");
                                    }
                                } else if (state === 'ERROR'){
                                    cmp.set('v.loaded', true);
                                    var errors = response.getError();
                                    console.log(JSON.stringify(errors));
                                    var toastEvent = $A.get("e.force:showToast");
                                    toastEvent.setParams({
                                        "type":"error",
                                        "title": "Errore",
                                        "message": "C'è stato un problema nell'effettuare la chiamata, contatta un amministratore.(Codice errore 112)"
                                    });
                                    toastEvent.fire();
                                } else{
                                    console.log('Something went wrong, Please check with your admin');
                                }
                            });
                            
                            $A.enqueueAction(action3);
                            
                        }
                        /*else {
                                console.log("No Rows Found");
                            }
                        } else if (state === 'ERROR'){
                            cmp.set('v.loaded', true);
                            var errors = response.getError();
                            console.log(JSON.stringify(errors));
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "type":"error",
                                "title": "Errore",
                                "message": "C'è stato un problema nel popolamento della tabella, contatta un amministratore. (Codice errore 111)"
                            });
                            toastEvent.fire();
                        } else{
                            console.log('Something went wrong, Please check with your admin');
                        }
                    });
                    $A.enqueueAction(action2);
                    
                }*/
                        else {
                            console.log("No Columns Found");
                        }
                    } else if (state === 'ERROR'){
                        cmp.set('v.loaded', true);
                        var errors = response.getError();
                        console.log(JSON.stringify(errors));
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "type":"error",
                            "title": "Errore",
                            "message": "C'è stato un problema nell'effettuare la chiamata, contatta un amministratore.(Codice errore 112)"
                        });
                        toastEvent.fire();
                    } else{
                        console.log('Something went wrong, Please check with your admin');
                    }
                });
                
                // Queue this action to send to the server
                $A.enqueueAction(action);
            },   
                
                //13.04.2021 fix: preselezionare i toggles in base al valore scritto su pos type dell'opportunità.
                
                Preselect : function(cmp, event, helper) {
                    var oppid = cmp.get("v.recordId");
                    console.log ('id dellopp:'+oppid);
                    
                    var action = cmp.get("c.Preselect");
                    action.setParams({
                        "oppid": oppid
                    });
                    
                    
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            
                            var result = response.getReturnValue();    
                            console.log ('RITORNO DI PRESELECT:'+ result);
                            
                            if (result == 'P'){
                                cmp.set("v.posChecked", true);
                            }
                            else if (result == 'X'){
                                cmp.set("v.xPosChecked", true);
                            }
                            
                            
                            
                            
                        }
                        else {
                            
                        }
                    });
                    // Send action off to be executed
                    $A.enqueueAction(action); 
                    
                },
                    
                    
                    //13.04.2021 fix: preselezionare i toggles in base al valore scritto su IT_POS_Installation_Fee__c delle opplines. E anche IT_POS_Third_Party_Installation_Fee__c
                    
                    Preselect2 : function(cmp, event, helper) {
                        var oppid = cmp.get("v.recordId");
                        console.log ('id dellopp:'+oppid);
                        
                        var action = cmp.get("c.Preselect2");
                        action.setParams({
                            "oppid": oppid
                        });
                        
                        action.setCallback(this, function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {                            
                                var result = response.getReturnValue();    
                                console.log ('RITORNO DI PRESELECT2:'+ result);
                                
                                
                                result.forEach(function(element) {
                                 if (element == 'N'){
                                    cmp.set("v.Nuovo", true);
                                }
                                
                                 if (element == 'R'){
                                    cmp.set("v.rinegoziazione", true);
                                }   
                                    
                                if (element == 'S')    
                                   cmp.set("v.fterzi", true); 
                                    
                                });  
                                
                                
         
                                
                            }
                            else {
                                
                            }
                        });
                        // Send action off to be executed
                        $A.enqueueAction(action);    
                        
                    },
                        
                        //14.04.2021 fix: se il componente viene chiamato dal flow, se non c'erano opplines il flow deve mostrare l'output di loaddefault
                        findopplinespresent : function(cmp, event, helper) {
                            var oppid = cmp.get("v.recordId");
                            console.log ('id dellopp:'+oppid);
                            
                            var action = cmp.get("c.findopplinespresent");
                            action.setParams({
                                "oppid": oppid
                            });
                            
                            action.setCallback(this, function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    cmp.set("v.allopplinespresenti", response.getReturnValue());
                                    var opplinespresent = cmp.get ("v.allopplinespresenti");
                                    console.log ('Le OppLines Presenti già:'+JSON.stringify(opplinespresent) );
                                    
                                    
                                     // se non vi sono già opplines collegate all opp, il flow deve far vedere il loaddefault
                           
                            
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
                                               
                                    
                                }
                                else {
                                    
                                }
                            });
                            // Send action off to be executed
                            $A.enqueueAction(action);   
                            
                           
                            
                        },//end of function
                            
                         
            checkopportunitypathmerchant : function(cmp, event, helper) {
                            var oppid = cmp.get("v.recordId");
                            console.log ('id dellopp nellhelper:'+oppid);
                            
                            var action = cmp.get("c.checkopportunitypathmerchant");
                            action.setParams({
                                "recordId": oppid
                            });
                            
                            action.setCallback(this, function(response) {
                                var state = response.getState();
                                if (state === "SUCCESS") {
                                    cmp.set("v.pathmerchant", response.getReturnValue());
                                    var pathmerchant = cmp.get ("v.pathmerchant");
                                    console.log ('pathmerchant nellhelper:'+ pathmerchant);
                                    
                                     if (pathmerchant != 'Draft'){
                                console.log ('ferma tutto');
                                var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    "type":"error",
                                    "title": "Errore!",
                                    "message": "Non è possibile modificare le condizioni economiche."
                                });
                                toastEvent.fire();
                                
                            }

                                    else {
                                        helper.savefix (cmp,event,helper);
                                    }
                                    
                                    
                                    
                                    
                                    
                                    
                                }
                                else {
                                    
                                }
                            });
                            // Send action off to be executed
                            $A.enqueueAction(action);    
                            
                        },      
            
            
            savefix : function (cmp,event,helper){
                
                
                
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
                
                
            },
                                        

            
        })