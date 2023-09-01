({
    invokeAura: function(component, methodName, params){
        console.log('invokeAuraMethod', methodName);
        
        return new Promise($A.getCallback((resolve, reject)=>{
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
        }));
    },
    invokeQueryData: function (component, helper, fields) {
        const recordId = component.get('v.recordId');
        const sObjectName = component.get("v.sObjectName");
        
        return helper.invokeAura(component, 'queryData', {
            sObjectName,
            fields,
            recordId
        });
    },
    invokeGenerateContext: function(component, helper, templateData, recordId){
        const jsonData = JSON.stringify({contextPdf: templateData});

        return helper.invokeAura(component, 'generateContext', {
            jsonData,
            recordId
        });
    },
    invokeGeneratePdf: function(component, helper, recordId, attachmentId){
        return helper.invokeAura(component, 'generatePdf', {
            recordId,
            attachmentId
        });
    },
    invokeGenerateExcel: function(component, helper, recordId, attachmentId){
        return helper.invokeAura(component, 'generateExcel', {
            recordId,
            attachmentId
        });
    },
    updateContext: function (component, helper) {
        helper.kam.updateSource();

        return helper.invokeQueryData(component, helper, helper.kam.sourceFields);
    },
    applyContext: function (component, helper, sObjectData) {
        const Input = component.get('v.source') || {};
		console.log('Input',Input);
        helper.kam.applySource({Input});
        helper.kam.applySource(sObjectData);

        const form = helper.kam.getForm();
        component._set({form});
    },
    applyMiddle:function(component, helper){
        const callback = component.get('v.next');
        const source = helper.kam.sourceData;

        return new Promise((resolve, reject)=>{
            (callback) ? callback(source, resolve, reject) : resolve({});
        }).then((Input)=>{
            helper.kam.applySource({Input});
        })
    },
                                 
        invokeCheckExcel:function(component, helper,recordId){
            
            const action = component.get('c.checkCreateExcel');
            action.setParams({recordId});
            
            action.setCallback(this, (response)=>{
                const state = response.getState();
                if(state === 'SUCCESS'){
                    component.set('v.createExcel',response.getReturnValue());
                }else if(state === 'ERROR'){
                    throw new Error(response.getError());
                }
            });
            
            $A.enqueueAction(action);
            
        } 
})