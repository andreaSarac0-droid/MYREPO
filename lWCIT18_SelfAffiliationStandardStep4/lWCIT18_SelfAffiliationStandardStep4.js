import { LightningElement, api, track, wire } from 'lwc';
import TR_LOGO from '@salesforce/contentAssetUrl/SelfAffiliation_TR';
import EL_LOGO from '@salesforce/contentAssetUrl/EL';
import CT_LOGO from '@salesforce/contentAssetUrl/CT';
import TS_LOGO from '@salesforce/contentAssetUrl/TS';
import ECP_LOGO from '@salesforce/contentAssetUrl/ESP';
import SP_LOGO from '@salesforce/contentAssetUrl/SP';
import ES_LOGO from '@salesforce/contentAssetUrl/ES';
import getEconomicConditions from '@salesforce/apex/APIT121_SelfAffiliation.getEconomicConditions';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';
import {subscribe,unsubscribe,APPLICATION_SCOPE,MessageContext} from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/SelfAffiliation__c';

export default class LWCIT18_SelfAffiliationStandardStep4 extends LightningElement {

    @wire(MessageContext) messageContext;

    @api button_options;
    @api text_options;
    @api input_options;

    subscription = null;

    @track variables = {
        posEdenredYes: false,
        posEdenredNo: false,
        xposEdenredYes: false,
        xposEdenredNo: true,
        checkPos: true,
        checkWeb: true,
        checkApp: true,
        xposDiTerzi: true,
        rimborsoBase: false,
        rimborsoFlyQuindici: true,
        fatturazioneBase: true,
        opzione1: true,
        checkBoxTerzi: true,
        posType: 'EVOLUZIONI DIRETTI'
    };

    logo_tr = TR_LOGO;
    logo_el = EL_LOGO;
    logo_ct = CT_LOGO;
    logo_ts = TS_LOGO;
    logo_ecp = ECP_LOGO;
    logo_sp = SP_LOGO;
    logo_es = ES_LOGO;

    @track discounts = {};
    @track prices = {};

    picklistPosType = [
        {value: 'EVOLUZIONI DIRETTI', key:'EVOLUZIONI DIRETTI'},
        {value: 'EVOLUZIONI SUB', key:'EVOLUZIONI SUB'},
        {value: 'PRODELCO DIRETTI', key:'PRODELCO DIRETTI'},
        {value: 'PRODELCO SUB', key:'PRODELCO SUB'},
        {value: 'DIEBOLD', key:'DIEBOLD'}
    ];

    handleChangePosType(event){
        this.variables.posType = event.detail.value;
    }


    connectedCallback(){
        this.subscribeToMessageChannel();
        loadStyle(this, sResource).then(() => {});
        getEconomicConditions({}).then(result=> {
            for(var i = 0 ; i < result.length ; i++){
                this.discounts[result[i].DeveloperName] = result[i].Discount__c;
                this.prices[result[i].DeveloperName] = result[i].Price__c;
            }
        }).catch(error => {console.log('Error -> '+JSON.stringify(error))});
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext,messageChannel,
                (message) => {
                    if(message.FunctionalityName == 'License'){
                        this.variables.availableBA = message.Value;
                    }
                    else{
                        if(message.FunctionalityName == 'Cassa Integrata'){
                            if(message.Value == true){
                                this.variables.xposDiTerzi = true;
                                this.variables.xposEdenredNo = true;
                                this.variables.xposEdenredYes = false;
                                this.variables.checkBoxTerzi = true;
                            }
                            else{
                                this.variables.xposDiTerzi = false;
                                this.variables.xposEdenredNo = false;
                                this.variables.xposEdenredYes = true;
                                this.variables.checkBoxTerzi = false;
                            }
                        }
                    }
                    
                },
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    goToStep3(){
        let ev = new CustomEvent('gotostep3', {});
        this.dispatchEvent(ev);  
    }

    goToStep5(){
        if(this.checkMandatoryFields()){
            let ev = new CustomEvent('gotostep5',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);  
        }
    }

    checkMandatoryFields(){
        /*if(this.variables.posEdenredNo == false && this.variables.posEdenredYes == false){
            alert('E\' necessario selezionare un\'opzione relativa al POS Edenred prima di poter procedere');
            this.scrollToTop();
            return false;
        }*/
        return true;
    }

    handleChangeCheckboxPOS(event){

    }

    handleChangeCheckboxWEB(event){

    }

    handleChangeCheckboxAPP(event){

    }

    handleChangeCheckboxTERZI(event){
        this.variables.checkBoxTerzi = event.detail;
    }

    handleChangeCheckboxPosEdenredYes(event){
        this.variables.posEdenredNo = false;
        this.variables.posEdenredYes = true;
    }

    handleChangeCheckboxPosEdenredNo(event){
        this.variables.posEdenredNo = true;
        this.variables.posEdenredYes = false;
    }

    handleChangeCheckboxXPosEdenredYes(event){
        this.variables.xposEdenredNo = false;
        this.variables.xposEdenredYes = true;
    }

    handleChangeCheckboxXPosEdenredNo(event){
        this.variables.xposEdenredNo = true;
        this.variables.xposEdenredYes = false;
    }

    handleChangeCheckboxxPosDiTerzi(event){
        this.variables.xposDiTerzi = event.detail;
    }

    handleChangeCheckboxRimborsoBase(event){
        this.variables.rimborsoBase = true;
        this.variables.rimborsoFlyDue = false;
        this.variables.rimborsoFlyQuindici = false;
    }

    handleChangeCheckboxFlyDue(event){
        this.variables.rimborsoBase = false;
        this.variables.rimborsoFlyDue = true;
        this.variables.rimborsoFlyQuindici = false;
    }

    handleChangeCheckboxFlyQuindici(event){
        this.variables.rimborsoBase = false;
        this.variables.rimborsoFlyDue = false;
        this.variables.rimborsoFlyQuindici = true;
    }

    handleChangeCheckboxFatturazioneBase(event){
        this.variables.fatturazioneBase = true;
        this.variables.fatturazioneSettimanale = false;
        this.variables.fatturazioneQuindicinale = false;
    }

    handleChangeCheckboxFatturazioneSettimanale(event){
        this.variables.fatturazioneBase = false;
        this.variables.fatturazioneSettimanale = true;
        this.variables.fatturazioneQuindicinale = false;
    }

    handleChangeCheckboxFatturazioneQuindicinale(event){
        this.variables.fatturazioneBase = false;
        this.variables.fatturazioneSettimanale = false;
        this.variables.fatturazioneQuindicinale = true;
    }

    handleChangeCheckboxOpzione1(event){
        this.variables.opzione1 = true;
        this.variables.opzione2 = false;
    }

    handleChangeCheckboxOpzione2(event){
        this.variables.opzione1 = false;
        this.variables.opzione2 = true;
    }

    scrollToTop(){
        const scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    @api
    get variables(){ return this.variables;}

}