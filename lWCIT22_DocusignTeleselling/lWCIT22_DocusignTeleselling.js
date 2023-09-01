/* eslint-disable no-empty */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-concat */
/* eslint-disable vars-on-top */
import { LightningElement, api, track } from 'lwc';
import isButtonVisible from '@salesforce/apex/APIT136_DocusignTeleselling.isButtonVisible';
import isButtonContrattoInviato from '@salesforce/apex/APIT136_DocusignTeleselling.isButtonContrattoInviato';
import getAvailableQuotes from '@salesforce/apex/APIT136_DocusignTeleselling.getAvailableQuotes';
import getRegimeIVA from '@salesforce/apex/APIT136_DocusignTeleselling.getRegimeIVA';
import getEmailDetails from '@salesforce/apex/APIT136_DocusignTeleselling.getEmailDetails';
import sendEmailController from '@salesforce/apex/APIT136_DocusignTeleselling.sendEmailController';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LWCIT22_DocusignTeleselling extends LightningElement {

    @api recordId;
    @track buttonVisible = false;
    @track buttonSent = false;
    @track modalOpenSelectQuote = false;
    @track modalOpenComposer = false;
    @track isLoading = false;

    @track quoteTableData = [];
    quoteTableColumns = [
        { label: 'Quote', fieldName: 'QuoteName' },
        { label: 'Tipologia', fieldName: 'QuoteVatPercentage' },
    ];
    @track selectedQuote;
    @track nextButtonDisabled = true;

    @track optionsFromAddress = [];
    @track optionsTemplate = [];
    @track valueFromAddress;
    @track emailTemplates; 
    @track valueTemplate;
    @track regimeIva = false;
    @track emailBody;
    @track files = [];
    emailObject;
    emailToAddresses;
    emailCCAddresses;
    acceptedFormats = '.pdf,.doc,.docx,.xlsx,.pptx,.csv,.jpeg,.png,.jpg';

    connectedCallback(){
        isButtonVisible({leadId: this.recordId}).then(result => {
            this.buttonVisible = result;
            console.log('buttonVisible --> '+this.buttonVisible);
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
        });
        isButtonContrattoInviato({leadId: this.recordId}).then(result => {
            this.buttonSent = result;
            console.log('buttonSent --> '+this.buttonSent);
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
        });
    }

    openModalSelectQuote(){
        this.modalOpenSelectQuote = true;
        this.isLoading = true;
        getAvailableQuotes({leadId: this.recordId}).then(result => {
            this.quoteTableData = result;
            this.isLoading = false;
        }).catch(error =>{
            console.log('Error -> '+JSON.stringify(error));
            this.isLoading = false;
            this.closeModalSelectQuote();
            this.showToast('ERRORE', error.body.message, 'Error');
        });
    }

    showToast(theTitle, theMessage, theVariant) {
        const event = new ShowToastEvent({
            title: theTitle,
            message: theMessage,
            variant: theVariant
        });
        this.dispatchEvent(event);
    }

    controlRegimeIVA(){
        getRegimeIVA({quoteId: this.selectedQuote.QuoteId}).then(result => {
            this.regimeIva = result;
            this.openEmailComposer();
        }).catch(error =>{
            console.log('Error -> '+JSON.stringify(error));
            this.isLoading = false;
            this.closeModalSelectQuote();
            this.showToast('ERRORE', error.body.message, 'Error');
        });
    }

    setSelectedQuote(event){
        this.selectedQuote = event.detail.selectedRows[0];
        this.nextButtonDisabled = false;        
    }

    closeModalSelectQuote(){
        this.modalOpenSelectQuote = false;
        this.selectedQuote = null;
        this.nextButtonDisabled = true;
    }

    openEmailComposer(){
        this.modalOpenSelectQuote = false;
        this.nextButtonDisabled = true;
        this.modalOpenComposer = true;
        this.isLoading = true;
        this.optionsFromAddress = [];
        this.optionsTemplate = [];
        getEmailDetails({}).then(result => {
            this.optionsFromAddress.push({label: '<'+result.yourEmail+'>' + ' (Tua email personale)',value: result.yourEmail});
            this.valueFromAddress = result.yourEmail;
            this.emailTemplates = result.emailTemplates;
            for(var i = 0 ; i < result.fromEmails.length ; i++){
                this.optionsFromAddress.push({label: result.fromEmails[i].DisplayName+ '<'+result.fromEmails[i].Address+'>' + ' (Email pubblica)',value: result.fromEmails[i].Address});
            }
            this.optionsTemplate.push({label: 'No Template', value: null});
            for(var i = 0 ; i < this.emailTemplates.length ; i++){
                this.optionsTemplate.push({label: this.emailTemplates[i].Name, value: this.emailTemplates[i].DeveloperName});
            }
            this.valueTemplate = null;
            this.isLoading = false;
        }).catch(error => {
            console.log('Error -> '+JSON.stringify(error));
            this.isLoading = false;
            this.closeEmailComposer();
        });
    }

    closeEmailComposer(){
        this.modalOpenComposer = false;
        this.nextButtonDisabled = true;
        this.files = [];
        this.emailBody = null;
        this.valueTemplate = null;
        this.valueFromAddress = null;
        this.emailObject = null;
        this.closeModalSelectQuote();
    }

    handleChangeFromAddress(event) {
        this.valueFromAddress = event.detail.value;
    }

    handleChangeTemplate(event){
        this.valueTemplate = event.detail.value;
        if(this.valueTemplate == null) this.emailBody = '';
        else{
            var devName = this.valueTemplate;
            var template = this.emailTemplates.filter(function(element){return element.DeveloperName == devName;})[0];
            this.emailBody = template.HtmlValue;
        }
    }

    handleChangeEmailBody(event){
        this.emailBody = event.target.value;
    }

    handleChangeEmailObject(event){
        this.emailObject = event.target.value;
    }

    handleChangeEmailToAddresses(event){
        this.emailToAddresses = event.target.value;
    }

    handleChangeEmailCCAddresses(event){
        this.emailCCAddresses = event.target.value;
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.files = [...this.files, ...uploadedFiles];
    }

    handleRemove(event) {
        const index = event.target.dataset.index;
        this.files.splice(index, 1);
    }

    validateEmail(email) {
        const res = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()s[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }

    sendEmail(){
        if(this.emailObject == '' || this.emailObject == null || this.emailToAddresses == null || this.emailToAddresses.split(';').lenght == 0 || this.emailBody == '' || this.emailBody == null){
            
        }
        else{
            var filesIds = [];
            for(var i = 0 ; i < this.files.length ; i++){
                filesIds.push(this.files[i].contentVersionId);
            }
            let emailDetails = {
                toAddress: this.emailToAddresses.split(';'),
                ccAddress: (this.emailCCAddresses != null && this.emailCCAddresses != '') ? this.emailCCAddresses.split(';') : [],
                subject: this.emailObject,
                body: this.emailBody,
                files: filesIds,
                templateId: this.valueTemplate,
                recordId: this.recordId,
                quoteId: this.selectedQuote.QuoteId
            };
            this.isLoading = true;
            sendEmailController({leadId: this.recordId, emailDetailStr: JSON.stringify(emailDetails)}).then(() => {
                this.isLoading = false;
                this.closeEmailComposer();
                this.connectedCallback();
            }).catch(error => {
                console.log('Error -> '+JSON.stringify(error));
                this.isLoading = false;
                this.closeEmailComposer();
            });
        }
    }

}