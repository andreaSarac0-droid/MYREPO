import { LightningElement, api, track } from 'lwc';
import modal from "@salesforce/resourceUrl/custommodalcss";
import { loadStyle } from "lightning/platformResourceLoader";
import getOpptyList from '@salesforce/apex/APIT121_OppGruppoController.getOpptyList';
import MassiveAuth from '@salesforce/apex/APIT00_GroupController.MassiveAuth';
import MassivesyncQuoteAndOpportunityFuture from '@salesforce/apex/APIT00_GroupController.MassivesyncQuoteAndOpportunityFuture';
import Won from '@salesforce/apex/APIT00_GroupController.Won';
import updateStage from '@salesforce/apex/APIT00_GroupController.updateStage';
import generateContract from '@salesforce/apex/APIT00_GroupController.generateContract';
import MassiveUpdateStageFuture from '@salesforce/apex/APIT00_GroupController.MassiveUpdateStageFuture';
import MassiveUpdateStageFutureGroup from '@salesforce/apex/APIT00_GroupController.MassiveUpdateStageFutureGroup';
import MassiveWonFuture from '@salesforce/apex/APIT00_GroupController.MassiveWonFuture';
import DiscardOpportunity from '@salesforce/apex/APIT00_GroupController.DiscardOpportunity';
import Revision from '@salesforce/apex/APIT00_GroupController.Revision';
import getOpportunityQuote from '@salesforce/apex/APIT00_GroupController.getOpportunityQuote';
import ValidLince from '@salesforce/apex/APIT00_GroupController.ValidLince';
import getCervedDoc from '@salesforce/apex/APIT00_GroupController.getCervedDoc';
import checkQuoteConditions from '@salesforce/apex/APIT00_GroupController.checkQuoteConditions';
import filterDocuSignWelfare from '@salesforce/apex/APIT00_GroupController.filterDocuSignWelfare';
import wonGroup from '@salesforce/apex/APIT140_WonFlexbenefit.wonGroup';
import getAgreement from '@salesforce/apex/APIT121_OppGruppoController.getAgreement';
import isQuoteApproved from '@salesforce/apex/APIT121_OppGruppoController.isQuoteApproved';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
  { label: 'Sincronizza', name: 'sincronizza' },
  { label: 'Vinci', name: 'vinci' },
  { label: 'Revisiona', name: 'revision' },
  //{ label: 'PDF', name: 'openPdf' },
  { label: 'Scarta', name: 'discard' },
  { label: 'Modifica account', name: 'modAcc' },
  { label: 'Modifica indirizzo', name: 'modInd' },
  // { label: 'Esito', name: 'esito' },
  { label: 'Lince', name: 'lince' },
  { label: 'Modifica Condizioni', name: 'updateCond' },
  { label: 'Invia DocuSign', name: 'onClickDocu' },
];

const cols = [
    { label: 'Opportunità', fieldName: 'OpptyURL', type: 'url',
      typeAttributes: {
        label: {
          fieldName: 'Name'
        }
      }
    },
    //{ label: 'Financial Center', fieldName: 'IT_Financial_Center' },
    { label: 'Prodotto', fieldName: 'ER_Product_Family' },
    { label: 'Metodo Pagamento', fieldName: 'ER_PaymentMethod' },
    { label: 'Frequenza Canone', fieldName: 'IT_Canon_Frequenc' },
    { label: 'Pec', fieldName: 'IT_Company_PEC' },
    { label: 'Cod. Fattura Elettronica', fieldName: 'IT_Ebill_Target_Code'},
    { label: 'Cod. Univoco Ufficio', fieldName: 'IT_Office_Code' },
    { label: 'Data Firma', fieldName: 'IT_Signed_Date'},
    { label: 'Att. senza firma', fieldName: 'IT_No_Sign_Activation_Authorization', type: 'boolean'},
    { label: 'Tipo Cliente', fieldName: 'IT_Company_Type'},
    { label: 'Stato Opportunità', fieldName: 'StageName' },
    { label: 'Stato Quote', fieldName: 'IT_Approval_Stage'},
    { label: 'Stato Quote', fieldName: 'IT_Approval_StageVAS'},
    { label: 'Quote', fieldName: 'QuoteURL', type: 'url',
      typeAttributes: {
        label: {
          fieldName: 'IT_Synced_Zuora_Quote'
        }
      }},
    { label: 'Quote', fieldName: 'QuoteVasURL', type: 'url',
    typeAttributes: {
      label: {
        fieldName: 'IT_Quote_VAS'
      }
    }},
    { label: 'Result', fieldName: 'IT_Action_Result' },
    { type: 'action',
      typeAttributes: { rowActions: actions },
    },
];

