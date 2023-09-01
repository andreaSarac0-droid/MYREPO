({
     
    init : function(cmp, event, helper) {
        //gets Case record type for the aura ifs
        var opts = [
            { value: "SDFC", label: "SDFC" },
            { value: "ANAGRAFICA", label: "ANAGRAFICA" },
            { value: "SGOP/SGOC", label: "SGOP/SGOC" }
        ];
        cmp.set("v.jiraIssueTypes", opts);
        var opts2 = [
            { value: "Salesforce", label: "Salesforce" },
            { value: "Edenred", label: "Edenred" },
            { value: "EasyWelfare", label: "EasyWelfare" }
        ];
        cmp.set("v.jiraProjects", opts2);
    
        var action = cmp.get("c.getRecordType");
        action.setParams({ 
            "recordId" : cmp.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var recTypeName = response.getReturnValue();
                var splittedResponse = recTypeName.split('§');
                cmp.set("v.rType",splittedResponse[0]);
                cmp.set("v.portalVariable",splittedResponse[1]);
                cmp.set("v.circCD" , splittedResponse[2]);
                cmp.set("v.serviceType", splittedResponse[3]);
                console.log("RTYPENAME:: "+splittedResponse[0]);
                console.log("portalVariable:: "+splittedResponse[1]);
                console.log("circCD:: "+splittedResponse[2]);
                console.log("serviceType:: "+splittedResponse[3]);
            }
        })
        $A.enqueueAction(action);

        var action2 = cmp.get("c.getProfileName");
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var profName = response.getReturnValue();
                cmp.set("v.ProfileName",profName);
                console.log(profName);
            }
        })
        $A.enqueueAction(action2);
        /*var idCase = cmp.get("v.recordId");
        var action2 = cmp.get('c.getStatementsGHOST');
        action2.setParams({
            "caseId": idCase
        });
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                
                var responseString = response.getReturnValue();
                console.log('KIWI RESPONSE :' +responseString);
                
            }
        })
        $A.enqueueAction(action2);*/
    },
        openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        component.set("v.isModalOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    
    handleClick: function (component, event, helper) {
        if(component.get('v.serviceType') == 'ticket'){
            helper.helperSystemCaller(component , event , 'Portale Clienti Cartaceo' , 'true' , 'portale-clienti?redirect_page=areaordini&user_type=ticket');
        }
        else{
            helper.helperSystemCaller(component , event , 'Portale Clienti Elettronico' , 'true' , '');
        }
         
    },
    
    handleClick2: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'SGOC' , 'false' , '');
    },
    
    
    handleClick3: function (component, event, helper) {
		helper.helperSystemCaller(component , event , 'KIWI' , 'false' , '');
    },

    handleClick4: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'SGOP' , 'false' , '');

    },
    handleClick5: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Portale Intesa' , 'false' , '');

    },
    handleClickTNT: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'MYTNT' , 'false' , '');
    },
    handleClickJIRA: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'JIRACreate' , 'false' , '');
        
    },
    handleClickDHL: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'MYDHL' , 'false' , '');
    },
    
    handleClickBenef: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Portale Beneficiari' , 'true' , 'portale-beneficiari?redirect-page=home'); 
    },

    handleClickDOC: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'GestCred' , 'false' , '');
    
    },
    
    handleClickCarte: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Portale Clienti Cartaceo' , 'true' , 'portale-clienti?redirect_page=areaordini&user_type=ticket');
    },
    
    handleClickOperations: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Operations' , 'false' , '');
    },
    handleClickApex: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Apex' , 'false' , '');
    },
    handleClickExpendia: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Expendia' , 'false' , '');
    },
    handleClickChopin: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Chopin' , 'false' , '');
    },
    handleClickDashboardUTA: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Dashboard UTA' , 'false' , '');
    },
    handleClickGalitt: function (component, event, helper) {
        helper.helperSystemCaller(component , event , 'Galitt' , 'false' , '');
    },
    
    
    /*var recordId = component.get("v.recordId");
        var action = component.get ("c.getCaseInfo");
        action.setParams({ 
            "recordId" : recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state =='SUCCESS'){
                console.log('SUCCESS');
                var returnedCase = response.getReturnValue();
                if(returnedCase.IT_Jira_Code__c != null && returnedCase.IT_Jira_Code__c != ''){
                    console.log('JIRA FOUND');
                    var jCode = returnedCase.IT_Jira_Code__c;
                    var evt = $A.get("e.force:navigateToComponent");
                    evt.setParams({
                        componentDef : "c:LNIT00_iframeOpener",
                        componentAttributes: {
                            calledSystem : 'JIRAIssue',
                            isIframe : 'false',
                            jiraCode : jCode
                        }
                    });
                    evt.fire();
                }
                else{
                    console.log('NEW JIRA');
                    var jSubject = returnedCase.CaseNumber.replace(/ /g, '+') + "-" + returnedCase.Subject.replace(/ /g, '+');
                    var jDescription;
                    if(returnedCase.Description != null){
                        jDescription = returnedCase.Description.replace(/ /g, '+').replace(/\n/g , '%0A').substring(0,1000);
                    }
                    else{
                        jDescription = 'No+Description';
                    }
                    console.log("CASEINFOS :: "+jDescription+ " "+jSubject);
                    var evt = $A.get("e.force:navigateToComponent");
                    evt.setParams({
                        componentDef : "c:LNIT00_iframeOpener",
                        componentAttributes: {
                            calledSystem : 'JIRACreate',
                            isIframe : 'false',
                            jiraSubject : jSubject,
                            jiraDescription : jDescription
                        }
                    });
                    evt.fire(); 
                } 
            }else{
                console.log('ERROR');
            }
            
        })
        $A.enqueueAction(action);
        component.set("v.isModalOpen", false);*/
})