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
        { label: 'COMPENSI', fieldName: 'ER_Percentage__c', type: 'decimal'},
        { label: 'COMPENSI ANNO 2', fieldName: 'IT_Percentage_2__c', type: 'decimal'},
        { label: 'COMPENSI ANNO 3', fieldName: 'IT_Percentage_3__c', type: 'decimal'},
        { label: 'APPLICA SU FEE', fieldName: 'IT_Apply_to_Fee__c', type: 'boolean'},
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

    @api IdDeletedOutput;
    @track _IdDeletedOutput = '';
    get IdDeletedOutput(){
        return this._IdDeletedOutput;
    }

    @api numSelectedRows;
    @track _numSelectedRows = 0;
    get numSelectedRows(){
        return this._numSelectedRows;
    }

    set deleteOutput(val){
        this._deleteOutput = val;
    }

    set IdDeletedOutput(val){
        this._IdDeletedOutput = val;
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
        console.log("row: " +JSON.stringify(row.Id));
        //this._deleteOutput = row.Id;
        this._IdDeletedOutput = row.Id;
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
        var list1 = [];
        var selectedRows = event.detail.selectedRows;
        for(var i=0;i<selectedRows.length; i++){
            list1.push(selectedRows[i].Id);
        }
        this._numSelectedRows = selectedRows.length;
        console.log("selectedRows: " +  JSON.stringify(list1));
        console.log("Numero di selectedRows: " +  JSON.stringify(selectedRows.length));
        //this._output = selectedRows;
        this._output = list1;
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