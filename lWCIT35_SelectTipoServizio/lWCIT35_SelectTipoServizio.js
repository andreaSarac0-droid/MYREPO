import { LightningElement, track } from 'lwc';

export default class LWCIT35_SelectTipoServizio extends LightningElement {

    tipoServizio;
    disableFine = true; 
    currentYear = new Date().getFullYear();
    @track optionsData = [];
    @track dataSelezionata = this.currentYear;
    dataDefault = this.dataSelezionata.toString();

    options = [
        {label: 'Conservazione', value: 'Conservazione'},
        {label: 'Trasmissione', value: 'Trasmissione'}
    ];

    connectedCallback(){
        console.log('current year: ' + this.currentYear);
        let temp = [];
        for(var i = this.currentYear; i >= 2018; i--){
            temp.push({label: i.toString(), value: i.toString()});
        }
        this.optionsData = temp;
        console.log('options data: ' + JSON.stringify(this.optionsData));
    }

    handleChange(event){
        let value = event.target.value;
        this.tipoServizio = value;
        this.disableFine = false;
        console.log('tipo servizio is >> ' + this.tipoServizio);
        console.log('data selezionata: ' + this.dataSelezionata);

        const e = new CustomEvent('selecttiposervizio',
        {
            detail: {
                tipoServizio: this.tipoServizio,
                annoInizioServizio: this.dataSelezionata,
                disableFine: this.disableFine
            }
        });

        this.dispatchEvent(e);
    }

    handleChangeData(event){
        let valueData = event.target.value;
        this.dataSelezionata = +valueData;
        //valueData = this.dataSelezionata.toString();
        console.log('data selezionata string: ' + valueData);
        console.log('data selezionata number: ' + this.dataSelezionata);

        const e = new CustomEvent('selectanno',
        {
            detail: {
                annoInizioServizio: valueData
            }
        });

        this.dispatchEvent(e);
    }
}