({
    /*getQuoteTemplateList: function(component, helper,recordId){
        return helper.invokeAura(component, 'getQuoteTemplateList').then((response)=>{
            const result = response.getReturnValue();
            component.set("v.quoteTemplateList", result);
            console.log("v.quoteTemplateList" + result);
            return Promise.resolve(response);
        })*/
    QuoteTemplateL: function(component,helper,recordId) {
        console.log("Siamo entrati nell'helper"); 
       var action = component.get("c.getQuoteTemplateList");
        console.log("Action  = " + action);  
        action.setParams({idQuote:recordId});
        console.log("Parametro settato");  
       action.setCallback(this, (response)=>{
           const state = response.getState();
           console.log('state',state);
           if(state === 'SUCCESS'){
           const result = response.getReturnValue();
            console.log("dimensione lista template " + result.length);
          
          if(result.length == 0){
           var x = document.getElementById("buttongeneratepdf");
           x.style.display = "none";
           component.find('notifLib').showToast({
                "variant": "error",
                   //"message": "There are no Quote templates associated with the product type of the Quote.",
                   "message": "Per questo prodotto non è possibile generare il modulo primo ordine né il contratto.",
           
                   "mode" : "sticky"
               })  
       } 
    if(result[0].quoteID == "Error" && result[0].quoteName == "Error" ){
           var x = document.getElementById("buttongeneratepdf");
           x.style.display = "none";
            component.find('notifLib').showToast({
                "variant": "error",
                   "message": "Quote Stage Draft or In Approval you cannot generate the PDF. Some required field could be missing.",
                   "mode" : "sticky"
               }) 
       }
       if(result[0].quoteID == "Error2"){
           var x = document.getElementById("buttongeneratepdf");
           x.style.display = "none";
            component.find('notifLib').showToast({
                "variant": "error",
                   "message": result[0].quoteName ,
                   "mode" : "sticky"
               }) 
       }
           
            console.log("response Test: " + response.getReturnValue());
           console.log("Result value0: " + result[0].quoteID);
           console.log("Result value0: " + result[0].quoteName);
      if(!result[0].quoteID.includes('Error') && result.length >= 1){
          component.set("v.templateIDandName", result);
           var testcomp = component.get("v.templateIDandName");
      }
           console.log("testcomp: " +testcomp)
       }else if( state === 'ERROR'){
           component.find('notifLib').showToast({
                "variant": "error",
                   "message": "There is a problem.(Check Product or Account field on this Quote)",
                   "mode" : "sticky"
               })               
      }
           
    });
   
    $A.enqueueAction(action);
    },
        
        UpdateTemapletID: function(component,helper,tempID,recordId) {
            var action = component.get('c.updateTemplateID');
            action.setParams({templateID:tempID,quoteID:recordId});
            action.setCallback(this, (response)=>{
            const state = response.getState();
           console.log('state',state);
           if(state === 'SUCCESS'){
           const result = response.getReturnValue();
           
       }else if( state === 'ERROR'){
           
               }               
      }
           
    );
     $A.enqueueAction(action);
        }
        
})