/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
import { LightningElement, track, api } from 'lwc';
//import pageUrl from '@salesforce/resourceUrl/recaptcha2';
import EDENRED_LOGO from '@salesforce/contentAssetUrl/SelfAffiliation_TR';
import createObject from '@salesforce/apex/APIT121_SelfAffiliation.createObject';
import createLeadOnCloseProcedure from '@salesforce/apex/APIT121_SelfAffiliation.createLeadOnCloseProcedure';
import insertAccount from '@salesforce/apex/APIT121_SelfAffiliation.insertAccount';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';
import genAndSend from '@salesforce/apex/APIT121_SelfAffiliation.genAndSend';
import getEmbeddedSendingUrl from '@salesforce/apex/APIT121_SelfAffiliation.getEmbeddedSigningUrl';



export default class LWCIT14_SelfAffiliationStandardContract extends LightningElement {


    edenredLogo = EDENRED_LOGO;
    
    @api fields;
    @api contractname;
    @track showSpinner = false;
    //@track navigateTo;

    @track errorPage = false;
    @track errorTitle;
    @track errorMessage;

    //Step Setup
    @track isStepOne = true;
    @track isStepTwo = false;
    @track isStepThree = false;
    @track isStepFour = false;
    @track isStepFive = false;
    @track isStepSix = false;
    @track isStepSeven = false;
    @track phase = "1";

    @track button_options = {};
    @track text_options = {};
    @track input_options = {};
    @track isLoading = false;
    @track contractSigned = false;

    s1;s2;s3;s4;s5;s6;s7;

    
    connectedCallback(){
        var url = window.location.href;
        if(url.includes('signing_complete')){
            this.contractSigned = true;
        }
        //this.navigateTo = pageUrl;
        for(var i = 0 ; i < this.fields.length ; i++){
            var item = this.fields[i];
            if(item.IT_Type__c == 'Button') this.button_options[item.IT_APIName__c] = item.IT_Value__c;
            else if(item.IT_Type__c == 'Text') this.text_options[item.IT_APIName__c] = item.IT_Value__c;
            else this.input_options[item.IT_APIName__c] = {value:item.IT_Value__c, required:item.IT_Required__c}
        }
        loadStyle(this, sResource).then(() => {});
    }

    get stepList() {return [{ nb: "1", label: '' },{ nb: "2", label: '' },{ nb: "3", label: '' },{ nb: "4", label: '' },{ nb: "5", label: '' },{ nb: "6", label: '' },{ nb: "7", label: '' }];}


    goToStep1(){
        this.phase = "1";
        this.template.querySelector(".step1").style.display = "block";
        this.template.querySelector(".step2").style.display = "none";
        this.scrollToTop();
    }

    goToStep2(event){
        this.phase = "2";
        this.template.querySelector(".step1").style.display = "none";
        this.template.querySelector(".step2").style.display = "block";
        this.template.querySelector(".step3").style.display = "none";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s1 = event.detail.vars;
    }

    goToStep3(event){
        this.phase = "3";
        this.template.querySelector(".step2").style.display = "none";
        this.template.querySelector(".step3").style.display = "block";
        this.template.querySelector(".step4").style.display = "none";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s2 = event.detail.vars;
        this.createAccount();
    }

    goToStep4(event){
        this.phase = "4";
        this.template.querySelector(".step3").style.display = "none";
        this.template.querySelector(".step4").style.display = "block";
        this.template.querySelector(".step5").style.display = "none";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s3 = event.detail.vars;
    }

    goToStep5(event){
        this.phase = "5";
        this.template.querySelector(".step4").style.display = "none";
        this.template.querySelector(".step5").style.display = "block";
        this.template.querySelector(".step6").style.display = "none";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s4 = event.detail.vars;
    }

    goToStep6(event){
        this.phase = "6";
        this.template.querySelector(".step5").style.display = "none";
        this.template.querySelector(".step6").style.display = "block";
        this.template.querySelector(".step7").style.display = "none";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s5 = event.detail.vars;
    }

