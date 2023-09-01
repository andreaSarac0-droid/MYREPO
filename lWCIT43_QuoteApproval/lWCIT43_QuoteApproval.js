import { LightningElement,api, track, wire } from 'lwc';
import getQuote from '@salesforce/apex/APIT156_QuoteApproval.getQuote';

export default class LWCIT43_QuoteApproval extends LightningElement {
    columns = [
        { label: 'Owner Name', fieldName: 'IT_Owner_Name__c', hideDefaultActions:true},
        { label: 'Request Date', fieldName: 'IT_Request_Date__c' , type:'date', hideDefaultActions:true},
        { label: 'Quote', fieldName: 'QuoteURL' ,type: 'url',typeAttributes: {label: {fieldName: 'Name'} }, hideDefaultActions:true},
        { label: 'Opportunity', fieldName: 'OppUrl', type: 'url',typeAttributes: {label: {fieldName: 'OppName'} }, hideDefaultActions:true},
        //{ label: 'Account Info', fieldName: 'IT_Account_Info__c' , hideDefaultActions:true},
        { label: 'Prodotto', fieldName: 'ProductUrl', type:'url', typeAttributes: {label: {fieldName: 'ProdName'} } , hideDefaultActions:true},
        { label: 'Tipo Opportunità', fieldName: 'IT_Opportunity_Type__c'},
        { label: 'Potenziale Annuo', fieldName: 'IT_Potential_Annual__c', type:'currency', typeAttributes: { currencyCode: 'EUR' }  , hideDefaultActions:true},
        { label: 'Sconto', fieldName: 'IT_Sconto__c', type:'percent', typeAttributes: { step: '0.01',minimumFractionDigits: '2',maximumFractionDigits: '3' }, hideDefaultActions:true},
        { label: 'EX Discount', fieldName: 'IT_EX_Discount__c', type:'percent' ,typeAttributes: { step: '0.01',minimumFractionDigits: '2',maximumFractionDigits: '3' },  hideDefaultActions:true},
        { label: 'Metodo di Pagamento', fieldName: 'IT_Payment_Method__c' , hideDefaultActions:true},
        { label: 'EX Payment Method', fieldName: 'IT_EX_Payment_Method__c' , hideDefaultActions:true},
        { label: 'Cards', fieldName: 'IT_Cards__c', type:'number' , hideDefaultActions:true},
        { label: 'Card Cost', fieldName: 'IT_Card_Cost__c', type:'currency', typeAttributes: { currencyCode: 'EUR' } , hideDefaultActions:true},
        { label: 'Descrizione', fieldName: 'IT_Description__c' , hideDefaultActions:true}
       
    ];
    @track data;
    connectedCallback(){
        getQuote()
            .then(result => {
                this.data = result;
                console.log('@@@@@Luca: '+JSON.stringify(this.data));
                this.data.forEach(item =>{
                    item.IT_EX_Discount__c=item.IT_EX_Discount__c/100;
                    item.QuoteURL='/'+item.Id;
                    item.IT_Sconto__c= item.IT_Sconto__c/100;
                    if(item.hasOwnProperty('zqu__Opportunity__c')){
                        item.OppUrl='/'+item.zqu__Opportunity__c;
                        item.OppName=item.zqu__Opportunity__r.Name;
                    }
                    if(item.hasOwnProperty('IT_Product__c')){
                        item.ProductUrl='/'+item.IT_Product__c;
                        console.log('@@@@: '+item.IT_Product__r.Name);
                        item.ProdName=item.IT_Product__r.Name;
                    }
                });
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleRefresh(){
        this.connectedCallback();
    }
    
   
    
    
    
}