import { LightningElement, api } from 'lwc';

export default class LWCIT08_SelfAffiliationProgressIndicator extends LightningElement {


  @api steps = [];
  @api currentStep;
  
  @api 
  get step1() {
    this.setState();
    return this.steps[0];
  }

  @api 
  get subsequentSteps() {
    return this.steps.slice(1);
  }
  
  setState() {
    let curStep = this.currentStep;
    let steps2 = [];
    this.steps.forEach(function (step) {
      if(step.nb === curStep){
        steps2.push({ nb: step.nb, label: step.label, state: 'active' });
      } else {
        steps2.push(step);
      }
    });
    this.steps = steps2;
  }
}