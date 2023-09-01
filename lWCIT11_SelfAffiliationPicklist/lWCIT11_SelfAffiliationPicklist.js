import { LightningElement, api, track  } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT11_SelfAffiliationPicklist extends LightningElement {

  @api inputLabel;
  @api propertyName;
  @api value;
  @api pkEntries =[];
  @api required;
  @api disabled;
  
  @api hasError;
  @api errorMessage;
  @api displayCurValue = false;

  @api hasTooltip;
  @api toolTipText;
  @api placeHolderText;

  @track isLoading = false;


  async connectedCallback() {
    loadStyle(this, sResource).then(() => {});
    // In order to trigger picklist initialization (done in parent component) after rendering
    const loadedEvent = new CustomEvent('loaded', { detail: { field: this.propertyName, value: 0 } });
    this.dispatchEvent(loadedEvent);
  }

  @api 
  get displayedValue(){
    console.log('>>> displayedValue -- this.value: ' + this.value + ' for ' + this.propertyName);
    console.log('>>> displayedValue -- pkEntries: ' + JSON.stringify(this.pkEntries));
    let entry = this.pkEntries.filter((elem) => (elem.key == this.value));
    return (entry.length > 0) ? entry[0].value : this.value;  
    // TODO find a better solution, in case of displaying translated value like "Other". dirty fix for dependant picklist
  }

  @api setValue(value){
    this.value = value;
    this.isLoading = true;
    let that = this;
    setTimeout(function(){that.setLoadingFalse();},100);
  }

  setLoadingFalse(){
    this.isLoading = false;
  }

  handleChange(event) {
    const changeEvent = new CustomEvent('change', { detail: { field: this.propertyName, value: event.target.value, picklist: true } });
    this.value = event.target.value;
    this.dispatchEvent(changeEvent);
  }
  
  handleClick(event) {
    this.displayCurValue = false;
  }

  get pickListCssClass() {
    let cssClass = "slds-select erportal-picklist ";
    if(this.hasError) 
      cssClass = cssClass + " has-error";
    return cssClass;
  }
}