import LightningDatatable from 'lightning/datatable';
//import the template so that it can be reused
import DatatablePicklistTemplate from './lWCIT04_PosteDiscount.html';
import {
    loadStyle
} from 'lightning/platformResourceLoader';
import CustomDataTableResource from '@salesforce/resourceUrl/CustomDataTableResource';

export default class lWCIT04_PosteDiscount extends LightningDatatable {
    static customTypes = {
        picklist: {
            template: DatatablePicklistTemplate,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'fieldName'],
        },
    };
    constructor() {
        super();
        Promise.all([
            loadStyle(this, CustomDataTableResource),
        ]).then(() => {})
    }
}