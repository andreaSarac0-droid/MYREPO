({
    // To prepopulate the seleted value pill if value attribute is filled
	doInit : function( component, event, helper ) {
    	$A.util.toggleClass(component.find('resultsDiv'),'slds-is-open');
		if( !$A.util.isEmpty(component.get('v.value')) ) {
			helper.searchRecordsHelper( component, event, helper, component.get('v.value') );
		}
	},

    // When a keyword is entered in search box
	searchRecords : function( component, event, helper ) {
        //if( !$A.util.isEmpty(component.get('v.searchString')) ) {
		    helper.searchRecordsHelper( component, event, helper, '' );
        //} else {
        //    $A.util.removeClass(component.find('resultsDiv'),'slds-is-open');
        //}
	},

    // When an item is selected
	selectItem : function( component, event, helper ) {
        if(!$A.util.isEmpty(event.currentTarget.id)) {
    		var recordsList = component.get('v.recordsList');
    		var index = recordsList.findIndex(x => x.value === event.currentTarget.id)
            if(index != -1) {
                var selectedRecord = recordsList[index];
            }
            component.set('v.selectedRecord',selectedRecord);
            component.set('v.value',selectedRecord.value);
            console.log('selectedRecord.value: ' + selectedRecord.value);
    // call the event   
      //var compEvent = component.getEvent("oSelectedRecordEvent");
    // set the Selected Account to the event attribute.  
         //compEvent.setParams({"RecordByEvent" : selectedRecord.value });  
    // fire the event  
         //compEvent.fire();
            $A.util.removeClass(component.find('resultsDiv'),'slds-is-open');
        }
	},
    
    showRecords : function( component, event, helper ) {
        if(!$A.util.isEmpty(component.get('v.recordsList')) && !$A.util.isEmpty(component.get('v.searchString'))) {
            $A.util.addClass(component.find('resultsDiv'),'slds-is-open');
        }
	},

    // To remove the selected item.
	removeItem : function( component, event, helper ){
        component.set('v.selectedRecord','');
        component.set('v.value','');
        component.set('v.searchString','');
        setTimeout( function() {
            component.find( 'inputLookup' ).focus();
        }, 250);
    },

    // To close the dropdown if clicked outside the dropdown.
    blurEvent : function( component, event, helper ){
    	$A.util.removeClass(component.find('resultsDiv'),'slds-is-open');
    },
    
    
 

    valueChanged : function( component, event, helper ){
      
       
        var valueadesso = component.get ('v.selectedRecord.value');
        var labeladesso = component.get ('v.selectedRecord.label');
       
        
        var islegal = component.get ('v.islegal');
   
        if (valueadesso != null && valueadesso != 'undefined' && islegal == true ){
            
              console.log ('evento in partenza solo per legal.');

              var evt = $A.get("e.c:LNIT56_LookupReferentiEvent");
              evt.setParams({ 
                  "Pass_Result": valueadesso,
                  "Pass_Label": labeladesso
              });
              evt.fire();             
        }

        
    },
    
    
    
    getValueFromApplicationEvent : function(cmp, event) {
        
   console.log ('Evento arrivato');
        
        var ShowResultValue = event.getParam("Pass_Result"); 
        var ShowResultLabel = event.getParam("Pass_Label"); 
               
        var selectrecords = {};
        
        selectrecords.label = ShowResultLabel ;
        selectrecords.value = ShowResultValue;
        
       
        var valuedopo = cmp.get ('v.value');
        console.log ('valdopo' + valuedopo);
        
        
        var qualereferente = cmp.get ('v.qualereferente');
  
        
       if (valuedopo == null || valuedopo == 'undefined'){
        
        cmp.set("v.value",ShowResultValue );   
        cmp.set("v.selectedRecord",selectrecords );  
          }  

       
        
 }
    

    
})