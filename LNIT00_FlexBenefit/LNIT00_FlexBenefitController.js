({
    Init: function(component, event, helper) {
        helper.isAmend(component, helper);
        helper.Init(component, event,helper);
        var rowActions = helper.getRowActions.bind(this, component);
        console.log('ACTIONS '+rowActions);
                component.set('v.mycolumns', [
            //{label: 'Product Name', fieldName: 'linkName', type: 'url'},
            {
                label: 'Product Name',
                fieldName: 'linkName',
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'Name'
                    },
                    target: '_self'
                }
            },
            {
                label: 'FinancialCenter',
                fieldName: 'linkNameFinancial',
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'FinancialCenterName'
                    },
                    target: '_self'
                }
            },
            {
                label: 'Sconto/Commissione',
                fieldName: 'IT_FeeEditFlex__c',
                type: 'Text',
                editable: true
            },
            {
                label: 'SetUp',
                fieldName: 'It_StartUpEditFlex__c',
                type: 'Text',
                editable: true
            },
            {
                label: 'Canone',
                fieldName: 'IT_EditCanoneFlex__c',
                type: 'Text',
                editable: true
            },
            //{label: 'Termini di pagamento', fieldName: 'TerminiPagEdit', type: 'Text'},
            //{label: 'Costo di consegna', fieldName: 'CostoConsEdit', type: 'Text'},
            {
                label: 'Metodo di Pagamento',
                fieldName: 'PaymentMethod',
                type: 'Text'
            },
            {
                label: 'Frequenza Canone',
                fieldName: 'FreqCan',
                type: 'Text'
            },
            { label: 'Durata Contratto', fieldName: 'DurContr', type: 'Text' },
            { label: 'Stato Opportunità', fieldName: 'StName', type: 'Text' },
            { label: 'Stato Quote', fieldName: 'StageQuote', type: 'Text' },
            {
                label: 'Clone Quote Effettuato',
                fieldName: 'Result',
                cellAttributes: {
                    iconName: {
                        fieldName: 'ResultIcon'
                    },
                    iconPosition: 'left',
                    iconAlternativeText: ''
                }
            },

			{ type: 'action', typeAttributes: { rowActions: rowActions } }
        ]);
        
    },
    
    chooseOppFather: function(component, event, helper) {
        
    }, 
    
    extendToGroup: function(component, event, helper) {
        var recordId = component.get('v.selectedValue');
        console.log('extendToGroup - selectedValue(flexBenefitId): '+recordId);
        var groupId = component.get('v.groupId');
        console.log('extendToGroup - groupId: '+groupId);
        var action = component.get("c.cloneOpportunity");
        helper.alert(component, event, "Success", '', "Processo di estensione in corso.");
        action.setParams({
            flexBenefitId: recordId,
            groupId: groupId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
				
            }                   
        }); 
         $A.enqueueAction(action);
    }, 
    
    addProduct: function(component, event, helper) {
        /*let action = component.get("c.fetchMetadata");

        action.setParams(
            {
                recordId: component.get('v.selectedValue')
            }
        );

        action.setCallback(this, response => {
            let state = response.getState();
            if(state == 'SUCCESS')
            {
                let metaCols = []
                //let metaColsString = Object.keys(response.getReturnValue()[0])

                /**{label: 'Fee', fieldName: 'IT_FeeEditFlex__c', type: 'Text',  editable: true } */
                /*
                metaColsString.forEach(element => {
                    metaCols.push({label: element, fieldName: element, type: 'text'})
                })
                */

               /* metaCols = [
                    {
                        label: 'Nome',
                        fieldName: 'MasterLabel',
                        type: 'text'
                    }
                ]

                //console.log(response.getReturnValue())

                component.set('v.metadataColumns', metaCols)
                component.set('v.metadataList', response.getReturnValue())
                component.set('v.showAddProduct', true)
            }
        })

        $A.enqueueAction(action);*/
		component.set('v.showAddProduct', true)
        let rows = [];
        rows.push(component.get('v.selectedValue'))
        console.log('rows selected value: ' + rows);
        helper.addProductTable(component, event, helper, rows);
    },
	
    handleAddProductNext: function(component, event, helper)
    {
        console.log(component.get('v.selectedMetadata'));
        let selectedMetadata = component.get('v.selectedMetadata');
        let selectedMetadataIds = [];

        for(let i = 0; i < selectedMetadata.length; i++)
        {
            let element = selectedMetadata[i];
            selectedMetadataIds.push(element.Id);
        }

        let action = component.get('c.createProducts')

        action.setParams(
            {
                metadataIdList: selectedMetadataIds,
                opportunityId: component.get("v.recordId")
            }
        );

        action.setCallback(this, response => {
            if(response.getState() == 'SUCCESS')
            {
                console.log('Opps created successfully');
                component.set('v.showAddProduct', false)
            }
        })
        
        $A.enqueueAction(action)
    },

    handleEvent : function(component, event, helper) {
        console.log('handleEvent Fired')
        var flag = event.getParam("showFlag");// getting the value of event attribute
        console.log('flag:::'+JSON.stringify(flag));
        setTimeout(() => {component.set("v.showAddProduct",flag);}, 500);
         // Setting the value of parent attribute with event attribute value
    },

    handleDismissShowAddProduct: function(component, event, helper)
    {
        component.set('v.showAddProduct', false)
    },

    handleAddProductSelection: function(component, event, helper)
    {
        component.set('v.selectedMetadata', event.getParam('selectedRows'))
    },
    
    handleSave: function (component, event,helper) {
               
 		helper.saveDataTable(component, event, helper);
        
    },
    
    onChangeSelect: function(component, event, helper){
        const recordId = component.get('v.selectedValue');
        console.log('onChangeSelect v.selectedValue: '+recordId);
        component.set('v.spinner', true);

        helper.fetchAccounts(component, event,helper,recordId).finally(()=>{
            component.set('v.spinner', false); 
        });
    },
                handleRowAction: function (component, event, helper) {
                    console.log('HandleRowAction begin');
        
                    var action = event.getParam('action');
                    var row = event.getParam('row');
                    var rowList = [];            
                    rowList.push(row);
                    switch (action.name) {
                        case 'Scarta':
                            console.log('switch case : Scarta');
                            helper.discard(component, event, helper, row);
                            break;  
                        case 'ModCond':
                            var inputVariables = [ { name : "recordId", type : "String", value: row.Id}];
                            var flowName='IT100_UpdateFlexbenefitvalues';
                            helper.runFlow(component, event,flowName,inputVariables); 
                            break; 
                        default:
                            // helper.showRowDetails(row);
                            break;
                    }
                },
                closeModal:function(component,event,helper){    
                    component.set('v.showModal', false);
                    //component.find('ModalDiv').destroy();
                    console.log('body',component.get( "v.body" ));
                    console.log('flow',component.get( "v.flow" ));
                    (component.get( "v.body" )).destroy();
                    (component.get( "v.flow" )).destroy();
                    component.find('ModalDiv').set('v.body',[]);

        /*var body = component.get("v.body");
        body.shift();
        component.set('v.body', body);
        component.find('templateID').destroy();*/
    },
            hideModal : function( component, event, helper ) {
                if ( event.getParam( "status" ).indexOf( "FINISHED" ) !== -1 ) {
                    component.set( "v.showModal", false );
                    component.get( "v.body" ).destroy();
                    component.get( "v.flow" ).destroy();
                    
                    $A.get('e.force:refreshView').fire();
                    
                }
            }    
})