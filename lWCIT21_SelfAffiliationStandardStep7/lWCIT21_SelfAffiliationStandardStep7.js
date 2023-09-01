import { LightningElement,track, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT21_SelfAffiliationStandardStep7 extends LightningElement {
    @api button_options;
    @api text_options;
    @api input_options;

    @track variables = {
        sottoscrizione: false,
        approvazioneArt: false,
        notizie: false,
        notizie2: false
    };

    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
    }

    goToStep6(){
        let ev = new CustomEvent('gotostep6', {});
        this.dispatchEvent(ev);  
    }
    

    handleChangeCheckboxSottoscrizione(event){this.variables.sottoscrizione = event.detail;}

    handleChangeCheckboxApprovazioneArt(event){this.variables.approvazioneArt = event.detail;}

    handleChangeCheckboxNotizie(event){this.variables.notizie = event.detail;}

    handleChangeCheckboxNotizie2(event){this.variables.notizie2 = event.detail;}

    signContract(){
        if(this.variables.sottoscrizione == false || this.variables.approvazioneArt == false) alert('Prima di procedere alla firma conferma i consensi obbligatori');
        else{
            let ev = new CustomEvent('sign',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);   
        }
    }

    @api
    get variables(){ return this.variables;}
}