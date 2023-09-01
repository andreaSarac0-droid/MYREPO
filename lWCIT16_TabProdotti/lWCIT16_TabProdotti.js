import { LightningElement, api, track, wire } from 'lwc';
import modal from "@salesforce/resourceUrl/custommodalcss";
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getChargeAndVas from '@salesforce/apex/APIT122_TabProdottiController.getChargeAndVas';
import discardProduct from '@salesforce/apex/APIT122_TabProdottiController.discardProduct';
import getDefaultFilter from '@salesforce/apex/APIT122_TabProdottiController.getDefaultFilter';
import getNewId from '@salesforce/apex/APIT122_TabProdottiController.getNewId';
import cvfDefault from '@salesforce/apex/APIT122_TabProdottiController.cvfDefault';
import getDefaultOptions from '@salesforce/apex/APIT122_TabProdottiController.getDefaultOptions';
import isQuoteApproved from '@salesforce/apex/APIT122_TabProdottiController.isQuoteApproved';
import cloneOpportunity from '@salesforce/apex/APIT00_FlexBenefitController.cloneOpportunity';
import { refreshApex } from '@salesforce/apex';
import updateChargeValues from '@salesforce/apex/APIT122_TabProdottiController.updateChargeValues';
//method for button 'Aggiungi Prodotti e VAS'
import checkProductName from '@salesforce/apex/APIT122_TabProdottiController.checkProductName';

//FDL 
import getCharge from '@salesforce/apex/APIT122_TabProdottiController.getCharge';
import { updateRecord } from 'lightning/uiRecordApi';
import PRODUCT_NAME from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.zqu__ProductName__c';
import NAME from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.Name';
import VALUE from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.Welfare_Value__c';
import UMD from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.CurrencyIsoCOde__c';
import BILLING_NAME from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.Billing_Name__c';
import FINANCIAL_CENTER from '@salesforce/schema/zqu__QuoteRatePlanCharge__c.Fiancial_Center__c';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';

const actions = [
  { label: 'Scarta', name: 'scarta'}
];

const COLS = [
  {
      label: 'Prodotto',
      fieldName: PRODUCT_NAME.fieldApiName,
      editable: false
  },
  {
      label: 'Charge',
      fieldName: NAME.fieldApiName,
      editable: false
  },
  {
      label: 'Valore',
      fieldName: VALUE.fieldApiName,
      editable: true
  },
  {   label: 'UDM', 
      fieldName: UMD.fieldApiName, 
      editable: false },
  {
      label: 'Account Name',
      fieldName: BILLING_NAME.fieldApiName,
      editable: false
  },
  {
      label: 'Financial Center',
      fieldName: FINANCIAL_CENTER.fieldApiName,
      editable: false
  },
  { 
      type: 'action',
      typeAttributes: { rowActions: actions },
  }
];

/*
const columns = [
    { label: 'Prodotto', fieldName: 'zqu_ProductName' },
    { label: 'Charge', fieldName: 'Name' },
    { label: 'Valore', fieldName: 'IT_Value', editable: 'true'}, //FDL BilReplat 23/10/2022
    //{ label: 'Valore', fieldName: 'Welfare_Value', editable: 'true'},// FDL BilReplat 23/10/2022
    { label: 'UDM', fieldName: 'CurrencyIsoCode' },
    { label: 'Account Sold-To', fieldName: 'AccountId_Sold' },
    { label: 'Account Bill-To', fieldName: 'IT_Billing_Account'},
    // { label: 'Fattura', fieldName: 'Zuora_ZInvoice' }, DA REINSERIRE PER ZUORA! RF 19/10/22
    { label: 'Financial Center', fieldName: 'IT_Financial_Center' },
    { type: 'action',
      typeAttributes: { rowActions: actions },
    },
];
FDL */

export default class LWCIT16_TabProdotti extends LightningElement {
    
    @api recordId;
    columns = COLS;
    draftValues = [];
    displayList = [];
    @track qrpc;
    @track newQRPC;
    @track showMostraTutti;
    @track sortBy;
    @track sortDirection = 'desc';
    @track isQtAppr;

    showRecord(){
      console.log('recordId: ' + this.recordId);
    }

