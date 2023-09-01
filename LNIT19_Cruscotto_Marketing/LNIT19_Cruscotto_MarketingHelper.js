({
    invokeAura: function(component, methodName, params){
        console.log('invokeAuraMethod', methodName);
        
        return new Promise((resolve, reject)=>{
            const action = component.get('c.' + methodName);
            
            if(params) action.setParams(params);
            
            action.setCallback(this, (response)=>{
            const state = response.getState();
            if(state === 'SUCCESS'){
            resolve(response);  
        }else if(state === 'ERROR'){
            throw new Error(response.getError());
        }
    });
    
    $A.enqueueAction(action);
});

},
    getCampaignContacts: function(component, helper, recordId){
        return helper.invokeAura(component, 'getCampaignContacts', {
            campaignId: recordId
        }).then((response)=>{
            const result = response.getReturnValue();
            
            if(!result.isSuccess) throw new Error(result.errorMessage);
            
            const detailList = [];
            for(let index in result.contacts){
            const value = result.contacts[index];
            value.LastActivityDate= 'test';
            value.inOtherCampaign = (result.contactInOtherCampaign.includes(value.Id));
              result.MaxDate.forEach(function(record){
                      alert("AccountIdValue"+ value.AccountId); 
            alert("AccountIdRecord"+ record.AccountId);
            value.LastActivityDate= 'test';
            if (record.AccountId==value.AccountId){
            value.LastActivityDate= 'test';
             console.log("ActivityDate"+ record.ActivityDate); 
        }
                });
            
            
            detailList.push(value);
        }
                
                component.set("v.acctList", detailList);
this.paginate(component, null, 0);
        component.set("v.ifViewAll", false);
        
        return Promise.resolve(response);
    }) 
}
/*,
	getCampaigns: function(component, helper){
        return helper.invokeAura(component, 'GetCampaignList').then((response)=>{
            const result = response.getReturnValue();
            component.set("v.options", result);

            return Promise.resolve(response);
        })
    }*/,  
        getCampaigns: function(component, helper){
            return helper.invokeAura(component, 'GetCampaignList').then((response)=>{
                const result = response.getReturnValue();
                component.set("v.options", result);
                
                return Promise.resolve(response);
            })
        },
            getCampaignsDoneCount: function(component, helper,recordId){
                return helper.invokeAura(component, 'getCampaignDoneCount',{campaignId : recordId}).then((response)=>{
                    const result = response.getReturnValue();
                    component.set("v.donecount", result);
                    
                    return Promise.resolve(response);
                })
            },
                getCampaignsToDoCount: function(component, helper,recordId){
                    return helper.invokeAura(component, 'getCampaignToDoCount',{campaignId : recordId}).then((response)=>{
                        const result = response.getReturnValue();
                        component.set("v.todocount", result);
                        console.log("v.todocount" + result);
                        return Promise.resolve(response);
                    })
                },
                    getCampaignsToDoCountNotResponded: function(component, helper,recordId){
                        return helper.invokeAura(component, 'getCampaignDoneCountNotResponded',{campaignId : recordId}).then((response)=>{
                            const result = response.getReturnValue();
                            component.set("v.todoNr", result);
                            console.log("v.todoNr" + result);
                            return Promise.resolve(response);
                        })
                    },
                        fetchAccounts : function(component, event, helper,recordId) {
                            
                            component.set('v.mycolumns', [
                                {label: 'Account Name', fieldName: 'linkName', type: 'url', 
                                 typeAttributes: {label: { fieldName: 'AccountName' }, target: '_self'}, sortable: true},
                                {label: 'Email', fieldName: 'Email', type: 'Email', sortable: true},
                                {label: 'Telefono', fieldName: 'Phone', type: 'Phone', sortable: true},
                                {label: 'Provincia', fieldName: 'BillingState', type: 'Text', sortable: true},
                                {label: 'Cap', fieldName: 'BillingPostalCode', type: 'Text', sortable: true},
                                {label: 'Città', fieldName: 'BillingCity', type: 'Text', sortable: true},
                                {label: 'Issue Volume', fieldName: 'IT_Issue_Volume__c', type: 'currency', sortable: true},
                                {label: 'Data ultimo ordine', fieldName: 'IT_Last_Order_Date__c', type: 'Text', sortable: true},
                                {label: 'Esito', fieldName: 'Status', type: 'Text', sortable: true},
                                {label: 'Codice', fieldName: 'IT_Financial_Center__c', type: 'Text', sortable: true},
                                {label: 'Data ultima attività', fieldName: 'LastActivityDate', type: 'Text', sortable: true},
                                {label: 'Cluster', fieldName: 'IT_Cluster__c', type: 'Text', sortable: true},
                            {label: 'In Altri Cruscotti', fieldName: 'inOtherCampaign', type: 'boolean', sortable: true},
                            {label: 'Assegnato a ', fieldName: 'IT_User_Name__c', type: 'Text', sortable: true}]);
                            return helper.invokeAura(component, 'getCampaignContacts', {
                                campaignId: recordId
                            }).then((response)=>{
                                const result = response.getReturnValue();
                                if(!result.isSuccess) throw new Error(result.errorMessage);
                                
                                const detailList = [];
                                for(let index in result.contacts){
                                const value = result.contacts[index];
                                value.inOtherCampaign = (result.contactInOtherCampaign.includes(value.Id));
                                value.linkName = '/lightning/r/Account/'+value.AccountId+ '/view';
                                value.AccountName=value.Account.Name;
                                value.BillingState=value.Account.BillingState;
                                value.BillingPostalCode=value.Account.BillingPostalCode;
                                value.BillingCity=value.Account.BillingCity;
                                value.IT_Issue_Volume__c=value.CampaignMembers[0].IT_Issue_Volume_Dashboard__c;
                                value.IT_Cluster__c=value.CampaignMembers[0].IT_Cluster_Dashboard__c;
                                value.code=value.CampaignMembers[0].IT_Client_Code__c;
                                value.Status=value.CampaignMembers[0].Status;
                                value.Email=value.CampaignMembers[0].IT_Email_Dashboard__c;
                                value.Phone=value.CampaignMembers[0].IT_Phone_Dashboard__c;
                                value.IT_Financial_Center__c=value.CampaignMembers[0].IT_Code_Dashboard__c;
                                value.IT_User_Name__c=value.CampaignMembers[0].IT_User_Name__c;
                                value.inOtherCampaign = (result.contactInOtherCampaign.includes(value.Id));
                                value.LastActivityDate=value.CampaignMembers[0].IT_Last_Activity_Date_Dashboard__c;
                                value.IT_Last_Order_Date__c=value.CampaignMembers[0].IT_Last_Order_Date__c;
                                
                                /* var ActivityDate;
                                console.log('Value1Out'+value.AccountId); 
                                console.log('MaxDate'+result.MaxDate.length); 
                           result.MaxDate.forEach(function(record){
            
                          
                                    console.log('Value2'+record.WhatId);
                                 if (record.WhatId==value.AccountId){
                                                          
                                value.LastActivityDate= record.ActivityDate; 
                                console.log('ActivityDate'+ActivityDate);
                            }
                                    
                                    });
                               result.MaxDate.forEach(function(record){
            if (record.WhatId==value.AccountId){
                              
            ActivityDate= record.ActivityDate;
        }
                });*/
                            
                            
                            detailList.push(value);
                        }

component.set("v.acctList", detailList);
this.paginate(component, null, 0);
component.set("v.ifViewAll", false);

return Promise.resolve(response);
})      

},
    sortData: function (component, fieldName, sortDirection) {
        var dataToSort = component.get("v.acctList");
        console.log('dataToSort'+JSON.stringify(dataToSort));
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse));
        console.log('data sorted',JSON.stringify(dataToSort));
        component.set("v.acctList", dataToSort);
        this.paginate(component, null, 0);
    },
        sortBy: function (field, reverse, primer) {
            var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
            //checks if the two rows should switch places
            reverse = !reverse ? 1 : -1;
            return function (a, b) {
                return a = key(a)?key(a):'', b = key(b)?key(b):'', reverse * ((a > b) - (b > a));
            }
        },
    paginate: function (component, event, previousPage) {
        var acctList = component.get('v.acctList');
        
        if(acctList.length < component.get("v.pageSize")){
            component.set("v.isLastPage", true);
        } else{
            component.set("v.isLastPage", false);
        }
        var pageNumber = component.get("v.pageNumber");
        console.log('previousPage: ',previousPage);
        console.log('page: ',pageNumber);
        var minPage = Math.min(previousPage, pageNumber);
        var maxPage = Math.max(previousPage, pageNumber);
        var paginatedData = acctList.slice((pageNumber-1)*10 , pageNumber*10);
        component.set("v.dataSize", paginatedData.length);
        component.set("v.paginatedData", paginatedData);
        
    },
})