export default class LWCIT15_OppGruppo extends NavigationMixin(LightningElement) {
    @api recordId;
    @track columns = cols;
    @track opptyList;
    @track error;
    @track groupIdTest;
    @track convenzione = false;
    @track chAddr = false;
    @track chAcct = false; 
    @track upCond = false;
    @track inputVariablesChAddr;
    @track inputVariablesChAcct;
    @track inputVariablesUpCond;
    @track errorDocu;
    @track showPdf = false;
    @track pdfRecordId;
    @track checkStatus = false;
    @track isLoading = false;
    @track compType = 'notPrivate';
    @track oppoType;
    @track disableUpCond = true;
    @track conv;
    @track isQtAppr;

    selectedRowsIds = [];
    fistTimerendering = false;

    // connectedCallback() {
    //   loadStyle(this, modal);
    // }

    handleColumns() {
      if (this.compType == 'Private' && this.oppoType == 'vas') {
          this.columns = [...cols].filter(col => col.fieldName != 'IT_Office_Code' && col.fieldName != 'QuoteURL' && col.fieldName != 'IT_Approval_Stage');
      } else if (this.compType == 'Private' && this.oppoType != 'vas') {
          this.columns = [...cols].filter(col => col.fieldName != 'IT_Office_Code' && col.fieldName != 'QuoteVasURL' && col.fieldName != 'IT_Approval_StageVAS');
      } else if (this.compType != 'Private' && this.oppoType == 'vas') {
          this.columns = [...cols].filter(col => col.fieldName != 'IT_Ebill_Target_Code' && col.fieldName != 'QuoteURL' && col.fieldName != 'IT_Approval_Stage');
      } else {
          this.columns = [...cols].filter(col => col.fieldName != 'IT_Ebill_Target_Code' && col.fieldName != 'QuoteVasURL' && col.fieldName != 'IT_Approval_StageVAS');
      }
      console.log('test comp type:' + this.compType + 'oppo: ' + this.oppoType);
    }

