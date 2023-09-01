({
    doInit : function(component, event, helper) {
        
		     var actions = [

            { label: 'Esito', name: 'Esito' }
        		]
        
        component.set('v.columns', [
            {label: 'Name', fieldName: 'linkName', type: 'url', 
             typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
            {label: 'Account', fieldName: 'linkNameAcc', type: 'url', 
             typeAttributes: {label: { fieldName: 'AccountName' }, target: '_self'}},
            {label: 'Product', fieldName: 'LinkProd', type: 'url', 
             typeAttributes: {label: { fieldName: 'ProdName' }, target: '_self'}},
            {label:"Capo Gruppo", fieldName:"group",type:"boolean", 
            typeAttributes: {label: { fieldName: 'groupCode' }, target: '_self'}},
            {label: 'Creazione Effettuata', fieldName: 'Result',
             cellAttributes:{ iconName: { fieldName: 'ResultIcon' },iconPosition: 'left', iconAlternativeText: '' }},
            {label: 'Opportunità', fieldName: 'linkOpp', type: 'url', 
             typeAttributes: {label: { fieldName: 'NameOpp' }, target: '_self'}},
            { type: 'action', typeAttributes: { rowActions: actions } }
        	]); 
        
        var recordId = component.get("v.recordId") ;
        var action = component.get("c.fetchAccts");    
        action.setParams({
            recordId,
            isFlexbenefit: component.get('v.IsFlexbenefit'),
            frame: component.get('v.Frame')
        });

            action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
          	  var records =response.getReturnValue();
            var myIds = [];
            records.forEach(function(record){
                
                component.set('v.tableSize',records.length);
                
                if(record.IT_Contract__c != null || record.IT_Contract__c != undefined){
            	console.log('head_code',record.IT_Framework_Head_Code__c);
            	console.log('contact type',record.IT_Contract__r.IT_Contract_Type__c);
            	console.log('future state', record.IT_Future_Opportunity_State__c);
                
            if(record.IT_Contract__r.IT_Framework_Head_Code__c != null){
            	myIds.push(record.Id);
        	}
            	
            	if(record.IT_Contract__r.IT_Contract_Type__c === '03' && record.IT_Contract__r.IT_Framework_Head_Code__c == record.IT_Financial_Center__c){
            		console.log('head_code2',record.IT_Contract__r.IT_Framework_Head_Code__c);
            		console.log('fin_cent',record. IT_Financial_Center__c);
            		component.set('v.isParent', true);
            		record.group = true;
        		}
            }
                record.linkName = '/lightning/r/ER_Financial_Center__c/'+record.Id+ '/view';
            	record.linkNameAcc = '/lightning/r/Account/'+record.ER_Account_Name__c+ '/view';
           		record.LinkProd= '/lightning/r/Product2/'+record.IT_Product2__c+ '/view';
           		if(record.ER_Account_Name__c)   
            		record.AccountName=record.ER_Account_Name__r.Name;
            	if(record.IT_Product2__c)   
            		record.ProdName=record.IT_Product2__r.Name;
                if (record.IT_Future_Opportunity_State__c == true) {
            		record.ResultIcon ='action:approval';            
            		record.iconLabel='';  }
            	else if (record.IT_Future_Opportunity_State__c =='' || record.IT_Future_Opportunity_State__c ==null || record.IT_Future_Opportunity_State__c ==undefined )  {
                 	record.ResultIcon ='';
            		record.iconLabel='';
        		}else{  
            		record.ResultIcon ='action:close';
            		record.iconLabel='';}
				//record.futureState=record.IT_Future_Opportunity_State__c;
            	console.log('record opp: ', record.IT_Future_OpportunityID__c );
           		if(record.IT_Future_OpportunityID__c != null){
            		record.linkOpp = '/lightning/r/Opportunity/'+record.IT_Future_OpportunityID__c+ '/view';
            		record.NameOpp = record.IT_Future_OpportunityName__c;
            		console.log('linkOpp: ', record.linkOpp);
        		}
        		});
            console.log('preSelected: ' +  myIds);
            component.set("v.preSelectedRows",myIds);
            component.set("v.data", records);
           /*var selValProd = record.IT_Product2__r.id;
            console.log('v.selectedValueProduct', selValProd);
            if(selValProd == null){
            	selValProd == '';
            	component.set("v.selectedValueProduct", selValProd);
        	}*/
            
            //component = component.find("linesTable");
        	//component.set("v.selectedRows", records.id);
        }
        });
            $A.enqueueAction(action);
            
        },
    getFrameCount: function(component, event, helper){
        var frame = component.get("v.Frame");
        var recordId = component.get("v.recordId");
        var action = component.get("c.getFrameCountController");    
        action.setParams({
            recordId,
            frame
        });
		action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	console.log(response.getReturnValue());
            	component.set("v.frameCount",response.getReturnValue());
            
        	}
        });
    },
            editRowStatus: function (component, row,action) {
                var datas = cmp.get('v.data');
                datas = datas.map(function(rowData) {
                    if (rowData.Id === row.Id) {
                        rowData.iconName = 'utility:check';
                        //    rowData.disabledValue = true;
                    } else {
                        rowData.iconName = 'utility:add';
                        //   rowData.disabledValue = false;
                    }
                    return rowData;
                });
                cmp.set("v.data", datas);
            },
            addToCase : function (component, row,event) {
                console.log('addToCase', component);
                var serverAction = component.get("c.getCloneOpportunity"); 
                console.log('GetCloneProva');
                var mktgActionVar = component.get('v.mktgAction');
                var Contact=component.get('v.contactId');
                component.set('v.FrameParentId',row.id);
                var isParent = true;
                component.set('v.isParent', isParent);
                console.log('FrameParent addToCase', component.get('v.FrameParentId'));
             	var fcFrameVar ='';
                console.log('FrameParentId', fcFrameVar);
            	//var frame = component.get('v.Frame');
            	var frameParent = component.get('v.FrameParent');
                var selValProd = null;
                
                if(component.get('v.PickVal') == '03' || component.get('v.PickVal') == '12'){
                    selValProd = component.get('v.selectedValueProduct');
                }
                console.log('selValProd', selValProd);
				

                serverAction.setParams({
                    financialCenterID: row.Id,
                    pickvalue:component.get('v.PickVal'),//'01'
                    selectedValueProduct:selValProd,
                    contactId:Contact, 
                    mktgActionId:mktgActionVar ,
                    finCenterFrameId:fcFrameVar,
                    //frame:frame,
                    frameParent:component.get('v.FrameParent')
                    //
                });
              component.set("v.loaded",true);
               /*   serverAction.setCallback(this, function(response) {
                    var state = response.getState();
                    console.log('state result', state);
                    if(state === "SUCCESS") {
                      component.set("v.loaded",false);
                        if(component.get('v.GroupId')=='') {
                            component.set("v.GroupId",response.getReturnValue())};
                        if (FrameParent==row.id) {   component.set("v.FrameParent",response.getReturnValue()) } ;
                        this.UpdateOpp(component,response.getReturnValue());
                        this.changeActionIcons(component, row); 
                    }else {
                        //component.set("v.loaded",false);
                        alert('error');
                    }
                }); 
                console.log('state add to case', state);
                $A.enqueueAction(serverAction);*/
                serverAction.setCallback(this, function(response) {
                   var state = response.getState();
                   console.log('state clone: '+ state);
                   if(state === "SUCCESS") {
                        component.set("v.loaded",false);
                        /*if(component.get('v.GroupId')=='') {
                            component.set("v.GroupId",response.getReturnValue())
                        };
                        if (FrameParent==row.id) {  
                       		component.set("v.FrameParent",response.getReturnValue()) 
                        } ;*/
                        component.set("v.GroupId",response.getReturnValue());
                        this.UpdateOpp(component,response.getReturnValue());
             		}else {
                        component.set("v.loaded",false);
                     
                    }
        		});
        $A.enqueueAction(serverAction);
            },  
            
            changeActionIcons : function (component, row) {
                var data = component.get('v.data');
                data = data.map(function(rowData) {
                    if ((rowData.Id === row.Id)|| (rowData.iconName=='utility:check')) {
                        rowData.iconName = 'utility:check';
                        rowData.disabledValue = true;
                    } else {
                        rowData.iconName = 'utility:add';
                        rowData.disabledValue = false;
                    }
                    return rowData;
                });
                component.set("v.data", data);
            },
            
            setActionIcons : function (component) {
                var data = component.get('v.data');
                data = data.map(function(rowData) {
                    if (rowData.Selected_Pet__c === true) {
                        rowData.iconName = 'utility:check';
                        rowData.disabledValue = true;
                    } else {
                        rowData.iconName = 'utility:add';
                        rowData.disabledValue = false;
                    }
                    return rowData;
                });
                component.set("v.data", data);
            }   ,
            UpdateOpp : function (component,oppId) {
                var serverAction = component.get("c.UpdateGroupField"); 
                serverAction.setParams({
                    GroupId:component.get('v.GroupId'),
                    OppId: oppId,
                    Frame:false,
                    FrameParent:component.get('v.FrameParent')
                });
                serverAction.setCallback(this, function(response) {
                    var state = response.getState();
                    if(state === "SUCCESS") {
                        
                    }else {
                        alert('error');
                    }
                });
                $A.enqueueAction(serverAction);         
            }, 
            
            alert: function(component, event, variant, title, message){
                console.log('enters the alert');
                component.find('notifLib').showToast({
                    "variant": variant,
                    "title": title,
                    "message": message,
                    "mode" : "sticky"/*,
            "duration": duration*/
                });
                console.log('enters the alert');
            },
            OppoReal :  function (component,event) {
                alert ('ci siamo');
            },
    CloneOpportunityFuture : function (component, event, helper) {
        
        var selectedRows = component.find('linesTable').getSelectedRows();
        var selectedRowsSize = selectedRows.length;
        
        
        if(selectedRowsSize > 49){
            helper.alert(component, event, "Error", '', "Hai superato il limite di selezione di "+(selectedRowsSize-49)+" unità");
        }
        else{
            
            var flexben = component.get('v.IsFlexbenefit');
            console.log('selectedRows', selectedRows);
            var OppRow;
            //var oppIds = [];
            var rowsWithoutParentOpp = [];
            var FrameParent;
            var OppParent;
            helper.alert(component, event, "Success", '', "Processo di creazione opportunità in corso.");
            selectedRows.forEach(function(element){
                
                if(flexben){
                    console.log('element.IT_Product2__r.IT_Acronym__c: '+element.IT_Product2__r.IT_Acronym__c);
                    console.log('element '+element.Id);
                    rowsWithoutParentOpp.push(element.Id); 
                }else{
                    if((element.IT_Contract__r.IT_Contract_Type__c === '03' && element.IT_Contract__r.IT_Framework_Head_Code__c == element.IT_Financial_Center__c)){
                        console.log('OPP ID TROVATA: '+element.Id);
                        OppRow = element; 
                        FrameParent=element.Id;
                        component.set('v.FrameParent', FrameParent);
                    }
                    else if (element.Id == component.get('v.recordId') && element.IT_Contract__r.IT_Contract_Type__c != '03'){
                        OppRow = element;
                        OppParent = true;
                    }
                    /*else if (element.IT_Product2__r.IT_Acronym__c === 'TW'){
                        console.log('entra if controllo Acronym: ');
                        rowsWithoutParentOpp.push(element.Id); 
                        isFlexParent = true;
                    }*/
                    else{
                        rowsWithoutParentOpp.push(element.Id); 
                        //  FrameParent=element.Id;
                        console.log('figlio:'+element.Id);
                    }  
            }
        });
            console.log('rowsWithoutParentOpp'+rowsWithoutParentOpp);
            console.log('v.FrameParent: '+FrameParent);
            
            if(OppRow != null && OppRow != undefined && (FrameParent != null || FrameParent != undefined)){
                console.log('OppRow != null');
                rowsWithoutParentOpp.unshift(OppRow.Id); 
                //helper.addToCase(component,OppRow,event);
            }
            else if (OppParent ){
                rowsWithoutParentOpp.unshift(OppRow.Id); 
                //helper.addToCase(component,OppRow,event);
            }
            
            if(rowsWithoutParentOpp != null && rowsWithoutParentOpp != undefined){
                setTimeout(function(){ 
                    var serverAction = component.get("c.getCloneOpportunityFuture"); 
                    var groupvar;
                    if(!flexben){
                        groupvar = component.get('v.GroupId');
                    }else{
                        groupvar = component.get('v.recordId')
                    }
                    console.log('GroupID figli', groupvar);
                    // Display that fieldName of the selected rows
                    var contactIdVar = component.get('v.contactId');
                    var mktgActionVar = component.get('v.mktgAction');
                    var fcFrameVar = component.get('v.FrameParentId');
                    var frame = component.get('v.Frame');
                    var frameParent = component.get('v.FrameParent');
                    console.log('CloneOpportunityFuture3');
                    serverAction.setParams({
                        financialCenterID: rowsWithoutParentOpp,
                        pickvalue:component.get('v.PickVal'),
                        selectedValueProduct:component.get('v.selectedValueProduct'),
                        contactId:contactIdVar, 
                        mktgActionId:mktgActionVar ,
                        finCenterFrameId:/*fcFrameVar*/ FrameParent, 
                        frame:frame,
                        frameParent:frameParent,
                        GroupId:groupvar,
                        isFlexbenefit: component.get('v.IsFlexbenefit'),
                        serviceExpDate: component.get('v.serviceExpDate')
                    });
                    
                    serverAction.setCallback(this, function(response) {
                        var state = response.getState();
                        console.log('state clone: '+ state);
                        
                    });
                    $A.enqueueAction(serverAction);
                }, 35000);
            }
        }      
    }
            
        })