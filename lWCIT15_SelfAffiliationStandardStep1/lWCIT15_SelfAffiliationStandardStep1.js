import { LightningElement, api, track, wire } from 'lwc';
import checkVatAndLicense from '@salesforce/apex/APIT121_SelfAffiliation.checkVatAndLicense';
import retrieveProvince from '@salesforce/apex/APIT121_SelfAffiliation.retrieveProvince';
import retrieveCity from '@salesforce/apex/APIT121_SelfAffiliation.retrieveCity';
import retrieveHamlet from '@salesforce/apex/APIT121_SelfAffiliation.retrieveHamlet';
import getBusinessType from '@salesforce/apex/APIT121_SelfAffiliation.getBusinessType';
import pageUrl from '@salesforce/resourceUrl/recaptcha2';
import getStreetSuggestions from '@salesforce/apex/APIT121_SelfAffiliation.getStreetSuggestions';
import createLeadOnError from '@salesforce/apex/APIT121_SelfAffiliation.createLeadOnError';
import retrievePostalCode from '@salesforce/apex/APIT121_SelfAffiliation.retrievePostalCode';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

import { publish, MessageContext } from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/SelfAffiliation__c';

export default class LWCIT15_SelfAffiliationStandardStep1 extends LightningElement {

    @wire(MessageContext) messageContext;

    @api button_options;
    @api text_options;
    @api input_options;
    @api contract_type;

    @track showSpinner = false;
    @track navigateTo;
    @track error = false;
    @track variables = {
        piva : null, 
        piva_field_disabled: false, 
        checkboxSA: false
    };

    myMessageHandler = this.listenForMessage.bind(this);
    province = [{label:'',value:''}];
    comuniSL = [{label:'',value:''}];
    comuniSA = [{label:'',value:''}];
    frazioniSL = [{label:'',value:''}];
    frazioniSA = [{label:'',value:''}];
    licenze_commerciali = [{label: '', value:''}];


    get disabledComune(){return this.variables.provinciaSL == null || this.variables.provinciaSL == ''}
    get disabledVia(){return this.variables.comuneSL == null || this.variables.comuneSL == ''}
    get disabledFrazione(){return this.variables.viaSLSelected == null || this.variables.viaSLSelected == ''}