    connectedCallback() {
      loadStyle(this, modal);
      if (this.recordId != null && this.recordId != undefined) {
        getOpptyList({recordId: this.recordId}).then(result => {

          var objArray = [];

          for(var i = 0 ; i < result.length ; i++){
            objArray.push(Object.assign({}, result[i]));
          }

          //HYPERLINK START
          if(objArray.length > 0){
            objArray.forEach(item => {
              if(item['Id'] != null && item['Id'] != undefined) item['OpptyVasURL'] = '/lightning/r/Opportunity/' + item['Id'] + '/view'
            });
            objArray.forEach(item => {
              if(item['IT_Quote_VASId'] != null && item['IT_Quote_VASId'] != undefined) item['QuoteVasURL'] = '/lightning/r/zqu__Quote__c/' + item['IT_Quote_VASId'] + '/view'
            });
            objArray.forEach(item => {
              if(item['Id'] != null && item['Id'] != undefined) item['OpptyURL'] = '/lightning/r/Opportunity/' + item['Id'] + '/view'
            });
            objArray.forEach(item => {
              if(item['IT_Synced_Zuora_QuoteId'] != null && item['IT_Synced_Zuora_QuoteId'] != undefined) item['QuoteURL'] = '/lightning/r/zqu__Quote__c/' + item['IT_Synced_Zuora_QuoteId'] + '/view'
            });
            // objArray.forEach(item => {
            //   if(item['IT_Approval_Stage'] === 'In Approval' || item['IT_Approval_Stage'] === 'In Approvazione'){
            //     this.checkStatus = true;
            //   } else {
            //     this.checkStatus = false;
            //   }
            // });
            if(objArray[0]['IT_Approval_Stage'] === 'In Approval' || objArray[0]['IT_Approval_Stage'] === 'In Approvazione'){
              this.checkStatus = true;
            } else {
              this.checkStatus = false;
            }
            // objArray.forEach(item => {
            //   if(item['IT_Company_Type'] == 'Private') this.compType = 'Private';
            // });
            //HYPERLINK END
            if(objArray[0]['IT_Company_Type'] == 'Private' || objArray[0]['IT_Company_Type'] == 'Privato') this.compType = 'Private';
            if(objArray[0]['Type'] == '13') this.oppoType = 'vas';
          }

          console.log('checkStatus: ' + this.checkStatus);
          if(this.checkStatus){
            objArray.forEach(item => {
              item['IT_Approval_Stage'] = 'In Approvazione'
            });
          }

          this.opptyList = objArray;
          this.groupIdTest = result[0].IT_GroupId;

        }).catch(error => {
          console.log('erroree =' + JSON.stringify(error.message));
        }).then(() => {
            if (this.compType != null){
              this.handleColumns();
            }
        });
      }
    }

