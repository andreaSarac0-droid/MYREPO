import { LightningElement, api, track } from 'lwc';
import checkIban from '@salesforce/apex/APIT121_SelfAffiliation.checkIban';
import retrieveBankName from '@salesforce/apex/APIT121_SelfAffiliation.retrieveBankName';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT19_SelfAffiliationStandardStep5 extends LightningElement {

    @api button_options;
    @api text_options;
    @api input_options;

    @track variables = {};

    @track validIban = false;
    @track bankName;
    @track iban;

    @track defaultIBAN = 'IT';

    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
    }

    goToStep4(){
        let ev = new CustomEvent('gotostep4', {});
        this.dispatchEvent(ev);  
    }

    goToStep6(){
        if(this.checkMandatoryFields()){
            let ev = new CustomEvent('gotostep6',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);  
        }
        else alert('Completa tutti i campi obbligatori o controlla l\' IBAN inserito prima di procedere !');
    }

    handleChangeIban(event){
        this.checkIbanCode(event.detail.value);
    }

    checkIbanCode(iban){
        this.showSpinner = true;
        checkIban({iban: iban}).then( result => {
            if(result){
                this.validIban = true;
                this.variables.iban = iban;
                this.iban = iban;
                retrieveBankName({iban: iban}).then( result2 => {
                    this.bankName = result2;
                    this.variables.bankName = result2;
                    this.showSpinner = false;
                }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
            }
            else{
                this.validIban = false;
            }
        }).catch(error => {;console.log('ERROR -> '+ JSON.stringify(error));});
    }

    checkMandatoryFields(){
        var result = true;
        if(!this.validIban) result = false;
        return result;
    }

    @api
    get variables(){ return this.iban;}

}