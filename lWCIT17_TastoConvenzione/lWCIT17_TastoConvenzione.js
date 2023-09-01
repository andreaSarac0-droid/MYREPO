import { LightningElement, track, wire, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import updateAgreement from '@salesforce/apex/APIT123_TastoConvenzioneController.updateAgreement';
import deleteAgreement from '@salesforce/apex/APIT123_TastoConvenzioneController.deleteAgreement';
import getListaConvenzioni from '@salesforce/apex/APIT123_TastoConvenzioneController.getListaConvenzioni';

export default class LWCIT17_TastoConvenzione extends LightningElement {
    @api recordId;
    //@api propertyValue;
    @track step0 = true;
    @track step1 = false;
    @track errorStep = false;
    @track valueContract;
    @track checked = false;
    @track convenzioni;


    connectedCallback(){
        getListaConvenzioni().then(response => {
            this.convenzioni = response;
        }).catch(error => {
            console.log('errore: ' + JSON.stringify(error.message));
        });
    }

    searchConvenzione(){
        let input = document.getElementById('searchbar').value;
        input=input.toLowerCase();

        for (var i = 0; i < this.convenzioni.length; i++) {  
            if (!this.convenzioni[i].innerHTML.toLowerCase().includes(input)) { 
                this.convenzioni[i].style.display="none";
            } 
            else { 
                this.convenzioni[i].style.display="list-item";                
            } 
        } 
    }
    
    handleAvanti(){
        console.log('CHECKED: ' + this.checked);
        console.log('CONVENZIONE SELEZIONATA: ' + this.valueContract);
        if(this.checked == false && (this.valueContract == null || this.valueContract == undefined || this.valueContract == '')){
            this.step0 = false;
            this.errorStep = true;
        }else if(this.checked == true && (this.valueContract == null || this.valueContract == undefined || this.valueContract == '')){
            console.log(this.recordId);
            deleteAgreement({oppId: this.recordId}).then(() => {
                console.log('Operazione eseguita con successo');
            }).catch(error => {
                console.log('errore: ' + JSON.stringify(error.message));
            });
            this.step0 = false;
            this.step1=true;
        }else if(this.checked == false && (this.valueContract != null && this.valueContract != undefined && this.valueContract != '')){
            updateAgreement({oppId: this.recordId, newAgreement: this.valueContract}).then(() => {
                console.log('Operazione eseguita con successo');
            }).catch(error => {
                console.log('errore: ' + JSON.stringify(error.message));
            });
            this.step0 = false;
            this.step1=true;
        }else if(this.checked == true && (this.valueContract != null && this.valueContract != undefined && this.valueContract != '')){
            this.step0 = false;
            this.errorStep = true;
        }
        console.log('Avanti');
    }

    handleTermina(){
        console.log('Termina');
        let ev = new CustomEvent('closeconvenzione', {});
            this.dispatchEvent(ev);
    }

    handleIndietro(){
        console.log('Indietro');
        this.errorStep=false;
        this.step0=true;
        this.checked = false;
    }

    handleCheckbox(event){
        if(event.target.checked){
            this.checked = true;
        } else {
            this.checked = false;
        };
    }

    handleChangeContract(event) {
        this.valueContract = event.target.value;
    }
}