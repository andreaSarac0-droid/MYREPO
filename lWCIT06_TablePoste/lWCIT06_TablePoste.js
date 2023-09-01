import { LightningElement, track, api } from 'lwc';
import RetrievePicklistValues from '@salesforce/apex/APIT104_DiscountTableCtrl.getPicklistValues';
import RetrieveDefaultValues from '@salesforce/apex/APIT104_DiscountTableCtrl.populateDefault';
import RetrievemetadataValues from '@salesforce/apex/APIT104_DiscountTableCtrl.populateDefaultWithMetadata';
import SaveValues from '@salesforce/apex/APIT104_DiscountTableCtrl.deleteInsertDiscount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class LWCIT06_TablePoste extends NavigationMixin(LightningElement) {

    @track data = [];
    @track record = [];
    @api recordId;
    @track returnError = [];
    @track viewSave = false;
    @track viewDefault = false;
    @track viewSpread = true;
    @track draftValues = [];
    @track changeRecord = false;

    lastSavedData = [];
    whoLast = '';

    @api
    doInit() {
        console.log("DOINIT ", this.recordId);
        this.viewDefault = false;
        RetrieveDefaultValues({
                opportunityId: this.recordId
            })
            .then(result => {
                console.log("result:: ", result);
                if (result) {
                    this.data = result;
                }
            })
            .catch(error => {
                this.error = error;
                this._isLoading = false;
            });

        this.columns = [
            { label: 'Giorno', fieldName: 'day', type: 'text', editable: false, initialWidth: 80 },
            { label: 'Dalle', fieldName: 'from1', type: 'text', editable: true, initialWidth: 80 },
            { label: 'Alle', fieldName: 'to1', type: 'text', editable: true, initialWidth: 80 },
            {
                label: 'Cashback per sconti su trans. Cod.',
                fieldName: 'discountPos1',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountPos1' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountPos1' }
                }
            },
            {
                label: 'Fee Cashback per sconti su trans. Cod.',
                fieldName: 'discountCode1',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountCode1' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountCode1' }
                }
            },
            { label: 'Dalle', fieldName: 'from2', type: 'text', editable: true, initialWidth: 80 },
            { label: 'Alle', fieldName: 'to2', type: 'text', editable: true, initialWidth: 80 },
            {
                label: 'Cashback per sconti su trans. Cod.',
                fieldName: 'discountPos2',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountPos2' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountPos2' }
                }
            },
            {
                label: 'Fee Cashback per sconti su trans. Cod.',
                fieldName: 'discountCode2',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountCode2' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountCode2' }
                }
            },
            { label: 'Dalle', fieldName: 'from3', type: 'text', editable: true, initialWidth: 80 },
            { label: 'Alle', fieldName: 'to3', type: 'text', editable: true, initialWidth: 80 },
            {
                label: 'Cashback per sconti su trans. Cod.',
                fieldName: 'discountPos3',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountPos3' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountPos3' }
                }
            },
            {
                label: 'Fee Cashback per sconti su trans. Cod.',
                fieldName: 'discountCode3',
                editable: true,
                initialWidth: 100,
                type: 'picklist',
                typeAttributes: {
                    placeholder: 'Choose discount',
                    options: [
                        { label: '-', value: '' },
                        { label: '0%', value: '0' },
                        { label: '2%', value: '2' },
                        { label: '3%', value: '3' },
                        { label: '4%', value: '4' },
                        { label: '5%', value: '5' },
                        { label: '6%', value: '6' },
                        { label: '7%', value: '7' },
                        { label: '8%', value: '8' },
                        { label: '9%', value: '9' },
                        { label: '10%', value: '10' },
                        { label: '11%', value: '11' },
                        { label: '15%', value: '15' },
                        { label: '20%', value: '20' },
                        { label: '25%', value: '25' },
                    ],
                    value: { fieldName: 'discountCode3' },
                    context: { fieldName: 'day' },
                    fieldName: { value: 'discountCode3' }
                }
            },
        ];
    }

    connectedCallback() {
        this.doInit();
        RetrieveDefaultValues({
                opportunityId: this.recordId
            })
            .then(result => {
                console.log("result:3: ", result);
                if (result) {
                    this.data = result;
                }
            })
            .catch(error => {
                this.error = error;
                this._isLoading = false;
            });

        //save last saved copy
        this.lastSavedData = JSON.parse(JSON.stringify(this.data));
    }

    updateDataValues(updateItem) {
        let copyData = [...this.data];
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });

        //write changes back to original data
        this.data = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    downloadDefault() {
        this._isLoading = true;
        //this.changeRecord = false;
        console.log("this.data:0: ", this.data);

        RetrievemetadataValues()
            .then(result => {
                console.log("result:1: ", result);
                if (result) {
                    this.data = result;
                }
                //this.viewSave = false;
                this._isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this._isLoading = false;
            });
    }

    saveDefault() {
        this._isLoading = true;
        //this.recordId = '0065r000003QdCyAAK';
        console.log('this.recordId', this.recordId);
        console.log('SAVEEEE', JSON.stringify(this.data));
        //console.log('Promotion', this.changeRecord);
        SaveValues({
                idOppy: this.recordId,
                listupdateWrapper: this.data
                    /*,
                                boolPromotion: this.changeRecord*/
            })
            .then(result => {
                console.log("result:2: ", result);
                if (result && !result.includes("ERROR :")) {
                    this.returnError = result;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: result,
                            variant: 'success',
                            mode: 'dismissable'
                        })
                    );
                }
                if (result && result.includes("ERROR :")) {
                    this.doInit();
                    console.log("ERROR::: ");
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: result,
                            variant: 'error',
                            mode: 'dismissable'
                        })
                    );
                }
                this._isLoading = false;
                this.draftValues = [];
                //this.navigateToRecordPage(this.recordId); 
            })
            .catch(error => {
                this.doInit();
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'File not found',
                        variant: 'error',
                        mode: 'dismissable'
                    })
                );
                this._isLoading = false;
            });
    }

    spreadPerc(event) {
        // console.log('**spreadPerc');
        let data1 = JSON.parse(this.whoLast);
        // console.log('***data1: ' + data1.day + ' ' + data1.fieldDiscount);
        let code, pos;
        this.data.forEach(estract2Val);

        function estract2Val(item) {
            if (item.day == data1.day) {
                let result = data1.fieldDiscount.substr(-4, 3);
                let resultCol = data1.fieldDiscount.substr(-1, 1);
                if (result == 'Pos') {
                    code = item['discountCode' + resultCol];
                    pos = item[data1.fieldDiscount];
                } else {
                    code = item[data1.fieldDiscount];
                    pos = item['discountPos' + resultCol];
                }
            }
        }
        var dataTotal = this.data;
        dataTotal.forEach(spreadAll);

        function spreadAll(item) {
            let keys = Object.keys(item);
            keys.forEach(ks => {
                if (ks.substr(0, 8) == 'discount') {
                    let result = ks.substr(-4, 3);
                    if (result == 'Pos') {
                        item[ks] = pos;
                    } else {
                        item[ks] = code;
                    }
                }
            });
        }
        this.data = JSON.parse(JSON.stringify(dataTotal));
        this.viewSpread = true;
        // consolida anche le perc spalmate
        this.saveDefault();
    }

    //listener handler to get the context and data / updates datatable
    picklistChanged(event) {
        // console.log('***picklistChanged');
        //this.viewSave = false;
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        console.log('ECCCC: ' + JSON.stringify(event.detail));
        var dataTotal = this.data;
        // console.log('***dataTotal old: ' + JSON.stringify(dataTotal));

        function getOriginalRow(element) {
            return element.day == dataRecieved.context;
        }
        let index = dataTotal.findIndex(getOriginalRow);
        let dataObj = dataTotal.find(getOriginalRow);
        // console.log('index: ' + index);
        // console.log('element.Id: ' + JSON.stringify(dataObj));

        let jsonString = `{ "day": "${dataRecieved.context}" , "${dataRecieved.fieldName}" : "${dataRecieved.value}" }`;
        // console.log('jsonString: ' + jsonString);
        let dataRecievedCorrect = JSON.parse(jsonString);
        // console.log('SOST1: ' + JSON.stringify(dataRecievedCorrect));

        this.whoLast = `{"day": "${dataRecieved.context}" , "fieldDiscount": "${dataRecieved.fieldName}"}`;
        // cntl both valor x attivare btn
        this.viewSpread = true;
        if (dataRecieved.fieldName.substr(-4, 3) == 'Pos') {
            if (dataObj.hasOwnProperty('discountCode' + dataRecieved.fieldName.substr(-1, 1))) {
                this.viewSpread = false;
            }
        } else {
            if (dataObj.hasOwnProperty('discountPos' + dataRecieved.fieldName.substr(-1, 1))) {
                this.viewSpread = false;
            }
        }

        var finalResultdraftValue = Object.assign(dataObj, dataRecievedCorrect);
        console.log('VALUEAFTER: ' + JSON.stringify(finalResultdraftValue));
        dataTotal.splice(index, 1, finalResultdraftValue);
        this.data = dataTotal;
        // console.log('this.data: ' + JSON.stringify(this.data));
        //this.changeRecord = true;
    }

    handleCellChange(event) {
        // console.log('***handleCellChange');
        //this.viewSave = true;
        this.viewDefault = true;
        //this.updateDraftValues(event.detail.draftValues[0]);
        var draftValue = event.detail.draftValues[0];
        console.log('VALUE: ' + JSON.stringify(event.detail));
        console.log('VALUE: ' + JSON.stringify(draftValue));
        var dataTotal = this.data;

        function getOriginalRow(element) {
            console.log('draftValue.Id: ' + draftValue.day);
            return element.day == draftValue.day;
        }
        let index = dataTotal.findIndex(getOriginalRow);
        let dataObj = dataTotal.find(getOriginalRow);
        console.log('element.Id: ' + JSON.stringify(dataObj));
        console.log('index: ' + index);
        var finalResultdraftValue = Object.assign(dataObj, draftValue);
        console.log('VALUEAFTER: ' + JSON.stringify(finalResultdraftValue));
        dataTotal.splice(index, 1, finalResultdraftValue);
        this.data = dataTotal;
        console.log('this.data: ' + JSON.stringify(this.data));
        //this.changeRecord = true;
    }

    handleSave(event) {
        //save last saved copy
        this.lastSavedData = JSON.parse(JSON.stringify(this.data));
    }

    handleCancel(event) {
        console.log('handleCancel: ');
        //remove draftValues & revert data changes
        this.data = JSON.parse(JSON.stringify(this.data));
        this.draftValues = [];
    }

    navigateToRecordPage(oppId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: oppId,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        });
    }

    get isLoading() {
        return this._isLoading;
    }

    _isLoading = false;
}