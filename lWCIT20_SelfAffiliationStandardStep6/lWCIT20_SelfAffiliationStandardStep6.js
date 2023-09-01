import { LightningElement, api, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT20_SelfAffiliationStandardStep6 extends LightningElement {

    @api button_options;
    @api text_options;
    @api input_options;

    placeholderDate = 'gg/mm/aaaa';

    @track variables = {
        tipoDocumento: 'Documento identità'
    };

    tipologie_documenti = [
        {key: 'Documento identità', value:'Documento d\'identità'},
        {key: 'Patente', value:'Patente'},
        {key: 'Passaporto', value:'Passaporto'},
        {key: 'Permesso di soggiorno', value:'Permesso di soggiorno'}
    ];

    connectedCallback(){
        loadStyle(this, sResource).then(() => {});
    }

    goToStep5(){
        let ev = new CustomEvent('gotostep5', {});
        this.dispatchEvent(ev);  
    }

    goToStep7(){
        if(this.checkMandatoryFields()){
            let ev = new CustomEvent('gotostep7',  {detail: {vars:this.variables}});
            this.dispatchEvent(ev);  
        }
        else alert('Completa tutti i campi obbligatori prima di procedere !');
    }

    handleChangeTipoDocumento(event){this.variables.tipoDocumento = event.detail.value;}

    handleChangeNumeroDocumento(event){this.variables.numeroDocumento = event.detail.value;}

    handleChangeDataEmissioneDocumento(event){this.variables.dataEmissioneDocumento = event.detail.value;}

    handleChangeDataScadenzaDocumento(event){this.variables.dataScadenzaDocumento = event.detail.value;}

    handleChangeEnteRilascioDocumento(event){this.variables.enteRilascioDocumento = event.detail.value;}

    uploadScontrino(event){
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.scontrino = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    uploadDocumento(event){
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.documento = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    uploadVisura(event){
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.variables.visura = {'filename': file.name,'base64': base64};
        }
        reader.readAsDataURL(file)
    }

    checkMandatoryFields(){
        var result = true;
        var isDate = false;
        //return true;
        for(var elem in this.input_options){ 
            if(this.input_options[elem].required){
                if(elem == 'F_Tipo_documento' && this.variables.tipoDocumento == '' || this.variables.tipoDocumento == null || this.variables.tipoDocumento == undefined){ result = false; break;}
                else if(elem == 'F_Numero_documento' && this.variables.numeroDocumento == '' || this.variables.numeroDocumento == null || this.variables.numeroDocumento == undefined){ result = false; break;}
                else if(elem == 'F_Data_di_emissione' && this.variables.dataEmissioneDocumento == '' || this.variables.dataEmissioneDocumento == null || this.variables.dataEmissioneDocumento == undefined || !this.dateIsValid(this.variables.dataEmissioneDocumento)){ isDate = true; result = false; break;}
                else if(elem == 'F_Data_di_scadenza' && this.variables.dataScadenzaDocumento == '' || this.variables.dataScadenzaDocumento == null || this.variables.dataScadenzaDocumento == undefined || !this.dateIsValid(this.variables.dataScadenzaDocumento)){ isDate= true; result = false; break;}
                else if(elem == 'F_Ente_di_rilascio' && this.variables.enteRilascioDocumento == '' || this.variables.enteRilascioDocumento == null || this.variables.enteRilascioDocumento == undefined ){ result = false; break;}
                else if(this.variables.documento == '' || this.variables.documento == null || this.variables.documento == undefined){ result = false; break;}
                //else if(this.variables.scontrino == '' || this.variables.scontrino == null || this.variables.scontrino == undefined){ result = false; break;}
                //else if(this.variables.visura == '' || this.variables.visura == null || this.variables.visura == undefined){ result = false; break;}
                else {}
            }
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

    @api
    get variables(){ return this.variables;}
}