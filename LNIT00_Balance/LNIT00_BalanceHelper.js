({
	balanceType : function(component, event, helper, recordId, recordObjectName) {
        console.log('recordId',recordId);
        console.log('recordObjectName',recordObjectName);
		return new Promise($A.getCallback((resolve, reject)=>{
            const action = component.get("c.getBalancesType");
                
            action.setParams({"recordId": recordId, 
                          "recordObjectName" : recordObjectName});
            action.setCallback(this, (response)=>{
                const state = response.getState();
                console.log('state',state);
                if(state === 'SUCCESS'){
                    console.log('response',response.getReturnValue()); 

                    component.set("v.prod_TR", response.getReturnValue());  
            		resolve(response);
                        
                }else{
                     console.error(response.getError());         
                }
            });   
            $A.enqueueAction(action);
		}));
	},
    invokeGetBalances : function(component, event, helper, recordId, recordObjectName) {
		const action = component.get("c.getBalances");
                
        action.setParams({"recordId": recordId, 
                          "recordObjectName" : recordObjectName});
                              
            action.setCallback(this, (response)=>{
                const state = response.getState();
                console.log('state',state);
                if(state === 'SUCCESS'){
                    var resp = response.getReturnValue();
                    console.log('response',resp);
                    // get product type
                    var prodType = resp.split('+')[0];
                    // get json of the response
                    var prodList = resp.split('+')[1];
                    console.log('prodList',prodList);
                              
                    var parsedProd = [];
                    
                    if(prodType === 'ETR'){
                        parsedProd = JSON.parse(prodList);
                        console.log('parsedProd TRS',parsedProd.data);
                        
                        if(Array.isArray(parsedProd.data)){
                              (parsedProd.data).forEach(d => {
                                var tradType;
                                var tradStatus;
                                console.log(d.tr_detail.type); 
                                  
                                //type translation 
                                if(d.tr_detail.type == 'card'){
                                    tradType = 'Tessera';	  
                                 }else if(d.tr_detail.type == 'mobile'){
                                    tradType = 'Smartphone';
                                 }else if(d.tr_detail.type == 'cloud'){
                                    tradType = 'Cloud';
                                 }
                                d["type"] = tradType;
                                //status translation
                                if(d.status == 'active'){
                                    tradStatus = 'Attivo';	  
                                 }else if(d.status == 'blocked'){
                                    tradStatus = 'Bloccato';
                                 }else if(d.status == 'damaged'){
                                    tradStatus = 'Danneggiato';
                                 }else if(d.status == 'inactive'){
                                    tradStatus = 'Inattivo';
                                 }else if(d.status == 'stolen'){
                                    tradStatus = 'Rubato';
                                 }else if(d.status == 'lost'){
                                    tradStatus = 'Perso';
                                 }
                                 d.status = tradStatus;
                            });   
                      	} else {
                        	var tradType;
                            var tradStatus;
                            console.log(parsedProd.data.tr_detail.type); 
                                  
                            //type translation 
                            if(parsedProd.data.tr_detail.type == 'card'){
                            	tradType = 'Tessera';	  
                            }else if(parsedProd.data.tr_detail.type == 'mobile'){
                            	tradType = 'Smartphone';
                            }else if(parsedProd.data.tr_detail.type == 'cloud'){
                            	tradType = 'Cloud';
                            }
                            parsedProd.data["type"] = tradType;
                            //status translation
                            if(parsedProd.data.status == 'active'){
                            	tradStatus = 'Attivo';	  
                            }else if(parsedProd.data.status == 'blocked'){
                            	tradStatus = 'Bloccato';
                            }else if(parsedProd.data.status == 'damaged'){
                            	tradStatus = 'Danneggiato';
                            }else if(parsedProd.data.status == 'inactive'){
                            	tradStatus = 'Inattivo';
                            }else if(parsedProd.data.status == 'stolen'){
                            	tradStatus = 'Rubato';
                            }else if(parsedProd.data.status == 'lost'){
                            	tradStatus = 'Perso';
                            }
                            parsedProd.data.status = tradStatus; 	     
                        }
                        console.log(parsedProd);  
                              
                        }else if(prodType === 'WEL'){
                            parsedProd = JSON.parse(prodList);      
                            console.log('parsedProd WELFARE',parsedProd.data);
                            if(Array.isArray(parsedProd.data)){
                           		(parsedProd.data).forEach(d => {
                                    console.log('test',d.twv_details.flg_cash_welfare); 
                                    d["flg_cash_welfare"] = d.twv_details.flg_cash_welfare ? 'Attivo' : 'Inattivo';
                                    d["premium_amount"] = d.twv_details.premium_amount;
                                    d["expiration_date"] = d.twv_details.expiration_date
                        		});   
                            }else{
                            	console.log('test',parsedProd.data.twv_details.flg_cash_welfare); 
                              	parsedProd.data["flg_cash_welfare"] = parsedProd.data.twv_details.flg_cash_welfare ? 'Attivo' : 'Inattivo';
                                parsedProd.data["premium_amount"] = parsedProd.data.twv_details.premium_amount;
                                parsedProd.data["expiration_date"] = parsedProd.data.twv_details.expiration_date  
                            }
                            
                        	console.log(parsedProd); 
                        }
                            
                        else if(prodType === 'TCW'){
                            parsedProd = JSON.parse(prodList);      
                            console.log('parsedProd TCW',parsedProd.data);
                            if(Array.isArray(parsedProd.data)){
                                (parsedProd.data).forEach(d => {
                                    console.log('test',d); 
                                    d["loaded_amount"] = d.loaded_amount;
                                    d["remaining_amount"] = d.remaining_amount
                                });   
                            }else{
                                console.log('test',parsedProd.data); 
                                parsedProd.data["loaded_amount"] = parsedProd.data.loaded_amount;
                                parsedProd.data["remaining_amount"] = parsedProd.data.remaining_amount 
                            }
                            
                            console.log(parsedProd); 
                    }
					         
                    /*if(parsedProd.meta.status === 'succeeded'){
                        
                    	component.set("v.data",parsedProd.data);  
						
                    }else{
                    	console.error('ERROR',parsedProd.meta.messages[0]);       
                    }*/
                    component.set("v.data",parsedProd.data);
            		resolve(response);
                        
                }else{
                     var errors = response.getError();
                        let message = 'Error: '; // Default error message
                        // Retrieve the error message sent by the server
                        if (errors && Array.isArray(errors) && errors.length > 0) {
                        message += errors[0].message;
                        }
                        console.error('errors',message);    
                }
            });   
            $A.enqueueAction(action);        
    }
})