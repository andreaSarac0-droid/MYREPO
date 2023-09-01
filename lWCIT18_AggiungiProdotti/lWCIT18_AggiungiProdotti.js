//RF 2022

import { LightningElement, track, wire, api } from 'lwc';
import getProductsAndVas from '@salesforce/apex/APIT124_AggiungiProdottiController.getProductsAndVas';
import getAddedProductsAndType from '@salesforce/apex/APIT124_AggiungiProdottiController.getAddedProductsAndType';
//import getProducts from '@salesforce/apex/APIT124_AggiungiProdottiController.getProducts';
//import getAddedProducts from '@salesforce/apex/APIT124_AggiungiProdottiController.getAddedProducts';
//import getVas from '@salesforce/apex/APIT124_AggiungiProdottiController.getVas';
//import getType from '@salesforce/apex/APIT124_AggiungiProdottiController.getType';
import finalizeAdd from '@salesforce/apex/APIT124_AggiungiProdottiController.finalizeAdd';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LWCIT18_AggiungiProdotti extends LightningElement {
    @api recordId;
    @api isLoaded = false;
    @track step = false;
    @track type;
    @track data = [];
    @track dataVas = [];
    @track dataAddedP = [];
    @track dataAddedV = [];
    //Altro
    @track quotes;
    @track valueProducts = [''];
    @track productOptions;
    @track selectedProducts = [];
    @track selectedFlexbenefit = [];
    @track selectedProductsJoin = [];
    @track LabelList = [];
    recordPageUrl;

    //logic for hiding 15. Flowee
    @api hideFlowee;


    columns = [
        { label: 'Seleziona tutto', fieldName: 'Label' },
    ];
    selectedRowsIds = [];

    /*@wire(getProductsAndVas, { recordId: '$recordId' })
    prodotti({ data }) {
        console.log('recordId: ' + this.recordId)
        console.log('data: '+ data);
        this.data = data['flexbenefit'];
        this.dataVas = data['vas'];
    }

    wire(getAddedProductsAndType, { recordId: '$recordId' })
    type({ data }) {
        this.dataAddedP = data['addedFlex'];
        this.dataAddedV = data['addedVas'];
        this.type = data['type'][0];
    }*/

    connectedCallback() {
        if (this.recordId != null && this.recordId != undefined /*&& !this.fistTimerendering*/) {
          //this.fistTimerendering = true;
          getProductsAndVas({recordId: this.recordId}).then(result => {
            this.data = result['flexbenefit'];
            this.dataVas = result['vas'];

            //logic for hiding 15. Flowee
            let index;
            if(this.hideFlowee == false){
                console.log('INSIDE IFFF');
                for(let i=0; i<this.dataVas.length; i++){
                    if(this.dataVas[i].MasterLabel == '15. Flowee Consevazione'){
                        index = i;
                    }
                }
                this.dataVas.splice(index, 1);
                
            }
            console.log('data checkkk >> ' + JSON.stringify(this.dataVas));

           }).catch(error => {
           console.log('errore =' + JSON.stringify(error.message));
           });
          getAddedProductsAndType({recordId: this.recordId}).then(result => {
          this.dataAddedP = result['addedFlex'];
          this.dataAddedV = result['addedVas'];
          this.type = result['type'][0];
          if(this.type == 'vas'){
            this.step = true;
          }
          }).catch(error => {
          console.log('errore =' + JSON.stringify(error.message));
          }).finally(() =>{
            console.log("data: " + this.data + ", dataVas: " + this.dataVas + ", dataAddedP: " + this.dataAddedP + ", dataAddedV: " + this.dataAddedV);
            });
        }
      }

    // connectedCallback(){
    //     refreshApex(this.data);
    //     refreshApex(this.dataVas);
    //     refreshApex(this.dataAddedP);
    //     refreshApex(this.dataAddedV);
    //     console.log("data: " + this.data + this.dataVas + this.dataAddedP + this.dataAddedV);
    // }

    /*@wire(getProducts, { recordId: '$recordId' })
    prodotti({ data }) {
        this.data = data;
    }*/

    /*@wire(getAddedProducts, { recordId: '$recordId' })
    prodotti({ data }) {
        this.dataAddedP = data;
    }*/

    /*@wire(getVas, { recordId: '$recordId' })
    vas({ data }) {
        this.dataVas = data;
    }*/

    /*@wire(getType, { recordId: '$recordId' })
    tipo({ data }) {
        this.type = data;
    }*/

    handleSelectedRows(event){
        this.selectedRowsIds = event.detail.selectedRows;
        console.log(JSON.stringify(this.selectedRowsIds));
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
    }

    handleBackToFlex(){
        this.step=false;
        this.isLoaded = !this.isLoaded;
        this.type='flexbenefit';
        this.selectedFlexbenefit=[];
        console.log('LISTA SOLO FLEX: ' + JSON.stringify(this.selectedFlexbenefit));
    }

    handleTermina(){
        console.log('Termina');
        let ev = new CustomEvent('closeaddprod', {});
            this.dispatchEvent(ev);
    }

    handleAvanti(){
        if(this.type == 'vas'){
            // this.isLoaded = !this.isLoaded;
            console.log('isLoaded: ' + this.isLoaded);
            this.selectedProducts = this.selectedRowsIds;
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

            if(this.LabelList == null || this.LabelList == '' || this.LabelList == undefined){
                console.log('type: ' + this.type);
                this.createToastMessage('Attenzione!', 'Non hai selezionato nessun prodotto!', 'error', 'dismissable');
            } else {
                console.log('isLoaded: ' + this.isLoaded);
                finalizeAdd({inputProducts: this.LabelList, recordId: this.recordId}).then(() => {
                    this.createToastMessage('Successo!','Prodotti aggiunti con successo!','success','dismissable');
                    this.handleTermina();
                  }).catch(error => {
                    this.createToastMessage('Attenzione!','Errore inaspettato!','error','dismissable');
                    this.error = error
                    console.log(this.error);
                  });
                console.log('isLoaded: ' + this.isLoaded);
            }

        } else if(this.type == 'good' || this.type == 'better' || this.type == 'best' || this.type == 'flexbenefit'){
            /* OLD CODE
            this.selectedFlexbenefit = this.selectedRowsIds;
            console.log('LISTA SOLO FLEX: ' + JSON.stringify(this.selectedFlexbenefit));
            console.log('step1: ' + this.step)
            this.step = true;
            console.log('step2: ' + this.step)
            this.type = 'vas';
            console.log('isLoaded: ' + this.isLoaded);
            this.isLoaded = !this.isLoaded;
            console.log('isLoaded: ' + this.isLoaded);
            OLD CODE */
            //this.isLoaded = !this.isLoaded;
            this.selectedProducts = this.selectedRowsIds;
            this.selectedProductsJoin = this.selectedProducts.concat(this.selectedFlexbenefit);
            this.selectedProductsJoin = this.selectedProductsJoin.filter((item,index)=>{
                return (this.selectedProductsJoin.indexOf(item) == index)
            });
            this.selectedProductsJoin = this.selectedProductsJoin.filter(Boolean);
            
            for(var i = 0 ; i < this.selectedProductsJoin.length ; i++){
                this.LabelList.push(this.selectedProductsJoin[i].Label);
            }

            if(this.LabelList == null || this.LabelList == '' || this.LabelList == undefined){
                this.createToastMessage('Attenzione!', 'Non hai selezionato nessun prodotto!', 'error', 'dismissable');
            } else {
                finalizeAdd({inputProducts: this.LabelList, recordId: this.recordId}).then(() => {
                    this.createToastMessage('Successo!','Prodotti aggiunti con successo!','success','dismissable');
                    this.handleTermina();
                }).catch(error => {
                    this.createToastMessage('Attenzione!', error.message, 'error', 'dismissable');
                });
            }
        }
        console.log('VALORE 1: ' + JSON.stringify(this.selectedProductsJoin[0]));
        console.log('VALORE 2: ' + JSON.stringify(this.selectedProductsJoin[1]));
        console.log('LISTA COMPLETA: ' + JSON.stringify(this.LabelList));
    }
}