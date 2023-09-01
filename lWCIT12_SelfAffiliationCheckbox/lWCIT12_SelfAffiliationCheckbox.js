import { LightningElement,api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT12_SelfAffiliationCheckbox extends LightningElement {
  @api inputLabel;
  @api isChecked;
  @api disabled;
  @api propertyName;

  connectedCallback(){
    loadStyle(this, sResource).then(() => {});
  }

  handleChange(event) {
    const changeEvent = new CustomEvent('change', { detail: event.target.checked });
    this.isChecked = event.target.checked;
    this.dispatchEvent(changeEvent);
  }
}