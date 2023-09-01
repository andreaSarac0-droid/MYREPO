({
	doInit : function(component, event, helper) {
		component.set('v.loaded', false);
		helper.showEDocument(component, event, helper); 
		var optsType = [
			{ value: "", label: "--none--" },
            { value: "1", label: "Buoni Acquisto" },
            { value: "2", label: "Voucher" },
			{ value: "3", label: "Rimborsi" },
			{ value: "4", label: "Versamenti" },
			{ value: "5", label: "Altri benefit" },
			{ value: "6", label: "Mutui" }
        ];
		component.set("v.pickTypeList", optsType);
		
		var optsStatus = [
			{ value: "", label: "--none--" },
            { value: "1", label: "BOZZA" },
			{ value: "2", label: "INVIATA" },
			{ value: "3", label: "RIMANDATA AL BENEFICIARIO" },
			{ value: "4", label: "RESPINTA" },
			{ value: "5", label: "ANNULLATA" },
			{ value: "6", label: "APPROVATA" },
			{ value: "7", label: "LIQUIDATA" },
			{ value: "8", label: "PROCESSATA" },
			{ value: "9", label: "EMESSA" },
			{ value: "10", label: "IN LAVORAZIONE" },
			{ value: "11", label: "UTILIZZATO" },
			{ value: "12", label: "RESO" }
        ];
		component.set("v.pickStatusList", optsStatus);
		
		var optsCategory = [
			{ value: "", label: "--none--" },
            { value: "1", label: "BUONI ACQUISTO" },
			{ value: "2", label: "ISTRUZIONE E FORMAZIONE" },
			{ value: "3", label: "VIAGGI &TURISMO" },
			{ value: "4", label: "SALUTE" },
			{ value: "5", label: "SPORT & BENESSERE" },
			{ value: "6", label: "ASSISTENZA SOCIALE E FAMILIARE" },
			{ value: "7", label: "TRASPORTO" },
			{ value: "8", label: "PREVIDENZA" },
			{ value: "9", label: "CULTURA & TEMPO LIBERO" },
			{ value: "10", label: "CODICI ONLINE" },
			{ value: "11", label: "ALTRI BENEFIT" },
			{ value: "12", label: "TICKET WELFARE" },
			{ value: "13", label: "MONETIZZAZIONE" },
			{ value: "14", label: "MUTUI" },
			{ value: "15", label: "WORK LIFE BALANCE" }
        ];
        component.set("v.pickCategoryList", optsCategory);
	},

	showDocumentFilter : function(component, event, helper) {
		component.set('v.loaded', false);
		helper.showEDocument(component, event, helper);    
	},
    
    openAllOperation : function(component,event,helper) {
        var recordObjectId = component.get("v.recordId");
		var recordObjectName = component.get("v.sObjectName");
		var evt = $A.get("e.force:navigateToComponent");
        console.log('evt'+evt);
        evt.setParams({
            componentDef : "c:LNIT34_GetOperation",
            componentAttributes : {
                recordId : recordObjectId,
				sObjectName : recordObjectName,
				viewAllBool : false,
				boolDataCounter : false,
            }    
        });
        evt.fire();  	
	},
	
	updateColumnSorting_present: function(component, event, helper) {
		
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy_present", fieldName);
        component.set("v.sortedDirection_present", sortDirection);
        helper.sortData_present(component, fieldName, sortDirection); 
    }
})