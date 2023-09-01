({
    doInit : function(component, event, helper) {
        
        component.set('v.columns', [
            {label: 'Codice Prodotto', fieldName: 'service_ref', type: 'text', initialWidth: 80},
            {label: 'Prodotto', fieldName: 'service_desc', type: 'text', initialWidth: 250},
            {label: 'Valore Fee', fieldName: 'fee_value', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80},
            {label: 'Canone Mensile', fieldName: 'monthly_fee', type: 'text', initialWidth: 80},
            {label: 'Data Effettiva', fieldName: 'effective_date', type: 'date', initialWidth: 250},
            {label: 'Costo Installazione', fieldName: 'installation_cost', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80},
            {label: 'Descrizione Circuito', fieldName: 'economic_group_desc', type: 'text', initialWidth: 150},
            {label: 'Tipo', fieldName: 'operator_type', type: 'text', initialWidth: 30},
            {label: 'Codice Circuito', fieldName: 'economic_group_ref', type: 'text', initialWidth: 250},
            {label: 'Barcode', fieldName: 'barcode_contract', type: 'text', initialWidth: 250},
            //{label: 'PDF', fieldName: 'url', type: 'url', typeAttributes: { label: 'PDF' }, initialWidth: 80},
            {label: 'PDF',type: 'button',typeAttributes:{label: 'PDF',name: 'Carica', title: '', disabled: false, value: 'test',},cellAttributes: { alignment: 'left' },initialWidth: 100},

            {label: 'Stato', fieldName: 'status_desc', type: 'text', initialWidth: 80},
            {label: 'Affiliatore', fieldName: 'merchant_desc', type: 'text', initialWidth: 250}
        ]);

        helper.getData( component, event );
    },

    /*updateColumnSorting: function(component, event, helper) {

        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy_name", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },*/

    openAll :function(component, event, helper){
        var recordObjectId = component.get("v.recordId");
        var recordObjectName = component.get("v.sObjectName");
        var gruppo = component.get("v.gruppoEconomico");
		var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT43_StoresFee",
            componentAttributes : {
                recordId : recordObjectId,
				sObjectName : recordObjectName,
				viewAllBool : false,
                gruppoEconomico : gruppo,
                show5rows :false,
            }    
        });
        evt.fire();
    },
    
    getBarcode :function(component,event,helper){
		helper.getDocument(component,event,helper);
    },
    exitModal : function(cmp,event,helper){
        cmp.set("v.isModalOpen",false);
    }
})