    handleRowAction(event) {
      const actionName = event.detail.action.name;
      const row = event.detail.row;
      switch (actionName) {
          case 'sincronizza':
              this.sincronizzaRow(event);
              break;
          case 'vinci':
              this.vinciRow(event);
              break;
          case 'discard':
              this.discard(event);
              break;
          case 'revision':
              this.revision(event);
              break;
          case 'lince':
              this.lince(event);
              break;
          case 'openPdf':
              this.openPdf(event);
              break;
          case 'modAcc':
              this.changeAccount(event);
              break;
          case 'modInd':
              this.changeAddress(event);
              break;
          case 'esito':
              this.esito(event);
              break;
          case 'updateCond':
              this.updateCond(event);
              break;
          case 'onClickDocu':
              this.onClickDocu(event);
              break;
          default:
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

  handleSelectedRows(event){
    this.selectedRowsIds = event.detail.selectedRows;
  }

    // updateRecordView() {
    //   setTimeout(() => {
    //       console.log('pre-eval spinner = ' + this.isLoading);
    //       eval("$A.get('e.force:refreshView').fire();");
    //       console.log('post-eval spinner = ' + this.isLoading);
    //   }, 1000); 
    //   console.log('post-timeout spinner = ' + this.isLoading);
    // }

  handleIsLoading(isLoading) {
    this.isLoading = isLoading;
  }

  refreshView() {
    this.handleIsLoading(true);


    /*getOpptyList({ recordId: this.recordId }).then(result => {
        var objArray = [];

        for(var i = 0 ; i < result.length ; i++){
          objArray.push(Object.assign({}, result[i]));
        }

        //HYPERLINK START
        if(objArray.length > 0){
          objArray.forEach(item => {
            if(item['Id'] != null && item['Id'] != undefined) item['OpptyURL'] = '/lightning/r/Opportunity/' + item['Id'] + '/view'
          });
          objArray.forEach(item => {
            if(item['IT_Synced_Zuora_QuoteId'] != null && item['IT_Synced_Zuora_QuoteId'] != undefined) item['QuoteURL'] = '/lightning/r/zqu__Quote__c/' + item['IT_Synced_Zuora_QuoteId'] + '/view'
          });
          objArray.forEach(item => {
            if(item['IT_Approval_Stage'] === 'In Approval' || item['IT_Approval_Stage'] === 'In Approvazione') this.checkStatus = true
          });
        }
        //HYPERLINK END

        console.log('checkStatus: ' + this.checkStatus);
        if(this.checkStatus){
          objArray.forEach(item => {
            item['IT_Approval_Stage'] = 'In Approvazione'
          });
        }

        this.opptyList = objArray;
        setTimeout(() => {
          console.log('spinner pre-refresh: ' + this.isLoading);
          eval("$A.get('e.force:refreshView').fire();");
          console.log('spinner post-refresh: ' + this.isLoading);
        }, 1000);
    }).catch(error => {
        this.createToastMessage('Error updating or refreshing records', error.message, 'Error', 'dismissable');
    }).finally(()=>{
        setTimeout(() => {
          this.handleIsLoading(false);
          console.log('spinner finally: ' + this.isLoading);
        }, 1500);
    });*/

    if (this.recordId != null && this.recordId != undefined) {
      getOpptyList({recordId: this.recordId}).then(result => {
        var objArray = [];

          for(var i = 0 ; i < result.length ; i++){
            objArray.push(Object.assign({}, result[i]));
          }

          //HYPERLINK START
          if(objArray.length > 0){
            objArray.forEach(item => {
              if(item['Id'] != null && item['Id'] != undefined) item['OpptyVasURL'] = '/lightning/r/Opportunity/' + item['Id'] + '/view'
            });
            objArray.forEach(item => {
              if(item['IT_Quote_VASId'] != null && item['IT_Quote_VASId'] != undefined) item['QuoteVasURL'] = '/lightning/r/zqu__Quote__c/' + item['IT_Quote_VASId'] + '/view'
            });
            objArray.forEach(item => {
              if(item['Id'] != null && item['Id'] != undefined) item['OpptyURL'] = '/lightning/r/Opportunity/' + item['Id'] + '/view'
            });
            objArray.forEach(item => {
              if(item['IT_Synced_Zuora_QuoteId'] != null && item['IT_Synced_Zuora_QuoteId'] != undefined) item['QuoteURL'] = '/lightning/r/zqu__Quote__c/' + item['IT_Synced_Zuora_QuoteId'] + '/view'
            });
            if(objArray[0]['IT_Approval_Stage'] === 'In Approval' || objArray[0]['IT_Approval_Stage'] === 'In Approvazione'){
              this.checkStatus = true;
            } else {
              this.checkStatus = false;
            }
          }
          //HYPERLINK END

          console.log('checkStatus: ' + this.checkStatus);
          if(this.checkStatus){
            objArray.forEach(item => {
              item['IT_Approval_Stage'] = 'In Approvazione'
            });
          }

          this.opptyList = objArray;
      }).catch(error => {
        console.log('errore =' + JSON.stringify(error));
      }).finally(() => {
        eval("$A.get('e.force:refreshView').fire();");
        // updateRecord({ fields: { Id: this.recordId }});
        this.handleIsLoading(false);
      });
      //eval("$A.get('e.force:refreshView').fire();");
    }
  }

  inviaAutorizzazione() {
    console.log('pre-get agreement');
    getAgreement({oppId: this.recordId}).then(result => {
      console.log('convenzione = ' + result);
      this.conv = result;
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore durante il fetch della convenzione!','error','dismissable');
    }).finally(() => {
      var quoteIds = [];

      //var table = this.template.querySelector('lightning-datatable');
      //var rows = table.data;
      console.log('selected rows: ' + this.selectedRowsIds);

      for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
      //for(var i = 0 ; i < this.rows.length ; i++){
        if(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != null && this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != undefined){
          quoteIds.push(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId);
        }
      }
      console.log('quote IDs: ' + quoteIds);
      if (this.conv == true || this.selectedRowsIds[0].Type == '13') {
        if(quoteIds.length > 0){
          MassiveAuth({recordIds: quoteIds}).then(() => {
            this.createToastMessage('Successo','Quote selezionate mandate in approvazione','success','dismissable');
          }).catch(error => {
            this.createToastMessage('Attenzione', error.body.message,'error','dismissable');
          });
        }
        else{
          this.createToastMessage('Attenzione','Selezionare almeno un elemento associato ad una Quote','error','dismissable');
        }
      } else {
        this.createToastMessage('Attenzione','Selezionare una convenzione oppure no convenzione!','error','dismissable');
      }
    });
    // var quoteIds = [];

    // //var table = this.template.querySelector('lightning-datatable');
    // //var rows = table.data;
    // console.log('selected rows: ' + this.selectedRowsIds);

    // for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
    // //for(var i = 0 ; i < this.rows.length ; i++){
    //   if(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != null && this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != undefined){
    //     quoteIds.push(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId);
    //   }
    // }
    // console.log('quote IDs: ' + quoteIds);
    // if (this.conv == true) {
    //   if(quoteIds.length > 0){
    //     MassiveAuth({recordIds: quoteIds}).then(() => {
    //       this.createToastMessage('Successo','Quote selezionate mandate in approvazione','success','dismissable');
    //     }).catch(error => {
    //       this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    //     });
    //   }
    //   else{
    //     this.createToastMessage('Attenzione','Selezionare almeno un elemento associato ad una Quote','error','dismissable');
    //   }
    // } else {
    //   this.createToastMessage('Attenzione','Selezionare una convenzione oppure no convenzione!','error','dismissable');
    // }

  }

  getConvenzione() {
    var oppIds = [];
    for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
      oppIds.push(this.selectedRowsIds[i].Id);
    }

  }

