({
	init: function (component, event, helper){
        component.set('v.loaded', false);
        var merchantCode = component.get("v.InputStringField");
        helper.callContractPivotal(component, merchantCode);
        
    },

    updateSelectedRows: function (cmp, event) {
        var selectedRows = event.getParam('selectedRows');
        if (selectedRows.length === 0)
            cmp.set("v.error", "");
        console.log('ROWS: ' + JSON.stringify(selectedRows));
        cmp.set('v.myRows', selectedRows);
        var output = [];
        var controlOutput = false;
        selectedRows.forEach(function (element) {
            output.push(element.barcode);
            if(element.quadro == "No"){
                controlOutput = true;
                cmp.set("v.error", "Non è possibile selezionare un contratto che non sia quadro");
            }else{
                cmp.set("v.error", "");   
            }    
        });

        console.log('controlOutput:: '+controlOutput);

        if(controlOutput == false){
            console.log('output: ' + JSON.stringify(output));
            cmp.set('v.OutputStringField', output);
        }   
    }
})