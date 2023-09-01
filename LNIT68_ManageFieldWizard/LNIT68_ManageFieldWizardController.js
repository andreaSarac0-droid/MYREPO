({ 
	init: function (component, event, helper){
        component.set('v.loaded', false);

        // component.set('v.FlagChg', "[false,false,false,false,false]");
        component.set('v.fieldBlank', true)

            // console.log('firstEntry:init1: ' + component.get('v.firstEntry') + "***");

        var objId = component.get("v.recordId");
        var objName = 'Opportunity';
            console.log('init:objId:: '+objId);
        helper.callAgreementsAffi(component, objId, objName);

        helper.controlloContrattoIniz(component, objId);

            // console.log('Msg Errore:1: ' + component.get('v.error') + " **fl E* " + component.get('v.FlagError') + " **sa T* " + component.get('v.SaveTrue') + " **fiE* " + component.get('v.firstEntry') + " **contr* " + component.get('v.FlagContratto'));

        // if (! component.get('v.error')) {
        //     component.set("v.warning", component.get("v.msgWar01"));
        // }
// + ? 
        if ( component.get('v.firstEntry') && (component.get('v.SaveTrue') == false)) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": "",
                "duration": '6000',
                "mode": 'dismissible',
                "message": "Salvare le condizioni economiche per Superpranzo."});
            toastEvent.fire();
        } 
               
    },

    // button Default
	callAffiService: function (component, event, helper){
        component.set('v.loaded', false);
        var objId = component.get("v.recordId");
        //var objId = '0065r000003pubzAAA';  //Opp Update
        //var objId = '0065r000003Qf0eAAC';    //Opp Insert
        component.set("v.SaveTrue", false);
        // component.set("v.lflgVAT", true);
        		// console.log('callAffiService:1a:button Default'); 
        helper.callDefaultField(component, objId);
    },

    // button Save
    updateOpporunityLine: function (component, event, helper){
        component.set('v.loaded', false);
        var dataOld = component.get("v.dataFirst");
        var dataNew = component.get("v.dataLast");
        var objId   = component.get("v.recordId");
        //var objId = '0065r000003pubzAAA';  //Opp Update
        //var objId = '0065r000003Qf0eAAC';    //Opp Insert
        component.set('v.FlagChg', [false, false, false, false, false]);
            // console.log('FlagErrors1:: ' + component.get("v.FlagError"));
            // if (component.get("v.warning")) {
            // component.set("v.warning", null);
        component.set('v.FlagError', false);
            // }
        helper.updateLineItem(component, objId, dataNew, dataOld);  
    },
        

    // Chg campi dataLast
    updateWrapperNew: function (component, event, helper){
            // console.log('updateWrapperNew');
        var updateField = component.get("v.dataLast");
        var sp_nFlg = 0;
        // var cmpInp = '';
        // console.log('event.target.name == ' + event.target.name);

        if(event.target.name == 'Above_Threshold_New'){
            updateField[0].above_threshold_fee = event.target.value;
            component.set('v.Above_Threshold_New', event.target.value);
            sp_nFlg = 0;
            helper.chgClr(component, event, sp_nFlg, event.target.id);
        }    

        if(event.target.name == 'Above_Percentage_New'){
            updateField[0].above_threshold_fee_percentage = event.target.value;
            component.set('v.Above_Percentage_New', event.target.value);
            sp_nFlg = 1;
            helper.chgClr(component, event, sp_nFlg, event.target.id);
        }   
         
        if(event.target.name == 'Threshold_New'){
            updateField[0].threshold = event.target.value;
            component.set('v.Threshold_New', event.target.value);
            sp_nFlg = 2;
            helper.chgClr(component, event, sp_nFlg, event.target.id);
        }

        if(event.target.name == 'Below_Threshold_New'){
            updateField[0].below_threshold_fee = event.target.value;
            component.set('v.Below_Threshold_New', event.target.value);
            sp_nFlg = 3;
            helper.chgClr(component, event, sp_nFlg, event.target.id);
        }

        if(event.target.name == 'Below_Percentage_New'){
            updateField[0].below_threshold_fee_percentage = event.target.value;    
            component.set('v.Below_Percentage_New', event.target.value);
            sp_nFlg = 4;
            helper.chgClr(component, event, sp_nFlg, event.target.id);
        }

        component.set("v.SaveTrue", false);
        component.set("v.FlagError", false);

        component.set('v.dataLast', updateField);

        var flgchg = component.get("v.FlagChg");
        if (flgchg.indexOf(true) >= 0) {
            component.set("v.fieldBlank", false);
        } else {
            component.set("v.fieldBlank", true);
        }

        var FlagContratto = component.get("v.FlagContratto");

            console.log('FlagContratto:: ' + FlagContratto + "***");

        var SaveTrue = component.get("v.SaveTrue");
        if ((FlagContratto == '102' && (SaveTrue == false || (SaveTrue == true && flgchg.indexOf(true)>=0))) || (FlagContratto == '101' && flgchg.indexOf(true)>=0)) {
            // component.set("v.error", 'ERROR: I campi non sono compilati correttamente o Richiedono di essere salvati.');
            // component.set("v.warning", component.get("v.msgWar01"));
            component.set("v.FlagError", true);
            component.set("v.SaveTrue", false);
        }
     
        // TODO
            console.log('**tt1'); 
        helper.testfieldBlank(component);
            console.log('**tt2'); 

        //prova da riportare 102 ???
        if (FlagContratto == '102' && component.get("v.fieldBlank") == true) {
                console.log('Send ERRORErp:102: ')
            component.set("v.error", 'ERROR: Contratto Stand Alone, obbligatoria la compilazione.');
            component.set("v.FlagError", true);
            component.set("v.SaveTrue", false);
        }
        // console.log('sono in updateWrapperNew a4 ' + "FlagError:: " + component.get("v.FlagError") + "SaveTrue:: " + component.get("v.SaveTrue"));
        
    },
    
    // button op1 op2
    handleChange: function(component, event, helper){

        console.log('***OP1 2 flagerr:1: ' + component.get("v.FlagError"));
        console.log('***OP1 2 flagerr:2: ' + component.get("v.error"));
        component.set("v.FlagError", false);
        component.set("v.error", null);

        if(component.get("v.value") == 'option1'){
            component.set("v.Option1True",true);
            component.set("v.Option2True",false);
        }else{
            component.set("v.Option1True", false);
            component.set("v.Option2True", true);
        }
        // src ca da evedenziare
        let arr = component.get("v.FlagChg");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == true) {
                let cmpInp = 'lname' + (i + 1); 
                helper.chgClrSub2(component, cmpInp);
                if (i <2) {
                    let cmpInp = 'lname' + (i + 6);
                    helper.chgClrSub2(component, cmpInp);
                }
            }
        }
    },


    cmpOnFcs: function (component, event, helper) {
        // console.log('wpOnFcs:1: ');
        helper.daOnFocus(component, event.target.id);
        // console.log('wpOnFcs:5: ');
    },

    cmpOnBlr: function (component, event, helper) {
        // console.log('wpOnFcs:1: ');
        helper.daOnBlur(component, event.target.id);
        // console.log('wpOnFcs:5: ');
    },

    // * prv rp
    // VAT: function (component, event, helper) {
    //     console.log('VAT22:1:');
    //     helper.rpsVAT22(component, objId);
    // },



})