    goToStep7(event){
        this.phase = "7";
        this.template.querySelector(".step6").style.display = "none";
        this.template.querySelector(".step7").style.display = "block";
        this.scrollToTop();
        if(event != null && event.detail != null && event.detail.vars != null) this.s6 = event.detail.vars;
    }
// lll
    hasError(event){
        if(event != null && event.detail != null && event.detail.vars != null) this.s2 = event.detail.vars;
        var mapLead = {
            vat : this.s1.piva,
            city: this.s1.comuneSLOption?.[0]?.value, //  ER_Legal_City__c
            countryCode: '086', // ER_Legal_Country__c
            postalCode: this.s1.postalcodeSL, // ER_Legal_Zip_Code__c
            province: this.s1.provinciaSLOption?.[0]?.value, //  ER_Legal_State_Province__c
            street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '',   //  ER_Legal_Street__c
            cityCode: this.s1.comuneSL, //IT_City_Code__c 
            // EUSpecification: null, manca
            region: this.s1.viaSLOption?.[0]?.region, //IT_Region_Txt__c
            regionCode: this.s1.provinciaSLOption?.[0]?.region,  //IT_Region_code__c
            // provinceCode: this.s1.provinciaSL, // ???
            streetCode: this.s1.viaSLOption?.[0]?.code, //IT_Street_Code__c
            streetNumber: this.s1.civicoSL, //IT_Street_Number__c
            streetNumericNumber: this.s1.civicoSLnr, //IT_Street_Number_Numeric__c
            toponym: this.s1.viaSLOption?.[0]?.toponym, //IT_Toponym__c
            // noteAddress: this.s1.noteIndirizzoSL, // manca
            hamlet: this.s1.frazioneSLOption?.[0]?.value, //IT_Hamlet__c
            hamletCode: this.s1.frazioneSLOption?.[0]?.key, //IT_Hamlet_Code__c
            fiscalCode: this.s1.codiceFiscaleEC,
            mobile: this.s1.mobileRL,
            phone: this.s1.phoneRL,  // IT_FiscalCodeChecked__c
            IT_Industry : '106',
            IT_Legal_Form : 'NC',
            IT_Company_Type : 'Private',
            email: this.s1.emailRL, //Email
            ragioneSociale: this.s1.ragioneSocialeEC, // ER_Legal_Name__c
            codDest: this.s1.codiceDestinatarioEC,
            licCom: this.s1.licenzaCommercialeOption?.[0]?.value,
            licComCod:this.s1.licenza_commerciale,
            ins: this.s2.insegnaPuntoVendita,
            name: this.s1.nameRL,
            surname:  this.s1.surnameRL
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
            console.log('***hasError ' + mapLead);
// lll
            createLeadOnCloseProcedure({mapLead : mapLead}
                ).then(result => {}
                ).catch(error => {});

    }

    openModalCambioGestione(){this.isModalCambioGestioneOpen = true;}

    scrollToTop(){
        const scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }
// lll
    createAccount(){
        if(this.accountId == null){
            var mapAccount = {
                city: this.s1.comuneSLOption?.[0]?.value, countryCode: '086', postalCode: this.s1.postalcodeSL, province: this.s1.provinciaSLOption?.[0]?.value, street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '', cityCode: this.s1.comuneSL, 
                EUSpecification: null, region: this.s1.viaSLOption?.[0]?.region, regionCode: this.s1.provinciaSLOption?.[0]?.region,
                provinceCode: this.s1.provinciaSL, streetCode: this.s1.viaSLOption?.[0]?.code, streetNumber: this.s1.civicoSL, streetNumericNumber: this.s1.civicoSLnr, toponym: this.s1.viaSLOption?.[0]?.toponym, 
                noteAddress: this.s1.noteIndirizzoSL, hamlet: this.s1.frazioneSLOption?.[0]?.value, hamletCode: this.s1.frazioneSLOption?.[0]?.key,
                fiscalCode: this.s1.codiceFiscaleEC, ragioneSociale: this.s1.ragioneSocialeEC,
                vat: this.s1.piva, sedeAmmDiversaLegale: this.s1.checkboxSA, refAmmDiversoLegale: this.s1.checkboxRA, refTermDiversoLegale: this.s2.checkboxRLPV, 
                refPVenditaDiversoLegale: this.s2.checkboxRLPV, puntoVendita2: this.s2.checkboxOtherPV, puntoVendita3: !this.s2.newPV, 
                orariAperturaChiusura: this.s2.daOraFeriale!= null, cambioGestione1: this.s2.isCambioGestione,
                cambioGestione2: this.s2.isCambioGestione2 , cambioGestione3: this.s2.isCambioGestione3, 
                dataSubentro1: this.s2.dataSubentroCG, dataSubentro2: this.s2.dataSubentroCG2, dataSubentro3: this.s2.dataSubentroCG3
            };
            insertAccount({mapAccount : mapAccount}
                ).then(result => {
                    if(result == null){
                        this.errorPage = true;
                        this.errorTitle=this.text_options.W_Testo_KO_Title_Generic;
                        this.errorMessage=this.text_options.W_Testo_KO_Message_Generic;
                        this
                        var mapLead = {
                            vat : this.s1.piva,
                            city: this.s1.comuneSLOption?.[0]?.value, //  ER_Legal_City__c
                            countryCode: '086', // ER_Legal_Country__c
                            postalCode: this.s1.postalcodeSL, // ER_Legal_Zip_Code__c
                            province: this.s1.provinciaSLOption?.[0]?.value, //  ER_Legal_State_Province__c
                            street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '',   //  ER_Legal_Street__c
                            cityCode: this.s1.comuneSL, //IT_City_Code__c 
                            // EUSpecification: null, manca
                            region: this.s1.viaSLOption?.[0]?.region, //IT_Region_Txt__c
                            regionCode: this.s1.provinciaSLOption?.[0]?.region,  //IT_Region_code__c
                            // provinceCode: this.s1.provinciaSL, // ???
                            streetCode: this.s1.viaSLOption?.[0]?.code, //IT_Street_Code__c
                            streetNumber: this.s1.civicoSL, //IT_Street_Number__c
                            streetNumericNumber: this.s1.civicoSLnr, //IT_Street_Number_Numeric__c
                            toponym: this.s1.viaSLOption?.[0]?.toponym, //IT_Toponym__c
                            // noteAddress: this.s1.noteIndirizzoSL, // manca
                            hamlet: this.s1.frazioneSLOption?.[0]?.value, //IT_Hamlet__c
                            hamletCode: this.s1.frazioneSLOption?.[0]?.key, //IT_Hamlet_Code__c
                            fiscalCode: this.s1.codiceFiscaleEC,  // IT_FiscalCodeChecked__c
                            email: this.s1.emailRL,
                            mobile: this.s1.mobileRL,
                            phone: this.s1.phoneRL, 
                            IT_Industry : '106',
                            IT_Legal_Form : 'NC',
                            IT_Company_Type : 'Private',
                            ragioneSociale: this.s1.ragioneSocialeEC, // ER_Legal_Name__c
                            codDest: this.s1.codiceDestinatarioEC,
                            licCom: this.s1.licenzaCommercialeOption?.[0]?.value,
                            licComCod:this.s1.licenza_commerciale,
                            ins: this.s2.insegnaPuntoVendita,
                            name: this.s1.nameRL,
                            surname:  this.s1.surnameRL
                            // sedeAmmDiversaLegale: this.s1.checkboxSA, //manca                 
                            // refAmmDiversoLegale: this.s1.checkboxRA, //manca 
                            // refTermDiversoLegale: this.s2.checkboxRLPV, //manca 
                            // refPVenditaDiversoLegale: this.s2.checkboxRLPV, //manca 
                            // puntoVendita2: this.s2.checkboxOtherPV, //manca 
                            // puntoVendita3: !this.s2.newPV, //manca 
                            // orariAperturaChiusura: this.s2.daOraFeriale!= null, //manca 
                            // cambioGestione1: this.s2.isCambioGestione,//manca 
                            // cambioGestione2: this.s2.isCambioGestione2 , //manca 
                            // cambioGestione3: this.s2.isCambioGestione3, //manca 
                            // dataSubentro1: this.s2.dataSubentroCG, //manca 
                            // dataSubentro2: this.s2.dataSubentroCG2, //manca 
                            // dataSubentro3: this.s2.dataSubentroCG3//manca 
                            };
                        console.log('***createAccount ' + mapLead);
// lll
                        createLeadOnCloseProcedure({mapLead : mapLead}
                        ).then(result => {}
                        ).catch(error => {});
                    }
                    else{
                        if(result != 'Existing')this.accountId = result;
                    }
                })
        }
    }

    signContract(event){

        this.isLoading = true;

        if(event != null && event.detail != null && event.detail.vars != null) this.s7 = event.detail.vars;

        var obj = {};

        var rimborso = 'base';
        if(this.s4.rimborsoFlyDue == true) rimborso = 'flydue';
        if(this.s4.rimborsoFlyQuindici == true) rimborso = 'flyquindici';

        var fatturazione = 'Base';
        if(this.s4.fatturazioneQuindicinale == true) fatturazione = 'Quindicinale';
        if(this.s4.fatturazioneSettimanale == true) fatturazione = 'Settimanale';

        var opzione = '1';
        if(this.s4.opzione2) opzione = '2';

        obj.mapAccount = {
            city: this.s1.comuneSLOption?.[0]?.value, countryCode: '086', postalCode: this.s1.postalcodeSL, province: this.s1.provinciaSLOption?.[0]?.value, street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '', cityCode: this.s1.comuneSL, 
            EUSpecification: null, region: this.s1.viaSLOption?.[0]?.region, regionCode: this.s1.provinciaSLOption?.[0]?.region,
            provinceCode: this.s1.provinciaSL, streetCode: this.s1.viaSLOption?.[0]?.code, streetNumber: this.s1.civicoSL, streetNumericNumber: this.s1.civicoSLnr, toponym: this.s1.viaSLOption?.[0]?.toponym, 
            noteAddress: this.s1.noteIndirizzoSL, hamlet: this.s1.frazioneSLOption?.[0]?.value, hamletCode: this.s1.frazioneSLOption?.[0]?.key,
            fiscalCode: this.s1.codiceFiscaleEC, ragioneSociale: this.s1.ragioneSocialeEC,
            vat: this.s1.piva, sedeAmmDiversaLegale: this.s1.checkboxSA, refAmmDiversoLegale: this.s1.checkboxRA, refTermDiversoLegale: !this.s3.refTerminale, 
            refPVenditaDiversoLegale: this.s2.checkboxRLPV, puntoVendita2: this.s2.checkboxOtherPV, puntoVendita3: !this.s2.newPV, 
            orariAperturaChiusura: this.s2.daOraFeriale!= null, cambioGestione1: this.s2.isCambioGestione,
            cambioGestione2: this.s2.isCambioGestione2 , cambioGestione3: this.s2.isCambioGestione3, 
            dataSubentro1: this.s2.dataSubentroCG, dataSubentro2: this.s2.dataSubentroCG2, dataSubentro3: this.s2.dataSubentroCG3
        };
        obj.setInfoSedeLeg = {
            codDestinatario: this.s1.codiceDestinatarioEC, pivaGruppo: this.s1.pivaGruppoEC,ragioneSociale: this.s1.ragioneSocialeEC,insegna: this.s2.insegnaPuntoVendita,city: this.s1.comuneSLOption?.[0]?.value, countryDesc : 'Italy', street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '', postalCode: this.s1.postalcodeSL, cityCode: this.s1.comuneSL,
            commercialLicense: this.s1.licenza_commerciale, countryCode : '086', province: this.s1.provinciaSLOption?.[0]?.value, region: this.s1.viaSLOption?.[0]?.region, regionCode: this.s1.provinciaSLOption?.[0]?.region,
            provinceCode: this.s1.provinciaSL, streetCode: this.s1.viaSLOption?.[0]?.code, streetNumber: this.s1.civicoSL, streetNumericNumber: this.s1.civicoSLnr, toponym: this.s1.viaSLOption?.[0]?.toponym, hamlet: this.s1.frazioneSLOption?.[0]?.value, hamletCode: this.s1.frazioneSLOption?.[0]?.key, noteAddress: this.s1.noteIndirizzoSL, vat: this.s1.piva
        };
        if(this.s1.checkboxSA){
            obj.setInfoSedeAmm = {
                city: this.s1.comuneSAOption?.[0]?.value, countryDesc : 'Italy', street: (this.s1.viaSA != null) ? (this.s1.viaSA.replace('VIA ','') + ', '+ this.s1.civicoSA) : '', postalCode: this.s1.postalcodeSA, cityCode: this.s1.comuneSA,
                commercialLicense: this.s1.licenza_commerciale, countryCode : '086', province: this.s1.provinciaSAOption?.[0]?.value, region: this.s1.viaSAOption?.[0]?.region, regionCode: this.s1.provinciaSAOption?.[0]?.region,
                provinceCode: this.s1.provinciaSA, streetCode: this.s1.viaSAOption?.[0]?.code, streetNumber: this.s1.civicoSA, streetNumericNumber: this.s1.civicoSAnr, toponym: this.s1.viaSAOption?.[0]?.toponym, hamlet: this.s1.frazioneSAOption?.[0]?.value, hamletCode: this.s1.frazioneSAOption?.[0]?.key, noteAddress: this.s1.noteIndirizzoSA, vat: this.s1.piva
            };
        }
        obj.setInfoOpp = {
            codDestinatario: this.s1.codiceDestinatarioEC, catMerceologica:this.s1.licenzaCommercialeOption?.[0]?.value, luogo: this.s1.LuogoEC, pivaGruppo: this.s1.pivaGruppoEC,ragioneSociale: this.s1.ragioneSocialeEC, province: this.s1.provinciaSLOption?.[0]?.value, city: this.s1.comuneSLOption?.[0]?.value, cityCode: this.s1.comuneSL,countryDesc:'Italy',countryCode:'086',effectiveDate:null,EUSpecifications:'',fiscalCode:this.s1.codiceFiscaleEC,regionCode: this.s1.provinciaSLOption?.[0]?.region,regionDesc:this.s1.viaSLOption?.[0]?.region,
            provinceCode:this.s1.provinciaSL,street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '',streetCode: this.s1.viaSLOption?.[0]?.code,streetNumber: this.s1.civicoSL,streetNumericNumber: this.s1.civicoSLnr,toponym: this.s1.viaSLOption?.[0]?.toponym,postalCode: this.s1.postalcodeSL,hamlet: this.s1.frazioneSLOption?.[0]?.value,
            hamletCode: this.s1.frazioneSLOption?.[0]?.key,addressNote: this.s1.noteIndirizzoSL,iban: this.s5.iban,posType: (this.s3.siCassaIntegrata == true) ? 'POS' : 'XPOS',typeReimbursement: rimborso,flagTerzi:this.s4.xposDiTerzi,option: opzione,commercialLicense: this.s1.licenza_commerciale,flagInstallation: (this.s3.siCassaIntegrata == false), invoiceFrequency:fatturazione,
            cartaIdentità: this.s6.documento, visura: this.s6.visura, attoSubentro1: this.s2.attoSubentroFileCG, attoSubentro2: this.s2.attoSubentroFileCG2, attoSubentro3: this.s2.attoSubentroFileCG3, licenza: this.s6.scontrino, posPartner: this.s4.posType, marketingConsent: this.s7.notizie, thirdPartyConsent: this.s7.notizie2,
            posEdenred: this.s4.posEdenredYes, xposEdenred: this.s4.xposEdenredYes, checkBoxTerzi: this.s4.checkBoxTerzi, rimborsoBase: this.s4.rimborsoBase, rimborsoFlyDue: this.s4.rimborsoFlyDue, rimborsoFlyQuindici: this.s4.rimborsoFlyQuindici, fatturazioneBase: this.s4.fatturazioneBase, fatturazioneSettimanale: this.s4.fatturazioneSettimanale,
            fatturazioneQuindicinale: this.s4.fatturazioneQuindicinale, opzione1: this.s4.opzione1, opzione2: this.s4.opzione2, checkPos: this.s4.checkPos, checkWeb: this.s4.checkWeb, checkApp: this.s4.checkApp
        };

        console.log('TEST LD REGION CODE -> ' +this.s1.provinciaSLOption?.[0]?.region);

        obj.setInfoLegal = {
            firstName: this.s1.nameRL,lastName: this.s1.surnameRL,fiscalCode: this.s1.fiscalCodeRL,email: this.s1.emailRL,mobilePhone: this.s1.mobileRL,phone:this.s1.phoneRL,
            fax:this.s1.faxRL,pec:this.s1.pecRL,docType: this.s6.tipoDocumento,docNumber: this.s6.numeroDocumento,docIssueDate:this.s6.dataEmissioneDocumento,docExpiration:this.s6.dataScadenzaDocumento,docIssuedBy: this.s6.enteRilascioDocumento,refAmmDiversoLeg: this.s1.checkboxRA,refPVDiversoLeg:this.s2.checkboxRLPV,refTermDiversoLeg:this.s2.checkboxRLPV
        };
        obj.setInfoAmm = {
            firstName: this.s1.nameRA,lastName:this.s1.surnameRA,fiscalCode:this.s1.fiscalCodeRA,email:this.s1.emailRA,mobilePhone:this.s1.mobileRA,phone:this.s1.phoneRA,fax:this.s1.faxRA,pec:this.s1.pecRA
        };
        obj.setInfoLoc = {
            firstName: this.s2.nameRLPV,lastName:this.s2.surnameRLPV,email:this.s2.emailRLPV,phone:this.s2.phoneRLPV
        };
        obj.setInfoPos = {
            firstName: this.s3.referenteName,lastName:this.s3.referenteSurname,email:this.s3.referenteEmail,phone:this.s3.referentePhone
        };
        obj.setInfoIban = {
            bankName:this.s5.bankName,iban:this.s5.iban
        };
        obj.setInfoHours = {
            mondayMorning: this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            mondayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            tuesdayMorning:this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            tuesdayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            wednesdayMorning: this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            wednesdayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            thursdayMorning: this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            thursdayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            fridayMorning: this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            fridayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            saturdayMorning: this.s2.daOraFeriale+'-'+this.s2.aOraFeriale,
            saturdayAfternoon: this.s2.daOraFerialeChiusura+'-'+this.s2.aOraFerialeChiusura,
            sundayMorning: this.s2.daOraDomenica+'-'+this.s2.aOraDomenica,
            sundayAfternoon: this.s2.daOraDomenicaChiusura+'-'+this.s2.aOraDomenicaChiusura,
            holidayMorning: this.s2.daOraFestivi+'-'+this.s2.aOraFestivi,
            holidayAfternoon: this.s2.daOraFestiviChiusura+'-'+this.s2.aOraFestiviChiusura,
            closeLunedi: this.s2.chiusuraLunedi,
            closeMartedi: this.s2.chiusuraMartedi,
            closeMarcoledi: this.s2.chiusuraMercoledi,
            closeGiovedi: this.s2.chiusuraGiovedi,
            closeVenerdi: this.s2.chiusuraVenerdi,
            closeSabato: this.s2.chiusuraSabato,
            closeDomenica: this.s2.chiusuraDomenica
        };


        var closeDate1 = null;
        var closeDate2 = null;
        var closingDates = [this.s2.chiusuraLunedi,this.s2.chiusuraMartedi,this.s2.chiusuraMercoledi,this.s2.chiusuraGiovedi,this.s2.chiusuraVenerdi,this.s2.chiusuraSabato,this.s2.chiusuraDomenica];
        var datesFound = 0;

        for(var i = 0 ; i < closingDates.length ; i++){
            if(closingDates[i] && datesFound < 2){
                if(datesFound == 0){
                    if(i==0) closeDate1 = 'Lunedì'
                    else if(i==1) closeDate1 = 'Martedì'
                    else if(i==2) closeDate1 = 'Mercoledì'
                    else if(i==3) closeDate1 = 'Giovedì'
                    else if(i==4) closeDate1 = 'Venerdì'
                    else if(i==5) closeDate1 = 'Sabato'
                    else closeDate1 = 'Domenica'
                }
                else{
                    if(i==0) closeDate2 = 'Lunedì'
                    else if(i==1) closeDate2 = 'Martedì'
                    else if(i==2) closeDate2 = 'Mercoledì'
                    else if(i==3) closeDate2 = 'Giovedì'
                    else if(i==4) closeDate2 = 'Venerdì'
                    else if(i==5) closeDate2 = 'Sabato'
                    else closeDate2 = 'Domenica'
                }
                datesFound ++;
                
            }
        }

    
        console.log('TEST LD PROVINCE PV -> ' +this.s2.provinciaPV);
        console.log('TEST LD PROVINCE SL -> ' +this.s1.provinciaSL);
        

        //PV 1
        if(this.s2.checkboxIPV){
            obj.setInfoPuntoVendita = {
                country:'Italy',province:this.s2.provinciaPVOption?.[0]?.value,openingDate: null,street: (this.s2.viaPV != null) ? (this.s2.viaPV.replace('VIA ','') + ', '+ this.s2.civicoPV) : '',vat:this.s1.piva,postalCode:this.s2.postalcodePV,insegna:this.s2.insegnaPuntoVendita,cityCode:this.s2.comunePV,commercialLicense:this.s1.licenza_commerciale,countryCode: '086',regionCode: this.s2.provinciaPVOption?.[0]?.region,provinceCode: this.s2.provinciaPV,
                streetCode: this.s2.viaPVOption?.[0]?.code,region: this.s2.viaPVOption?.[0]?.region,streetNumber: this.s2.civicoPV,streetNumericNumber:this.s2.civicoPVnr,toponym:this.s2.viaPVOption?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV,noteAddress: this.s2.noteIndirizzoPV,closeDate1:closeDate1,closeDate2:closeDate2, city: this.s2.comunePVOption?.[0]?.value
            };
            obj.setInfoPuntoVenditaOppStore = {
                city: this.s2.comunePVOption?.[0]?.value,country:'Italy',province:this.s2.provinciaPVOption?.[0]?.value,street:(this.s2.viaPV != null) ? this.s2.viaPV.replace('VIA ','') + ', '+ this.s2.civicoPV: '',postalCode:this.s2.postalcodePV,insegna:this.s2.insegnaPuntoVendita,cityCode:this.s2.comunePV,commercialLicense:this.s1.licenza_commerciale,commercialLicenseDesc: this.s1.licenzaCommercialeOption?.[0]?.value,
                countryCode: '086',regionCode: this.s2.provinciaPVOption?.[0]?.region,provinceCode:this.s2.provinciaPV,streetNumber:this.s2.civicoPV,streetNumericNumber:this.s2.civicoPVnr,toponym:this.s2.viaPVOption?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV,
                streetCode: this.s2.viaPVOption?.[0]?.code, noteAddress:this.s2.noteIndirizzoPV,flagInstallation:(this.s3.siCassaIntegrata == false),flagTerzi:this.s4.xposDiTerzi
            };
        }
        else{
            obj.setInfoPuntoVendita = {
                country: 'Italy',province: this.s1.provinciaSLOption?.[0]?.value,openingDate:'',street: (this.s1.viaSL != null) ? (this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL) : '',vat:this.s1.piva,postalCode:this.s1.postalcodeSL,insegna: this.s2.insegnaPuntoVendita,cityCode: this.s1.comuneSL,commercialLicense:this.s1.licenza_commerciale,countryCode: '086',regionCode: this.s1.provinciaSLOption?.[0]?.region,provinceCode: this.s1.provinciaSL,
                streetCode: this.s1.viaSLOption?.[0]?.code, streetNumber: this.s1.civicoSL,streetNumericNumber: this.s1.civicoSLnr,toponym: this.s1.viaSLOption?.[0]?.toponym,region: this.s1.viaSLOption?.[0]?.region,hamlet:this.s1.frazioneSLOption?.[0]?.value,hamletCode: this.s1.frazioneSLOption?.[0]?.key,noteAddress:this.s1.noteIndirizzoSL,closeDate1: closeDate1,closeDate2:closeDate2, city: this.s1.comuneSLOption?.[0]?.value
            };
            obj.setInfoPuntoVenditaOppStore = {
                city: this.s1.comuneSLOption?.[0]?.value,country:'Italy',province:this.s1.provinciaSLOption?.[0]?.value,street:(this.s1.viaSL != null) ? this.s1.viaSL.replace('VIA ','') + ', '+ this.s1.civicoSL: '',postalCode:this.s1.postalcodeSL,insegna:this.s2.insegnaPuntoVendita,cityCode:this.s1.comuneSL,commercialLicense:this.s1.licenza_commerciale,commercialLicenseDesc: this.s1.licenzaCommercialeOption?.[0]?.value,
                countryCode: '086',regionCode: this.s1.provinciaSLOption?.[0]?.region,provinceCode:this.s1.provinciaSL,streetNumber:this.s1.civicoSL,streetNumericNumber:this.s1.civicoSLnr,toponym:this.s1.viaSLOption?.[0]?.toponym,hamlet:this.s1.frazioneSLOption?.[0]?.value,hamletCode:this.s1.frazioneSLOption?.[0]?.key,
                streetCode: this.s1.viaSLOption?.[0]?.code, noteAddress:this.s1.noteIndirizzoSL,flagInstallation: (this.s3.siCassaIntegrata == false),flagTerzi:this.s4.xposDiTerzi
            };
        }
        if(this.s2.isCambioGestione){
            obj.setInfoChangeManagement1 = {
                //toponym:this.s2.viaPVOption?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV != null) ? (this.s2.viaPV.replace('VIA ','') + ', '+ this.s2.civicoPV) : '',streetNumber:this.s2.civicoPV,postalCode:this.s2.postalcodePV,city:this.s2.comunePVOption?.[0]?.value,province:this.s2.provinciaPVOption?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG
                toponym:this.s2.viaPVOption?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV != null) ? (this.s2.viaPV.substring(this.s2.viaPV.indexOf(" ") + 1) + ', '+ this.s2.civicoPV) : '',streetNumber:this.s2.civicoPV,postalCode:this.s2.postalcodePV,city:this.s2.comunePVOption?.[0]?.value,province:this.s2.provinciaPVOption?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG
            };
        }

        //PV 2
        if(this.s2.checkboxOtherPV){
            obj.setInfoPuntoVendita2 = {
                country:'Italy',province:this.s2.provinciaPV2Option?.[0]?.value,openingDate: null,street: (this.s2.viaPV2 != null) ? (this.s2.viaPV2.replace('VIA ','') + ', '+ this.s2.civicoPV2) : '',vat:this.s1.piva,postalCode:this.s2.postalcodePV2,insegna:this.s2.insegnaPuntoVendita2,cityCode:this.s2.comunePV2,commercialLicense:this.s2.categoriaPV2,countryCode: '086',regionCode: this.s2.provinciaPV2Option?.[0]?.region,provinceCode: this.s2.provinciaPV2,
                streetCode: this.s2.viaPV2Option?.[0]?.code, region: this.s2.viaPV2Option?.[0]?.region, streetNumber: this.s2.civicoPV2,streetNumericNumber:this.s2.civicoPV2nr,toponym:this.s2.viaPV2Option?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV2,noteAddress: this.s2.noteIndirizzoPV2,closeDate1:closeDate1,closeDate2:closeDate2, city: this.s2.comunePV2Option?.[0]?.value
            };
            obj.setInfoPuntoVenditaOppStore2 = {
                city: this.s2.comunePV2Option?.[0]?.value,country:'Italy',province:this.s2.provinciaPV2Option?.[0]?.value,street:(this.s2.viaPV2 != null) ? this.s2.viaPV2.replace('VIA ','') + ', '+ this.s2.civicoPV2: '',postalCode:this.s2.postalcodePV2,insegna:this.s2.insegnaPuntoVendita2,cityCode:this.s2.comunePV2,commercialLicense:this.s2.categoriaPV2,commercialLicenseDesc: this.s1.licenzaCommercialeOption?.[0]?.value,
                countryCode: '086',regionCode: this.s2.provinciaPV2Option?.[0]?.region,provinceCode:this.s2.provinciaPV2,streetNumber:this.s2.civicoPV2,streetNumericNumber:this.s2.civicoPV2nr,toponym:this.s2.viaPV2Option?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV2,
                streetCode: this.s2.viaPV2Option?.[0]?.code, noteAddress:this.s2.noteIndirizzoPV2,flagInstallation:(this.s3.siCassaIntegrata == false),flagTerzi:this.s4.xposDiTerzi
            };
        }
        if(this.s2.isCambioGestione2){
            obj.setInfoChangeManagement2 = {
                //toponym:this.s2.viaPV2Option?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV2 != null) ? (this.s2.viaPV2.replace('VIA ','') + ', '+ this.s2.civicoPV2) : '',streetNumber:this.s2.civicoPV2,postalCode:this.s2.postalcodePV2,city:this.s2.comunePV2Option?.[0]?.value,province:this.s2.provinciaPV2Option?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG2
                toponym:this.s2.viaPV2Option?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV2 != null) ? (this.s2.viaPV2.substring(this.s2.viaPV2.indexOf(" ") + 1) + ', '+ this.s2.civicoPV2) : '',streetNumber:this.s2.civicoPV2,postalCode:this.s2.postalcodePV2,city:this.s2.comunePV2Option?.[0]?.value,province:this.s2.provinciaPV2Option?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG2
            };
        }

