({
 setLayoutTable: function(component, helper){
        component.set('v.columns', [
            {label: 'Codice Store', fieldName: 'codicestore', type: 'text',sortable: true},
            {label: 'Iban', fieldName: 'iban', type: 'text',sortable: true},
            {label: 'Tipo Servizio', fieldName: 'tipoServizio', type: 'text',sortable: true},
            {label: 'URL', fieldName: 'url', type: 'text',sortable: true},
            {label: 'ID POS', fieldName: 'idpos', type: 'text',sortable: true}           
          
        ]);
    },
            
            
  setData: function(component, helper){

            var OppIniziale = component.get ("v.OppIniziale");
            var documentoid =  component.get ("v.documentoid");
         
            var action = component.get("c.CSVtoOppStoreRiepilogo");  
            
             action.setParams({
            "recordid": OppIniziale,
            "documentoid": documentoid,           
             })
            
            
       action.setCallback(this, function (response) {
            
            if (action.getState() == "SUCCESS") {
                console.log ('chiamata andato in success');
                
                
                var responseCall = response.getReturnValue();  
                
                component.set('v.data', responseCall );
   
 
            }

        })
        $A.enqueueAction(action);      
       
    }          
            
})