({
	init: function (component, event, helper){
        component.set('v.loaded', false);
        var objId = component.get("v.recordId");
        var objName = component.get("v.sObjectName");
        //console.log('objName:: '+objName);
        //var objName = 'ER_Store__c';
		//var objId = 'a095r000004DmfpAAC';
        helper.callAgreementsAffi(component, objId, objName);
        
    },

    openAllOperation : function(component,event,helper) {
        var recordObjectId = component.get("v.recordId");
		var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT57_Agreements",
            componentAttributes : {
                recordId : recordObjectId,
                viewAllBool : false,
				boolDataCounter : false,
            }    
        });
        evt.fire();  	
	},

    downloaPdf : function(component,event,helper) {
        var linkUrl = component.get("v.LinkBarcode");
        console.log('linkDownloadPDF:: '+linkUrl);
    	window.open(linkUrl, "_blank"); 	
	}
})