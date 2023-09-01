({
    init: function(component, event, helper) {
        var gruppo = component.get('v.gruppoEconomico');

        if (gruppo) {
            component.set('v.columns', [
                { label: 'Codice Servizio', fieldName: 'service_ref', type: 'text', initialWidth: 80, sortable: true },
                { label: 'Descrizione Servizio', fieldName: 'service_desc', type: 'text', initialWidth: 250, sortable: true },
                { label: 'Sconto', fieldName: 'discount', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80 },
                {
                    label: 'Data Decorrenza',
                    fieldName: 'effective_date',
                    type: 'date',
                    initialWidth: 250,
                    sortable: true,
                    typeAttributes: {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                            /*,
                                                minute:'numeric',
                                                hour:'numeric',
                                                second:'numeric',
                                                timeZone: 'Europe/Paris'*/
                    }
                },
                {
                    label: 'Data Chiusura',
                    fieldName: 'closing_date',
                    type: 'date',
                    initialWidth: 250,
                    typeAttributes: {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                    }
                },
                { label: 'Detrazione', fieldName: 'deduction', type: 'text', initialWidth: 80 },
                { label: 'Iva', fieldName: 'vat', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80 },
                { label: 'C. Tipo Chiusura', fieldName: 'closing_type_ref', type: 'text', initialWidth: 150 },
                { label: 'D. Tipo Chiusura', fieldName: 'closing_type_desc', type: 'text', initialWidth: 250 },
                //{label: 'Codice Società', fieldName: 'company_ref', type: 'text', initialWidth: 80 },
                { label: 'D. Gruppo Economico', fieldName: 'economic_group_desc', type: 'text', initialWidth: 250 },
                { label: 'C. Gruppo Economico', fieldName: 'economic_group_ref', type: 'text', initialWidth: 250 },
                /*{label: 'Codice Pagamento', fieldName: 'payment_ref', type: 'text', initialWidth: 80},
                {label: 'Descrizione Pagamento', fieldName: 'payment_desc', type: 'text', initialWidth: 250},*/
                { label: 'C. Stato', fieldName: 'status', type: 'text', initialWidth: 80 },
                { label: 'D. Stato', fieldName: 'status_desc', type: 'text', initialWidth: 250 },
                { label: 'C. Affiliatore', fieldName: 'merchant', type: 'text', initialWidth: 80 },
                { label: 'D. Affiliatore', fieldName: 'merchant_desc', type: 'text', initialWidth: 250 },
                { label: 'Barcode', fieldName: 'barcode_contract', type: 'text', initialWidth: 250 },
                //{label: 'Contratto', fieldName: 'url', type: 'url', typeAttributes: { label: 'PDF'}, initialWidth: 250}
                { label: 'Contratto', type: 'button', typeAttributes: { label: 'PDF', name: 'Carica', title: '', disabled: false, value: 'test', }, cellAttributes: { alignment: 'left' }, initialWidth: 100 }
            ]);
        } else {
            component.set('v.columns', [
                { label: 'Codice Servizio', fieldName: 'service_ref', type: 'text', initialWidth: 80, sortable: true },
                { label: 'Descrizione Servizio', fieldName: 'service_desc', type: 'text', initialWidth: 250, sortable: true },
                { label: 'D. Gruppo Economico', fieldName: 'economic_group_desc', type: 'text', initialWidth: 250 },
                { label: 'Sconto', fieldName: 'discount', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80 },
                {
                    label: 'Data Decorrenza',
                    fieldName: 'effective_date',
                    type: 'date',
                    initialWidth: 250,
                    sortable: true,
                    typeAttributes: {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                            /*,
                                                minute:'numeric',
                                                hour:'numeric',
                                                second:'numeric',
                                                timeZone: 'Europe/Paris'*/
                    }
                },
                {
                    label: 'Data Chiusura',
                    fieldName: 'closing_date',
                    type: 'date',
                    initialWidth: 250,
                    typeAttributes: {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                    }
                },
                { label: 'Detrazione', fieldName: 'deduction', type: 'text', initialWidth: 80 },
                { label: 'Iva', fieldName: 'vat', type: 'number', typeAttributes: { minimumFractionDigits: '2' }, initialWidth: 80 },
                { label: 'C. Tipo Chiusura', fieldName: 'closing_type_ref', type: 'text', initialWidth: 150 },
                { label: 'D. Tipo Chiusura', fieldName: 'closing_type_desc', type: 'text', initialWidth: 250 },
                //{label: 'Codice Società', fieldName: 'company_ref', type: 'text', initialWidth: 80 },

                { label: 'C. Gruppo Economico', fieldName: 'economic_group_ref', type: 'text', initialWidth: 250 },
                /*{label: 'Codice Pagamento', fieldName: 'payment_ref', type: 'text', initialWidth: 80},
                {label: 'Descrizione Pagamento', fieldName: 'payment_desc', type: 'text', initialWidth: 250},*/
                { label: 'C. Stato', fieldName: 'status', type: 'text', initialWidth: 80 },
                { label: 'D. Stato', fieldName: 'status_desc', type: 'text', initialWidth: 250 },
                { label: 'C. Affiliatore', fieldName: 'merchant', type: 'text', initialWidth: 80 },
                { label: 'D. Affiliatore', fieldName: 'merchant_desc', type: 'text', initialWidth: 250 },
                { label: 'Barcode', fieldName: 'barcode_contract', type: 'text', initialWidth: 250 },
                //{label: 'Contratto', fieldName: 'url', type: 'url', typeAttributes: { label: 'PDF' }, initialWidth: 250}
                { label: 'Contratto', type: 'button', typeAttributes: { label: 'PDF', name: 'Carica', title: '', disabled: false, value: 'test', }, cellAttributes: { alignment: 'left' }, initialWidth: 100 }
            ]);
        }
        //web service call 
        var recordId = component.get("v.recordId");
        var gruppo = component.get("v.gruppoEconomico");
        helper.invokeGetSconti(component, event, helper, recordId, gruppo);

    },
    updateColumnSorting_past: function(cmp, event, helper) {

        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy_past", fieldName);
        cmp.set("v.sortedDirection_past", sortDirection);
        helper.sortData_past(cmp, fieldName, sortDirection);
    },
    updateColumnSorting_present: function(cmp, event, helper) {

        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy_present", fieldName);
        cmp.set("v.sortedDirection_present", sortDirection);
        helper.sortData_present(cmp, fieldName, sortDirection);
    },
    updateColumnSorting_future: function(cmp, event, helper) {

        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy_future", fieldName);
        cmp.set("v.sortedDirection_future", sortDirection);
        helper.sortData_future(cmp, fieldName, sortDirection);
    },

    openAll: function(cmp, event, helper) {
        var recordObjectId = cmp.get("v.recordId");
        var recordObjectName = cmp.get("v.sObjectName");
        var gruppo = cmp.get("v.gruppoEconomico");
        var evt = $A.get("e.force:navigateToComponent");
        console.log('evt' + evt);
        evt.setParams({
            componentDef: "c:LNIT00_ScontiLocali",
            componentAttributes: {
                recordId: recordObjectId,
                sObjectName: recordObjectName,
                viewAllBool: false,
                gruppoEconomico: gruppo,
                show5rows: false,
            }
        });
        evt.fire();
    },

    getBarcode: function(component, event, helper) {
        helper.getDocument(component, event, helper);
    },
    exitModal: function(cmp, event, helper) {
        cmp.set("v.isModalOpen", false);
    }


})