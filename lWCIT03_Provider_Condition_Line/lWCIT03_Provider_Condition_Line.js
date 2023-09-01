import { LightningElement, api, track } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';

const actions = [
    { label: 'Delete', name: 'delete' },
];

export default class contractLineItem extends LightningElement {

    @api arrData = [];
    @api columnName="";
    @api fieldColumns = [
        { label: 'LINEA PRODOTTO', fieldName: 'IT_Product_Line_FRM__c', type:'text'}, //, sortable: true},
        { label: 'PRODOTTO', fieldName: 'IT_Product_Name_FRM__c', type: 'text'}, //, sortable: true},
        { label: 'SCONTO DA', fieldName: 'ER_Discount__c', type: 'decimal'},
        { label: 'SCONTO A', fieldName: 'IT_AG_Discount_to__c', type: 'decimal'},
        { label: 'PROVVIGIONI', fieldName: 'ER_Percentage__c', type: 'decimal'},
        { label: 'DURATA PAGAMENTO', fieldName: 'IT_AG_Payment_Duration__c', type: 'text'},
        {
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    ];
    @api output;
    @track _output = '';
    get output(){
        return this._output;
    }

    set output(val){
        this._output = val;
    }

    @api deleteOutput;
    @track _deleteOutput = '';
    get deleteOutput(){
        return this._deleteOutput;
    }

    set deleteOutput(val){
        this._deleteOutput = val;
    }
    
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const {id} = row;
        console.log("row: " +JSON.stringify(row));
        this._deleteOutput= row.Id;
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
        
    }

    findRowIndexById(id) {
        let ret = -1;
        this.arrData.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    handleResize(event) {
        const sizes = event.detail.columnWidths;
    }

    handleSelect(event) {
        var selectedRows = event.detail.selectedRows;
        console.log("selectedRows: " + JSON.stringify(selectedRows));
        if(selectedRows.length==1){
            this._output = selectedRows[0].Id;
        }
        else{
            this._output ="";
        }
        
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.arrData];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.arrData = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    handleGoNext() {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
    }
}