    @wire(getCharge, { oppId: '$recordId' })
    QuoteRatePlanCharge(result) {
      this.newQRPC = result;
      if (result.data) {
          this.qrpc = result.data;
          this.displayList = [...this.qrpc].splice(0,10);
          console.log('display list length: ' + this.qrpc.length);
          this.showMostraTutti = this.qrpc.length <= 10 ? false : true;
      }
    }

    doSorting(event) {
      this.sortBy = event.detail.fieldName;
      this.sortDirection = event.detail.sortDirection;
      this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.qrpc));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.qrpc = parseData;
    }    

    // async handleSave(event) {
    //     // Convert datatable draft values into record objects
    //     const records = event.detail.draftValues.slice().map((draftValue) => {
    //         const fields = Object.assign({}, draftValue);
    //         return { fields };
    //     });

    //     // Clear all datatable draft values
    //     this.draftValues = [];

    //     try {
    //         // Update all records in parallel thanks to the UI API
    //         const recordUpdatePromises = records.map((record) =>
    //             updateRecord(record)
    //         );
    //         await Promise.all(recordUpdatePromises);

    //         // Report success with a toast
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'QuoteRatePlanCharge updated',
    //                 variant: 'success'
    //             })
    //         );

    //         // Display fresh data in the datatable
    //         await refreshApex(this.newQRPC);
    //     } catch (error) {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error updating or reloading Products',
    //                 message: error.body.message,
    //                 variant: 'error'
    //             })
    //         );
    //     }
    // }

    handleSave(event) {
      console.log(this.recordId);
      isQuoteApproved({oppId: this.recordId}).then(result =>{
        this.isQtAppr = result;
        console.log(this.isQtAppr);
      }).catch(error =>{
        this.createToastMessage('Attenzione!', error.message,'error' ,'dismissable');
      }).finally(()=>{
        if(this.isQtAppr == false){
          this.saveCond(event);
        } else {
          this.createToastMessage('Attenzione!', 'Non puoi modificare le condizioni economiche se la quote è stata mandata in approvazione!','error' ,'dismissable');
        }
      })
    }

    async saveCond(event) {
      const updatedFields = event.detail.draftValues;
        console.log('updatedFields: ' + JSON.stringify(updatedFields));
        try {
            // Pass edited fields to the updateContacts Apex controller
            await updateChargeValues({ qrpcToUpdate: updatedFields });
            
          //Code to show a successful update message
          this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Valori aggiornati correttamente',
                variant: 'success'
            })
        );
          // Display fresh data in the datatable
            await refreshApex(this.newQRPC);
            
          // Clear all draft values in the datatable
            this.draftValues = [];
        } catch (error) {
            // Handle error scenario
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Errore durante l\'aggiornamento dei valori',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    //@api recordId;
    //@track columns = columns;
    // End FDL
    @track chargeList;
    @track chargeListOriginal;
    @track vasList;
    @track vasListOriginal;
    @track error;
    @track mostraTabVas = false;
    @track mostraTabProdotti = false;
    @track upCond = false;
    @track inputVariablesUpCond;
    @track optionsSoldTo = null;
    @track optionsBillTo = null;
    @track optionsInvoice = null;
    @track addProducts = false;
    @track value = null;
    @track alreadyInsertedSoldTo = [];
    @track alreadyInsertedBillTo = [];
    @track alreadyInsertedInvoice = [];
    @track eventSoldTo = null;
    @track eventBillTo = null;
    @track eventFattura = null;
    @track isLoading = false;
    @track zuoraSwitch = false;
    @track buttonLabel = "Mostra tutti";
    @track stopCvfDefault = false;

    selectedRowsIds = [];
    fistTimerendering = false;

    //disable button 'Aggiungi Prodotti e VAS'
    @track disableAggiungi = false;

    //logic for button 'Aggiungi Prodotti e VAS'
    @wire(checkProductName, { oppId: '$recordId' })
    QuoteRatePlanChargeProductName(result) {
      if(result){
        console.log('Result is >>> ' + JSON.stringify(result));
        this.disableAggiungi = result.data;
        console.log('Disable button value >>> ' + JSON.stringify(this.disableAggiungi));
      }
    }

    connectedCallback() {
      loadStyle(this, modal);
      getDefaultFilter({oppId: this.recordId}).then(result => {
        console.log(result);
        this.value = result;
      }).catch(error => {
        console.log('errore default filter=' + error.message);
      });

      getDefaultOptions({oppId: this.recordId}).then(result => {
        this.optionsSoldTo = [];
        for(var i = 0; i < result.length; i++){
          this.optionsSoldTo.push({value: result[i], label: result[i]});
        }
      }).catch(error => {
        console.log('errore default options=' + error.message);
      });
      // if(this.displayList.length > 0){
      //   // if (!this.stopCvfDefault) {
      //   //   cvfDefault({oppId: this.recordId}).then(() => {
      //   //     console.log('cvf = 10!');
      //   //     this.refreshView();
      //   //     this.stopCvfDefault = true;
      //   //   }).catch(error => {
      //   //     console.log('errore cvf default = ' + error.body.message);
      //   //   });
      //   // }
      //   this.handleCFV();
      // }
    }

      handleIsLoading(isLoading) {
        this.isLoading = isLoading;
      }

      // handleCFV(){
      //   console.log('stopCVF?: ' + this.stopCvfDefault);
      //   if (!this.stopCvfDefault) {
      //     cvfDefault({oppId: this.recordId}).then(() => {
      //       console.log('cvf = 10!');
      //       this.refreshView();
      //       this.stopCvfDefault = true;
      //     }).catch(error => {
      //       console.log('errore cvf default = ' + error.body.message);
      //     });
      //   }
      // }

    refreshView() {
      /*this.handleIsLoading(true);
      //return refreshApex(this.chargeList);
      getChargeAndVas({recordId: this.recordId}).then(result => {
        var vasResult = result['vas'];
        var chargeResult = result['charge'];
        // this.optionsBillTo = [];
        // this.optionsBillTo.push({value: 'noFiltroBill', label: '-- Nessun filtro --'});
        // this.optionsSoldTo = [];
        // //this.optionsSoldTo.push({value: 'noFiltroSold', label: '-- Nessun filtro --'});
        // this.optionsInvoice = [];
        // this.optionsInvoice.push({value: 'noFiltro', label: '-- Nessun filtro --'});
        // this.optionsInvoice.push({value: 'TEST FATTURA DIVERSA', label: 'TEST FATTURA DIVERSA'});
        this.manageCharge(chargeResult);
        this.manageVas(vasResult);
      }).catch(error => {
      console.log('errore getCH%VAS =' + JSON.stringify(error.message));
      }).finally(() => {
        eval("$A.get('e.force:refreshView').fire();");
        this.handleIsLoading(false);
      });*/
      this.handleIsLoading(true);
      refreshApex(this.newQRPC);
      //this.handleCFV();
      setTimeout(() => {
        this.handleIsLoading(false);
      }, 1000);
    }
    
    handleSelectedRows(event){
        this.selectedRowsIds = event.detail.selectedRows;
    }

    handleRowAction(event) {
      const actionName = event.detail.action.name;
      console.log(actionName);
      switch (actionName) {
          case 'updateCond':
              this.updateCond(event);
              break;
          case 'scarta':
              this.scarta(event);
              break;
          default:
      }
    }

    handleMostraTutti(){
      console.log('display list length: ' + this.displayList.length)
      if(this.displayList.length <= 10){
        this.displayList = [...this.qrpc];
        this.buttonLabel = "Mostra meno";
      } else {
        this.displayList = [...this.qrpc].splice(0,10);
        this.buttonLabel = "Mostra tutti";
      }
    }

    updateCond(event){
      this.upCond=!this.upCond;
      this.inputVariablesUpCond = [
        {
          name: "recordId",
          type: "String",
          value: event.detail.row.Id,
        },
    ];

    console.log('upCond: ' + this.upCond);
    }

    scarta(event){
      var rowId = event.detail.row.Id;
      console.log(rowId);
      discardProduct({chargeId: rowId}).then(result => {
        if(result=='Prodotto scartato'){
          this.createToastMessage('Successo!',result,'success','dismissable');
          this.refreshView();
        } else {
          this.createToastMessage('Attenzione!', result,'error' ,'dismissable');
        }
      }).catch(error => {
        this.createToastMessage('Attenzione!', error.message,'error' ,'dismissable');
      });
    }

    handleStatusChangeUpCond(event) {
      if (event.detail.status === "FINISHED") {
        console.log('success!');
        this.createToastMessage('Successo','Condizioni modificate!','success','dismissable');
        this.upCond=false;
      }
    }

    createToastMessage(title, message,variant,mode) {
      const event = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
          mode: mode
      });
      this.dispatchEvent(event);
    }

    manageVas(result){
      var objArray2 = [];

      for(var j = 0 ; j < result.length ; j++){
          objArray2.push(Object.assign({}, result[j]));
          if(!this.alreadyInsertedSoldTo.includes(result[j].AccountId_Sold)){
            this.alreadyInsertedSoldTo.push(result[j].AccountId_Sold);
            this.optionsSoldTo.push({value: result[j].AccountId_Sold, label: result[j].AccountId_Sold});
            if(this.value==null){
              this.value=result[j].AccountId_Sold;
              this.eventSoldTo = result[j].AccountId_Sold;
              console.log('eventSoldTo---vas---' + this.eventSoldTo);
            }
          }
          if(!this.alreadyInsertedBillTo.includes(result[j].IT_Billing_Account)){
            this.alreadyInsertedBillTo.push(result[j].IT_Billing_Account);
            this.optionsBillTo.push({value: result[j].IT_Billing_Account, label: result[j].IT_Billing_Account});
          }
          if(!this.alreadyInsertedInvoice.includes(result[j].Zuora_ZInvoice)){
            this.alreadyInsertedInvoice.push(result[j].Zuora_ZInvoice);
            this.optionsInvoice.push({value: result[j].Zuora_ZInvoice, label: result[j].Zuora_ZInvoice});
          }
        }

      this.vasList = objArray2;
      console.log('size:' + this.vasList.length);
      console.log('vas list = ' + this.vasList);
      this.vasListOriginal = objArray2;
      this.vasList = this.vasListOriginal.filter((item) => {
        return item.AccountId_Sold == this.value;
      });
      if (this.vasList.length > 0){
          this.mostraTabVas = true;
      }
    }

    manageCharge(result){
      var objArray = [];

      for(var i = 0 ; i < result.length ; i++){
          objArray.push(Object.assign({}, result[i]));
          if(!this.alreadyInsertedSoldTo.includes(result[i].AccountId_Sold)){
            this.alreadyInsertedSoldTo.push(result[i].AccountId_Sold);
            this.optionsSoldTo.push({value: result[i].AccountId_Sold, label: result[i].AccountId_Sold});
            if(this.value==null){
              this.value=result[i].AccountId_Sold;
              this.eventSoldTo = result[i].AccountId_Sold;
              console.log('eventSoldTo---charge---' + this.eventSoldTo);
            }
          }
          if(!this.alreadyInsertedBillTo.includes(result[i].IT_Billing_Account)){
            this.alreadyInsertedBillTo.push(result[i].IT_Billing_Account);
            this.optionsBillTo.push({value: result[i].IT_Billing_Account, label: result[i].IT_Billing_Account});
          }
          if(!this.alreadyInsertedInvoice.includes(result[i].Zuora_ZInvoice)){
            this.alreadyInsertedInvoice.push(result[i].Zuora_ZInvoice);
            this.optionsInvoice.push({value: result[i].Zuora_ZInvoice, label: result[i].Zuora_ZInvoice});
          }
      }
      console.log('optionss: ' + JSON.stringify(this.optionsSoldTo));

      this.chargeList = objArray;
      console.log('size:' + this.chargeList.length);
      this.chargeListOriginal = objArray;
      this.chargeList = this.chargeListOriginal.filter((item) => {
        return item.AccountId_Sold == this.value;
      });
      if (this.chargeList.length> 0){
        console.log('size:' + this.chargeList.length);
        this.mostraTabProdotti = true;
      }
    }

    // renderedCallback() {
    //   if (this.recordId != null && this.recordId != undefined && !this.fistTimerendering) {
    //     this.fistTimerendering = true;
    //     // getChargeAndVas({recordId: this.recordId}).then(result => {
    //     //   console.log('TEST: ' + JSON.stringify(result));
    //     //   var vasResult = result['vas'];
    //     //   var chargeResult = result['charge'];
    //     //   this.optionsBillTo = [];
    //     //   this.optionsBillTo.push({value: 'noFiltroBill', label: '-- Nessun filtro --'});
    //     //   this.optionsSoldTo = [];
    //     //   //this.optionsSoldTo.push({value: 'noFiltroSold', label: '-- Nessun filtro --'});
    //     //   this.optionsInvoice = [];
    //     //   this.optionsInvoice.push({value: 'noFiltro', label: '-- Nessun filtro --'});
    //     //   this.manageCharge(chargeResult);
    //     //   this.manageVas(vasResult);
    //     // }).catch(error => {
    //     //   console.log('errore getCH&VAS(1)=' + error.message);
    //     // });
    //     getDefaultFilter({oppId: this.recordId}).then(result => {
    //       console.log(result);
    //       this.value = result;
    //     }).catch(error => {
    //       console.log('errore default filter=' + error.message);
    //     });

    //     getDefaultOptions({oppId: this.recordId}).then(result => {
    //       this.optionsSoldTo = [];
    //       for(var i = 0; i < result.length; i++){
    //         this.optionsSoldTo.push({value: result[i], label: result[i]});
    //       }
    //     }).catch(error => {
    //       console.log('errore default options=' + error.message);
    //     });
    //   }
    //   if (!this.stopCvfDefault) {
    //     cvfDefault({oppId: this.recordId}).then(() => {
    //       console.log('cvf = 10!');
    //       this.stopCvfDefault = true;
    //     }).catch(error => {
    //       console.log('errore cvf default = ' + error.body.message);
    //     });
    //   }
    // }

    handleChangeSoldTo(event){
      // this.vasList = this.vasListOriginal.filter((item) => {
      //   return item.AccountId_Sold == event.target.value;
      // });
      // this.chargeList = this.chargeListOriginal.filter((item) => {
      //   return item.AccountId_Sold == event.target.value;
      // });
      // this.eventSoldTo = event.target.value;

      // var account = event.target.value;
      // console.log('account name: ' + account);
      // getFilteredCharge({oppId: this.recordId, accName: account}).then(result => {
      //   console.log('filter result: ' + result);
      //   this.QuoteRatePlanCharge = result;
      //   console.log(this.QuoteRatePlanCharge.data);
      // }).catch(error => {
      //   console.log('errore filtro = ' + error.message);
      // });

      var account = event.target.value;
      getNewId({oppId: this.recordId, accName: account}).then(result => {
          console.log('filter result: ' + result);
          this.recordId = result;
        }).catch(error => {
          console.log('errore filtro = ' + error.message);
        }).finally(() => {
          // this.handleIsLoading(true);
          refreshApex(this.QuoteRatePlanCharge);
          // setTimeout(() => {
          //   this.handleIsLoading(false);
          // }, 1000);
          console.log('recId = ' + this.recordId);
        });

      if(this.eventBillTo != null){
        this.vasList = this.vasList.filter((item) => {
          return item.IT_Billing_Account == this.eventBillTo;
        });
        this.chargeList = this.chargeList.filter((item) => {
          return item.IT_Billing_Account == this.eventBillTo;
        });
      }
      if(this.eventFattura != null){
        this.vasList = this.vasList.filter((item) => {
          return item.Zuora_ZInvoice == this.eventFattura;
        });
        this.chargeList = this.chargeList.filter((item) => {
          return item.Zuora_ZInvoice == this.eventFattura;
        });   
      }
    }

    handleChangeBillTo(event){
      if(event.target.value == 'noFiltroBill'){
        this.vasList = this.vasListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        this.chargeList = this.chargeListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        if(this.eventFattura != null){
          this.vasList = this.vasList.filter((item) => {
            return item.Zuora_ZInvoice == this.eventFattura;
          });
          this.chargeList = this.chargeList.filter((item) => {
            return item.Zuora_ZInvoice == this.eventFattura;
          });    
        }
        this.eventBillTo = null;
        console.log('eventBillTo---' + this.eventBillTo);
      } else {
        this.vasList = this.vasListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        this.chargeList = this.chargeListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        if(this.eventFattura != null){
          this.vasList = this.vasList.filter((item) => {
            return item.Zuora_ZInvoice == this.eventFattura;
          });
          this.chargeList = this.chargeList.filter((item) => {
            return item.Zuora_ZInvoice == this.eventFattura;
          });   
        }
        this.vasList = this.vasList.filter((item) => {
          return item.IT_Billing_Account == event.target.value;
        });
        this.chargeList = this.chargeList.filter((item) => {
          return item.IT_Billing_Account == event.target.value;
        });
        this.eventBillTo = event.target.value;
        console.log('eventBillTo---' + this.eventBillTo);
      }
    }

    handleChangeInvoice(event){
      if(event.target.value == 'noFiltro'){
        this.vasList = this.vasListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        this.chargeList = this.chargeListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        if(this.eventBillTo != null){
          this.vasList = this.vasList.filter((item) => {
            return item.IT_Billing_Account == this.eventBillTo;
          });
          this.chargeList = this.chargeList.filter((item) => {
            return item.IT_Billing_Account == this.eventBillTo;
          });
        }
        this.eventFattura = null;
        console.log('eventFattura---' + this.eventFattura);
      } else {
        this.vasList = this.vasListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        this.chargeList = this.chargeListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        if(this.eventBillTo != null){
          this.vasList = this.vasList.filter((item) => {
            return item.IT_Billing_Account == this.eventBillTo;
          });
          this.chargeList = this.chargeList.filter((item) => {
            return item.IT_Billing_Account == this.eventBillTo;
          });   
        }
        this.vasList = this.vasList.filter((item) => {
          return item.Zuora_ZInvoice == event.target.value;
        });
        this.chargeList = this.chargeList.filter((item) => {
          return item.Zuora_ZInvoice == event.target.value;
        });
        this.eventFattura = event.target.value;
        console.log('eventFattura---' + this.eventFattura);
      }
    }

    openAddProducts(){
      this.addProducts = true;
      this.template.querySelector("c-l-w-c-i-t18_-aggiungi-prodotti").fireQuery();
    }

    closeAddProducts(){
      this.addProducts = false;
    }

    // extendToGroup() {
    //   for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
    //     recId = 'test';
    //     grpId = 'test';
        
    //     cloneOpportunity({flexBenefitId: recId, groupId: grpId}).then(() => {
    //       this.createToastMessage('Successo','Processo di estensione in corso','success','dismissable');
    //     }).catch(error => {
    //     console.log('errore =' + JSON.stringify(error.message));
    //     });
    //   }
    // }

    groupVas() {
      if(this.vasList != this.vasListOriginal){
        this.vasList = this.vasListOriginal;
        this.mostraTabProdotti = false;
      } else {
        this.vasList = this.vasListOriginal.filter((item) => {
          return item.AccountId_Sold == this.eventSoldTo;
        });
        if(this.eventBillTo != null){
          this.vasList = this.vasList.filter((item) => {
            return item.IT_Billing_Account == this.eventBillTo;
          });
        }
        if(this.eventFattura != null){
          this.vasList = this.vasList.filter((item) => {
            return item.Zuora_ZInvoice == this.eventFattura;
          });
        }
        //this.mostraTabProdotti = true;
      }
    }

  /*extendToGroup: function(component, event, helper) {
    var recordId = component.get('v.selectedValue');
    console.log('extendToGroup - selectedValue(flexBenefitId): '+recordId);
    var groupId = component.get('v.groupId');
    console.log('extendToGroup - groupId: '+groupId);
    var action = component.get("c.cloneOpportunity");
    helper.alert(component, event, "Success", '', "Processo di estensione in corso.");
    action.setParams({
        flexBenefitId: recordId,
        groupId: groupId
    });
    action.setCallback(this, function(response){
        var state = response.getState();
        if (state === "SUCCESS") {
    
        }                   
    }); 
     $A.enqueueAction(action);
}

sincronizza(event) {
  var quoteIds = [];
  var oppIds = [];
  for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
    if(this.selectedRowsIds[i].IT_Synced_Zuora_Quote != null && this.selectedRowsIds[i].IT_Synced_Zuora_Quote != undefined){
      quoteIds.push(this.selectedRowsIds[i].IT_Synced_Zuora_Quote);
      oppIds.push(this.selectedRowsIds[i].recordId);
    }
  }
  if(quoteIds.length > 0){
    MassivesyncQuoteAndOpportunityFuture({recordIds: quoteIds,oppIds: oppIds}).then(result => {
      this.createToastMessage('Successo','Sincronizzazione massiva in corso, clicca refresh per avere il risultato','success','dismissable');
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }
  else{
    this.createToastMessage('Attenzione','Selezionare almeno un elemento associato ad una Quote','error','dismissable');
  }
}*/


}