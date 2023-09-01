import { LightningElement, track, api, wire } from 'lwc';
import { subscribe, unsubscribe, publish, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/SelfAffiliation__c';

import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT17_SelfAffiliationStandardStep3 extends LightningElement {

    @wire(MessageContext) messageContext;

    @api button_options;
    @api text_options;
    @api input_options;

    @track variables = {
        siCassaIntegrata : true,
        refTerminale: false
    };

    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
    }

    goToStep2(){
        let ev = new CustomEvent('gotostep2', {});
        this.dispatchEvent(ev);  
    }

    goToStep4(){
        if(this.checkMandatoryFields()){
            let ev = new CustomEvent('gotostep4',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);  
        }
        else alert('Completa tutti i campi obbligatori prima di procedere !');
    }

    checkMandatoryFields(){
        var result = true;
        //return true;
        for(var elem in this.input_options){ 
            if(this.input_options[elem].required){
                if(elem == 'F_Nome_ReferenteTerminale' && !this.variables.refTerminale && (this.variables.referenteName == null || this.variables.referenteName == '')){ result = false; break;}
                if(elem == 'F_Cognome_ReferenteTerminale' && !this.variables.refTerminale && (this.variables.referenteSurname == null || this.variables.referenteSurname == '')){ result = false; break;}
                if(elem == 'F_Telefono_ReferenteTerminale' && !this.variables.refTerminale && (this.variables.referentePhone == null || this.variables.referentePhone == '')){ result = false; break;}
                if(elem == 'F_Email_ReferenteTerminale' && !this.variables.refTerminale && (this.variables.referenteEmail == null || this.variables.referenteEmail == '')){ result = false; break;}
            }
            if(this.variables.referentePhone != null && this.variables.referentePhone != undefined && this.variables.referentePhone != '' && !this.isValidNumber(this.variables.referentePhone)){ result = false; alert('Numero di telefono inserito non valido !'); break;}
            else if(this.variables.referenteEmail != null && this.variables.referenteEmail != undefined && this.variables.referenteEmail != '' && !this.validateEmail(this.variables.referenteEmail)){ result = false; alert('Email inserita non valida !'); break;}
            else{}
        }
        return result;
    }

    handleChangeSiCassaIntegrata(){
        this.variables.siCassaIntegrata = true;
        this.variables.noCassaIntegrata = false;
        const payload = { FunctionalityName: 'Cassa Integrata', Value: true };
        publish(this.messageContext, messageChannel, payload);
    }

    handleChangeNoCassaIntegrata(){
        this.variables.noCassaIntegrata = true;
        this.variables.siCassaIntegrata = false;
        const payload = { FunctionalityName: 'Cassa Integrata', Value: false };
        publish(this.messageContext, messageChannel, payload);
    }

    handleChangeRefTerminale(event){this.variables.refTerminale = event.detail;}

    handleChangeReferenteName(event){this.variables.referenteName= event.detail.value;}

    handleChangeReferenteSurname(event){this.variables.referenteSurname = event.detail.value;}

    handleChangeReferentePhone(event){this.variables.referentePhone = event.detail.value;}

    handleChangeReferenteEmail(event){this.variables.referenteEmail = event.detail.value;}

    validateEmail(input) {
        var validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (input.match(validRegex)) return true;
        else return false;
    }

    isValidNumber(input){
        return /^[0-9]+$/.test(input);
    }

    @api
    get variables(){ return this.variables;}

}