({
    updateTable : function( cmp, event ) {
        
        var action = cmp.get( "c.getContactData" ); 
        // if sorting is by linkName we need to pass Name to controller
        var sortBy = cmp.get("v.sortedBy"); 
        var sortOrder = cmp.get("v.sortedDirection");
        var pageSize = cmp.get("v.selectedPageSize");
        var pageNumber = cmp.get("v.currentPageNumber");
        var searchTerm = cmp.get("v.searchTerm");
        var recordId = cmp.get("v.recordId");
        var isViewAll = cmp.get("v.isViewAll");
        action.setParams({"pageSize": parseInt(pageSize, 10), "pageNumber": pageNumber, "sortBy": sortBy, "sortOrder": sortOrder , "recordId" : recordId, "isViewAll" : isViewAll });
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.loaded', true);
                if ( response.getReturnValue() != null ) {
                    var result = response.getReturnValue().result;
                    var resultCon = response.getReturnValue().resultCon;
                    console.log("result: " + JSON.stringify(result));
                    console.log("resultCon: " + JSON.stringify(resultCon));
                    result.forEach(function(record){
                        if(record.IT_Contact__c != null && record.IT_Contact__c != undefined){
                             record.IT_Contact__c = '/'+record.IT_Contact__c;
                        }
                        if(record.IT_Financial_Center__c != null && record.IT_Financial_Center__c != undefined){
                             record.IT_Financial_Center__c = '/'+record.IT_Financial_Center__c;
                        }
                        if(record.IT_Financial_Center__c != null && record.IT_Financial_Center__c != undefined){
                             record.fincentName = record.IT_Financial_Center__r.Name;
                        }
                        if(record.IT_Contact__c != null && record.IT_Contact__c != undefined){
                             record.contactName = record.IT_Contact__r.IT_Contact_Type__c;
                        }
                    });
                    resultCon.forEach(function(record){
                        record.IT_Contact__c = '/'+record.Id;
                        record.contactName = record.IT_Contact_Type__c;
                    });
                    result.push(...resultCon);
                    cmp.set("v.data", result );
                    cmp.set('v.recordNumber',cmp.get("v.data").length);
                    cmp.set("v.totalPages", Math.ceil( result.totalNumberOfRecords/cmp.get("v.selectedPageSize"))  );
                    
                    this.generatePageList(cmp, cmp.get("v.currentPageNumber"));
                }
            } else if (state === 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            } else{
                console.log('Something went wrong, Please check with your admin');
            }
        });
        
        // Queue this action to send to the server
        $A.enqueueAction(action);
    },
    
    generatePageList : function(cmp, pageNumber ){
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = cmp.get("v.totalPages");
        
        if(totalPages > 1){
            if(totalPages <= 10){
                var counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        cmp.set("v.pageList", pageList);
        
    },
    
    helpSaveDetail : function(component, event ){
        //CALL FIELDS
        //POPULATE CONTACT DETAIL
        //VALIDATE INPUT
        //CALL APEX
        //REFRESH PAGE
    },
    
    helpOpenModel : function(component, event, flowName, recordId ){
        component.set("v.isModalOpen", true);
        var flow = component.find("flow");
        
        
        var inputVariables = [
            {
                name : 'recordId',
                type : 'String',
                value : recordId
            }
        ];
        flow.startFlow(flowName, inputVariables);
    },
    
})