    get disabledComuneSA(){return this.variables.provinciaSA == null || this.variables.provinciaSA == ''}
    get disabledViaSA(){return this.variables.comuneSA == null || this.variables.comuneSA == ''}
    get disabledFrazioneSA(){return this.variables.viaSASelected == null || this.variables.viaSASelected == ''}
    
    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
        this.navigateTo = pageUrl;
        window.addEventListener("message", this.myMessageHandler, false);
        this.populateBusinessTypes();
    }

    populateBusinessTypes(){
        getBusinessType({contractName: this.contract_type}).then(result => {
            for(var elem in result) { this.licenze_commerciali.push({value: result[elem], key: elem});}
            this.licenze_commerciali.sort((a, b) => (a.value > b.value) ? 1 : -1);
        });
    }

    captchaLoaded(evt){
        var e = evt;
        if(e.target.getAttribute('src') == pageUrl){} 
    }

    listenForMessage(message){
        if(message.data == 'captcha success') {
            if(this.variables.piva == null || this.variables.piva == '' || this.variables.licenza_commerciale == null || this.variables.licenza_commerciale == ''){
                alert('Completa i dati obbligatori');
            }
            else this.checkVatNumber();
        }
    }

    checkVatNumber(){
        checkVatAndLicense({vat: this.variables.piva, license: this.variables.licenza_commerciale, flag: (this.variables.convention == 'B_eCommerce_Si'), contractName: this.contract_type }).then( result => {
            if(!result) this.error = true;
            else {
                this.variables.piva_field_disabled = true;
                retrieveProvince({}).then(result2 => {
                    var provinceResult = JSON.parse(result2);
                    for(var i = 0 ; i < provinceResult.data.length ; i++){
                        this.province.push({value: provinceResult.data[i].name, key: provinceResult.data[i].province_ref, region: provinceResult.data[i].region_ref, province_ab: provinceResult.data[i].abbreviation});
                    }
                    this.showSpinner = false;
                }).catch(error => {console.log('ERROR -> '+JSON.stringify(error)); this.error = true;});
                this.scrollToTop();
            }
        }).catch(error => {console.log('ERROR -> '+JSON.stringify(error)); this.error = true;});
    }

    goToStep2(){
        if(this.checkMandatoryFields()){
            if(this.variables.convention == 'B_eCommerce_Si'){
                var mapLead = {
                    vat : this.variables.piva,
                    city: this.variables.comuneSLOption?.[0]?.value, //  ER_Legal_City__c
                    countryCode: '086', // ER_Legal_Country__c
                    postalCode: this.variables.postalcodeSL, // ER_Legal_Zip_Code__c
                    province: this.variables.provinciaSLOption?.[0]?.value, //  ER_Legal_State_Province__c
                    street: (this.variables.viaSL != null) ? (this.variables.viaSL.replace('VIA ','') + ', '+ this.variables.civicoSL) : '',   //  ER_Legal_Street__c
                    cityCode: this.variables.comuneSL, //IT_City_Code__c 
                    // EUSpecification: null, manca
                    region: this.variables.viaSLOption?.[0]?.region, //IT_Region_Txt__c
                    regionCode: this.variables.provinciaSLOption?.[0]?.region,  //IT_Region_code__c
                    // provinceCode: this.s1.provinciaSL, // ???
                    streetCode: this.variables.viaSLOption?.[0]?.code, //IT_Street_Code__c
                    streetNumber: this.variables.civicoSL, //IT_Street_Number__c
                    streetNumericNumber: this.variables.civicoSLnr, //IT_Street_Number_Numeric__c
                    toponym: this.variables.viaSLOption?.[0]?.toponym, //IT_Toponym__c
                    // noteAddress: this.s1.noteIndirizzoSL, // manca
                    hamlet: this.variables.frazioneSLOption?.[0]?.value, //IT_Hamlet__c
                    hamletCode: this.variables.frazioneSLOption?.[0]?.key, //IT_Hamlet_Code__c
                    fiscalCode: this.variables.codiceFiscaleEC,  // IT_FiscalCodeChecked__c
                    IT_Industry : '106',
                    IT_Legal_Form : 'NC',
                    IT_Company_Type : 'Private',
                    mobile: this.variables.mobileRL,
                    phone: this.variables.phoneRL, 
                    email: this.variables.emailRL, //Email
                    ragioneSociale: this.variables.ragioneSocialeEC, // ER_Legal_Name__c
                    codDest: this.variables.codiceDestinatarioEC,
                    licCom: this.variables.licenzaCommercialeOption?.[0]?.value,
                    licComCod:this.variables.licenza_commerciale,
                    name: this.variables.nameRL,
                    surname:  this.variables.surnameRL
                        // ???? come valorizzarli ????
                        // newAcc.BillingLatitude = (double)mapAccount.get('geoRefY');
                        // newAcc.BillingLongitude = (double)mapAccount.get('geoRefX');
                        // newAcc.IT_Extra_Urban_Specifications__c = (string)mapAccount.get('EUSpecification');
                        // newAcc.IT_Province__c = (string)mapAccount.get('province');
                        // newAcc.IT_Additional_Locality__c = (string)mapAccount.get('noteAddress');
                        // newAcc.NumberOfEmployees = 1;
                        // newAcc.IT_Type__c = 'Merchant';
                        // newAcc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ER_Company_Account_RT').getRecordTypeId();
                        // newAcc.Type = 'Merchant';
        
                    };
                    createLeadOnError({mapLead : mapLead}
                        ).then(result => {}
                        ).catch(error => {});
            }
            
            let ev = new CustomEvent('gotostep2', {detail: {vars:this.variables}});
            this.dispatchEvent(ev); 
                
                
            
             
        }
        else {
            alert('Completa tutti i campi obbligatori prima di procedere !')
        }
    }


    /** 
     * Field Functions
    */

     handleChangeProvinciaSL(event){
        this.variables.provinciaSL = event.detail.value;
        this.variables.provinciaSLOption = this.province.filter(word => word.key == event.detail.value);
        this.variables.viaSL = null;
        this.variables.postalcodeSL = null;
        this.variables.viaSLSelected = null;
        //this.showSpinner = true;
        retrieveCity({provinceRef : this.variables.provinciaSL, cityPattern: ''}).then(result => {
            
            var comuniResult = JSON.parse(result);
            this.comuniSL = [{label:'',value:''}];
            for(var i = 0 ; i < comuniResult.data.length ; i++){
                this.comuniSL.push({value: comuniResult.data[i].name, key: comuniResult.data[i].municipality_ref});
            }
            this.variables.comuneSL = '';
            this.template.querySelector('.comuniSL').setValue(this.variables.comuneSL);
            this.variables.frazioneSL = '';
            this.template.querySelector('.frazioniSL').setValue(this.variables.frazioneSL);
            //this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeProvinciaSA(event){
        this.variables.provinciaSA = event.detail.value;
        this.variables.provinciaSAOption = this.province.filter(word => word.key == event.detail.value);
        this.variables.viaSA = null;
        this.variables.postalcodeSA = null;
        this.variables.viaSASelected = null;
        //this.showSpinner = true;
        retrieveCity({provinceRef : this.variables.provinciaSA, cityPattern: ''}).then(result => {
            var comuniResult = JSON.parse(result);
            this.comuniSA = [{label:'',value:''}];
            for(var i = 0 ; i < comuniResult.data.length ; i++){
                this.comuniSA.push({value: comuniResult.data[i].name, key: comuniResult.data[i].municipality_ref});
            }
            this.variables.comuneSA = '';
            this.template.querySelector('.comuniSA').setValue(this.variables.comuneSA);
            this.variables.frazioneSA = '';
            this.template.querySelector('.frazioniSA').setValue(this.variables.frazioneSA);
            //this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeComuneSL(event){
        this.variables.comuneSL = event.detail.value;
        this.variables.comuneSLOption = this.comuniSL.filter(word => word.key == event.detail.value);
        this.variables.viaSL = null;
        this.variables.postalcodeSL = null;
        this.variables.viaSLSelected = null;
        //this.showSpinner = true;
        retrieveHamlet({municipRef : this.variables.comuneSL}).then(result => {
            console.log(result);
            var frazioniResult = JSON.parse(result);
            this.frazioniSL = [{label:'',value:''}];
            for(var i = 0 ; i < frazioniResult.data.length ; i++){
                this.frazioniSL.push({value: frazioniResult.data[i].name, key: frazioniResult.data[i].hamlet_ref});
            }
            this.variables.frazioneSL = '';
            this.template.querySelector('.frazioniSL').setValue(this.variables.frazioneSL);
            //this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeComuneSA(event){
        this.variables.comuneSA = event.detail.value;
        this.variables.comuneSAOption = this.comuniSA.filter(word => word.key == event.detail.value);
        this.variables.viaSA= null;
        this.variables.postalcodeSA = null;
        this.variables.viaSASelected = null;
        //this.showSpinner = true;
        retrieveHamlet({municipRef : this.variables.comuneSA}).then(result => {
            var frazioniResult = JSON.parse(result);
            this.frazioniSA = [{label:'',value:''}];
            for(var i = 0 ; i < frazioniResult.data.length ; i++){
                this.frazioniSA.push({value: frazioniResult.data[i].name, key: frazioniResult.data[i].hamlet_ref});
            }
            this.variables.frazioneSA = '';
            this.template.querySelector('.frazioniSA').setValue(this.variables.frazioneSA);
            //this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeViaSL(event){
        this.variables.viaSL = event.detail.value;
        this.variables.viaListSL = [];
        var autocompleteRequest = {"address" : this.variables.viaSL, "town" : this.variables.comuneSLOption[0].value , "province" : this.variables.provinciaSLOption[0].value, "region" : "null"}
        if(this.variables.viaSL != null && this.variables.viaSL != undefined && this.variables.viaSL != ''){
            getStreetSuggestions({calloutJson: JSON.stringify(autocompleteRequest)}).then(result => {
                var response = JSON.parse(result);
                var streets = response.data;
                var returnMap = [];
    
                for(var i = 0 ; i < streets.length ; i++){
                    var realTopo = '';
                    var realAddress = '';
                    var old_town = '';
                    if(streets[i].toponym != null)realAddress = streets[i].completed_address;
                    else realAddress = streets[i].completed_address;
                    if(streets[i].old_town != null) realAddress += ' ('+streets[i].old_town+') ';
                    returnMap.push({'key' : streets[i].address_ref , 'value' : realAddress , 'toponym' : streets[i].toponym, 'postal_code': streets[i].post_code, 'region': streets[i].region, 'code': streets[i].address_ref}); 
                }
    
                if(returnMap.length == 0) this.variables.viaListSL = null;
                else this.variables.viaListSL = returnMap;
            }).catch(error => {
                console.log('Error -> '+JSON.stringify(error));
            });
        }
        
    }

    handleChangeViaSA(event){
        this.variables.viaSA = event.detail.value;
        this.variables.viaListSA = [];
        var autocompleteRequest = {"address" : this.variables.viaSA, "town" : this.variables.comuneSAOption[0].value , "province" : this.variables.provinciaSAOption[0].value, "region" : "null"}
        if(this.variables.viaSA != null && this.variables.viaSA != undefined && this.variables.viaSA != ''){
            getStreetSuggestions({calloutJson: JSON.stringify(autocompleteRequest)}).then(result => {
                var response = JSON.parse(result);
                var streets = response.data;
                var returnMap = [];
    
                for(var i = 0 ; i < streets.length ; i++){
                    var realTopo = '';
                    var realAddress = '';
                    var old_town = '';
                    if(streets[i].toponym != null)realAddress = streets[i].completed_address;
                    else realAddress = streets[i].completed_address;
                    if(streets[i].old_town != null) realAddress += ' ('+streets[i].old_town+') ';
                    returnMap.push({'key' : streets[i].address_ref , 'value' : realAddress , 'toponym' : streets[i].toponym, 'postal_code': streets[i].post_code, 'region': streets[i].region, 'code': streets[i].address_ref}); 
                }
    
                if(returnMap.length == 0) this.variables.viaListSA = null;
                else this.variables.viaListSA = returnMap;
            }).catch(error => {
                console.log('Error -> '+JSON.stringify(error));
            });
        }
        
    }

    selectViaSL(event){
        this.variables.viaSL = event.currentTarget.dataset.name;
        //this.variables.postalcodeSL = event.currentTarget.dataset.postal;
        this.variables.viaSLSelected = event.currentTarget.dataset.name;
        this.variables.viaSLOption = this.variables.viaListSL.filter(word => word.value == this.variables.viaSL);
        this.variables.viaListSL = null;
    }

    selectViaSA(event){
        this.variables.viaSA = event.currentTarget.dataset.name;
        //this.variables.postalcodeSA = event.currentTarget.dataset.postal;
        this.variables.viaSASelected = event.currentTarget.dataset.name;
        this.variables.viaSAOption = this.variables.viaListSA.filter(word => word.value == this.variables.viaSA);
        this.variables.viaListSA = null;
    }

    handleChangeConvention(event){
        var convention_buttons = this.template.querySelectorAll('.button-style-convention, .button-style-convention-selected');
        for(var i = 0 ; i < convention_buttons.length ; i++){
            convention_buttons[i].className = 'button-style-convention';
        }
        event.target.className = 'button-style-convention-selected';
        this.variables.convention = event.target.name;
    }

    handleChangePIVA(event){this.variables.piva = event.detail.value;}

    handleChangeLicenzaCommerciale(event){
        this.variables.licenza_commerciale = event.detail.value;
        this.variables.licenzaCommercialeOption = this.licenze_commerciali.filter(word => word.key == this.variables.licenza_commerciale);
        const payload = { FunctionalityName: 'License', Value: (this.variables.licenza_commerciale == '022' || this.variables.licenza_commerciale == '017') };
        publish(this.messageContext, messageChannel, payload);
    }

    handleChangeLuogoEC(event){this.variables.LuogoEC = event.detail.value;}

    handleChangeRagioneSocialeEC(event){
        this.variables.ragioneSocialeEC = event.detail.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    handleChangeCodiceFiscaleEC(event){this.variables.codiceFiscaleEC = event.detail.value;}

    handleChangeCodiceDestinatarioEC(event){this.variables.codiceDestinatarioEC = event.detail.value;}

    handleChangePivaGruppoEC(event){
        this.variables.pivaGruppoEC = event.detail.value;
        if(this.variables.pivaGruppoEC == this.variables.piva){
            alert('Non è possibile utilizzare una partita IVA di gruppo uguale alla partita IVA precedentemente inserita');
            this.variables.pivaGruppoEC = null;
        }
    }

    handleChangeCivicoSL(event){
        this.variables.civicoSL = event.detail.value;
        if(this.variables.civicoSL != null && this.variables.civicoSL != ''){
            retrievePostalCode({address: this.variables.viaSL, municipality_ref: this.variables.comuneSL, province_ref: this.variables.provinciaSL, region_ref: this.variables.provinciaSLOption?.[0]?.region, street_ref: this.variables.viaSLOption?.[0]?.code, street_number: this.variables.civicoSL}).then(result => {
                this.variables.postalcodeSL = result.post_code;
                if(this.variables.civicoSL == 'SNC'){
                    this.variables.civicoSLnr = '0';
                }else{
                    this.variables.civicoSLnr = result.street_number;
                }
                console.log('Civico numerico >> ', this.variables.civicoSLnr);
            }).catch(error => {
                alert('Il civico inserito non risulta essere valido');
                this.variables.civicoSL = null;
                console.log('ERROR -> ', JSON.stringify(error));
            });
        }
        else this.variables.postalcodeSL = null;
        
    }

    handleChangeCAPSL(event){this.variables.capSL = event.detail.value;}

    handleChangeFrazioneSL(event){
        this.variables.frazioneSL = event.detail.value;
        this.variables.frazioneSLOption = this.frazioniSL.filter(word => word.key == this.variables.frazioneSL);
    }

    handleChangeNoteIndirizzoSL(event){this.variables.noteIndirizzoSL = event.detail.value;}

    handleChangeCivicoSA(event){
        this.variables.civicoSA = event.detail.value;
        if(this.variables.civicoSA != null && this.variables.civicoSA != ''){
            retrievePostalCode({address: this.variables.viaSA, municipality_ref: this.variables.comuneSA, province_ref: this.variables.provinciaSA, region_ref: this.variables.provinciaSAOption?.[0]?.region, street_ref: this.variables.viaSAOption?.[0]?.code, street_number: this.variables.civicoSA}).then(result => {
                this.variables.postalcodeSA = result;
            }).catch(error => {
                alert('Il civico inserito non risulta essere valido');
                this.variables.civicoSA = null;
                console.log(JSON.stringify(error));
            });
        }
        else this.variables.postalcodeSA = null;
    }

    handleChangeCAPSA(event){this.variables.capSA = event.detail.value;}

    handleChangeFrazioneSA(event){
        this.variables.frazioneSA = event.detail.value;
        this.variables.frazioneSAOption = this.frazioniSA.filter(word => word.key == this.variables.frazioneSA);
    }

    handleChangeNoteIndirizzoSA(event){this.variables.noteIndirizzoSA = event.detail.value;}

    handleChangeNameRL(event){this.variables.nameRL = event.detail.value;}

    handleChangeSurnameRL(event){this.variables.surnameRL = event.detail.value;}

    handleChangeFiscalCodeRL(event){this.variables.fiscalCodeRL = event.detail.value;}

    handleChangeEmailRL(event){this.variables.emailRL = event.detail.value;}

    handleChangeMobileRL(event){this.variables.mobileRL = event.detail.value;}

    handleChangePhoneRL(event){this.variables.phoneRL = event.detail.value;}

    handleChangeFaxRL(event){this.variables.faxRL = event.detail.value;}

    handleChangePECRL(event){this.variables.pecRL = event.detail.value;}

    handleChangeNameRA(event){this.variables.nameRA = event.detail.value;}

    handleChangeSurnameRA(event){this.variables.surnameRA = event.detail.value;}

    handleChangeFiscalCodeRA(event){this.variables.fiscalCodeRA = event.detail.value;}

    handleChangeEmailRA(event){this.variables.emailRA = event.detail.value;}

    handleChangeMobileRA(event){this.variables.mobileRA = event.detail.value;}

    handleChangePhoneRA(event){this.variables.phoneRA = event.detail.value;}

    handleChangeFaxRA(event){this.variables.faxRA = event.detail.value;}

    handleChangePECRA(event){this.variables.pecRA = event.detail.value;}

    handleChangeCheckboxSA(event){this.variables.checkboxSA = event.detail;}

    handleChangeCheckboxRA(event){
        this.variables.checkboxRA = event.detail;
        if(this.variables.checkboxRA == false){
            this.variables.emailRA = null;
            this.variables.pecRA = null;
            this.variables.fiscalCodeRA = null;
            this.variables.mobileRA = null;
            this.variables.phoneRA = null;
            this.variables.faxRA = null;
        }
        
    }

    scrollToTop(){
        const scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    checkMandatoryFields(){
        //return true;
        var result = true;
        for(var elem in this.input_options){ 
            if(this.input_options[elem].required){
                if(elem == 'F_Luogo' && (this.variables.LuogoEC == null || this.variables.LuogoEC == '')){result = false; break;}
                else if(elem == 'F_Ragione_Sociale' && (this.variables.ragioneSocialeEC == null || this.variables.ragioneSocialeEC == '')){result = false; break;}
                else if(elem == 'F_Codice_Fiscale_EsercizioCommerciale' && (this.variables.codiceFiscaleEC == null || this.variables.codiceFiscaleEC == '')){result = false; break;}
                else if(elem == 'F_Codice_Destinatario' && (this.variables.codiceDestinatarioEC == null || this.variables.codiceDestinatarioEC == '')){result = false; break;}
                else if(elem == 'F_PIva_Gruppo' && (this.variables.pivaGruppoEC == null || this.variables.pivaGruppoEC == '')){result = false; break;}
                else if(elem == 'F_Provincia_SedeLegale' && (this.variables.provinciaSL == null || this.variables.provinciaSL == '')){result = false; break;}
                else if(elem == 'F_Comune_SedeLegale' && (this.variables.comuneSL == null || this.variables.comuneSL == '')){result = false; break;}
                else if(elem == 'F_Via_SedeLegale' && (this.variables.viaSL == null || this.variables.viaSL == '' || this.variables.viaSLSelected == null || this.variables.viaSLSelected == undefined || this.variables.viaSLSelected == '')){result = false; break;}
                else if(elem == 'F_Civico_SedeLegale' && (this.variables.civicoSL == null || this.variables.civicoSL == '')){result = false; break;}
                else if(elem == 'F_Cap_EsercizioCommerciale' && (this.variables.postalcodeSL == null || this.variables.postalcodeSL == '')){result = false; break;}
                else if(elem == 'F_Frazione_SedeLegale' && (this.variables.frazioneSL == null || this.variables.frazioneSL == '')){result = false; break;}
                else if(elem == 'F_Note_Indirizzo_SedeLegale' && (this.variables.noteIndirizzoSL == null || this.variables.noteIndirizzoSL == '')){result = false; break;}
                else if(elem == 'F_Provincia_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.provinciaSA == null || this.variables.provinciaSA == '')){result = false; break;}
                else if(elem == 'F_Comune_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.comuneSA == null || this.variables.comuneSA == '')){result = false; break;}
                else if(elem == 'F_Via_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.viaSA == null || this.variables.viaSA == '' || this.variables.viaSASelected == null || this.variables.viaSASelected == undefined || this.variables.viaSASelected == '')){result = false; break;}
                else if(elem == 'F_Civico_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.civicoSA == null || this.variables.civicoSA == '')){result = false; break;}
                else if(elem == 'F_Cap_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.postalcodeSA == null || this.variables.postalcodeSA == '')){result = false; break;}
                else if(elem == 'F_Frazione_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.frazioneSA == null || this.variables.frazioneSA == '')){result = false; break;}
                else if(elem == 'F_Note_Indirizzo_SedeAmministrativa' && this.variables.checkboxSA && (this.variables.noteIndirizzoSA == null || this.variables.noteIndirizzoSA == '')){result = false; break;}
                else if(elem == 'F_Nome_ReferenteLegale' && (this.variables.nameRL == null || this.variables.nameRL == '')){result = false; break;}
                else if(elem == 'F_Cognome_ReferenteLegale' && (this.variables.surnameRL == null || this.variables.surnameRL == '')){result = false; break;}
                else if(elem == 'F_Codice_Fiscale_ReferenteLegale' && (this.variables.fiscalCodeRL == null || this.variables.fiscalCodeRL == '')){result = false; break;}
                else if(elem == 'F_Email_ReferenteLegale' && (this.variables.emailRL == null || this.variables.emailRL == '')){result = false; break;}
                else if(elem == 'F_Cellulare_ReferenteLegale' && (this.variables.mobileRL == null || this.variables.mobileRL == '')){result = false; break;}
                else if(elem == 'F_Telefono_ReferenteLegale' && (this.variables.phoneRL == null || this.variables.phoneRL == '')){result = false; break;}
                else if(elem == 'F_Fax' && (this.variables.faxRL == null || this.variables.faxRL == '')){result = false; break;}
                else if(elem == 'F_Pec' && (this.variables.pecRL == null || this.variables.pecRL == '')){result = false; break;}
                else if(elem == 'F_Nome_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.nameRA == null || this.variables.nameRA == '')){result = false; break;}
                else if(elem == 'F_Cognome_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.surnameRA == null || this.variables.surnameRA == '')){result = false; break;}
                else if(elem == 'F_Codice_Fiscale_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.fiscalCodeRA == null || this.variables.fiscalCodeRA == '')){result = false; break;}
                else if(elem == 'F_Email_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.emailRA == null || this.variables.emailRA == '')){result = false; break;}
                else if(elem == 'F_Cellulare_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.mobileRA == null || this.variables.mobileRA == '')){result = false; break;}
                else if(elem == 'F_Telefono_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.phoneRA == null || this.variables.phoneRA == '')){result = false; break;}
                else if(elem == 'F_Fax_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.faxRA == null || this.variables.faxRA == '')){result = false; break;}
                else if(elem == 'F_Pec_ReferenteAmministrativo' && this.variables.checkboxRA && (this.variables.pecRA == null || this.variables.pecRA == '')){result = false; break;}
                else {}
            }
            if(this.variables.emailRA != null && this.variables.emailRA != undefined && this.variables.emailRA != '' && !this.validateEmail(this.variables.emailRA)){result = false; alert('Email inserita non valida !'); break;}
            else if(this.variables.emailRL != null && this.variables.emailRL != undefined && this.variables.emailRL != '' && !this.validateEmail(this.variables.emailRL)){result = false; alert('Email inserita non valida !'); break;}
            else if(this.variables.pecRA != null && this.variables.pecRA != undefined && this.variables.pecRA != '' && !this.validateEmail(this.variables.pecRA)){result = false; alert('PEC inserita non valida !'); break;}
            else if(this.variables.pecRL != null && this.variables.pecRL != undefined && this.variables.pecRL != '' && !this.validateEmail(this.variables.pecRL)){result = false; alert('PEC inserita non valida !'); break;}
            else if(this.variables.phoneRA != null && this.variables.phoneRA != undefined && this.variables.phoneRA != '' && !this.isValidNumber(this.variables.phoneRA)){result = false; alert('Numero di telefono inserito non valido !');break;}
            else if(this.variables.phoneRL != null && this.variables.phoneRL != undefined && this.variables.phoneRL != '' && !this.isValidNumber(this.variables.phoneRL)){result = false; alert('Numero di telefono inserito non valido !');break;}
            else if(this.variables.mobileRA != null && this.variables.mobileRA != undefined && this.variables.mobileRA != '' && !this.isValidNumber(this.variables.mobileRA)){result = false; alert('Numero di cellulare inserito non valido !');break;}
            else if(this.variables.mobileRL != null && this.variables.mobileRL != undefined && this.variables.mobileRL != '' && !this.isValidNumber(this.variables.mobileRL)){result = false; alert('Numero di cellulare inserito non valido !');break;}
            else if(this.variables.faxRA != null && this.variables.faxRA != undefined && this.variables.faxRA != '' && !this.isValidNumber(this.variables.faxRA)){result = false; alert('Numero FAX inserito non valido !');break;}
            else if(this.variables.faxRL != null && this.variables.faxRL != undefined && this.variables.faxRL != '' && !this.isValidNumber(this.variables.faxRL)){result = false; alert('Numero FAX inserito non valido !');break;}
            else {}

            if(this.variables.fiscalCodeRL != null && this.variables.fiscalCodeRL != undefined && this.variables.fiscalCodeRL != '' && !this.validFC(this.variables.fiscalCodeRL)){result = false; alert('Codice Fiscale inserito non valido !'); break;}
            else if(this.variables.fiscalCodeRA != null && this.variables.fiscalCodeRA != undefined && this.variables.fiscalCodeRA != '' && !this.validFC(this.variables.fiscalCodeRA)){result = false; alert('Codice Fiscale inserito non valido !'); break;}
            else if(this.variables.codiceFiscaleEC != null && this.variables.codiceFiscaleEC != undefined && this.variables.codiceFiscaleEC != '' && this.variables.codiceFiscaleEC.length != 11 && this.variables.codiceFiscaleEC.length != 16){result = false; alert('Codice Fiscale inserito non valido !'); break;}
            else if(this.variables.codiceFiscaleEC != null && this.variables.codiceFiscaleEC != undefined && this.variables.codiceFiscaleEC != '' && this.variables.codiceFiscaleEC.length == 16 && !this.validFC(this.variables.codiceFiscaleEC)){result = false; alert('Codice Fiscale inserito non valido !'); break;}
            else if(this.variables.codiceFiscaleEC != null && this.variables.codiceFiscaleEC != undefined && this.variables.codiceFiscaleEC != '' && this.variables.codiceFiscaleEC.length == 11 && !(this.variables.codiceFiscaleEC.match(/^[0-9]+$/) != null)){result = false; alert('Codice Fiscale inserito non valido !'); break;}

            if(this.variables.codiceDestinatarioEC != null && this.variables.codiceDestinatarioEC != '' && this.variables.codiceDestinatarioEC.length != 7) {result = false; alert('Il codice destinatario deve essere di 7 caratteri !'); break;}
            
        }
        return result;
    }


    validateEmail(input) {
        
        var validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (input.match(validRegex)) return true;
        else return false;
    }

    isValidNumber(input){
        return /^[0-9]+$/.test(input);
    }

    validFC(cf){
        var validi, i, s, set1, set2, setpari, setdisp;
        if( cf == '' )  return '';
        cf = cf.toUpperCase();
        if( cf.length != 16 )
            return false;
        validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for( i = 0; i < 16; i++ ){
            if( validi.indexOf( cf.charAt(i) ) == -1 )
                return false;
        }
        set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
        setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
        s = 0;
        for( i = 1; i <= 13; i += 2 )
            s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
        for( i = 0; i <= 14; i += 2 )
            s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
        if( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) )
            return false;
        return true;
    }

    @api
    get variables(){ return this.variables;}
}