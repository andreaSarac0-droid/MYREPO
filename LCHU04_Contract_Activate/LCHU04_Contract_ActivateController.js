({
    doInit : function(component, event, helper) {
        
        helper.getContractHelper(component, event, helper);
    },
    cancel : function(component, event, helper) {
        
        $A.get("e.force:closeQuickAction").fire();
    },
    activateContract : function(component, event, helper) {
        
        var AccountCreatedInSysOp = component.get("v.AccountCreatedInSysOp");
        var ContractCreatedInSysOp = component.get("v.ContractCreatedInSysOp");
        console.log('AccountCreatedInSysOp '+AccountCreatedInSysOp);
        console.log('ContractCreatedInSysOp '+ContractCreatedInSysOp);
        
        if(AccountCreatedInSysOp == false){
            
            helper.saveEdg(component, event, helper);
        }
        else if(ContractCreatedInSysOp == false){
            
            helper.saveContractEdg(component, event, helper);
        }
            else{
                helper.toggleSpinner(component);
                helper.activateContractJSHelper(component, event, helper);
            }
    },
    //******************saveEdg what was in init before ****************
    saveEdg: function(component, event, helper) {
        
        helper.saveEdg(component, event, helper);
    },
    saveContractEdg: function(component, event, helper) {
        
        helper.saveContractEdg(component, event, helper);
    },
    //******************closePopUp**************** 
    closePopUp: function(component, event, helper) {
        
        $A.get("e.force:closeQuickAction").fire();
    }
})