  sincronizza() {
    console.log('sync cliccato');
    var quoteIds = [];
    var oppIds = [];
    for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
      if(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != null && this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId != undefined){
        quoteIds.push(this.selectedRowsIds[i].IT_Synced_Zuora_QuoteId);
        oppIds.push(this.selectedRowsIds[i].Id);
      }
    }
    //
    isQuoteApproved({quoteIds: quoteIds}).then(result =>{
      this.isQtAppr = result;
      console.log('is quote approved?: ' + this.isQtAppr);
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore durante la lettura dello stato della quote!','error','dismissable');
    }).finally(() => {
      console.log('quoteIds: ' + quoteIds + ' and OppIds: ' + oppIds);
      if(quoteIds.length > 0){
        if(this.isQtAppr){
          MassivesyncQuoteAndOpportunityFuture({recordIds: quoteIds,oppIds: oppIds}).then(result => {
            this.createToastMessage('Successo','Sincronizzazione massiva in corso, clicca refresh per avere il risultato','success','dismissable');
          }).catch(error => {
            this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
          });
        } else {
          this.createToastMessage('Attenzione','Le quote selezionate devono essere approvate prima della sincronizzazione!','error','dismissable');
        }
      } else {
        this.createToastMessage('Attenzione','Selezionare almeno un elemento associato ad una Quote','error','dismissable');
      }
    });
    //
  }

  sincronizzaRow(event){
    var rowId = event.detail.row.Id;
    var qt = event.detail.row.IT_Synced_Zuora_Quote;
    console.log('rowId: ' + rowId);
    console.log('rowId.IT_Synced_Zuora_Quote: ' + event.detail.row.IT_Synced_Zuora_Quote);
    var quoteIds = [];
    var oppIds = [];
    if (qt != null && qt != undefined){
      quoteIds.push(qt);
      oppIds.push(rowId);
    }
    console.log('quoteIds: ' + quoteIds);
    console.log('oppIds: ' + oppIds);
    if(quoteIds.length > 0){
      MassivesyncQuoteAndOpportunityFuture({recordIds: quoteIds,oppIds: oppIds}).then(result => {
        this.createToastMessage('Successo','Sincronizzazione in corso, clicca refresh per avere il risultato','success','dismissable');
      }).catch(error => {
        this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
      });
    }
    else{
      this.createToastMessage('Attenzione','L\'elemento non è associato ad una Quote','error','dismissable');
    }
  }

  vinciRow(event){
    var rowId = event.detail.row.Id;
    var oppIds = [];
    oppIds.push(rowId);
    console.log('oppIds: ' + oppIds);
    var selectStatus = 'Closed Won';
      var oppIdsStageUpdated = [];
      MassiveUpdateStageFutureGroup({recordIds: oppIds, status: selectStatus}).then(result => {
        for(var i = 0 ; i < result.length ; i++){
          oppIdsStageUpdated.push(result[i]);
        }
        wonGroup({recordIds: oppIdsStageUpdated}).then(() => {
          // FINE MODIFICHE MASSIVE UPDATE STAGE 12/10
            this.createToastMessage('Successo','Won massivo in corso, clicca refresh per avere il risultato','success','dismissable');
          }).catch(error => {
            this.createToastMessage('Attenzione','Errore: ' + error.message,'error','dismissable');
          });
      }).catch(error => {
        this.createToastMessage('Attenzione', 'Errore: ' + error.message,'error','dismissable');
      });

    // OLD CODE-----------------------------------------------------------------------------------------------
    // var rowId = event.detail.row.Id;
    // var rowsWithoutParentOpp = [];
    // var OppRow;

    // if(rowId == this.recordId){
    //   OppRow = rowId;
    // }
    // else{
    //   rowsWithoutParentOpp.push(rowId);
    // }
    // if(OppRow != null){
    //   alert('a')
    //   this.postWon(OppRow);
    // }
    // if (rowsWithoutParentOpp.length > 0){
    //   alert('b')
    //   this.postWonFUTURE(rowsWithoutParentOpp);
    // }
    // else{
    //   alert('c')
    //     rowsWithoutParentOpp.push(OppRow);
    //     this.postWonFUTURE(rowsWithoutParentOpp);
    // }
    // OLD CODE-----------------------------------------------------------------------------------------------
  }

  vinci() {
    if(this.selectedRowsIds.length > 0){
      var oppIds = [];
      for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
        oppIds.push(this.selectedRowsIds[i].Id);
      }
      console.log('oppIds: ' + oppIds);
      // MODIFICHE MASSIVE UPDATE STAGE 12/10
      var selectStatus = 'Closed Won';
      var oppIdsStageUpdated = [];
      MassiveUpdateStageFutureGroup({recordIds: oppIds, status: selectStatus}).then(result => {
        for(var i = 0 ; i < result.length ; i++){
          oppIdsStageUpdated.push(result[i]);
        }
        wonGroup({recordIds: oppIdsStageUpdated}).then(() => {
          // FINE MODIFICHE MASSIVE UPDATE STAGE 12/10
            this.createToastMessage('Successo','Won massivo in corso, clicca refresh per avere il risultato','success','dismissable');
          }).catch(error => {
            this.createToastMessage('Attenzione','Errore Won: ' + error.message,'error','dismissable');
          });
      }).catch(error => {
        this.createToastMessage('Attenzione', 'Errore Massive Update: ' + error.message,'error','dismissable');
      });
    }

    // OLD CODE-----------------------------------------------------------------------------------------------
    // if(this.selectedRowsIds.length > 0){
    //   var rowsWithoutParentOpp = [];
    //   var OppRow;
    //   for(var i = 0 ; i < this.selectedRowsIds.length ; i++){
    //     if(this.selectedRowsIds[i].recordId == this.recordId){
    //       OppRow = this.selectedRowsIds[i];
    //     }
    //     else{
    //       rowsWithoutParentOpp.push(this.selectedRowsIds[i]);
    //     }
    //   }
    //   if(OppRow != null){
    //     alert('a')
    //     this.postWon(OppRow);
    //   }
    //   if (rowsWithoutParentOpp.length > 0){
    //     alert('b')
    //     this.postWonFUTURE(rowsWithoutParentOpp);
    //   }
    //   else{
    //     alert('c')
    //       rowsWithoutParentOpp.push(OppRow);
    //       this.postWonFUTURE(rowsWithoutParentOpp);
    //   }
    // }
    // else{
    //   this.createToastMessage('Attenzione','Selezionare almeno un elemento','error','dismissable');
    // }
    // OLD CODE-----------------------------------------------------------------------------------------------
  }

  postWonFUTURE(rows){
    var rowsIds = rows.map(el => el.Id);
    var selectStatus = 'Closed Won';
    var rowIds2 = [];
    MassiveUpdateStageFuture({"recordIds": rowIds, "status": selectStatus}).then(result => {//MassiveUpdateStageFutureGroup
      for(var i = 0 ; i < result.length ; i++){
        rowIds2.push(result[i]);
      }
      this.invokePostWonFUTURE(rowIds2);
      this.createToastMessage('Successo',"Won massivo in corso, clicca refresh per avere il risultato",'success','dismissable');
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  invokePostWonFUTURE(recordIds){
    MassiveWonFuture({"recordIds": recordIds}).then(result=>{

    }).catch(error => {

    })
  }

  postWon(record){
    const recordId = record.recordId;
    var selectStatus = 'Closed Won';
    updateStage({recordId: recordId, selectStatus: selectStatus}).then(result => {
      if(result == 'Closed Won'){
        Won({recordId : recordId}).then(result => {
          if (result === null || result === ''){
            alert('aa')
            this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
            this.invokeUpdateStage(recordId, 'Negotiation');
          }
          else{
            alert('ab')
            var customerCode = returnVal.split('·')[1];
            this.invokeGenerateContract(recordId, customerCode);
          }
          
        }).catch(error => {
          this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
          this.invokeUpdateStage(recordId, 'Negotiation');
        });
      }
      else{
        this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
      }
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  invokeGenerateContract(recordId,customerCode){
    generateContract({recordId: recordId, customerRef: customerCode}).then(result => {
      this.createToastMessage('Successo','Contract generated!','success','dismissable');

    }).catch(error => {
      this.createToastMessage('Attenzione','Error while generating contract','error','dismissable');
      this.invokeUpdateStage(recordId, 'Negotiation');
    });
  }

  invokeUpdateStage(recordId, status){
    updateStage({recordId: recordId, selectStatus: status}).then(result => {

    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  openConvenzione() {
    this.convenzione=!this.convenzione;
  }

  get inputVariablesConvenzione() {
    return [
      {
          name: "recordId",
          type: "String",
          value: this.recordId
      }
    ];
  }

  handleStatusChangeConvenzione(event) {
    if (event.detail.status === "FINISHED") {
      console.log('success!');
      this.createToastMessage('Successo','Convenzione modificata con successo!','success','dismissable');
      this.convenzione=false;
    }
  }

  discard(event) {
    var rowId = event.detail.row.Id;
    DiscardOpportunity({recordId: rowId}).then(result => {
      this.createToastMessage('Successo','Opportunità scartata','success','dismissable');
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  revision(event) {
    var rowId = event.detail.row.Id;
    Revision({recordId: rowId}).then(result => {
      this.createToastMessage('Successo','Opportunità revisionata','success','dismissable');
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  lince(event){
    var rowId = event.detail.row.Id;
    getOpportunityQuote({oppId: rowId}).then(result => {
      var linceSelectedId = result;
      this.invokeValidLince(linceSelectedId);
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  invokeValidLince(linceSelectedId){
    ValidLince({recordId: linceSelectedId}).then(result => {
      var validLince = result;
      this.Call(linceSelectedId);
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
    });
  }

  Call(linceSelectedId){
    getCervedDoc({AccID: linceSelectedId}).then(result => {
      if (result !== null) {
        var title = result.split('·')[0];
        var message = result.split('·')[1];
        if(title === 'SUCCESS'){
          linceSelectedId = message;
          showLince = true;
          eval("$A.get('e.force:refreshView').fire();")
        } else {
          this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
        }
      }
    }).catch(error => {
      var errors = error;
      console.log('errors',errors);
      let message = 'Error: '; // Default error message
      // Retrieve the error message sent by the server
      if (errors && Array.isArray(errors) && errors.length > 0) {
          message = errors[0].message;
      }
      
      console.error('errors',message);
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
      showLince = true;
    });
  }

  esito(event){
    var row = event.detail.row;
    if (row.IT_Action_Result__c == 'SUCCESS') {
      this.createToastMessage('Successo',row.IT_Action_Result__c,'success','dismissable');
    } else {
      this.createToastMessage('Attenzione',row.IT_Action_Result__c,'error','dismissable');
    }
  }

  onClickDocu(event){
    var rowId = event.detail.row.Id;
    if(event.detail.row.Docusign == false){
      if((event.detail.row.StageName === 'Proposal' || event.detail.row.StageName === 'Proposta') &&
        (event.detail.row.IT_Approval_Stage === 'In Approval' || event.detail.row.IT_Approval_Stage === 'In Approvazione')){
        checkQuoteConditions({recordId: rowId}).then(result => {
          if(result == true){
            this.buttonFilter(rowId);
          } else if(result == false){
            this.createToastMessage('Attenzione','Prima di procedere con l\'invio del contratto tramite DocuSign, popolare i campi nella sezione "Contratto Welfare"','error','dismissable');
          }

        }).catch(error => {
          this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
          this.errorDocu = error.message;
          console.log('errore: ' + JSON.stringify(this.errorDocu));
        });
      } else {
          this.createToastMessage('Attenzione','L\'opportunità deve essere in Proposta e la quote in Approvazione!','error','dismissable');
      }
    } else {
      this.createToastMessage('Attenzione','DocuSign già inviato!','error','dismissable');
    }
  }

  buttonFilter(recordId){
    filterDocuSignWelfare({recordId: recordId}).then(result =>{
      // var urlString = window.location.href;
      // var baseURL = urlString.substring(0, urlString.indexOf("/r/"));
      // var urlCall = baseURL + encodeURI(result);
      // console.log('urlCall: ' + urlCall);

      // Navigate to a URL
      this[NavigationMixin.Navigate]({
          type: 'standard__webPage',
          attributes: {
              url: result
          }
      }, true // Replaces the current page in your browser history with the URL
      );
    }).catch(error => {
      this.createToastMessage('Attenzione','Errore inaspettato !','error','dismissable');
      console.log('errore: ' + JSON.stringify(error.message));
    });
  }

  changeAddress(event){
    this.chAddr=!this.chAddr;
    this.inputVariablesChAddr = [
      {
        name: "recordId",
        type: "String",
        value: event.detail.row.Id,
      },
    ];
    console.log('chAddr: ' + this.chAddr);
  }

  handleStatusChangeChAddr(event) {
    if (event.detail.status === "FINISHED") {
      console.log('success!');
      this.createToastMessage('Successo','Indirizzo cambiato con successo!','success','dismissable');
      this.chAddr=false;
    }
  }

  openPdf(event){
    this.showPdf = !this.showPdf;
    this.pdfRecordId = event.detail.row.Id;
  }

  changeAccount(event){
    this.chAcct=!this.chAcct;
    this.inputVariablesChAcct = [
      {
        name: "OpportunityId",
        type: "String",
        value: event.detail.row.Id,
      },
    ];
    console.log('chAcct: ' + this.chAcct);
  }

  handleStatusChangeChAcct(event) {
    if (event.detail.status === "FINISHED") {
      console.log('success!');
      this.createToastMessage('Successo','Account cambiato con successo!','success','dismissable');
      this.chAcct=false;
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

  handleStatusChangeUpCond(event) {
    if (event.detail.status === "FINISHED") {
      console.log('success!');
      this.createToastMessage('Successo','Condizioni modificate!','success','dismissable');
      this.upCond=false;
    }
  }
    
}