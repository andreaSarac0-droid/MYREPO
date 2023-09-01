import { LightningElement,api, track} from 'lwc';
import getCase from '@salesforce/apex/APIT157_CaseApproval.getCase';


export default class LWC44_CaseApproval extends LightningElement {
    columns = [
    { label: 'Link approvazione', fieldName: 'approvalUrl' ,type: 'url',typeAttributes: {label: 'Approva/Rifiuta'}, hideDefaultActions:true},
    { label: 'Numero Caso', fieldName: 'caseURL' ,type: 'url',typeAttributes: {label: {fieldName: 'CaseNumber'} }, hideDefaultActions:true},
    //{ label: 'Nome referente', fieldName: 'ContactUrl' ,type: 'url',typeAttributes: {label: {fieldName: 'ContactId'} }, hideDefaultActions:true},
    //{ label: 'Oggetto', fieldName: 'Subject'},
    { label: 'Account', fieldName: 'AccountUrl' ,type: 'url',typeAttributes: {label: {fieldName: 'Account'} }, hideDefaultActions:true},
    { label: 'Financial Center', fieldName: 'fcUrl' ,type: 'url',typeAttributes: {label: {fieldName: 'FinancialCenter'} }, hideDefaultActions:true},
    { label: 'Priorità', fieldName: 'Priority' , hideDefaultActions:true},  
    { label: 'Stato', fieldName: 'Status' , hideDefaultActions:true}, 
    { label: 'Titolare caso', fieldName: 'OwnerUrl' ,type: 'url',typeAttributes: {label: {fieldName: 'Owner'} }, hideDefaultActions:true},
    { label: 'Tipo Operazione', fieldName: 'IT_Operation_Type__c' , hideDefaultActions:true}, 
    { label: 'Casistica', fieldName: 'IT_Case_Study__c' , hideDefaultActions:true},
    { label: 'Importo', fieldName: 'IT_Refund_Amount__c', type:'currency', typeAttributes: { currencyCode: 'EUR', step: '0.01',minimumFractionDigits: '2',maximumFractionDigits: '3' } , hideDefaultActions:true},
    { label: 'Note', fieldName: 'IT_Finance_Notes__c' , hideDefaultActions:true},
    ];

// Avvio pagina
    @track data;
    connectedCallback(){
        getCase()
            .then(result => {
                this.data = result.map((item) => {
                    item.caseURL = "/" + item.ProcessInstance.TargetObject.Id;
                    item.CaseNumber = item.ProcessInstance.TargetObject.CaseNumber;
                    item.approvalUrl = "/" + item.Id;
                    if (item.ProcessInstance.TargetObject.AccountId !== null) {
                      item.AccountUrl = "/" + item.ProcessInstance.TargetObject.AccountId;
                      item.Account = item.ProcessInstance.TargetObject.Account.Name;
                    }
                    if (item.ProcessInstance.TargetObject.IT_Financial_Center__c !== null) {
                      item.fcUrl =
                        "/" + item.ProcessInstance.TargetObject.IT_Financial_Center__r.Id;
                      item.FinancialCenter =
                            item.ProcessInstance.TargetObject.IT_Financial_Center__r.Name;
                    }
                    item.OwnerUrl = "/" + item.ProcessInstance.TargetObject.OwnerId;
                    item.Owner =
                      item.ProcessInstance.TargetObject.Owner.Name;
                    item.IT_Finance_Notes__c = item.ProcessInstance.TargetObject.IT_Finance_Notes__c;
                    // mdaolio 20230307
                    item.Priority = item.ProcessInstance.TargetObject.Priority;
                    item.Status = item.ProcessInstance.TargetObject.Status;
                    item.IT_Operation_Type__c = item.ProcessInstance.TargetObject.IT_Operation_Type__c;
                    item.IT_Case_Study__c = item.ProcessInstance.TargetObject.IT_Case_Study__c;
                    item.IT_Refund_Amount__c = item.ProcessInstance.TargetObject.IT_Refund_Amount__c;

                    return item;
                  });    
            })

            .catch(error => {
                this.error = error;
            });
    }
    // Quando si clicca regresh richiamo metodo connectedCallback
    handleRefresh(){
        this.connectedCallback();
    }
}