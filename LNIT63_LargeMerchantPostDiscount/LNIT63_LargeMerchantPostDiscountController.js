({
	doInit : function(component, event, helper) {
        
         var recordId = component.get("v.recordId");
       
        
          var action = component.get("c.LargeMerchantPostDiscount");  
          
           console.log ('OK1');
         
            component.set('v.columns1', [
                             
                {label: 'Codice Sconto FEE', fieldName: 'discount_fee_code', type: 'text'},
                {label: 'Sconto FEE', fieldName: 'discount_fee', type: 'text'},   
                {label: 'Sconto una TANTUM', fieldName: 'discount_one_off', type: 'text'}, 

            ]); 
        
        
        
            component.set('v.columns2', [
                
                
                {label: 'Giorno', fieldName: 'day', type: 'text'},
                {label: 'Dalle', fieldName: 'opening_hour_string', type: 'text'}, 
                {label: 'Alle', fieldName: 'closing_hour_string', type: 'text'},
                {label: 'Sconto POS', fieldName: 'discount_pos', type: 'text'},
                {label: 'Sconto Codice', fieldName: 'discount_code', type: 'text'},
                
                
                
            ]); 
                
                
            component.set('v.columns3', [
                
                
                {label: 'Cod. Origine', fieldName: 'origin', type: 'text'},
                {label: 'Origine', fieldName: 'origin_desc', type: 'text'},
                {label: 'ID POS', fieldName: 'merchant_ref', type: 'text'},    
                {label: 'Stato', fieldName: 'status', type: 'text'},
      
            ]);     
                
                
        
        
         action.setParams({
            "recordId": recordId

        })
         
         
       action.setCallback(this, function (response) {
                
                 console.log ('OK2');
            
            if (action.getState() == "SUCCESS") {
                
                 
                var responseCall = response.getReturnValue();   
               // console.log ('stringify del ritorno dei WS:'+ JSON.stringify(responseCall));
                
                if (responseCall != null && responseCall != '') {
                    
                    component.set('v.data', responseCall );  
                    component.set('v.data2', responseCall.economic_conditions.slice(0,1) );    
                    
                
                //convertire giorni e ore per activity hour
              function time_convert(num){ 
              var hours = Math.floor(num / 60);  
              var minutes = num % 60;
              return hours + ":" + minutes;         
              }
                
             
                var selected=[];
                        
                 selected  = responseCall.activity_hour ;  
                          
                 for(var i=0; i < selected.length; i++) { 
                
                  if (selected[i].day == 1){selected[i].day = 'Lunedì';}
                  if (selected[i].day == 2){selected[i].day = 'Martedì';}
                  if (selected[i].day == 3){selected[i].day = 'Mercoledì';}
                  if (selected[i].day == 4){selected[i].day = 'Giovedì';}
                  if (selected[i].day == 5){selected[i].day = 'Venerdì';}
                  if (selected[i].day == 6){selected[i].day = 'Sabato';}
                  if (selected[i].day == 7){selected[i].day = 'Domenica';}
                
                 var tempo =   new Date(selected[i].opening_hour * 1000).toISOString().substr(11, 5);
                
                 console.log ('tempo:' + tempo);
                 selected[i].opening_hour = tempo ;

                  }            
                 component.set('v.data3', selected ); 
        
                 component.set('v.data4', responseCall.pos );  
                }

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
		
	}

})