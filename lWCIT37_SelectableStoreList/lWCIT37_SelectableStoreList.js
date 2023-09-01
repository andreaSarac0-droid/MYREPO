import { LightningElement, api, track } from 'lwc';
import LightningAlert from 'lightning/alert';
import getStores from "@salesforce/apex/APIT144_StoreToOpportunityStore.getStores";
import createOppStores from "@salesforce/apex/APIT144_StoreToOpportunityStore.createOpportunityStores";

export default class LWCIT37_SelectableStoreList extends LightningElement {

    //variables passed from flow
    @api recordId; 
    @api financialCenterId; 
    @api contractType;
    @api ListaNomiStore; 

    @track checked = false; //boolean for 'Tutti' checkbox
    @track checkedAll = false; //boolean for store list checkboxes
    @track disableT = false; //boolean to disable 'Tutti' checkbox
    @track disableAll = false; //boolean to disable store list checkboxes
    @track stores = []; //array for the list of stores returned from Apex -- used to show the list 'Altri locale da selezionare'
    @track storeIds = []; //array for the list of just store ids returned from Apex
    @track selectedIds = []; //array for just store ids that are selected 
    @track selectedStores = []; // array for stores that are selected
    @track storeNameList = ''; //String for stores to add on 'ListaNomiStore'
    @track disableButton = false; //boolean to disable 'Aggiungi' button


    connectedCallback() {
        
        //call getStores() function
        this.getStores();
    }

    getStores() {
        let params = {
            'recordId': this.recordId,
            'financialCenterId': this.financialCenterId,
            'contractType': this.contractType
        }

        //get the list of Stores by Opportuity, FinancialCenter and ContractType
        getStores({ 'params': params })
            .then(result => {
                if (result) {
                    //array for Stores returned
                    this.stores = result;
                    //array for just Store Ids
                    this.storeIds = result.map(element => element.Id);
                }
            });
    }

    //Function called when 'Tutti' is checked or unchecked
    handleAllChecked(event) {
        let isChecked = event.target.checked;

        //when checked 
        //-- check tutti
        //-- check all the list checkboxes 
        //-- pass all store ids to selectedIds array 
        //-- pass all stores to seletedStores array
        if (isChecked == true) {
            this.checked = true;
            this.checkedAll = true;
            this.selectedIds = this.storeIds.map(el => el);
            this.selectedStores = this.stores.map(el => el);
            
        //when unchecked
        //-- uncheck tutti
        //-- uncheck all the list of stores checkboxes
        //-- empty selectedIds array
        //-- empty selectedStores array
        } else if (isChecked == false) {
            this.checked = false;
            this.checkedAll = false;
            this.selectedIds = []; 
            this.selectedStores = []; 
        }
        //console logs
        /*
        console.log('Store array length>> ' +this.selectedIds.length + ' and ' + this.selectedStores.length);
        console.log('All selected ids >> ' + JSON.stringify(this.selectedIds));
        console.log('All selected stores >> ' + JSON.stringify(this.selectedStores));
        */
    }

    //Function called when a single item of the list is checked or unchecked
    handleCheck(event) {
        let isChecked = event.target.checked;
        let selected = event.target.value;

        //if an item is checked
        //-- add item id in selectedIds
        if (isChecked == true && !this.selectedIds.includes(selected)) {
            this.selectedIds = [...this.selectedIds, selected];

            //if selectedIds are all stores
            //-- check 'Tutti' checkbox
            if(this.selectedIds.length == this.storeIds.length){
                this.checked = true;
            }
        }

        //if an item is unchecked
        //-- uncheck 'Tutti' by making false checked var
        //-- remove item id from selectedIds array
        //-- remove item from selectedStores array
        else if (isChecked == false && this.selectedIds.includes(selected)) {
            this.checked = false;
            for (let i = 0; i < this.selectedIds.length; i++) {
                if (this.selectedIds[i] == selected) {
                    this.selectedIds.splice(i, 1);
                }
                if (this.selectedStores[i].Id == selected){
                    this.selectedStores.splice(i, 1);
                }
            }
        }
        //console logs
        /*
        console.log('Store array length>> ' +this.selectedIds.length + ' and ' + this.selectedStores.length);
        console.log('All selected ids 1 >> ' + this.selectedIds);
        console.log('All selected stores 1 >> ' + this.selectedStores);
        */
    }

