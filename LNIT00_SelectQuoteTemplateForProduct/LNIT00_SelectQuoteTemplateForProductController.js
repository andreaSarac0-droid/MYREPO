({
      doInit : function(component, event, helper){
      
       var recordId = component.get("v.recordId");
       console.log("RecordID  = " + recordId);   
       helper.QuoteTemplateL(component, helper, recordId);
       
    },
   
    handleClick : function(component, event, helper){
       var record18Id = component.get("v.recordId");
        var record15id = record18Id.slice(0, 15);
       console.log("RecordID  = " + record15id); 
       var urlZuora = "/apex/zqu__zqgeneratedocument?quoteId="+record15id+"&format=pdf";
        window.open(urlZuora);
    },
    
    onChangeSelect: function(component, event, helper){
        console.log("Onchange");
       var x = document.getElementById("buttongeneratepdf");
       x.style.visibility = "visible";
       var recordId = component.get("v.recordId");
       var tempID = component.get("v.selectedValue");
       helper.UpdateTemapletID(component, helper, tempID,recordId);
       
    },
});