// wpOcl: function (component, event, helper) {
//     console.log('wpOcl:1: ');
//     var wp = component.find('winpop1');
//     $A.util.addClass(wp, 'aaa');
//     console.log('wpOcl:2: ');
// },    

// wpFcs: function (component, event) {
//     console.log('wpFcs:: ');
//     //    onclick = "{!c.wpFcs}"
//     // var wp = component.find('winpop1');
//     // $A.util.toggleClass(wp, 'slds-hide');
//     var cmpTarget = component.find('lname1');
//     $A.util.addClass(cmpTarget, 'sp_inpErr');
// },    


// openAll: function (cmp, event, helper) {
//     var recordObjectId = cmp.get("v.recordId");
//     var recordObjectName = cmp.get("v.sObjectName");
//     var gruppo = cmp.get("v.gruppoEconomico");
//     var evt = $A.get("e.force:navigateToComponent");
//     console.log('evt' + evt);
//     evt.setParams({
//         componentDef: "c:LNIT00_ScontiLocali",
//         componentAttributes: {
//             recordId: recordObjectId,
//             sObjectName: recordObjectName,
//             viewAllBool: false,
//             gruppoEconomico: gruppo,
//             show5rows: false,
//         }
//     });
//     evt.fire();
// },

// rpsalva22: function (component, event, helper) {
//     console.log('rpsalva22:1:');
//     var objId = component.get("v.recordId");
//     helper.rpsalvaHelp22(component, objId);
// },