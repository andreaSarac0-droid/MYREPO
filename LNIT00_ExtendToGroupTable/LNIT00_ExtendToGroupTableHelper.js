({
    doInit : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'Opportunity Name', fieldName: 'linkName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}}, 
       //     {label: '', type: 'button', initialWidth: 135, typeAttributes: { label: { fieldName: 'actionLabel'}, name: 'view_details',iconName: {fieldName: 'iconName'}, title: 'Click to View Details'}}
        ]);
        
        // {label: '', type: 'action', initialWidth: 135, typeAttributes: { label: { fieldName: 'actionLabel'}, title: 'Click to Edit', name: 'edit_status', iconName: 'utility:edit', disabled: {fieldName: 'actionDisabled'}, class: 'btn_next'}}}]);
        var recordId = component.get("v.recordId");
        var action = component.get("c.fetchAccts");
        action.setParams({
            "recordId":recordId
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            let recordIDs = [];
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                records.forEach(function(record){
                    recordIDs.push(record.Id);
                    record.linkName = '/'+record.Id;
                    record.iconName ='utility:add';
                    record.actionLabel=''; 
                });
                
                
                let quoteTypeIsTrue = component.get('v.quoteTypeIsTrue');
                if( quoteTypeIsTrue )
                {
                    component.find('AcctsDataTable').set('v.selectedRows', recordIDs);
                    component.set('v.myRows', records);
                }
                
                component.set("v.data", records);
            }
        });
        $A.enqueueAction(action);
        
    },
    editRowStatus: function (component, row,action) {
        var datas = cmp.get('v.data');
        datas = datas.map(function(rowData) {
            if (rowData.Id === row.Id) {
                rowData.iconName = 'utility:check';
                //    rowData.disabledValue = true;
            } else {
                rowData.iconName = 'utility:add';
                //   rowData.disabledValue = false;
            }
            return rowData;
        });
        cmp.set("v.data", datas);
    },
    addToCase : function (component, row1) {
        component.set("v.loaded",true);
        var rows = component.get('v.data');
        var rowIndex = rows.indexOf(row1);
        var serverAction = component.get("c.CloneQuote"); 
        console.log('ROW1 O MI SPACCO: '+row1);
        serverAction.setParams({
            quoteId: component.get("v.recordId"),
            OptyTarget:row1.Id,
            AccTarget:row1.AccountId
        });
        serverAction.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.loaded",false);
                this.changeActionIcons(component, row1);
            }else {
                component.set("v.loaded",false);
                alert('error');
            }
        });
        $A.enqueueAction(serverAction);         
    },  
    
    changeActionIcons : function (component, row) {
        var data = component.get('v.data');
        data = data.map(function(rowData) {
            if ((rowData.Id === row.Id) || (rowData.iconName=='utility:check')) {
                rowData.iconName = 'utility:check';
                rowData.disabledValue = true;
            } else {
                rowData.iconName = 'utility:add';
                rowData.disabledValue = false;
            }
            return rowData;
        });
        component.set("v.data", data);
    },
    
    setActionIcons : function (component) {
        var data = component.get('v.data');
        data = data.map(function(rowData) {
            if (rowData.Selected_Pet__c === true) {
                rowData.iconName = 'utility:check';
                rowData.disabledValue = true;
            } else {
                rowData.iconName = 'utility:add';
                rowData.disabledValue = false;
            }
            return rowData;
        });
        component.set("v.data", data);
    }
})