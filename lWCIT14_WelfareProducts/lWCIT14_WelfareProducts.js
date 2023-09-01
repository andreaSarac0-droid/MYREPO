//RF 2022

import { LightningElement, track, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/APIT120_WelfareProductsController.getProducts';
import getQuotes from '@salesforce/apex/APIT120_WelfareProductsController.getQuotes';
import finalizeQuotes from '@salesforce/apex/APIT120_WelfareProductsController.finalizeQuotes';
import updateCircuit from '@salesforce/apex/APIT120_WelfareProductsController.updateCircuit';
import deleteOppGruppo from '@salesforce/apex/APIT120_WelfareProductsController.deleteOppGruppo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import circuitCodePopolato from '@salesforce/apex/APIT120_WelfareProductsController.circuitCodePopolato';
//import { CloseActionScreenEvent } from 'lightning/actions';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import { FlowNavigationBackEvent} from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';

export default class LWCIT14_WelfareProducts extends NavigationMixin(LightningElement) {
    //Input dal flow
    @api type;
    @api records;
    @api group; //refuso
    @api gruppo; //billing account id
    @api isLoaded = false;
    //Step flags
    @track step0 = true;
    @track step1 = false;
    @track step2 = false;
    //Altro
    @track preSelectedRows = [];
    @track quotes;
    @track valueProducts = [''];
    @track productOptions;
    @track selectedProducts = [];
    @track selectedFlexbenefit = [];
    @track selectedProductsJoin = [];
    @track disableButton = false;
    @track LabelList = [];
    recordPageUrl;
    @track data = [];
    @track cYesNo;
    @track noCircuit = false;
    @track containsFlex;
    @track valueCircuit = null;

    //vas product selection variables
    checkAll;
    disableAll = false;
    checkFlowee;
    disableFlowee = false;
    dataWithoutFlowee = [];
    flowee = '15. Flowee Consevazione';
    isVas = false;
    selectedLabels = [];
    disableNext = true;
    serviceType;
    disableSave = true;
    nextLabel = 'Fine';
    //RF
    annoInizioServizio;

    columns = [
        { label: 'Seleziona tutto', fieldName: 'Label' },
    ];
    selectedRowsIds = [];

    @wire(getProducts, { productType: '$type' })
    products({ data }) {
        //let options = [];
        console.log('Type is >> ' +this.type);
        if(this.type == 'vas'){
            this.isVas = true;
        }

        if(data){
            this.data = data;

            let preSelectedLabels = [];
            for(var i = 0 ; i < data.length ; i++){
                if (this.data[i].MasterLabel == "FLEXBENEFIT") {
                    preSelectedLabels.push(this.data[i].MasterLabel);
                    if(!this.selectedRowsIds.includes(this.data[i])){
                        this.selectedRowsIds.push(this.data[i]);
                    }
                }

                //vas product selection logic
                if(this.isVas == true){
                    if(this.data[i].MasterLabel != '15. Flowee Consevazione'){
                        this.dataWithoutFlowee = [...this.dataWithoutFlowee, this.data[i].MasterLabel];
                    }
                }
            }
            console.log('sObjects: ' + this.records);
            this.preSelectedRows = preSelectedLabels;

            console.log('data without flowee is  >> ' + this.dataWithoutFlowee);
        }

        /*console.log('DATA: ' + JSON.stringify(data));
        for (var key in data) {
            //KEY = INDICE DELLA LISTA DI RECORD
            options.push({ label: data[key], value: data[key]  });
            //LABEL E VALUE = STRINGA PRODOTTO
            }
        console.log('OPTIONS: ' + JSON.stringify(options));
        this.productOptions = options;
        console.log('PRODOTTI QUERY = ' + JSON.stringify(this.productOptions));*/
    }

    handleSelectedRows(event){
        this.selectedRowsIds = event.detail.selectedRows;
        if(this.selectedRowsIds  != null && this.selectedRowsIds.length > 0){
            this.disableButton = false; 
        }
        else this.disableButton = true; 
        console.log(JSON.stringify(this.selectedRowsIds));
    }

    //Seleziona prodotti handleClick method
    handleCheck(event){
        let isChecked = event.target.checked;
        let value = event.target.value;
        console.log('key is >> ' + value+ ' and value is >> ' +isChecked);
        if(isChecked == true){
            if(value == '15. Flowee Consevazione'){
                this.nextLabel = 'Next';
                this.checkAll = false;
                console.log('checkAll value is >> ' + this.checkAll);
                this.disableAll = true;
                this.selectedLabels.splice(0, (this.selectedLabels.length));
            }
            if(!this.selectedLabels.includes(value)){
                this.selectedLabels = [...this.selectedLabels, value];
            }
        }else if(isChecked == false && this.selectedLabels.includes(value)){
            for(var i=0; i<this.selectedLabels.length; i++){
                if(this.selectedLabels[i] == value){
                    this.selectedLabels.splice(i, 1);
                }
            }
            if(value == '15. Flowee Consevazione'){
                this.nextLabel = 'Fine';
                this.disableAll = false;
                this.checkAll = null;
                console.log('checkAll value is >> ' + this.checkAll);
            }
        }
        console.log('selected rows >> ' +this.selectedLabels);
        if(this.selectedLabels.length == 0){
            this.disableNext = true;
        }else{
            this.disableNext = false;
        }
    }

    //Seleziona prodotti next button logic
    handleNextOld(event){
        let label = event.target.label;
        console.log('Button label is >>> ' + label);
        if(this.nextLabel == 'Next'){
            for(let i=0; i<this.data.length; i++){
                if(this.selectedLabels.includes(this.data[i].MasterLabel)){
                    this.selectedRowsIds = [...this.selectedRowsIds, this.data[i]];
                }
            }
            console.log('selected products are >> ' + JSON.stringify(this.selectedRowsIds));
            this.step0 = false;
            this.step1 = false;
            this.step2 = true;
        }else{
            this.handleAvanti();
        }
    }

    handleNext(event){
        let label = event.target.label;
        console.log('Button label is >>> ' + label);
        for(let i=0; i<this.data.length; i++){
            if(this.selectedLabels.includes(this.data[i].MasterLabel)){
                this.selectedRowsIds = [...this.selectedRowsIds, this.data[i]];
            }
        }
        console.log('selected products are >> ' + JSON.stringify(this.selectedRowsIds));
        if(this.nextLabel == 'Next'){
            this.step0 = false;
            this.step1 = false;
            this.step2 = true;
        }else{
            this.handleAvanti();
        }
    }

    //select tipo servizio get value
    getTipoServizio(event){
        this.serviceType = event.detail.tipoServizio;
        this.disableSave = event.detail.disableFine;
        this.annoInizioServizio = event.detail.annoInizioServizio;
    }
    getAnno(event){
        this.annoInizioServizio = event.detail.annoInizioServizio;
    }

    //seleziona tipo servizio fine button logic
    handleSave(event){
        this.isLoaded = !this.isLoaded;
        this.selectedProducts = /*this.selectedValues.split(',');*/ this.selectedRowsIds;
        console.log('LISTA SOLO VAS: ' + this.selectedProducts);
        this.selectedProductsJoin = this.selectedProducts.concat(this.selectedFlexbenefit);
        this.selectedProductsJoin = this.selectedProductsJoin.filter((item,index)=>{
            return (this.selectedProductsJoin.indexOf(item) == index)
         });
         this.selectedProductsJoin = this.selectedProductsJoin.filter(Boolean);
          console.log(JSON.stringify('LD-> '+JSON.stringify(this.selectedProductsJoin)));
          for(var i = 0 ; i < this.selectedProductsJoin.length ; i++){
            this.LabelList.push(this.selectedProductsJoin[i].Label);
          }
          console.log('LABEL LIST: ' + JSON.stringify(this.LabelList));

          finalizeQuotes({inputProducts: this.LabelList, inputQuotes: this.quotes, billingAcctId: this.gruppo, serviceType: this.serviceType, annoInizioServizio: this.annoInizioServizio}).then(() => {
            this.createToastMessage('Successo!','Opportunità creata con successo!','success','dismissable');
            const finishEvent = new FlowNavigationFinishEvent();
            this.dispatchEvent(finishEvent);
            this.handleRedirect();
          }).catch(error => {
            this.createToastMessage('Attenzione!','Errore inaspettato!','error','dismissable');
            this.error = error
            console.log(this.error);
          });
    }

    connectedCallback(){
        console.log('records: ' + JSON.stringify(this.records));
        getQuotes({inputOpps: this.records}).then(response => {
            this.quotes = response;
            console.log('quote fetchate correttamente');
        }).catch(error => {
            console.log('errore: ' + error.message);
        });
    }

    createToastMessage(title, message,variant,mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }

    handleChangeProducts(event) {
        this.valueProducts = event.detail.value;
        // if(this.valueProducts != null && this.valueProducts != ''){
        //     this.disableButton = false;
        // }else{
        //     this.disableButton = true;
        // }
        if(this.valueProducts == null || this.valueProducts == ''){
            this.disableButton = true;
        }else{
            this.disableButton = false;
        }
    }

    handleBackToFlex(){
        this.noCircuit = false;
        this.step0=true;
        this.isLoaded = !this.isLoaded;
        this.type='flexbenefit';
        this.selectedFlexbenefit=[];
        this.selectedProducts=[];
        this.selectedProductsJoin = [];
        this.LabelList = [];
        console.log('LISTA SOLO FLEX: ' + JSON.stringify(this.selectedFlexbenefit));
    }

    handleBackToFlow(){
        deleteOppGruppo({inputOpps: this.records}).then(() => {
            console.log('OPP ELIMINATE');
        }).catch(error => {
            console.log('errore: ' + JSON.stringify(error.message));
        });
        const backToFlow = new FlowNavigationBackEvent();
              this.dispatchEvent(backToFlow);
    }

    handleRedirect(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.records[0].Id,
                objectApiName: 'Opportunity',
                actionName: 'view'
            },
        });
    }

    handleChangeCircuit(event) {
        this.valueCircuit = event.target.value;
        console.log('circuit: ' + this.valueCircuit);
    }

    handleFine(){
        if(this.valueCircuit != null){
            console.log('circuit: ' + this.valueCircuit);
            updateCircuit({inputOpps: this.records, newCircuit: this.valueCircuit}).then(() => {
                console.log('Operazione eseguita con successo');
            }).catch(error => {
                console.log('errore: ' + error.message);
            });
            finalizeQuotes({inputProducts: this.LabelList, inputQuotes: this.quotes, billingAcctId: this.gruppo, serviceType: null}).then(() => {
                this.createToastMessage('Successo!','Opportunità creata con successo!','success','dismissable');
                const finishEvent = new FlowNavigationFinishEvent();
                this.dispatchEvent(finishEvent);
                this.handleRedirect();
            }).catch(error => {
                this.createToastMessage('Attenzione!', error.message, 'error', 'dismissable');
            });
        } else {
            alert('ATTENZIONE! Seleziona un circuito per continuare!');
        }
    }

    handleAvanti(){
        //this.selectedValues = this.selectedRowsIds.Label.join(',');
        //console.log('VALORI SELEZIONATI: ' + this.selectedValues);
        console.log('TYPE ' + this.type);
        console.log('LISTA OPPORTUNITY ' + this.records);
        console.log('QUOTES: ' + this.quotes);
        console.log('BILLING COOUNT: ' + this.gruppo);
        console.log('Selected row id: ' + this.selectedRowsIds);
        //console.log('VARIABILE TEST: ' + this.productTypeTest);
        if(this.type == 'vas' || this.type == 'standalone'){
            this.isLoaded = !this.isLoaded;
            this.selectedProducts = /*this.selectedValues.split(',');*/ this.selectedRowsIds;
            console.log('LISTA SOLO VAS: ' + this.selectedProducts);
            this.selectedProductsJoin = this.selectedProducts.concat(this.selectedFlexbenefit);
            this.selectedProductsJoin = this.selectedProductsJoin.filter((item,index)=>{
                return (this.selectedProductsJoin.indexOf(item) == index)
             });
             this.selectedProductsJoin = this.selectedProductsJoin.filter(Boolean);
              console.log(JSON.stringify('LD-> '+JSON.stringify(this.selectedProductsJoin)));
              for(var i = 0 ; i < this.selectedProductsJoin.length ; i++){
                this.LabelList.push(this.selectedProductsJoin[i].Label);
              }
              console.log('LABEL LIST: ' + JSON.stringify(this.LabelList));

              finalizeQuotes({inputProducts: this.LabelList, inputQuotes: this.quotes, billingAcctId: this.gruppo, serviceType: null}).then(() => {
                this.createToastMessage('Successo!','Opportunità creata con successo!','success','dismissable');
                const finishEvent = new FlowNavigationFinishEvent();
                this.dispatchEvent(finishEvent);
                this.handleRedirect();
              }).catch(error => {
                this.createToastMessage('Attenzione!','Errore inaspettato!','error','dismissable');
                this.error = error
                console.log(this.error);
              });
        }else if(this.type == 'good' || this.type == 'better' || this.type == 'best' || this.type == 'flexbenefit'){
            //this.selectedValues = this.selectedRowsIds.Label.join(',');
            /* OLD CODE
            this.selectedFlexbenefit = this.selectedRowsIds;
            console.log('LISTA SOLO FLEX: ' + JSON.stringify(this.selectedFlexbenefit));
            this.step = true;
            this.type = 'vas';
            this.isLoaded = !this.isLoaded;
            OLD CODE*/
            this.isLoaded = !this.isLoaded;
            this.selectedProducts = this.selectedRowsIds;
            this.selectedProductsJoin = this.selectedProducts.concat(this.selectedFlexbenefit);
            this.selectedProductsJoin = this.selectedProductsJoin.filter((item,index)=>{
                return (this.selectedProductsJoin.indexOf(item) == index)
            });
            this.selectedProductsJoin = this.selectedProductsJoin.filter(Boolean);

            for(var i = 0 ; i < this.selectedProductsJoin.length ; i++){
                if(!this.LabelList.includes(this.selectedProductsJoin[i].Label)){
                    this.LabelList.push(this.selectedProductsJoin[i].Label);
                }
            }
            console.log('label list: ' + this.LabelList);

            for(var i = 0 ; i < this.LabelList.length ; i++){
                if(this.LabelList[i] == 'FLEXBENEFIT'){
                    this.containsFlex = true;
                }
            }

            circuitCodePopolato({inputOpps: this.records}).then(result => {
                this.cYesNo = result;
                console.log('circuit: ' + this.cYesNo);
            }).catch(error => {
                this.createToastMessage('Attenzione!', error.message, 'error', 'dismissable');
            });

            if(this.containsFlex == true || (this.containsFlex != true && this.cYesNo == 'cYes')){
                finalizeQuotes({inputProducts: this.LabelList, inputQuotes: this.quotes, billingAcctId: this.gruppo, serviceType: null}).then(() => {
                    this.createToastMessage('Successo!','Opportunità creata con successo!','success','dismissable');
                    const finishEvent = new FlowNavigationFinishEvent();
                    this.dispatchEvent(finishEvent);
                    this.handleRedirect();
                }).catch(error => {
                    this.createToastMessage('Attenzione!', error.message, 'error', 'dismissable');
                });
            } else {
                this.step0 = false;
                this.noCircuit = true;
            }
        }
        console.log('VALORE 1: ' + JSON.stringify(this.selectedProductsJoin[0]));
        console.log('VALORE 2: ' + JSON.stringify(this.selectedProductsJoin[1]));
        console.log('LISTA COMPLETA: ' + JSON.stringify(this.selectedProductsJoin));
    }
}