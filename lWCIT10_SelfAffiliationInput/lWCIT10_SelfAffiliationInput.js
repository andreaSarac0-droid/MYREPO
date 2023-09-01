import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT10_SelfAffiliationInput extends LightningElement {
    @api inputLabel;
    @api propertyName;
    @api value;
    @api required = false;
    @api requiredConditional;
    @api disabled;
    @api hasError;
    @api errorMessage;
    @api autofocus;
    @api hasTooltip;
    @api toolTipText;
    @api placeHolderText;
    @api maxLength;
    timeout;

    async connectedCallback() {
        loadStyle(this, sResource).then(() => {});
        if (this.value  === undefined) this.value = "";
    }

    get _value() {
        return (this.value  === undefined) ? "" : this.value;
    }

    get hasInputLabel() {
        return (this.inputLabel);
    }

    get inputCssClass() {
        let elemClass = "slds-form-element";
        if (this.hasError) elemClass = elemClass + " slds-has-error";

        return elemClass;
    }

    get inputCssClass2() {
        let elemClass = "slds-input erportal-input";
        if (this.hasError) elemClass = elemClass + " has-error";
        if (this.disabled) elemClass = elemClass + " field__disabled";

        return elemClass;
    }

    handleChange(event) {
        const changeEvent = new CustomEvent('change', { detail: { field: this.propertyName, value: event.target.value } });
        var that = this;
        if(this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function(){
            that.dispatchEvent(changeEvent);
        },500);
        
    }
}