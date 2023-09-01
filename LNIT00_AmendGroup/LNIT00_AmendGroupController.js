({
    doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
        helper.getFrameCount(component, event, helper);
        
    },
    handleRowAction: function (component, event, helper) {
        
        var action = event.getParam('action');
        var row = event.getParam('row');
        var recordId = component.get("v.recordId") ;
        /*var action = component.get("c.getFinCen");    
        action.setParams({
            recordId
        }); 
        var rowList = [];
        rowList.push(row);*/
        
        switch (action.name) {
            case 'view_details':
                helper.addToCase(component, row,event);
                break;
            case 'Esito':
                console.log('IT_Future_Opportunity_State__c',row.IT_Future_Opportunity_State__c);
                console.log('IT_Future_Opportunity_State__c',row.IT_Future_Opportunity_Exception__c);	
                if (row.IT_Future_Opportunity_State__c == true) {
                    console.log('enters the if',row.IT_Future_Opportunity_State__c);
            		helper.alert(component,event,"Success",'','SUCCESS');    
                }else{
                   helper.alert(component,event,"error",'',''+row.IT_Future_Opportunity_Exception__c);  
                }    
            default:
                break;
        }
    }, 
    
    cloneOpportunities : function (component, event, helper){
        var totalRecordsSize = component.get('v.tableSize');
        var frameSize = component.get('v.frameCount');
        var frameContract = component.get('v.Frame');
        var selectedRows = component.find('linesTable').getSelectedRows();
        var selectedRowsSize = selectedRows.length;
        console.log('frameSize',frameSize);
        console.log('totalRecordsSize',totalRecordsSize);
        console.log('selectedRowsSize',selectedRowsSize);
        if(frameContract){
            //if(totalRecordsSize != selectedRowsSize){
            if(frameSize != selectedRowsSize && selectedRowsSize < frameSize){
                helper.alert(component, event, "Error", '', "Per opportunità quadro è necessario selezionare tutti i codici.");
            }else{
                helper.CloneOpportunityFuture(component, event, helper);
            }
        }else{
            helper.CloneOpportunityFuture(component, event, helper);
        }
    },
    
    updateSelectedRows: function (cmp, event) {
       // var editedRecords = event.getParam('draftValues');
        var selectedRows = event.getParam('selectedRows');
        console.log('ROWS: '+JSON.stringify(selectedRows));
        cmp.set('v.myRows', selectedRows);
    },
    
})