        obj.documents = {
            cartaIdentità: this.s6.documento, visura: this.s6.visura, attoSubentro1: this.s2.attoSubentroFileCG, attoSubentro2: this.s2.attoSubentroFileCG2, attoSubentro3: this.s2.attoSubentroFileCG3, licenza: this.s6.scontrino
        }


        //PV 3
        if(!this.s2.newPV){
            obj.setInfoPuntoVendita3 = {
                country:'Italy',province:this.s2.provinciaPV3Option?.[0]?.value,openingDate: null,street: (this.s2.viaPV3 != null) ? (this.s2.viaPV3.replace('VIA ','') + ', '+ this.s2.civicoPV3) : '',vat:this.s1.piva,postalCode:this.s2.postalcodePV3,insegna:this.s2.insegnaPuntoVendita3,cityCode:this.s2.comunePV3,commercialLicense:this.s2.categoriaPV3,countryCode: '086',regionCode: this.s2.provinciaPV3Option?.[0]?.region,provinceCode: this.s2.provinciaPV3,
                streetCode: this.s2.viaPV3Option?.[0]?.code, streetNumber: this.s2.civicoPV3,streetNumericNumber:this.s2.civicoPV3nr,toponym:this.s2.viaPV3Option?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV3,noteAddress: this.s2.noteIndirizzoPV3,closeDate1:closeDate1,closeDate2:closeDate2, city: this.s2.comunePV3Option?.[0]?.value
            };
            obj.setInfoPuntoVenditaOppStore3 = {
                city: this.s2.comunePV3Option?.[0]?.value,country:'Italy',province:this.s2.provinciaPV3Option?.[0]?.value,street:(this.s2.viaPV3 != null) ? this.s2.viaPV3.replace('VIA ','') + ', '+ this.s2.civicoPV3: '',postalCode:this.s2.postalcodePV3,insegna:this.s2.insegnaPuntoVendita3,cityCode:this.s2.comunePV3,commercialLicense:this.s2.categoriaPV3,commercialLicenseDesc: this.s1.licenzaCommercialeOption?.[0]?.value,
                countryCode: '086',regionCode: this.s2.provinciaPV3Option?.[0]?.region,provinceCode:this.s2.provinciaPV3,streetNumber:this.s2.civicoPV3,streetNumericNumber:this.s2.civicoPV3nr,toponym:this.s2.viaPV3Option?.[0]?.toponym,hamlet:'',hamletCode:this.s2.frazionePV3,
                streetCode: this.s2.viaPV3Option?.[0]?.code, noteAddress:this.s2.noteIndirizzoPV3,flagInstallation:(this.s3.siCassaIntegrata == false),flagTerzi:this.s4.xposDiTerzi
            };
        }
        if(this.s2.isCambioGestione3){
            obj.setInfoChangeManagement3 = {
                //toponym:this.s2.viaPV3Option?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV3 != null) ? (this.s2.viaPV3.replace('VIA ','') + ', '+ this.s2.civicoPV3) : '',streetNumber:this.s2.civicoPV3,postalCode:this.s2.postalcodePV3,city:this.s2.comunePV3Option?.[0]?.value,province:this.s2.provinciaPV3Option?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG3
                toponym:this.s2.viaPV3Option?.[0]?.toponym?.replace(' ',''),street:(this.s2.viaPV3 != null) ? (this.s2.viaPV3.substring(this.s2.viaPV3.indexOf(" ") + 1) + ', '+ this.s2.civicoPV3) : '',streetNumber:this.s2.civicoPV3,postalCode:this.s2.postalcodePV3,city:this.s2.comunePV3Option?.[0]?.value,province:this.s2.provinciaPV3Option?.[0]?.province_ab,vat:this.s2.pivaPrecedenteCG3
            };
        }
        



