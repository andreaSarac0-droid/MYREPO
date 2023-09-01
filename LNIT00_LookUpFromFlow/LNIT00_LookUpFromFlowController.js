({
        handleComponentEvent : function(component, event, helper) {
      
       var selectedRecordtGetFromEvent = event.getParam("RecordByEvent");
	   component.set("v.selectedRecord" , selectedRecordtGetFromEvent);            
            console.log("selectedRecordtGetFromEvent:" + selectedRecordtGetFromEvent);
        }
})