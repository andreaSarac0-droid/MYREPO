import { LightningElement, track, api } from 'lwc';
import checkAddress from '@salesforce/apex/APIT121_SelfAffiliation.checkAddress';
import retrieveProvince from '@salesforce/apex/APIT121_SelfAffiliation.retrieveProvince';
import retrieveCity from '@salesforce/apex/APIT121_SelfAffiliation.retrieveCity';
import retrieveHamlet from '@salesforce/apex/APIT121_SelfAffiliation.retrieveHamlet';
import getStreetSuggestions from '@salesforce/apex/APIT121_SelfAffiliation.getStreetSuggestions';
import retrieveAvailableLicense from '@salesforce/apex/APIT121_SelfAffiliation.retrieveAvailableLicense';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';
import retrievePostalCode from '@salesforce/apex/APIT121_SelfAffiliation.retrievePostalCode';


export default class LWCIT16_SelfAffiliationStandardStep2 extends LightningElement {

    @api button_options;
    @api text_options;
    @api input_options;

    @api contract_type;

    @track variables = {
        isModalCambioGestioneOpen: false, 
        checkboxLessThan3PV: true, 
        checkboxMoreThan3PV: false, 
        checkboxOtherPV : false, 
        checkboxNoOtherPV: true,
        newPV: true,
        isCambioGestioneSaved3: true,
        isCambioGestioneSaved2: true,
        isCambioGestioneSaved: true
    };

    province = [{label:'',value:''}];
    comuniPV = [{label:'',value:''}];
    comuniPV2 = [{label:'',value:''}];
    comuniPV3 = [{label:'',value:''}];
    frazioniPV = [{label:'',value:''}];
    frazioniPV2 = [{label:'',value:''}];
    frazioniPV3 = [{label:'',value:''}];
    
    @track error = false;
    @track errorTitle;
    @track errorMessage;

    @track availableLicense = [];

    orari = [
        {key: '00', value: '00'},
        {key: '01', value: '01'},
        {key: '02', value: '02'},
        {key: '03', value: '03'},
        {key: '04', value: '04'},
        {key: '05', value: '05'},
        {key: '06', value: '06'},
        {key: '07', value: '07'},
        {key: '08', value: '08'},
        {key: '09', value: '09'},
        {key: '10', value: '10'},
        {key: '11', value: '11'},
        {key: '12', value: '12'},
        {key: '13', value: '13'},
        {key: '14', value: '14'},
        {key: '15', value: '15'},
        {key: '16', value: '16'},
        {key: '17', value: '17'},
        {key: '18', value: '18'},
        {key: '19', value: '19'},
        {key: '20', value: '20'},
        {key: '21', value: '21'},
        {key: '22', value: '22'},
        {key: '23', value: '23'},
        {key: '24', value: '24'},
    ] 



    get disabledComunePV(){return this.variables.provinciaPV == null || this.variables.provinciaPV == ''}
    get disabledViaPV(){return this.variables.comunePV == null || this.variables.comunePV == ''}
    get disabledFrazionePV(){return this.variables.viaPVSelected == null || this.variables.viaPVSelected == ''}
    indirizzoPvCompleted(){return !this.disabledFrazionePV && !this.disabledViaPV && !this.disabledComunePV && this.variables.civicoPV != null}

    get disabledComunePV2(){return this.variables.provinciaPV2 == null || this.variables.provinciaPV2 == ''}
    get disabledViaPV2(){return this.variables.comunePV2 == null || this.variables.comunePV2 == ''}
    get disabledFrazionePV2(){return this.variables.viaPV2Selected == null || this.variables.viaPV2Selected == ''}
    indirizzoPvCompleted2(){return !this.disabledFrazionePV2 && !this.disabledViaPV2 && !this.disabledComunePV2 && this.variables.civicoPV2 != null}