    //Function called when 'Aggiungi' button is pressed
    aggiungi(event){
        //disable 'Aggiungi' button
        this.disableButton = true;

        //for each element of store list
        this.stores.forEach(element => {

            //if element id is in selectedIds array and element is not in selectedStores array
            //-- add the element in selectedStores array
            //-- add the element description to storeNameList string with new line
            if (this.selectedIds.includes(element.Id) && !this.selectedStores.includes(element)) {
                this.selectedStores = [...this.selectedStores, element];
                this.storeNameList = this.storeNameList + element.IT_Desc_Store__c + ' \n';    
                
            //if element id is not in selectedIds array and element is in selectedStores array
            //-- remove the element from selectedStores array
            //* this if case may never happen, element id is added to selectedIds before element is added to selectedStores
            }else if (!this.selectedIds.includes(element.Id) && this.selectedStores.includes(element)){
                for(let j=0; j<this.selectedStores.length; j++){
                    if(this.selectedStores[j] == element){
                        this.selectedStores.splice(j, 1);
                    }
                }

            //if element id is in selectedIds array and element is in selectedStores array
            //-- add the element description to storeNameList string with new line
            }else if(this.selectedIds.includes(element.Id) && this.selectedStores.includes(element)){
                this.storeNameList = this.storeNameList + element.IT_Desc_Store__c + ' \n';
            }
        })

        //check if selectedIds and selectedStores has more than one element
        //-- call Apex method createOppStore()
        if(this.selectedIds.length > 0 && this.selectedStores.length > 0){
            this.createOppStore()

        //if selectedIds or selectedStores has 0 elements
        //-- open warning alert
        }else{
            LightningAlert.open({
                message: 'Devi selezionare almeno un locale da aggiungere agli altri.',
                theme: 'Warning',
                label: 'Warning',
            });
        }
        //console logs
        /*
        console.log('Store name list >> ' + this.storeNameList);
        console.log('Store array length>> ' +this.selectedIds.length + ' and ' + this.selectedStores.length);
        */
    }

    //Function called from function aggiungi()
    //-- after selecting stores, call Apex function to create OpportunityStore for each store selected
    createOppStore() {

        //params
        //-- list of stores selected
        //-- opportunity id 
        let params = {
            'stores': this.selectedStores,
            'oppId': this.recordId
        }

        createOppStores({ 'params': params }).then(
            result => {
                //console logs
                /*console.log('Result is >> ' + JSON.stringify(result));*/
                
                //if we have a response from Apex
                //-- open [success/error] alert based on Apex response
                if (result) {
                    
                    LightningAlert.open({
                        message: result.message,
                        theme: result.variant,
                        label: result.title,
                    });

                    //if response is success
                    //-- disable 'Tutti' checkbox
                    //-- disable all store list checkboxes
                    //-- add storeNameList string of selected stores description to ListaNomiStore
                    if(result.variant == 'success'){
                        this.disableT = true;
                        this.disableAll = true;
                        if(this.ListaNomiStore == null || this.ListaNomiStore == undefined){
                            this.ListaNomiStore = '';
                        }
                        this.ListaNomiStore = this.ListaNomiStore + this.storeNameList;
                        //this.getStores();
                    }

                    //if response is error
                    //-- empty selectedIds array
                    //-- empty selectedStores array
                    //-- empty storeNameList string
                    //-- enable 'Tutti' checkbox
                    //-- enable all checkboxes
                    //-- enable 'Aggiungi' button
                    //-- uncheck all checkboxes
                    //-- uncheck 'Tutti' checkbox
                    //-- call getStores() to refresh store list
                    else if(result.variant == 'error'){
                        this.selectedIds.splice(0, this.selectedIds.length);
                        this.selectedStores.splice(0, this.selectedStores.length);
                        this.storeNameList = '';
                        this.disableT = false;
                        this.disableAll = false;
                        this.disableButton = false;
                        this.checked = false;
                        this.checkedAll = false;
                        this.template.querySelectorAll('[data-id="stores"]').forEach(element => {
                            element.checked = false;
                        });

                        this.getStores();

                        //console logs
                        /*
                        console.log('Selected ids>> ' + this.selectedIds);
                        console.log('Selected stores>> ' + this.selectedStores);
                        console.log('All stores >> ' + this.stores);
                        */
                    }
                }
            }
        )
    }
}