({
    init: function(component, event, helper) {
        var recordId = component.get('v.recordId');
        var sObjectName = component.get('v.sObjectName');
        var boolPersonAcc;
        var boolBenCase;

        var action1 = component.get("c.currentUser");
        action1.setCallback(this, function(response1) {
            var currentUser = response1.getReturnValue();
            component.set("v.codUtenteSF", currentUser);
            console.log("v.codUtenteSF : ", currentUser);
        })
        $A.enqueueAction(action1);

        if (sObjectName == "Account") {
            var action3 = component.get("c.controlPersonAccount");
            action3.setParams({
                "recordId": recordId
            })
            action3.setCallback(this, function(response3) {
                boolPersonAcc = response3.getReturnValue();
                console.log("boolPersonAcc da apex: ", boolPersonAcc);
                component.set("v.boolPersonAcc", boolPersonAcc);
                var options = [];
                if (sObjectName == 'Account' && boolPersonAcc == true) {
                    options = [{
                            'label': 'Portale Beneficiario',
                            'value': '31'
                        },
                        {
                            'label': 'Portale Clienti',
                            'value': '33'
                        },
                        {
                            'label': 'Dashboard UTA',
                            'value': '34'
                        },
                        {
                            'label': 'Expendia',
                            'value': '35'
                        },
                        {
                            'label': 'Galitt',
                            'value': '36'
                        }
                    ]
                } else if (sObjectName == 'Account' && boolPersonAcc == false) {
                    options = [{
                            'label': 'Applicativo Affi',
                            'value': '32'
                        },
                        {
                            'label': 'Portale Affiliati',
                            'value': '30'
                        },
                        {
                            'label': 'Portale Beneficiario',
                            'value': '31'
                        },
                    ]
                }
                component.set('v.options', options);

            });
            $A.enqueueAction(action3);

            component.set("v.boolPersonAcc", boolPersonAcc);
            console.log("v.boolPersonAcc :", boolPersonAcc);
        }

        if (sObjectName == "Case") {
            var action4 = component.get("c.controllCaseBeneficiary");
            action4.setParams({
                "recordId": recordId
            })
            action4.setCallback(this, function(response4) {
                boolBenCase = response4.getReturnValue();
                console.log("boolBenCase da apex: ", boolBenCase);
                component.set("v.boolBenCase", boolBenCase);
                var options = [];
                if (sObjectName == 'Case' && boolBenCase == true) {
                    options = [{
                            'label': 'Portale Beneficiario',
                            'value': '31'
                        },
                        {
                            'label': 'Portale Clienti',
                            'value': '33'
                        },
                        {
                            'label': 'Dashboard UTA',
                            'value': '34'
                        },
                        {
                            'label': 'Expendia',
                            'value': '35'
                        },
                        {
                            'label': 'Galitt',
                            'value': '36'
                        }
                    ]
                } else if (sObjectName == 'Case' && boolBenCase == false) {
                    options = [{
                            'label': 'Applicativo Affi',
                            'value': '32'
                        },
                        {
                            'label': 'Portale Affiliati',
                            'value': '30'
                        }
                    ]
                }
                component.set('v.options', options);
            });
            
            $A.enqueueAction(action4);
            component.set("v.boolBenCase", boolBenCase);
            console.log("v.boolBenCase :", boolBenCase);
        }
        
        //richiamo apex
        var action = component.get("c.getUser");
        action.setParams({
            "objname": sObjectName, //nelle "" quelle di apex, gli altri di javascript
            "recordId": recordId
        });
        action.setCallback(this, function(response) { //quando apex risponde
            if (response.getState() === "SUCCESS") {
                var objValue = JSON.parse(response.getReturnValue());
                console.log('objValue:: ' + JSON.stringify(objValue)); //me lo mette come stringa a video non come oggetto altrimenti compare solo object
                if (sObjectName == 'Case' && objValue.IT_Financial_Center__c != null) {
                    component.set("v.codCli", objValue.IT_Financial_Center__r.IT_Merchant_Code__c);
                    console.log('codCli case:: ' + objValue.IT_Financial_Center__r.IT_Merchant_Code__c);
                    component.set("v.circCd", objValue.IT_Financial_Center__r.IT_Circuit_Code__c);
                    console.log('circCd  :: ' + objValue.IT_Financial_Center__r.IT_Circuit_Code__c);
                    if (objValue.ER_Store__c != null) {
                        component.set("v.codLoc", objValue.ER_Store__r.IT_Store_Code__c);
                        console.log('codLoc case:: ' + objValue.ER_Store__r.IT_Store_Code__c);
                    }
                } else if (sObjectName == 'ER_Financial_Center__c') {
                    component.set("v.codCli", objValue.IT_Merchant_Code__c);
                    console.log('codCli fc:: ' + objValue.IT_Merchant_Code__c);
                    component.set("v.circCd", objValue.IT_Circuit_Code__c);
                    console.log('circCd  :: ' + objValue.IT_Circuit_Code__c);
                } else if (sObjectName == 'ER_Store__c' && objValue.IT_Store_Code__c != null) {
                    if (objValue.ER_Financial_Center__c != null) {
                        component.set("v.codCli", objValue.ER_Financial_Center__r.IT_Merchant_Code__c);
                        console.log('codCli store:: ' + objValue.ER_Financial_Center__r.IT_Merchant_Code__c);
                        component.set("v.circCd", objValue.ER_Financial_Center__r.IT_Circuit_Code__c);
                        console.log('circCd  :: ' + objValue.ER_Financial_Center__r.IT_Circuit_Code__c);
                    }
                    component.set("v.codLoc", objValue.IT_Store_Code__c);
                    console.log('codLoc store:: ' + objValue.IT_Store_Code__c);
                } else if (sObjectName == 'Account') {
                    if (objValue.AccountId__r != null) {
                        component.set("v.circCd", objValue.ER_Employee__r.IT_Circuit_Code__c);
                        console.log('circCd accId :: ' + objValue.ER_Employee__r.IT_Circuit_Code__c);
                    } else if (objValue.Employees__r != null) {
                        component.set("v.circCd", objValue.ER_Employee__r.IT_Circuit_Code__c);
                        console.log('circCd emp :: ' + objValue.ER_Employee__r.IT_Circuit_Code__c);
                    } else if (objValue.Employees1__r != null) {
                        component.set("v.circCd", objValue.IT_Circuit_Code__c);
                        console.log('circCd emp1 :: ' + objValue.IT_Circuit_Code__c);
                    }

                    var portalUser = [{'label': "Nessuno",'value': 999}];
                    var action2 = component.get('c.employeeUsers');
                    action2.setParams({
                        "objname": sObjectName,
                        "recordId": recordId
                    })
                    action2.setCallback(this, function(response2) {
                        console.log('response2:: ' + JSON.stringify(response2));
                        if (response2.getState() === "SUCCESS") { 
                            var employeeUser = response2.getReturnValue();
                            console.log('employeeUser return apex:: ' + employeeUser);
                            employeeUser.forEach(function(element1) {
                                portalUser.push({
                                    'label': element1,
                                    'value': element1
                                });
                            });
                            component.set('v.portalUser', portalUser);
                            console.log('userlist acc if:: ' + JSON.stringify(portalUser));
                        } else {
                            var errors = response2.getError();
                            console.log(JSON.stringify(errors));
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "type": "error",
                                "title": "Errore!",
                                "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                            });
                            toastEvent.fire(); //allert a video
                        }
                    })
                    $A.enqueueAction(action2);
                    component.set('v.portalUser', portalUser);
                    console.log('userlist acc:: ' + JSON.stringify(portalUser));
                } else if (sObjectName == 'ER_Employee__c') {
                    var portalUser = [{'label': "Nessuno",'value': 999}];
                    component.set("v.circCd", objValue.IT_Circuit_Code__c);
                    console.log('circuit code emp ::' + objValue.IT_Circuit_Code__c);
                    if(objValue.IT_UserName__c != null){
                        portalUser.push({
                        'label': objValue.IT_UserName__c,
                        'value': objValue.IT_UserName__c
                        });
                    }
                    component.set('v.portalUser', portalUser);
                    console.log('userlist employee:: ' + JSON.stringify(portalUser));
                } else if (sObjectName == 'Asset') {
                    var portalUser = [{'label': "Nessuno",'value': 999}];
                    component.set("v.circCd", objValue.IT_Circuito_Employee__c);
                    console.log('circuit code ass ::' + objValue.IT_Circuito_Employee__c);
                    if(objValue.ER_Employee__r.IT_UserName__c != null){
                        portalUser.push({
                        'label': objValue.ER_Employee__r.IT_UserName__c,
                        'value': objValue.ER_Employee__r.IT_UserName__c
                        });
                    }
                    
                    component.set('v.portalUser', portalUser);
                    console.log('userlist asset:: ' + JSON.stringify(portalUser));
                }
            } else {
                var errors = response.getError();
                console.log(JSON.stringify(errors));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "error",
                    "title": "Errore!",
                    "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                });
                toastEvent.fire(); //allert a video
            }
        })
        $A.enqueueAction(action);

        var options = [];
        if (sObjectName == 'ER_Financial_Center__c' || sObjectName == 'ER_Store__c') {
            options = [{
                    'label': 'Applicativo Affi',
                    'value': '32'
                },
                {
                    'label': 'Portale Affiliati',
                    'value': '30'
                }
            ]
        } else if (sObjectName == 'ER_Employee__c' || sObjectName == 'Asset') {
            options = [{
                'label': 'Portale Beneficiario',
                'value': '31'
            },
            {
                'label': 'Portale Clienti',
                'value': '33'
            },
            {
                'label': 'Dashboard UTA',
                'value': '34'
            },
            {
                'label': 'Expendia',
                'value': '35'
            },
            {
                'label': 'Galitt',
                'value': '36'
            }
            ]
        }

        component.set('v.options', options);
    },

    onButtonPressed: function(component, event, helper) {
        var portale = component.get('v.value');
        var boolBenCase = component.get('v.boolBenCase');
        var sObjectName = component.get('v.sObjectName');
        var boolPersonAcc = component.get('v.boolPersonAcc');
        var collegamenti = [];
        if (portale == 30) {
            if (boolPersonAcc == false && sObjectName == 'Account') {
                collegamenti = [{
                    'label': 'Home Affiliati',
                    'value': '0'
                }]
                var changeType = 'Next1';
            } else if(boolBenCase== true && sObjectName =='Case'){
                collegamenti = [{
                    'label': 'Home Affiliati',
                    'value': '0'
                }]
                var changeType = 'Next1';
            }
             else {
                collegamenti = [{
                        'label': 'Consulta transazioni dematerializzate',
                        'value': '4'
                    },
                    {
                        'label': 'Consulta transazioni elettroniche',
                        'value': '5'
                    },
                    {
                        'label': 'Documenti',
                        'value': '6'
                    },
                    {
                        'label': 'Dotescuola',
                        'value': '8'
                    },
                    {
                        'label': 'Easy check',
                        'value': '7'
                    },
                    {
                        'label': 'Fatture respinte sdi',
                        'value': '2'
                    },
                    {
                        'label': 'Home Affiliati',
                        'value': '0'
                    },
                    {
                        'label': 'Invio credenziali portale backoffice',
                        'value': '9'
                    },
                    {
                        'label': 'La tua situazione contabile',
                        'value': '3'
                    },
                    {
                        'label': 'Prefatture da confermare',
                        'value': '1'
                    }
                ]
                var changeType = 'Next';
            }

        } else if (portale == 31) {
            if (sObjectName == 'Account' && boolPersonAcc == false) {  
                collegamenti = [{
                    'label': 'Home Beneficiari',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            } 
            else if(boolBenCase== true && sObjectName =='Case'){
                collegamenti = [{
                    'label': 'Home Beneficiari',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            }
            else {
                collegamenti = [{
                    'label': 'Home Beneficiari',
                    'value': 'home'
                }]
                var changeType = 'Next';
            }
        } 
        else if (portale == 32) {
            if (sObjectName == 'ER_Store__c') {
                collegamenti = [{
                        'label': 'Archivio',
                        'value': '4'
                    },
                    {
                        'label': 'Cambio Gestione/Spostamento Prestazioni Elettroniche',
                        'value': '6'
                    },
                    {
                        'label': 'Censimento Partite Iva Con Esenzione Bollo',
                        'value': '8'
                    },
                    {
                        'label': 'Fatture elettroniche',
                        'value': '1'
                    },
                    {
                        'label': 'Gestione Affiliato In Regime Forfettario',
                        'value': '9'
                    },
                    {
                        'label': 'Gestione Invio Circolari',
                        'value': '13'
                    },
                    {
                        'label': 'Home Affiliati',
                        'value': '0'
                    },
                    {
                        'label': 'Inter. Prestazioni Elettroniche E Dematerializzate (Iecc)',
                        'value': '10'
                    },
                    {
                        'label': 'Note Debito Mense',
                        'value': '7'
                    },
                    {
                        'label': 'Rete',
                        'value': '2'
                    },
                    {
                        'label': 'Riep. Contratto',
                        'value': '5'
                    },
                    {
                        'label': 'Stampa Massiva Contratti',
                        'value': '12'
                    },
                    {
                        'label': 'Stampa Massiva Documenti',
                        'value': '11'
                    },
                    {
                        'label': 'WTLR',
                        'value': '3'
                    }
                ]
                var changeType = 'Next1';
            } else if (sObjectName == 'Case' && boolBenCase == false) {
                collegamenti = [{
                        'label': 'Archivio',
                        'value': '4'
                    },
                    {
                        'label': 'Cambio Gestione/Spostamento Prestazioni Elettroniche',
                        'value': '6'
                    },
                    {
                        'label': 'Censimento Partite Iva Con Esenzione Bollo',
                        'value': '8'
                    },
                    {
                        'label': 'Fatture elettroniche',
                        'value': '1'
                    },
                    {
                        'label': 'Gestione Affiliato In Regime Forfettario',
                        'value': '9'
                    },
                    {
                        'label': 'Gestione Invio Circolari',
                        'value': '13'
                    },
                    {
                        'label': 'Home Affiliati',
                        'value': '0'
                    },
                    {
                        'label': 'Inter. Prestazioni Elettroniche E Dematerializzate (Iecc)',
                        'value': '10'
                    },
                    {
                        'label': 'Note Debito Mense',
                        'value': '7'
                    },
                    {
                        'label': 'Rete',
                        'value': '2'
                    },
                    {
                        'label': 'Riep. Contratto',
                        'value': '5'
                    },
                    {
                        'label': 'Stampa Massiva Contratti',
                        'value': '12'
                    },
                    {
                        'label': 'Stampa Massiva Documenti',
                        'value': '11'
                    },
                    {
                        'label': 'WTLR',
                        'value': '3'
                    }
                ]
                var changeType = 'Next1';
            } else if (sObjectName == 'ER_Financial_Center__c') {
                collegamenti = [{
                    'label': 'Cambio Gestione/Spostamento Prestazioni Elettroniche',
                    'value': '6'
                },
                {
                    'label': 'Censimento Partite Iva Con Esenzione Bollo',
                    'value': '8'
                },
                {
                    'label': 'Fatture elettroniche',
                    'value': '1'
                },
                {
                    'label': 'Gestione Affiliato In Regime Forfettario',
                    'value': '9'
                },
                {
                    'label': 'Gestione Invio Circolari',
                    'value': '13'
                },
                {
                    'label': 'Home Affiliati',
                    'value': '0'
                },
                {
                    'label': 'Inter. Prestazioni Elettroniche E Dematerializzate (Iecc)',
                    'value': '10'
                },
                {
                    'label': 'Note Debito Mense',
                    'value': '7'
                },
                {
                    'label': 'Riep. Contratto',
                    'value': '5'
                },
                {
                    'label': 'Stampa Massiva Contratti',
                    'value': '12'
                },
                {
                    'label': 'Stampa Massiva Documenti',
                    'value': '11'
                }
                ]
                var changeType = 'Next1';
            } else if (boolPersonAcc == false && sObjectName == 'Account') {
                collegamenti = [{
                    'label': 'Home Applicativo Affi',
                    'value': '0'
                }]
                var changeType = 'Next1';
            }
            else if (boolBenCase == true && sObjectName == 'Case') {
                collegamenti = [{
                    'label': 'Home Applicativo Affi',
                    'value': '0'
                }]
                var changeType = 'Next1';
            }
            
        } 
        else if (portale == 33) {
            if ((boolPersonAcc == true && sObjectName == 'Account') || sObjectName =='Asset' || sObjectName =='ER_Employee__c' || (boolBenCase == true && sObjectName=='Case')) {
                collegamenti = [{
                    'label': 'Home Clienti',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            }
        } else if (portale == 34) {
            if ((boolPersonAcc == true && sObjectName == 'Account') || sObjectName =='Asset' || sObjectName =='ER_Employee__c' || (boolBenCase == true && sObjectName=='Case')){
                collegamenti = [{
                    'label': 'Dashboard UTA',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            }
        } else if (portale == 35) {
            if ((boolPersonAcc == true && sObjectName == 'Account') || sObjectName =='Asset' || sObjectName =='ER_Employee__c' || (boolBenCase == true && sObjectName=='Case')){
                collegamenti = [{
                    'label': 'Expendia',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            }
        }
        else if (portale == 36) {
            if ((boolPersonAcc == true && sObjectName == 'Account') || sObjectName =='Asset' || sObjectName =='ER_Employee__c' || (boolBenCase == true && sObjectName=='Case')){
                collegamenti = [{
                    'label': 'Galitt',
                    'value': 'home'
                }]
                var changeType = 'Next1';
            }
        }
        helper.changePage(component, event, changeType);
        component.set('v.portali', collegamenti);
    },

    onButtonPressed1: function(component, event, helper) {
        var isIframe = "false";
        var boolBenCase= component.get('v.boolBenCase');
        var sObjectName = component.get('v.sObjectName');
        var portale = component.get('v.value');
        var scenario = component.get('v.selectedPortal');
        if (( (boolBenCase == false && sObjectName=='Case') || sObjectName == 'ER_Financial_Center__c' || sObjectName == 'ER_Store__c') && portale != 31) {
            var codCli = component.get('v.codCli');
            console.log("codCli EDG::  " + codCli);
            var action = component.get("c.callEDGUser");
            action.setParams({
                "codCli": codCli
            })
            action.setCallback(this, function(response) { //quando apex risponde
                var userList = []; //nuova lista
                if(portale == 30 && (scenario== 0 || scenario == 9) ) {
                    userList.push({'label': "Nessuno",'value': 999});
                }
                console.log('userList1:: ' + JSON.stringify(userList));
                if (response.getState() === "SUCCESS") {
                    var returnValue = JSON.parse(response.getReturnValue()); //oggettone         
                    console.log('returnValue:: ' + JSON.stringify(returnValue)); //me lo mette come stringa a video non come oggetto altrimenti compare solo object
                    if (returnValue.data.error != null && returnValue.data.error != undefined) {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "type": "warning",
                            "title": "Attenzione!",
                            "message": "Non sono stati trovati utenti per il codice " + codCli
                        });
                        toastEvent.fire();
                    } else if(portale == 30 && scenario!= 9) {
                        var users = returnValue.data.users;
                        users.forEach(function(element) {
                            userList.push({
                                'label': element.type + '-' + element.id,
                                'value': element.id
                            });
                        });
                        console.log('userList2:: ' + JSON.stringify(userList));
                    }
                    component.set('v.users', userList);
                } else {
                    var errors = response.getError();
                    console.log(JSON.stringify(errors));
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type": "error",
                        "title": "Errore!",
                        "message": "Si è verificato il seguente errore: " + errors[0].pageErrors[0].message
                    });
                    toastEvent.fire(); //allert a video
                }
            })
            $A.enqueueAction(action);
            var changeType = 'Next';
        } else if (sObjectName == 'Account' || sObjectName == 'ER_Employee__c' || sObjectName == 'Asset') {
            var portalUser = component.get("v.portalUser");
            component.set('v.users', portalUser);
            console.log('userlist acc,emp,ass:: ' + JSON.stringify(portalUser));
            var changeType = 'Next';
        } 
        helper.changePage(component, event, changeType);
    },

    onButtonPressed2: function(component, event, helper) {
        var changeType = 'Back';
        helper.changePage(component, event, changeType);
    },
    onButtonPressed3: function(component, event, helper) {
        var changeType = 'Back1';
        helper.changePage(component, event, changeType);
    },

    impersona: function(component, event, helper) {
        var isIframe = "false";
        var calledSystem ="";
        var workspaceAPI = component.find("workspaceAPI");
        var circCd = component.get('v.circCd');
        var codCli = component.get('v.codCli');
        var codUtenteSF = component.get('v.codUtenteSF');
        var selectedUser = component.get('v.selectedUser');
        console.log('user selezionato:: ' + selectedUser);
        var codLoc = component.get('v.codLoc');
        var scenario = component.get('v.selectedPortal');
        var portale = component.get('v.value');
        console.log('scenario selezionato:: ' + scenario);
        var stringaQuery;
        if (selectedUser != null && selectedUser != 999) {
            if (scenario <= 9 && portale ==30) {
                stringaQuery = 'portale-affiliati?user_imp=' + selectedUser + '&redirect_page=' + scenario;
                console.log('stringaQuery::  ' + stringaQuery);
                calledSystem ="Portale Affiliati";
                isIframe = "true";
            } else if (portale == 31 && scenario == "home") {
                isIframe = "true";
                calledSystem ="Portale Beneficiari";
                stringaQuery = 'portale-beneficiari?user_imp=' + selectedUser;
                console.log('stringaQuery::  ' + stringaQuery);
            }
        } else if (selectedUser == null || selectedUser == 999) {
            if (scenario <= 13 && portale == 32) {
                if (codLoc != null && codCli != null && (scenario == 2 || scenario == 3 || scenario == 4)) {
                    stringaQuery = 'affi?codice_gruppo_fatt=' + codCli + '&codice_locale=' + codLoc + '&redirect_page=' + scenario;
                }
                else if (codCli != null && (scenario == 1 || scenario == 5) ) {
                    stringaQuery = 'affi?codice_gruppo_fatt=' + codCli + '&redirect_page=' + scenario;
                }
                else{
                    stringaQuery = 'affi?redirect_page=' + scenario;
                }
                console.log('stringaQuery::  ' + stringaQuery);
                calledSystem ="Affi"
            } 
            else if (portale == 31 && scenario == "home") {
                isIframe = "true";
                calledSystem ="Portale Beneficiari";
                stringaQuery = 'portale-beneficiari';
            }
            else if(scenario <= 9 && portale == 30) {
                stringaQuery = 'portale-affiliati?redirect_page=' + scenario;
                calledSystem ="Portale Affiliati";
                isIframe = "true";
            }
            else if (portale == 33 && scenario == 'home') {
                if(circCd!=null){
                    stringaQuery = 'portale-clienti?redirect_page=' + scenario +'&circ_cd='+circCd + '&user_type=card';
                }
                else {
                    stringaQuery = 'portale-clienti?redirect_page=' + scenario + '&user_type=card'; 
                }
                calledSystem ="Portale Clienti Elettronico";
                isIframe = "true";
            }
            else if (portale == 34 && scenario == 'home') {
                stringaQuery = '';
                calledSystem ="Dashboard UTA";
            }
            else if (portale == 35 && scenario == 'home') {
                stringaQuery = '';
                calledSystem ="Expendia";
            }
            else if (portale == 36 && scenario == 'home') {
                stringaQuery = '';
                calledSystem ="Galitt";
            }

            console.log('stringaQuery::  ' + stringaQuery);
        }

        workspaceAPI.generateConsoleURL({
            "pageReferences": [{
                "type": "standard__component",
                "attributes": {
                    "componentName": "c__LNIT00_iframeOpener"
                },
                "state": {
                    "c__calledSystem": calledSystem,
                    "c__isIframe": isIframe,
                    "c__queryString": stringaQuery
                }
            }]
        }).
        then(function(url) {
                console.log(url);
                workspaceAPI.openTab({
                    url: url,
                    focus: true
                });
            })
            .catch(function(error) {
                console.log('ERROR' + error);
            });
        var changeType = 'Open';
        helper.changePage(component, event, changeType);
    }
})