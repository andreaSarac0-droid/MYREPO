import { LightningElement, wire, track } from 'lwc';
import getContractSchema from '@salesforce/apex/APIT121_SelfAffiliation.getContractSchema';



export default class LWCIT07_SelfAffiliation extends LightningElement {

    contractSchema;
    isStandardContact = false;
    @track contractName;

    connectedCallback(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var contractName = urlParams.get('contract');
        if(contractName == null) contractName = 'Contratto_Unico';
        this.contractName = contractName;
        getContractSchema({contractName : contractName}).then(result=>{
            if(result == null) alert('Nessun contratto disponibile !');
            else {
                this.contractSchema = result;
                this.isStandardContact = true;
            }
        });
    }

}