    get disabledComunePV3(){return this.variables.provinciaPV3 == null || this.variables.provinciaPV3 == ''}
    get disabledViaPV3(){return this.variables.comunePV3 == null || this.variables.comunePV3 == ''}
    get disabledFrazionePV3(){return this.variables.viaPV3Selected == null || this.variables.viaPV3Selected == ''}
    indirizzoPvCompleted3(){return !this.disabledFrazionePV3 && !this.disabledViaPV3 && !this.disabledComunePV3 && this.variables.civicoPV3 != null}


    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
        retrieveProvince({}).then(result2 => {
            var provinceResult = JSON.parse(result2);
            for(var i = 0 ; i < provinceResult.data.length ; i++){
                this.province.push({value: provinceResult.data[i].name, key: provinceResult.data[i].province_ref, region: provinceResult.data[i].region_ref, province_ab: provinceResult.data[i].abbreviation});
            }
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error)); this.error = true; this.errorTitle=this.text_options.W_Testo_KO_Title_Generic; this.errorMessage=this.text_options.W_Testo_KO_Message_Generic;});
        retrieveAvailableLicense({contractName :this.contract_type}).then(result => {
            var i = 0;
            for(var elem in result){
                if(i==0){
                    this.variables.categoriaPV2 = elem;
                    this.variables.categoriaPV3 = elem;
                }
                this.availableLicense.push({key: elem, value: result[elem]});
                i++;
            }
        });
    }

    goToStep3(){
        if(this.checkMandatoryFields()){
            let ev = new CustomEvent('gotostep3',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);  
        }
        else alert('Completa tutti i campi obbligatori prima di procedere !');
    }

    goToStep1(){
        let ev = new CustomEvent('gotostep1', {});
        this.dispatchEvent(ev);  
    }

    uploadFileCG(event) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.attoSubentroFileCG = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    uploadFileCG2 (event) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.attoSubentroFileCG2 = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    uploadFileCG3(event){
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.attoSubentroFileCG3 = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    saveCambioGestione(){
        this.variables.isCambioGestioneSaved = true;
    }

    saveCambioGestione2(){
        this.variables.isCambioGestioneSaved2 = true;
    }

    saveCambioGestione3(){
        this.variables.isCambioGestioneSaved3 = true;
    }

    openThirdPV(){
        this.variables.newPV = false;
    }

    handleChangeProvinciaPV(event){
        this.variables.provinciaPV = event.detail.value;
        this.variables.provinciaPVOption = this.province.filter(word => word.key == event.detail.value);
        this.variables.viaSPV = null;
        this.variables.postalcodePV = null;
        this.variables.viaPVSelected = null;
        this.variables.civicoPV = null;
        this.showSpinner = true;
        retrieveCity({provinceRef : this.variables.provinciaPV, cityPattern: ''}).then(result => {
            var comuniResult = JSON.parse(result);
            this.comuniPV = [{label:'',value:''}];
            for(var i = 0 ; i < comuniResult.data.length ; i++){
                this.comuniPV.push({value: comuniResult.data[i].name, key: comuniResult.data[i].municipality_ref});
            }
            this.variables.comunePV = '';
            this.template.querySelector('.comuniPV').setValue(this.variables.comunePV);
            this.variables.frazionePV = '';
            this.template.querySelector('.frazioniPV').setValue(this.variables.frazionePV);
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeProvinciaPV2(event){
        this.variables.provinciaPV2 = event.detail.value;
        this.variables.provinciaPV2Option = this.province.filter(word => word.key == event.detail.value);
        this.variables.viaSPV2 = null;
        this.variables.postalcodePV2 = null;
        this.variables.viaPV2Selected = null;
        this.variables.civicoPV2 = null;
        this.showSpinner = true;
        retrieveCity({provinceRef : this.variables.provinciaPV2, cityPattern: ''}).then(result => {
            var comuniResult = JSON.parse(result);
            this.comuniPV2 = [{label:'',value:''}];
            for(var i = 0 ; i < comuniResult.data.length ; i++){
                this.comuniPV2.push({value: comuniResult.data[i].name, key: comuniResult.data[i].municipality_ref});
            }
            this.variables.comunePV2 = '';
            this.template.querySelector('.comuniPV2').setValue(this.variables.comunePV2);
            this.variables.frazionePV2 = '';
            this.template.querySelector('.frazioniPV2').setValue(this.variables.frazionePV2);
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeProvinciaPV3(event){
        this.variables.provinciaPV3 = event.detail.value;
        this.variables.provinciaPV3Option = this.province.filter(word => word.key == event.detail.value);
        this.variables.viaSPV3 = null;
        this.variables.postalcodePV3 = null;
        this.variables.viaPV3Selected = null;
        this.variables.civicoPV3 = null;
        this.showSpinner = true;
        retrieveCity({provinceRef : this.variables.provinciaPV3, cityPattern: ''}).then(result => {
            var comuniResult = JSON.parse(result);
            this.comuniPV3 = [{label:'',value:''}];
            for(var i = 0 ; i < comuniResult.data.length ; i++){
                this.comuniPV3.push({value: comuniResult.data[i].name, key: comuniResult.data[i].municipality_ref});
            }
            this.variables.comunePV3 = '';
            this.template.querySelector('.comuniPV3').setValue(this.variables.comunePV3);
            this.variables.frazionePV3 = '';
            this.template.querySelector('.frazioniPV3').setValue(this.variables.frazionePV3);
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeComunePV(event){
        this.variables.comunePV = event.detail.value;
        this.variables.comunePVOption = this.comuniPV.filter(word => word.key == event.detail.value);
        this.variables.viaPV = null;
        this.variables.postalcodePV = null;
        this.variables.viaPVSelected = null;
        this.variables.civicoPV = null;
        this.showSpinner = true;
        retrieveHamlet({municipRef : this.variables.comunePV}).then(result => {
            var frazioniResult = JSON.parse(result);
            this.frazioniPV = [{label:'',value:''}];
            for(var i = 0 ; i < frazioniResult.data.length ; i++){
                this.frazioniPV.push({value: frazioniResult.data[i].name, key: frazioniResult.data[i].hamlet_ref});
            }
            this.variables.frazionePV = '';
            this.template.querySelector('.frazioniPV').setValue(this.variables.frazionePV);
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeComunePV2(event){
        this.variables.comunePV2 = event.detail.value;
        this.variables.comunePV2Option = this.comuniPV2.filter(word => word.key == event.detail.value);
        this.variables.viaPV2 = null;
        this.variables.postalcodePV2 = null;
        this.variables.viaPV2Selected = null;
        this.showSpinner = true;
        this.variables.civicoPV2 = null;
        retrieveHamlet({municipRef : this.variables.comunePV2}).then(result => {
            var frazioniResult = JSON.parse(result);
            this.frazioniPV2 = [{label:'',value:''}];
            for(var i = 0 ; i < frazioniResult.data.length ; i++){
                this.frazioniPV2.push({value: frazioniResult.data[i].name, key: frazioniResult.data[i].hamlet_ref});
            }
            this.variables.frazionePV2= '';
            this.template.querySelector('.frazioniPV2').setValue(this.variables.frazionePV2);
            this.showSpinner = false;
        }).catch(error => {cconsole.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeComunePV3(event){
        this.variables.comunePV3 = event.detail.value;
        this.variables.comunePV3Option = this.comuniPV3.filter(word => word.key == event.detail.value);
        this.variables.viaPV3 = null;
        this.variables.postalcodePV3 = null;
        this.variables.viaPV3Selected = null;
        this.variables.civicoPV3 = null;
        this.showSpinner = true;
        retrieveHamlet({municipRef : this.variables.comunePV3}).then(result => {
            var frazioniResult = JSON.parse(result);
            this.frazioniPV3 = [{label:'',value:''}];
            for(var i = 0 ; i < frazioniResult.data.length ; i++){
                this.frazioniPV3.push({value: frazioniResult.data[i].name, key: frazioniResult.data[i].hamlet_ref});
            }
            this.variables.frazionePV3 = '';
            this.template.querySelector('.frazioniPV3').setValue(this.variables.frazionePV3);
            this.showSpinner = false;
        }).catch(error => {console.log('ERROR -> '+ JSON.stringify(error));});
    }

    handleChangeViaPV(event){
        this.variables.civicoPV = null;
        this.variables.viaPV = event.detail.value;
        this.variables.viaListPV = [];
        var autocompleteRequest = {"address" : this.variables.viaPV, "town" : this.variables.comunePVOption[0].value , "province" : this.variables.provinciaPVOption[0].value, "region" : "null"}
        getStreetSuggestions({calloutJson: JSON.stringify(autocompleteRequest)}).then(result => {
            var response = JSON.parse(result);
            var streets = response.data;
            var returnMap = [];

            for(var i = 0 ; i < streets.length ; i++){
                var realTopo = streets[i].toponym;
                var realAddress = '';
                var old_town = '';
                if(streets[i].toponym != null)realAddress = streets[i].completed_address;
                else realAddress = streets[i].completed_address;
                if(streets[i].old_town != null) realAddress += ' ('+streets[i].old_town+') ';
                returnMap.push({'key' : streets[i].address_ref , 'value' : realAddress , 'toponym' : streets[i].toponym, 'postal_code': streets[i].post_code, 'region': streets[i].region, 'code': streets[i].address_ref}); 
            }

            if(returnMap.length == 0) this.variables.viaListPV = null;
            else this.variables.viaListPV = returnMap;
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
        });
    }

    handleChangeViaPV2(event){
        this.variables.civicoPV2= null;
        this.variables.viaPV2 = event.detail.value;
        this.variables.viaListPV2 = [];
        var autocompleteRequest = {"address" : this.variables.viaPV2, "town" : this.variables.comunePV2Option[0].value , "province" : this.variables.provinciaPV2Option[0].value, "region" : "null"}
        getStreetSuggestions({calloutJson: JSON.stringify(autocompleteRequest)}).then(result => {
            var response = JSON.parse(result);
            var streets = response.data;
            var returnMap = [];

            for(var i = 0 ; i < streets.length ; i++){
                var realTopo = streets[i].toponym;
                var realAddress = '';
                var old_town = '';
                if(streets[i].toponym != null)realAddress = streets[i].completed_address;
                else realAddress = streets[i].completed_address;
                if(streets[i].old_town != null) realAddress += ' ('+streets[i].old_town+') ';
                returnMap.push({'key' : streets[i].address_ref , 'value' : realAddress , 'toponym' : streets[i].toponym, 'postal_code': streets[i].post_code, 'region': streets[i].region, 'code': streets[i].address_ref}); 
            }

            if(returnMap.length == 0) this.variables.viaListPV2 = null;
            else this.variables.viaListPV2 = returnMap;
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
        });
    }

    handleChangeViaPV3(event){
        this.variables.civicoPV3 = null;
        this.variables.viaPV3 = event.detail.value;
        this.variables.viaListPV3 = [];
        var autocompleteRequest = {"address" : this.variables.viaPV3, "town" : this.variables.comunePV3Option[0].value , "province" : this.variables.provinciaPV3Option[0].value, "region" : "null"}
        getStreetSuggestions({calloutJson: JSON.stringify(autocompleteRequest)}).then(result => {
            var response = JSON.parse(result);
            var streets = response.data;
            var returnMap = [];

            for(var i = 0 ; i < streets.length ; i++){
                var realTopo = streets[i].toponym;
                var realAddress = '';
                var old_town = '';
                if(streets[i].toponym != null)realAddress = streets[i].completed_address;
                else realAddress = streets[i].completed_address;
                if(streets[i].old_town != null) realAddress += ' ('+streets[i].old_town+') ';
                returnMap.push({'key' : streets[i].address_ref , 'value' : realAddress , 'toponym' : streets[i].toponym, 'postal_code': streets[i].post_code, 'region': streets[i].region, 'code': streets[i].address_ref}); 
            }

            if(returnMap.length == 0) this.variables.viaListPV3 = null;
            else this.variables.viaListPV3 = returnMap;
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
        });
    }

    selectViaPV(event){
        this.variables.viaPV = event.currentTarget.dataset.name;
        //this.variables.postalcodePV = event.currentTarget.dataset.postal;
        this.variables.viaPVSelected = event.currentTarget.dataset.name;
        this.variables.viaPVTypo = event.currentTarget.dataset.title;
        this.variables.viaPVOption = this.variables.viaListPV.filter(word => word.value == this.variables.viaPV);
        this.variables.viaListPV = null;
        this.variables.civicoPV = null;
    }

    selectViaPV2(event){
        this.variables.viaPV2 = event.currentTarget.dataset.name;
        //this.variables.postalcodePV2 = event.currentTarget.dataset.postal;
        this.variables.viaPV2Selected = event.currentTarget.dataset.name;
        this.variables.viaPV2Typo = event.currentTarget.dataset.title;
        this.variables.viaPV2Option = this.variables.viaListPV2.filter(word => word.value == this.variables.viaPV2);
        this.variables.viaListPV2 = null;
        this.variables.civicoPV2 = null;
    }

    selectViaPV3(event){
        this.variables.viaPV3 = event.currentTarget.dataset.name;
        //this.variables.postalcodePV3 = event.currentTarget.dataset.postal;
        this.variables.viaPV3Selected = event.currentTarget.dataset.name;
        this.variables.viaPV3Typo = event.currentTarget.dataset.title;
        this.variables.viaPV3Option = this.variables.viaListPV3.filter(word => word.value == this.variables.viaPV3);
        this.variables.viaListPV3 = null;
        this.variables.civicoPV3 = null;
    }

    handleChangeCivicoPV(event){
        this.variables.civicoPV = event.detail.value;
        if(this.variables.civicoPV != null && this.variables.civicoPV != ''){
            retrievePostalCode({address: this.variables.viaPV, municipality_ref: this.variables.comunePV, province_ref: this.variables.provinciaPV, region_ref: this.variables.provinciaPVOption?.[0]?.region, street_ref: this.variables.viaPVOption?.[0]?.code, street_number: this.variables.civicoPV}).then(result => {
                this.variables.postalcodePV = result.post_code;
                if(this.variables.civicoPV == 'SNC'){
                    this.variables.civicoPVnr = '0';
                }else{
                    this.variables.civicoPVnr = result.street_number;
                }
                if(this.indirizzoPvCompleted()){
                    checkAddress({street: this.variables.viaPV, toponym: this.variables.viaPVTypo, streetNumber: this.variables.civicoPV, postalCode: this.variables.postalcodePV, city: this.variables.comunePVOption[0].value, province : this.variables.provinciaPVOption[0].value}).then(result => {
                        if(!result) {
                            this.variables.isModalCambioGestioneOpen = true;
                            this.variables.isCambioGestione = false;
                        }
                        else {
                            this.variables.isModalCambioGestioneOpen = false;
                            this.variables.isCambioGestione = false;
                        }
                    });
                }
            }).catch(error => {
                alert('Il civico inserito non risulta essere valido');
                this.variables.civicoPV = null;
                console.log(JSON.stringify(error));
            });
        }
        else this.variables.postalcodePV = null;
    }

    handleChangeCivicoPV2(event){
        this.variables.civicoPV2 = event.detail.value;
        if(this.variables.civicoPV2 != null && this.variables.civicoPV2 != ''){
            retrievePostalCode({address: this.variables.viaPV2, municipality_ref: this.variables.comunePV2, province_ref: this.variables.provinciaPV2, region_ref: this.variables.provinciaPV2Option?.[0]?.region, street_ref: this.variables.viaPV2Option?.[0]?.code, street_number: this.variables.civicoPV2}).then(result => {
                this.variables.postalcodePV2 = result.post_code;
                if(this.variables.civicoPV2 == 'SNC'){
                    this.variables.civicoPV2nr = '0';
                }else{
                    this.variables.civicoPV2nr = result.street_number;
                }
                if(this.indirizzoPvCompleted2()){
                    checkAddress({street: this.variables.viaPV2, toponym: this.variables.viaPV2Typo, streetNumber: this.variables.civicoPV2, postalCode: this.variables.postalcodePV2, city: this.variables.comunePV2Option[0].value, province : this.variables.provinciaPV2Option[0].value}).then(result => {
                        if(!result) {
                            this.variables.isModalCambioGestioneOpen2 = true;
                            this.variables.isCambioGestione2 = false;
                        }
                        else {
                            this.variables.isModalCambioGestioneOpen2 = false;
                            this.variables.isCambioGestione2 = false;
                        }
                    });
                }
            }).catch(error => {
                alert('Il civico inserito non risulta essere valido');
                this.variables.civicoPV2 = null;
                console.log(JSON.stringify(error));
            });
        }
        else this.variables.postalcodePV2 = null;
    }

    handleChangeCivicoPV3(event){
        this.variables.civicoPV3 = event.detail.value;
        if(this.variables.civicoPV3 != null && this.variables.civicoPV3 != ''){
            retrievePostalCode({address: this.variables.viaPV3, municipality_ref: this.variables.comunePV3, province_ref: this.variables.provinciaPV3, region_ref: this.variables.provinciaPV3Option?.[0]?.region, street_ref: this.variables.viaPV3Option?.[0]?.code, street_number: this.variables.civicoPV3}).then(result => {
                this.variables.postalcodePV3 = result.post_code;
                if(this.variables.civicoPV3 == 'SNC'){
                    this.variables.civicoPV3nr = '0';
                }else{
                    this.variables.civicoPV3nr = result.street_number;
                }
                if(this.indirizzoPvCompleted3()){
                    checkAddress({street: this.variables.viaPV3, toponym: this.variables.viaPV3Typo, streetNumber: this.variables.civicoPV3, postalCode: this.variables.postalcodePV3, city: this.variables.comunePV3Option[0].value, province : this.variables.provinciaPV3Option[0].value}).then(result => {
                        if(!result) {
                            this.variables.isModalCambioGestioneOpen3 = true;
                            this.variables.isCambioGestione3 = false;
                        }
                        else {
                            this.variables.isModalCambioGestioneOpen3 = false;
                            this.variables.isCambioGestione3 = false;
                        }
                    });
                }
            }).catch(error => {
                alert('Il civico inserito non risulta essere valido');
                this.variables.civicoPV3 = null;
                console.log(JSON.stringify(error));
            });
        }
        else this.variables.postalcodePV3 = null;
    }

    closeModalCambioGestione(){
        this.variables.capPV = null;
        this.variables.viaPV = null;
        this.variables.provinciaPV = null;
        this.variables.comunePV = null;
        this.variables.civicoPV = null;
        this.variables.frazionePV = null;
        this.variables.noteIndirizzoPV = null;
        this.variables.isModalCambioGestioneOpen = false;

        this.template.querySelector('.frazioniPV').setValue('');
        this.template.querySelector('.comuniPV').setValue('');
        this.template.querySelector('.provincePV').setValue('');
        this.variables.postalcodePV = null;
        //this.error = true;
        let ev = new CustomEvent('haserror',  {});
        this.dispatchEvent(ev);  
    }

    closeModalCambioGestione2(){
        this.variables.capPV2 = null;
        this.variables.viaPV2 = null;
        this.variables.provinciaPV2 = null;
        this.variables.comunePV2 = null;
        this.variables.civicoPV2 = null;
        this.variables.frazionePV2 = null;
        this.variables.noteIndirizzoPV2 = null;
        this.variables.isModalCambioGestioneOpen2 = false;

        this.template.querySelector('.frazioniPV2').setValue('');
        this.template.querySelector('.comuniPV2').setValue('');
        this.template.querySelector('.provincePV2').setValue('');
        this.variables.postalcodePV2 = null;
        //this.error = true;
        let ev = new CustomEvent('haserror',  {});
        this.dispatchEvent(ev);  
    }

    closeModalCambioGestione3(){
        this.variables.capPV3 = null;
        this.variables.viaPV3 = null;
        this.variables.provinciaPV3 = null;
        this.variables.comunePV3 = null;
        this.variables.civicoPV3 = null;
        this.variables.frazionePV3 = null;
        this.variables.noteIndirizzoPV3 = null;
        this.variables.isModalCambioGestioneOpen3 = false;

        this.template.querySelector('.frazioniPV3').setValue('');
        this.template.querySelector('.comuniPV3').setValue('');
        this.template.querySelector('.provincePV3').setValue('');
        this.variables.postalcodePV3 = null;
        //this.error = true;
        let ev = new CustomEvent('haserror',  {});
        this.dispatchEvent(ev);  
    }

    viewCambioGestione(){
        this.variables.isCambioGestione = true;
        this.variables.isModalCambioGestioneOpen = false;
    }

    viewCambioGestione2(){
        this.variables.isCambioGestione2 = true;
        this.variables.isModalCambioGestioneOpen2 = false;
    }

    viewCambioGestione3(){
        this.variables.isCambioGestione3 = true;
        this.variables.isModalCambioGestioneOpen3 = false;
    }

    handleChangeInsegnaPuntoVendita(event){this.variables.insegnaPuntoVendita = event.detail.value;}

    handleChangeCheckboxIPV(event){this.variables.checkboxIPV = event.detail;}

    handleChangeCAPPV(event){this.variables.capPV = event.detail.value;}

    handleChangeNoteIndirizzoPV(event){this.variables.noteIndirizzoPV = event.detail.value;}

    handleChangeDataSubentroCG(event){this.variables.dataSubentroCG = event.detail.value;}

    handleChangePivaPrecedenteCG(event){this.variables.pivaPrecedenteCG = event.detail.value;}

    handleChangeCodiceLocalePrecedenteCG(event){this.variables.codiceLocalePrecedenteCG = event.detail.value;}

    handleChangeCheckboxRLPV(event){this.variables.checkboxRLPV = event.detail;}

    handleChangeNameRLPV(event){this.variables.nameRLPV = event.detail.value;}

    handleChangeSurnameRLPV(event){this.variables.surnameRLPV = event.detail.value;}

    handleChangePhoneRLPV(event){this.variables.phoneRLPV = event.detail.value;}

    handleChangeEmailRLPV(event){this.variables.emailRLPV = event.detail.value;}

    handleChangeCheckboxChiusuraLunedi(event){this.variables.chiusuraLunedi = event.detail;}

    handleChangeCheckboxChiusuraMartedi(event){this.variables.chiusuraMartedi = event.detail;}

    handleChangeCheckboxChiusuraMercoledi(event){this.variables.chiusuraMercoledi = event.detail;}

    handleChangeCheckboxChiusuraGiovedi(event){this.variables.chiusuraGiovedi = event.detail;}

    handleChangeCheckboxChiusuraVenerdi(event){this.variables.chiusuraVenerdi = event.detail;}

    handleChangeCheckboxChiusuraSabato(event){this.variables.chiusuraSabato = event.detail;}

    handleChangeCheckboxChiusuraDomenica(event){this.variables.chiusuraDomenica = event.detail;}

    handleChangeCheckboxOtherPV(event){
        this.variables.checkboxOtherPV = true;
        this.variables.checkboxNoOtherPV = false;
    }

    handleChangeCheckboxNoOtherPV(event){
        this.variables.checkboxNoOtherPV = true;
        this.variables.checkboxOtherPV = false;
    }

    handleChangeCheckboxMoreThank3PV(event){
        this.variables.checkboxMoreThan3PV = true;
        this.variables.checkboxLessThan3PV = false;
    }

    handleChangeCheckboxLessThan3PV(event){
        this.variables.checkboxMoreThan3PV = false;
        this.variables.checkboxLessThan3PV = true;
    }

    closeModalMoreThan3PVContinue(){
        this.variables.checkboxMoreThan3PV = false;
        this.variables.checkboxLessThan3PV = true;
    }

    closeModalMoreThan3PVCancel(){
        this.error = true;
        this.errorTitle= this.text_options.W_Testo_KO_Title_3_More;
        this.errorMessage= this.text_options.W_Testo_KO_Message_3_More;
        let ev = new CustomEvent('haserror',  {detail: {vars:this.variables}});
        this.dispatchEvent(ev);  
    }

    handleChangeFrazionePV(event){this.variables.frazionePV = event.detail.value;}

    handleChangeInsegnaPuntoVendita2(event){this.variables.insegnaPuntoVendita2 = event.detail.value;}

    handleChangeCAPPV2(event){this.variables.capPV2 = event.detail.value;}

    handleChangeFrazionePV2(event){this.variables.frazionePV2 = event.detail.value;}

    handleChangeNoteIndirizzoPV2(event){this.variables.noteIndirizzoPV2 = event.detail.value;}

    handleChangeDataSubentroCG2(event){this.variables.dataSubentroCG2 = event.detail.value;}

    handleChangePivaPrecedenteCG2(event){this.variables.pivaPrecedenteCG2 = event.detail.value;}

    handleChangeCodiceLocalePrecedenteCG2(event){this.variables.codiceLocalePrecedenteCG2 = event.detail.value;}

    handleChangeInsegnaPuntoVendita3(event){this.variables.insegnaPuntoVendita3 = event.detail.value;}

    handleChangeCAPPV3(event){this.variables.capPV3 = event.detail.value;}

    handleChangeFrazionePV3(event){this.variables.frazionePV3 = event.detail.value;}

    handleChangeNoteIndirizzoPV3(event){this.variables.noteIndirizzoPV3 = event.detail.value;}

    handleChangeDataSubentroCG3(event){this.variables.dataSubentroCG3 = event.detail.value;}

    handleChangePivaPrecedenteCG3(event){this.variables.pivaPrecedenteCG3 = event.detail.value;}

    handleChangeCodiceLocalePrecedenteCG3(event){this.variables.codiceLocalePrecedenteCG3 = event.detail.value;}

    daOraFerialeChange(event){this.variables.daOraFeriale = event.detail.value;}

    aOraFerialeChange(event){this.variables.aOraFeriale = event.detail.value;}

    daOraFerialeChangeChiusura(event){this.variables.daOraFerialeChiusura = event.detail.value;}

    aOraFerialeChangeChiusura(event){this.variables.aOraFerialeChiusura = event.detail.value;}

    daOraDomenicaChange(event){this.variables.daOraDomenica = event.detail.value;}

    aOraDomenicaChange(event){this.variables.aOraDomenica = event.detail.value;}

    daOraDomenicaChangeClose(event){this.variables.daOraDomenicaChiusura = event.detail.value;}

    aOraDomenicaChangeClose(event){this.variables.aOraDomenicaChiusura = event.detail.value;}

    daOraFestiviChange(event){this.variables.daOraFestivi = event.detail.value;}

    aOraFestiviChange(event){this.variables.aOraFestivi = event.detail.value;}

    daOraFestiviChangeClose(event){this.variables.daOraFestiviChiusura = event.detail.value;}

    aOraFestiviChangeClose(event){this.variables.aOraFestiviChiusura = event.detail.value;}

    aggiungiDomenica(){this.variables.availableDomenica = true;}

    aggiungiFestivi(){this.variables.availableFestivi = true;}

    closeDomenica(){this.variables.availableDomenica = false;}

    closeFestivi(){this.variables.availableFestivi = false;}

    handleChangeCategoriaPV2(event){ this.variables.categoriaPV2 = event.detail.value;}

    handleChangeCategoriaPV3(event){ this.variables.categoriaPV3 = event.detail.value;}


    checkMandatoryFields(){
        //return true;
        var result = true;
        var isDate = false;
        for(var elem in this.input_options){ 
            if(this.input_options[elem].required){
                if(elem == 'F_Insegna_PuntoVendita1' && (this.variables.insegnaPuntoVendita == null || this.variables.insegnaPuntoVendita == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Provincia_PuntoVendita1' && (this.variables.provinciaPV == null || this.variables.provinciaPV == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Comune_PuntoVendita1' && (this.variables.comunePV == null || this.variables.comunePV == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Via_PuntoVendita1' && (this.variables.viaPVSelected == null || this.variables.viaPVSelected == '' || this.variables.viaPV == '' || this.variables.viaPV == null)){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Civico_puntoVendita1' && (this.variables.civicoPV == null || this.variables.civicoPV == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Cap_puntoVendita1' && (this.variables.postalcodePV == null || this.variables.postalcodePV == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Frazione_PuntoVendita1' && (this.variables.frazionePV == null || this.variables.frazionePV == '')){ result = false; break;}
                else if(this.variables.checkboxIPV && elem == 'F_Note_Indirizzo_PuntoVendita1' && (this.variables.noteIndirizzoPV == null || this.variables.noteIndirizzoPV == '')){ result = false; break;}

                else if(this.variables.checkboxRLPV && elem == 'F_Nome_ReferentePuntoVendita' && this.variables.checkboxRLPV && (this.variables.nameRLPV == null || this.variables.nameRLPV == '')){ result = false; break;}
                else if(this.variables.checkboxRLPV && elem == 'F_Cognome_ReferentePuntoVendita' && this.variables.checkboxRLPV  && (this.variables.surnameRLPV == null || this.variables.surnameRLPV == '')){ result = false; break;}
                else if(this.variables.checkboxRLPV && elem == 'F_Telefono_ReferentePuntoVendita' && this.variables.checkboxRLPV  && (this.variables.phoneRLPV == null || this.variables.phoneRLPV == '')){ result = false; break;}
                else if(this.variables.checkboxRLPV && elem == 'F_Email_ReferentePuntoVendita' && this.variables.checkboxRLPV && (this.variables.emailRLPV == null || this.variables.emailRLPV == '')){ result = false; break;}

                else if(elem == 'F_Insegna_PuntoVendita2' && this.variables.checkboxOtherPV && (this.variables.insegnaPuntoVendita2 == null || this.variables.insegnaPuntoVendita2 == '')){ result = false; break;}
                else if(elem == 'F_Provincia_PuntoVendita2' && this.variables.checkboxOtherPV && (this.variables.provinciaPV2 == null || this.variables.provinciaPV2 == '')){ result = false; break;}
                else if(elem == 'F_Comune_PuntoVendita2' && this.variables.checkboxOtherPV && (this.variables.comunePV2 == null || this.variables.comunePV2 == '')){ result = false; break;}
                else if(elem == 'F_Via_PuntoVendita2' && this.variables.checkboxOtherPV && (this.variables.viaPV2Selected == null || this.variables.viaPV2Selected == '' || this.variables.viaPV2 == '' || this.variables.viaPV2 == null)){ result = false; break;}
                else if(elem == 'F_Civico_puntoVendita2' && this.variables.checkboxOtherPV && (this.variables.civicoPV2 == null || this.variables.civicoPV2 == '')){ result = false; break;}
                else if(elem == 'F_Cap_puntoVendita2' && this.variables.checkboxOtherPV && (this.variables.postalcodePV2 == null || this.variables.postalcodePV2 == '')){ result = false; break;}
                else if(elem == 'F_Frazione_PuntoVendita1' && this.variables.checkboxOtherPV && (this.variables.frazionePV2 == null || this.variables.frazionePV2 == '')){ result = false; break;}
                else if(elem == 'F_Note_Indirizzo_PuntoVendita2' && this.variables.checkboxOtherPV && (this.variables.noteIndirizzoPV2 == null || this.variables.noteIndirizzoPV2 == '')){ result = false; break;}

                else if(elem == 'F_Insegna_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.insegnaPuntoVendita3 == null || this.variables.insegnaPuntoVendita3 == '')){ result = false; break;}
                else if(elem == 'F_Provincia_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.provinciaPV3 == null || this.variables.provinciaPV3 == '')){ result = false; break;}
                else if(elem == 'F_Comune_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.comunePV3 == null || this.variables.comunePV3 == '')){ result = false; break;}
                else if(elem == 'F_Via_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.viaPV3Selected == null || this.variables.viaPV3Selected == '' || this.variables.viaPV3 == '' || this.variables.viaPV3 == null)){ result = false; break;}
                else if(elem == 'F_Civico_puntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.civicoPV3 == null || this.variables.civicoPV3 == '')){ result = false; break;}
                else if(elem == 'F_Cap_puntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.postalcodePV3 == null || this.variables.postalcodePV3 == '')){ result = false; break;}
                else if(elem == 'F_Frazione_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.frazionePV3 == null || this.variables.frazionePV3 == '')){ result = false; break;}
                else if(elem == 'F_Note_Indirizzo_PuntoVendita3' && this.variables.checkboxOtherPV && !this.variables.newPV && (this.variables.noteIndirizzoPV3 == null || this.variables.noteIndirizzoPV3 == '')){ result = false; break;}

                else if(elem == 'F_Data_Subentro_puntoVendita1' && this.variables.isCambioGestione && (this.variables.dataSubentroCG == null || this.variables.dataSubentroCG == '' || !this.dateIsValid(this.variables.dataSubentroCG))){isDate = true; result = false; break;}
                else if(elem == 'F_Codice_Locale_precedente1' && this.variables.isCambioGestione && (this.variables.codiceLocalePrecedenteCG == null || this.variables.codiceLocalePrecedenteCG == '')){result = false; break;}
                else if(elem == 'F_PIVA_gestore_precedente1' && this.variables.isCambioGestione && (this.variables.pivaPrecedenteCG == null || this.variables.pivaPrecedenteCG == '')){result = false; break;}

                else if(elem == 'F_Data_Subentro_puntoVendita2' && this.variables.isCambioGestione2 && (this.variables.dataSubentroCG2 == null || this.variables.dataSubentroCG2 == '' || !this.dateIsValid(this.variables.dataSubentroCG2))){isDate = true; result = false; break;}
                else if(elem == 'F_Codice_Locale_precedente2' && this.variables.isCambioGestione2 && (this.variables.codiceLocalePrecedenteCG2 == null || this.variables.codiceLocalePrecedenteCG2 == '')){result = false; break;}
                else if(elem == 'F_PIVA_gestore_precedente2' && this.variables.isCambioGestione2 && (this.variables.pivaPrecedenteCG2 == null || this.variables.pivaPrecedenteCG2 == '')){result = false; break;}

                else if(elem == 'F_Data_Subentro_puntoVendita3' && this.variables.isCambioGestione3 && (this.variables.dataSubentroCG3 == null || this.variables.dataSubentroCG3 == '' || !this.dateIsValid(this.variables.dataSubentroCG3))){isDate = true; result = false; break;}
                else if(elem == 'F_Codice_Locale_precedente3' && this.variables.isCambioGestione3 && (this.variables.codiceLocalePrecedenteCG3 == null || this.variables.codiceLocalePrecedenteCG3 == '')){result = false; break;}
                else if(elem == 'F_PIVA_gestore_precedente3' && this.variables.isCambioGestione3 && (this.variables.pivaPrecedenteCG3 == null || this.variables.pivaPrecedenteCG3 == '')){result = false; break;}
                else{}
            }
            if(this.variables.phoneRLPV != null && this.variables.phoneRLPV != undefined && this.variables.phoneRLPV != '' && !this.isValidNumber(this.variables.phoneRLPV)){ result = false; alert('Numero di telefono inserito non valido !'); break;}
            else if(this.variables.emailRLPV != null && this.variables.emailRLPV != undefined && this.variables.emailRLPV != '' && !this.validateEmail(this.variables.emailRLPV)){ result = false; alert('Email inserita non valida !'); break;}
            else if(this.variables.isCambioGestione && (this.variables.attoSubentroFileCG == null || this.variables.attoSubentroFileCG == undefined || this.variables.attoSubentroFileCG == '')) { result = false; alert('Documenti da allegare mancanti !'); break;}
            else if(this.variables.isCambioGestione2 && (this.variables.attoSubentroFileCG2 == null || this.variables.attoSubentroFileCG2 == undefined || this.variables.attoSubentroFileCG2 == '')) { result = false; alert('Documenti da allegare mancanti !'); break;}
            else if(this.variables.isCambioGestione3 && (this.variables.attoSubentroFileCG3 == null || this.variables.attoSubentroFileCG3 == undefined || this.variables.attoSubentroFileCG3 == '')) { result = false; alert('Documenti da allegare mancanti !'); break;}
            else{}
        }
        if(isDate){
            alert('Formato data non valido !');
            return false;
        }
        return result;
    }

    

    dateIsValid(dateStr) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      
        if (dateStr.match(regex) === null) {
          return false;
        }
      
        const [day, month, year] = dateStr.split('/');
      
        // 👇️ format Date string as `yyyy-mm-dd`
        const isoFormattedStr = `${year}-${month}-${day}`;
      
        const date = new Date(isoFormattedStr);
      
        const timestamp = date.getTime();
      
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
          return false;
        }
      
        return date.toISOString().startsWith(isoFormattedStr);
    }

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