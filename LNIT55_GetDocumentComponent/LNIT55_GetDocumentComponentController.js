({
    init : function(cmp, event, helper) {
		helper.retriveName(cmp,event,helper);
        //helper.retriveObjectData(cmp,event,helper);
	},
    
	handleClick : function(cmp, event, helper) {
		helper.getDocumentFromBarcode(cmp,event,helper);
	},
    
    exitModal : function(cmp,event,helper){
        cmp.set("v.isModalOpen",false);
    }
})