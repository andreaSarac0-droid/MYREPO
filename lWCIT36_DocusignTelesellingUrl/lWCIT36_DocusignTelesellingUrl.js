import { LightningElement, track, api } from 'lwc';
import getDocusignLink from '@salesforce/apex/APIT136_DocusignTeleselling.getDocusignLink';

export default class LWCIT36_DocusignTelesellingUrl extends LightningElement {
    
    @track showSpinner = true;

    connectedCallback(){
        //this.showSpinner = true;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var leadId = urlParams.get('leadId');
        var quoteId = urlParams.get('quoteId');
        var userName = urlParams.get('userName');
        var email = urlParams.get('email');
        
        console.log('leadId--> ' + leadId);
        console.log('quoteId--> ' + quoteId);
        console.log('userName--> ' + userName);
        console.log('email--> ' + email);


        getDocusignLink({quoteId : quoteId, username : userName, toEmail : email, recordId : leadId}).then(signingUrl=>{
            if(signingUrl == null) alert('Nessun Link Disponibile!');
            else {
                window.location.href = signingUrl;
                this.showSpinner = false;
            }
        });
        
    }
}