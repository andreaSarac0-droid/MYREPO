({  
	init : function(cmp, event, helper) {
		helper.init(cmp, event, helper);
    	  
	},
    handleSaveEdition : function(cmp, event, helper) {
        let listDraftValue = event.getParam('draftValues');
        var types = cmp.get('v.columnTypes');
        console.log('types',types);
        console.log('listDraftValue',listDraftValue);
        let listUpdate = [];
        let listInsert = [];
        
         
        listDraftValue.map(element =>{
            for(let a in Object.keys(element)) {
            let nameField = Object.keys(element)[a];
            let type = types[nameField];
            console.log('type',type);
            if(type == 'number' || type == 'currency' || type == 'percent'){
            	//Cast type number 
            	element[nameField] = Number(element[nameField]);
            	console.log('element[nameField]',element[nameField]);
        	}

				console.log(element[nameField]);
            		
			}
            element.Id.length === 15 || element.Id.length === 18 ? listUpdate.push(element) : listInsert.push(element);
        })
       	console.log('listupdate',listUpdate);
        let action = cmp.get('c.saveRecord');
        action.setParams({'listUp':listUpdate,'listIn':listInsert,
                          'nomeObj': cmp.get('v.NomeOggetto'),
                          'nomelookup':cmp.get('v.CampoLookup'),
                          'idLookup':cmp.get('v.recordId') });
        
        action.setCallback(this, (response)=> { 
            let state = response.getState();
            console.log(state);
            if (state == 'SUCCESS') { 
            	let bool = response.getReturnValue();
            	
            	
            	//helper.reloadDataTable();
            	helper.init(cmp,event,helper);
            helper.showToast({ "type":"success", "title": "Success!","message": "Record inseriti con successo!"})
        	}else{
                var errors = response.getError();
                console.log('errors',errors);
                let message = ''; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                
                console.error('errors',message);
                
                //console.log(JSON.stringify(response.getError()))
                helper.showToast({ "type":"error", "title": "Error","message": "Impossibile inserire i record: "+message});
        	           
        	}
         }); 
       $A.enqueueAction(action); 
        
        
  		
    },
        
    insertRow  : function(cmp, event, helper) {
        
        let listData = cmp.get('v.data');
        listData.push({});
        cmp.set('v.data',listData);
            
    },
    
	open : function(cmp, event, helper) {

        var recId = event.getParam('row').Id;
        console.log('recId',recId);
        var actionName = event.getParam('action').name;
        console.log('actionName',actionName);
        if ( actionName == 'view') {
            //alert('view');
            var viewRecordEvent = $A.get("e.force:navigateToURL");
            viewRecordEvent.setParams({
                "url": "/" + recId
            });
            viewRecordEvent.fire();
        }
    },
    updateColumnSorting: function(cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
    refresh: function(cmp, event, helper){
        console.log('reload');
       helper.init(cmp, event, helper);
       //helper.reloadDataTable();     
    }
    
      
})