        createObject({setInfo: obj, accountId: this.accountId}).then(result => {
            if(result == null){
                this.errorPage = true;
                this.errorTitle=this.text_options.W_Testo_KO_Title_Generic;
                this.errorMessage=this.text_options.W_Testo_KO_Message_Generic;
            }
            else{
                genAndSend({recordID: result ,generateTemplateDocumentId : 'f3efaf68-30bf-48ff-a785-324f59ef66cf',description: 'Test desc', useIDVerification : false, isEmbeddedSigning : true, username: this.s1.nameRL + ' ' +this.s1.surnameRL, email: this.s1.emailRL, setInfo: obj, contractName: this.contractname}).then((envelopeId) =>{
                    if(envelopeId==null){
                        this.errorPage = true;
                        this.errorTitle=this.text_options.W_Testo_KO_Title_Generic;
                        this.errorMessage=this.text_options.W_Testo_KO_Message_Generic;
                    }
                    else{
                        getEmbeddedSendingUrl({envId: envelopeId,url: window.location.href,username: this.s1.nameRL + ' ' +this.s1.surnameRL, email: this.s1.emailRL, contractName: this.contractname}).then(signingUrl => {
                            if(signingUrl==null){
                                this.errorPage = true;
                                this.errorTitle=this.text_options.W_Testo_KO_Title_Generic;
                                this.errorMessage=this.text_options.W_Testo_KO_Message_Generic;
                            }
                            else{
                                window.location.href = signingUrl;
                            }
                            
                            
                        }).catch(error => {
                            console.log('Error:');
                            console.log(error);
                        })
                    }
                    
    
                }); 
            }
        }).catch(error => {
            console.log('ERROR ->' + JSON.stringify(error));
        });


    }

    changeCassaIntegrata(event){}

}


        // console.log('***hasError ' +
        //  this.s1.comuneSLOption?.[0]?.value +'*'+ 
        //  this.s1.postalcodeSL +'*'+ 
        //  this.s1.provinciaSLOption?.[0]?.value +'*'+ 
        //  this.s1.viaSL.replace('VIA ','') + ','+ this.s1.civicoSL +'*'+ 
        //  this.s1.comuneSL +'*'+ 
        //  this.s1.viaSLOption?.[0]?.region +'*'+ 
        //  this.s1.provinciaSLOption?.[0]?.region +'*'+
        //  this.s1.provinciaSL +'*'+ 
        //  this.s1.viaSLOption?.[0]?.code +'*'+ 
        //  this.s1.civicoSL +'*'+ 
        //  this.s1.civicoSL +'*'+ 
        //  this.s1.viaSLOption?.[0]?.toponym +'*'+ 
        //  this.s1.noteIndirizzoSL +'*'+ 
        //  this.s1.frazioneSLOption?.[0]?.value +'*'+ 
        //  this.s1.frazioneSLOption?.[0]?.key +'*'+
        //  this.s1.codiceFiscaleEC +'*'+ 
        //  this.s1.ragioneSocialeEC +'*'+
        //  this.s1.checkboxSA +'*'+ 
        //  this.s1.checkboxRA +'*'+ 
        //  this.s2.checkboxRLPV +'*'+ 
        //  this.s2.checkboxRLPV +'*'+ 
        //  this.s2.checkboxOtherPV +'*'+ 
        //  this.s2.newPV +'*'+ 
        //  this.s2.isCambioGestione +'*'+
        //  this.s2.isCambioGestione2  +'*'+ 
        //  this.s2.isCambioGestione3 +'*'+ 
        //  this.s2.dataSubentroCG +'*'+ 
        //  this.s2.dataSubentroCG2 +'*'+ 
        //  this.s2.dataSubentroCG3
        //  );