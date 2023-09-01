({
    apex: function (component, event, apexAction, params) {
        var p = new Promise($A.getCallback(function (resolve, reject) {
            var action = component.get("c." + apexAction + "");
            action.setParams(params);
            action.setCallback(this, function (callbackResult) {
                if (callbackResult.getState() == 'SUCCESS') {
                    resolve(callbackResult.getReturnValue());
                }
                if (callbackResult.getState() == 'ERROR') {
                    console.log('ERROR', callbackResult.getError());
                    reject(callbackResult.getError());
                }
            });
            $A.enqueueAction(action);
        }));
        return p;
    },

    changePage: function (component, event, changeType) {
        var pageNumber = component.get('v.pageNumber');
        if(changeType == 'Next'){
            pageNumber++;
        }
        else if(changeType == 'Next1') {
            pageNumber=pageNumber+3;
        }
            else if(changeType =='Back'){
                pageNumber--;
            }
                else if(changeType =='Back1'){
                    pageNumber=pageNumber-3;
                }
                    else if(changeType =='Open'){
                        pageNumber=1;
                    }
        component.set('v.pageNumber',pageNumber);
    }
})