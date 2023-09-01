({
    init: function(component, event, helper) {
        var recordId = component.get("v.recordId");
        helper.isCreditCheckRequired(component, event, helper, recordId);
        helper.conditionsCaseProvisioning(component, event, helper, recordId);


        /*var navService = component.find("navId");
        // Sets the route to /lightning/o/Account/home
        var pageReference = {
            type: 'standard__navItemPage',
            attributes: {
                objectApiName: 'Opportunity',
                apiName: 'IT_Opportunity_LP.Attivazione_Automatica'
            }
        };
        component.set("v.pageReference", pageReference);
        // Set the URL on the link or use the default if there's an error
        var defaultUrl = "#";
        
        navService.generateUrl(pageReference)
            .then($A.getCallback(function(url) {
                component.set("v.url", url ? url : defaultUrl);
            }), $A.getCallback(function(error) {
                component.set("v.url", defaultUrl);
            }));*/
    },
    /*onClick : function (component, event, helper) {
        component.set("v.loaded",true);
        //Get record id
		const recordId = component.get('v.recordId');
        //Get picklist status selected
        var selectStatus = component.get('v.picklistField.StageName');
        //if status is closed won try to call the webservice 
        var contrId;
        if(selectStatus === 'Closed Won'){
            helper.postWon(component,event,helper);
        } else {
       	 	helper.invokeUpdateStage(component,helper,recordId,selectStatus);
    	}
    },*/

    //  attenzione in caso di manutenzione il codice di postWon2: va RIPORTATO sul metodo setDataFirma:
    //  attenzione in caso di manutenzione il codice di postWon2: va RIPORTATO sul metodo setDataFirma:
    //  attenzione in caso di manutenzione il codice di postWon2: va RIPORTATO sul metodo setDataFirma:
    postWon2: function(component, event, helper) {
        component.set("v.loaded", true);
        console.log('postwon2');
        component.set('v.isModalOpen', false);
        var cc = component.get('v.creditCheckRequired'); // code dead?
        var provisioning = component.get('v.caseProv');
        console.log('provisioning', provisioning);
        /*if(cc){
            helper.invokeCreditCheck(component,event,helper);
        }else*/
        if (provisioning) {
            component.set('v.isModalCaseOpen', true);
        } else {
            helper.postWon(component, event, helper, false);
        }
    },

    handleSelect: function(component, event, helper) {
        //get selected Status value
        var selectStatus = event.getParam("detail").value;
        //set selected Status value
        component.set("v.picklistField.StageName", selectStatus);
    },

    onClick2: function(component, event, helper) {
        component.set("v.loaded", true);
        //Get record id
        const recordId = component.get('v.recordId');
        console.log('recordId', recordId);
        //Get picklist status selected
        var selectStatus = component.get('v.picklistField.StageName');
        console.log('selectStatus', selectStatus);
        //if status is closed won try to call the webservice 
        var contrId;
        if (selectStatus === 'Closed Won') {
            //funzione per prendere il flag attivazione automatica
            helper.invokeAutomaticContract(component, helper, recordId).then(() => {

                var auto = component.get("v.automatic");
                console.log('auto', auto);
                component.set("v.loaded", false);

                if (!auto) {
                    component.set("v.isModalOpen", true);
                } else {
                    component.set("v.loaded", false);
                    // var cc = component.get('v.creditCheckRequired');
                    var provisioning = component.get('v.caseProv');
                    /*if(cc){
                		helper.invokeCreditCheck(component,event,helper);
            		}else */
                    if (provisioning) {
                        component.set('v.isModalCaseOpen', true);
                    } else {
                        helper.postWon(component, event, helper, false);
                    }
                }
            });

        } else {
            helper.invokeUpdateStage(component, helper, recordId, selectStatus);
        }
    },

    setAutomatic: function(component, event, helper) {
        component.set("v.loaded", false);
        component.set("v.isModalOpen", false);
        component.set("v.isModalCaseOpen", false);

        component.set("v.isModalDataFirmaOpen", true);
        console.log('setAutomatic in');
    },

    // FFF
    setDataFirma: function(component, event, helper) {
        component.set("v.loaded", true);
        const recordId = component.get('v.recordId');
        const signDt = component.get('v.dataFirma');
        const noSignAct = component.get('v.noSignAct');

        console.log('setDataFirma:?::' + signDt + ' ' + noSignAct);

        if ((noSignAct == true && signDt != null) || (noSignAct == false && signDt == null)) {
            component.set("v.loaded", false);
            let message = 'Selezionare la Data o No richiesta firma!';
            helper.alert(component, event, helper, "error", '', message);
        } else {

            console.log('setDataFirma:?2::' + signDt + ' ' + noSignAct);
            const action = component.get('c.setSignedDate');
            action.setParams({
                recordId: recordId,
                signDt: signDt
            });
            console.log('setDataFirma setParams');

            action.setCallback(this, (response) => {
                var status = response.getState();
                console.log('setDataFirma status', status);
                if (status === 'SUCCESS') {
                    component.set("v.loaded", false);
                    // component.set("v.isModalOpen", false);
                    component.set("v.isModalDataFirmaOpen", false);

                    //  attenzione x la manutenzione questo è lo stesso codice copiato dal metodo postWon2:
                    //  attenzione x la manutenzione questo è lo stesso codice copiato dal metodo postWon2:
                    //  attenzione x la manutenzione questo è lo stesso codice copiato dal metodo postWon2:
                    component.set("v.loaded", true);
                    console.log('postwon2-1');
                    component.set('v.isModalOpen', false);
                    // var cc = component.get('v.creditCheckRequired'); // code dead?
                    var provisioning = component.get('v.caseProv');
                    console.log('provisioning', provisioning);
                    // /*if(cc){
                    //     helper.invokeCreditCheck(component,event,helper);
                    // }else*/
                    // PPP
                    if (provisioning) {
                        console.log('postwon2-2');
                        component.set('v.isModalCaseOpen', true);
                    } else {
                        console.log('postwon2-3');
                        helper.postWon(component, event, helper, false);
                    }
                    //  stesso codice

                    helper.alert(component, event, helper, "success", 'Scelta inserita con successo', '');
                    component.set('v.dataFirma', null);
                    component.set('v.noSignAct', false);
                    $A.get('e.force:refreshView').fire();

                } else if (status === 'ERROR') {
                    component.set("v.loaded", false);
                    // component.set("v.isModalOpen", false);
                    var errors = response.getError();
                    let message = ''; // Default error message
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                        message += errors[0].message;
                    }
                    console.error('errors', message);
                    helper.alert(component, event, helper, "error", '', message);
                }
            });

            // console.log('setDataFirma nn dovrebbe farlo');
            $A.enqueueAction(action);
        }

    },


    setCreateCaseProvisioning: function(component, event, helper) {
        component.set("v.loaded", true);
        component.set('v.createCase', true);
        component.set('v.isModalCaseOpen', false);
        helper.postWon(component, event, helper);
    },
    wonWithoutCase: function(component, event, helper) {
        console.log('no case');
        component.set("v.loaded", true);
        component.set('v.isModalCaseOpen', false);
        helper.postWon(component, event, helper);
    },
    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
    },
    closeCaseModal: function(component, event, helper) {
        component.set("v.isModalCaseOpen", false);
    },
    closedModalDataFirma: function(component, event, helper) {
            component.set("v.isModalDataFirmaOpen", false);
        }
        // onChangeData: function(component, event, helper) {
        //     console.log('onChangeData ', component.get('v.dataFirma'));
        // }
})