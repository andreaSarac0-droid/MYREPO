import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuoteTemplateList from '@salesforce/apex/APIT00_QuoteTemplateAssociatedToProduct.getQuoteTemplateList';
import updateTemplateID from '@salesforce/apex/APIT00_QuoteTemplateAssociatedToProduct.updateTemplateID';
import getQuote from '@salesforce/apex/APIT141_OpenPdfController.getQuote';


export default class LWCIT19_OpenPdf extends LightningElement {
    @api recordId;
    @track quoteId;
    @track templateIdAndName;
    @track showPdfButton = true;

    createToastMessage(title, message,variant,mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }

    connectedCallback(){
        getQuote({recordId: this.recordId}).then(result => {
            this.quoteId = result;
            console.log('QUOTE ID FROM GETQUOTE: ' + this.quoteId);
            this.QuoteTemplateL(result);
            // this.createToastMessage('Successo','','success','dismissable');
        }).catch(error => {
            console.log('errore =' + JSON.stringify(error.message));
            this.createToastMessage('Attenzione','Errore inaspettato!','error','dismissable');
        });
    }

    handleTermina(){
        console.log('Termina');
        let ev = new CustomEvent('closepdf', {});
            this.dispatchEvent(ev);
    }

    QuoteTemplateL(qt){
        console.log('QUOTE ID IN GETQUOTETEMPLATELIST: ' + qt);
        getQuoteTemplateList({idQuote: qt}).then(result => {
            console.log("DIMENSIONE LISTA TEMPLATE: " + result.length);
            
            var objArray = [];
            for(var i = 0 ; i < result.length ; i++){
                objArray.push(Object.assign({}, result[i]));
            }

            if(objArray.length == 0){
                this.showPdfButton = false;
                this.createToastMessage('Attenzione','Per questo prodotto non è possibile generare il modulo primo ordine né il contratto','error','dismissable');
            }
            if(objArray.length > 0){
                if(objArray[0].quoteID == "Error" && objArray[0].quoteName == "Error" ){
                    this.showPdfButton = false;
                    this.createToastMessage('Attenzione','Non puoi generare il PDF se la quote è in Draft o in Approval perché potrebbero mancare alcuni campi','error','dismissable');
                }
                if(objArray[0].quoteID == "Error2"){
                    this.showPdfButton = false;
                    this.createToastMessage('Attenzione', objArray[0].quoteName,'error','dismissable');
                }
                if(!objArray[0].quoteID.includes('Error') && objArray.length >= 1){
                    this.templateIdAndName = objArray;
                }
            }
        }).catch(error => {
            console.log('errore =' + JSON.stringify(error.message));
            this.createToastMessage('Attenzione','Errore inaspettato: controlla i prodotti e l\'account della quote','error','dismissable');
        });
    }

    UpdateIdTemplate(event){
        console.log('QUOTE ID IN UPDATETEMPLATEID: ' + this.quoteId);
        updateTemplateID({templateID: event, quoteID: this.quoteId}).then(() => {
            console.log('UpdateTemplateID OK!');
        }).catch(error => {
            console.log('errore =' + JSON.stringify(error.message));
            this.createToastMessage('Attenzione','Errore inaspettato!','error','dismissable');
        });
    }

    handleClick(){
        var record18Id = this.quoteId;
        var record15id = record18Id.slice(0, 15);
        console.log("ID 15 CARATTERI: " + record15id); 
        var urlZuora = "/apex/zqu__zqgeneratedocument?quoteId="+record15id+"&format=pdf";
        window.open(urlZuora);
    }

    onChangeSelect(event){
        console.log('ONCHANGE');
        this.showPdfButton = true;
        this.updateIdTemplate(event.target.value)
       
    }
}