import { LightningElement, api } from 'lwc';

export default class LWCIT05_DataPicklist extends LightningElement {
    @api label;
    @api placeholder;
    @api options;
    @api value;
    @api context;
    @api fieldName;

    handleChange(event) {
        //show the selected value on UI
        console.log('PICKLISTCOMPONENT: '+JSON.stringify(event.detail));
        console.log('PICKLISTCOMPONENT2: '+JSON.stringify(this.label));
        console.log('PICKLISTCOMPONENT3: '+this.context);
        console.log('PICKLISTCOMPONENT4: '+JSON.stringify(this.fieldName));
        this.value = event.detail.value;

        var fieldCorrect = this.fieldName.value;

        //fire event to send context and selected value to the data table
        this.dispatchEvent(new CustomEvent('picklistchanged', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { context: this.context, value: this.value, fieldName: fieldCorrect}
            }
        }));
    }

}