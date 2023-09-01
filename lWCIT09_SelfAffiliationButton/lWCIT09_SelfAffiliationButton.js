import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import sResource from '@salesforce/resourceUrl/ubuntufont';

export default class LWCIT09_SelfAffiliationButton extends LightningElement {

  @api label;
  @api size;
  @api large;
  @api disabled;
  @api alignment;
  @api color;
  @api responsive;
  @api responsiveLeft;

  connectedCallback(){
    loadStyle(this, sResource).then(() => {});
  }

  get btnClass() {
    let btnClass = "slds-button btn";
    
    switch (this.alignment) {
      case "right":  
        btnClass += " slds-float_right";
        break;
      case "center":
        btnClass += " slds-align_absolute-center";
        break;
      case "left":
        btnClass += " slds-float_left";
        break;
    }

    if(this.size === "small") btnClass += " small";
    if(this.color === "red") btnClass += " red";
    if(this.responsive) btnClass += " " + this.responsive;
    if(this.responsiveLeft) btnClass += " left";

    return btnClass;
  }

  get isDisabled() {
    return this.disabled == true;
  }
}