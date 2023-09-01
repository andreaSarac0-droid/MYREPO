({
	doInit : function(cmp, event, helper) {
     	let listContact = [];
        let caseId = cmp.get("v.recordId");
        let action = cmp.get("c.populateValues");
       	action.setParams({
            "recordId" : caseId
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            let currentCase = response.getReturnValue();
            if(currentCase.Contact != null){
                listContact.push(currentCase.Contact);
                cmp.set('v.selectedContact',listContact);
                cmp.set('v.contactEmail',currentCase.SuppliedEmail);
                cmp.set('v.contactPhone',currentCase.SuppliedPhone);
                cmp.set('v.contactName', null);
                let lookupPill = cmp.find("lookup-pill");
                $A.util.removeClass(lookupPill, "slds-hide");
                let Input = cmp.find("input");
                $A.util.addClass(Input, "slds-hide");
            }
            else{
                cmp.set('v.selectedContact',null);
                cmp.set('v.contactEmail',currentCase.SuppliedEmail);
                cmp.set('v.contactPhone',currentCase.SuppliedPhone);
            }
           
           
        });
         $A.enqueueAction(action);
        
       	},
    
    onchange : function(cmp, event, helper) {
        let caseId = cmp.get("v.recordId");
		let contName = cmp.get('v.contactName');
        let action = cmp.get('c.lookUpContact');
        action.setParams({"searchTerm": contName,"caseId":caseId});
        action.setCallback(this, function (response) {
                let state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    let result = response.getReturnValue();
                    console.log(JSON.stringify(result));
                    cmp.set("v.conList", result);
                    let ToOpen = cmp.find("toOpenContact");
                    $A.util.addClass(ToOpen, "slds-is-open");
                    
                }
            else{
                console.log(JSON.stringify(response.getError()));
            }
         });
        $A.enqueueAction(action);
        
	},
    
    onBlur : function(cmp, event, helper) {
		
	},
    
    onfocus : function(cmp, event, helper) {
		console.log('sono nel focus')
        let caseId = cmp.get("v.recordId");
		let contName = cmp.get('v.contactName');
        let action = cmp.get('c.lookUpContact');
        action.setParams({"searchTerm": null,"caseId":caseId});
        action.setCallback(this, function (response) {
                let state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    let result = response.getReturnValue();
                    console.log(JSON.stringify(result));
                    cmp.set("v.conList", result);
                    let ToOpen = cmp.find("toOpenContact");
                    $A.util.addClass(ToOpen, "slds-is-open");
                    
                }
            else{
                console.log(JSON.stringify(response.getError()));
            }
         });
        $A.enqueueAction(action);
        
        
	},
     
    Remove: function(cmp, event, helper) {
        cmp.set('v.selectedContact',null);
        cmp.set('v.contactName',null);
        let lookupPill = cmp.find("lookup-pill");
        $A.util.addClass(lookupPill, "slds-hide");
        let Input = cmp.find("input");
        $A.util.removeClass(Input, "slds-hide");
            
	},
    
    handleEvent: function(cmp,event,helper){
       let finalEmail = '';
       let finalPhone = '';
       let currentCase = cmp.get('v.CaseRecord'); 
       let selectedList = [];
       let contactSel = event.getParam("Contact");
       selectedList.push(contactSel);
        
       let initContactId = currentCase.ContactId ;
       let selectedContactId = selectedList[0].Id;
        
       console.log('init Id '+ initContactId + ' select Id '+ selectedContactId);
       cmp.set("v.selectedContact", selectedList);
	   cmp.set('v.contactName', null);
        
       let Input = cmp.find("input");
       $A.util.addClass(Input, "slds-hide");
       let lookupPill = cmp.find("lookup-pill");
       $A.util.removeClass(lookupPill, "slds-hide");
       let blurTimeout = cmp.get('v.blurTimeout');
	   	
        if (blurTimeout) {
            clearTimeout(blurTimeout);
            
        }
       
       let ToOpen = cmp.find("toOpenContact");
       $A.util.removeClass(ToOpen, "slds-is-open");
        
        
       
              
    },
    
    clickPill: function(cmp,event,helper){
        let navService = cmp.find("navService");
        let contactList = cmp.get("v.selectedContact");
        let contactId = contactList[0].Id;
        let pageReference = {
            					type: 'standard__recordPage',
            						attributes: {
                						recordId: contactId,
                						objectApiName: 'Contact',
                						actionName: 'view'
            								}
        					}
        cmp.set("v.pageReference", pageReference);
        let pgRef = navService.generateUrl(pageReference);
        navService.navigate(pageReference);
        
    }
    
})