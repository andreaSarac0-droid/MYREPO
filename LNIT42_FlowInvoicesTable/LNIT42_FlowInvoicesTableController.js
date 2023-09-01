({
    init: function (component, event, helper){
        
        helper.setLayoutTable(component, helper);
        helper.setLayout(component, helper);
		helper.invoicesListSet(component, helper);         
        const idCase = component.get("v.recordId");

        
    },
    
    

    
    showInvoices: function (component, event, helper) {
        const icon = component.find('iconRef');
        $A.util.toggleClass(icon, 'rotator');
        
        component.set('v.loaded', false);

        helper.invoicesListSet(component, helper);   
    },
    updateSelectedRows: function (cmp, event) {
        var selectedRows = event.getParam('selectedRows');
        console.log('ROWS: ' + JSON.stringify(selectedRows));
        cmp.set('v.myRows', selectedRows);
        var recordId = cmp.get('v.recordId');
        var FCId = cmp.get('v.FCId');
        var output = [];
        selectedRows.forEach(function (element) {
            output.push({'sObjectType':'IT_Edenred_Document__c',
                         'Name':element.document_number,
                         'IT_Document_Number_Confirmed__c':element.document_number,
                         'IT_Case__c':recordId,
                         'IT_Financial_Center__c':FCId,
                         'IT_Document_Date_Confirmed__c':element.document_date,
                         'IT_Refund_Amount__c':element.amount_due
                         //'IT_Operation_Type_Out__c':element.document_type
                        });
        });
        console.log('output: ' + JSON.stringify(output));
        cmp.set('v.output', output);
    },
    
    
    //sorting function↓
   
    updateColumnSorting: function(component, event, helper) {
    var fieldName = event.getParam('fieldName');
      
        
    var sortDirection = event.getParam('sortDirection');
        
        
   
    component.set("v.sortedBy", fieldName);
    
        
    component.set("v.sortedDirection", sortDirection);
    helper.sortData(component, fieldName, sortDirection);
    }
    
    
    
    
    
    
    
    
    
    
    
});