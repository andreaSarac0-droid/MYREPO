({
    addProduct: function (component, event, helper) {
        let action = component.get("c.fetchMetadata");
        let oppIDList = component.get('v.opportunities');

        console.log('oppIDList: ', oppIDList);


        action.setParams(
            {
                recordId: oppIDList[0]
            }
        );

        action.setCallback(this, response => {
            let state = response.getState();
            if (state == 'SUCCESS') {
                let metaCols = []
                //let metaColsString = Object.keys(response.getReturnValue()[0])

                /**{label: 'Fee', fieldName: 'IT_FeeEditFlex__c', type: 'Text',  editable: true } */
                /*
                metaColsString.forEach(element => {
                    metaCols.push({label: element, fieldName: element, type: 'text'})
                })
                */

                metaCols = [
                    {
                        label: 'Nome',
                        fieldName: 'MasterLabel',
                        type: 'text'
                    }
                ]

                //console.log(response.getReturnValue())

                component.set('v.metadataColumns', metaCols)
                component.set('v.metadataList', response.getReturnValue())
                //component.set('v.showAddProduct', true)
            }
        })

        $A.enqueueAction(action);
    },
    handleAddProductNextHelper: function (component, event, helper, selectedMetadataIds) {
        let action = component.get('c.createProductsList')

        action.setParams(
            {
                metadataIdList: selectedMetadataIds,
                opportunityIdList: component.get('v.opportunities')
            }
        );

        action.setCallback(this, response => {
            if (response.getState() == 'SUCCESS') {
                console.log('Opps created successfully');
                //component.set('v.showAddProduct', false)
            }
        })

        $A.enqueueAction(action)
    },
})