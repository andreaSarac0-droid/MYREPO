({
	sortData_present: function (component, fieldName, sortDirection) {
        var dataToSort = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        component.set("v.data", dataToSort);
    },

    sortBy: function (field, reverse, primer) {
        var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a)?key(a):'', b = key(b)?key(b):'', reverse * ((a > b) - (b > a));
        }
   },

   saveDataTable : function(component, event, helper) {
        var editedRecords =  component.find("tableW").get("v.draftValues");
        var listWorkflow =  component.get("v.dataWorkflow");
        var action = component.get( "c.updateNoteInline" );  
        action.setParams({       
            'dataRef' : editedRecords,
            'dataRefOld' : listWorkflow   
        });  
        action.setCallback( this, function( response ) {  
            
            var state = response.getState();   
            if ( state === "SUCCESS" ) {  
                component.find( "tableW" ).set( "v.draftValues", null );
                var caseList = response.getReturnValue(); 
                component.set('v.dataWorkflow', caseList.slice(0,5));   
                helper.showToast({
                    "title": "Record Update",
                    "type": "success",
                    "message": "Records Updated"
                });      
                
            } else {  
                var Errors = response.getError();
                console.log('Error:: '+Errors[0].message);
                helper.showToast({
                    "title": "Record Not Update",
                    "type": "eror",
                    "message": "ERROR"
                });
            }  
            
        });  
        $A.enqueueAction( action );
    },

    showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },
})