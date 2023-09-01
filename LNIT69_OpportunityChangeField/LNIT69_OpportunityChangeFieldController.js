({
    init: function (component, event, helper) {
        var recordId = component.get("v.recordId");
        //console.log('recordId: ' + recordId);
        helper.getAcctype(component,event);
        helper.getFieldPicklist(component, event);
    },
    
    onHeaderChange : function(component, event, helper) {
            
            var selectedValue = event.getSource().get("v.value");
            console.log('selectedValue: ' + selectedValue);
            console.log(event.getSource().get("v.native"));
            if(selectedValue == 'Inserisci manualmente'){
                component.set("v.ManualString",'');
                component.set("v.outputString",'');
                component.set("v.InserimentoManuale",true);
            }
            else{
                console.log(component.get("v.ManualString"));
                component.set("v.ManualString",'');
                component.set("v.outputString",selectedValue);
                component.set("v.InserimentoManuale",false);
            }
        }, 

        handleChange : function(component,event,helper){
            var valueInput = component.get("v.ManualString");
            console.log('Manual: ' + valueInput);
            component.set("v.outputString",valueInput);
            //console.log('valueInput: ' + valueInput);
        },

        handleBlur: function (component, event) {
            var valueInput = component.get("v.ManualString");
            console.log('Manual: ' + valueInput);
            component.set("v.outputString",valueInput);
        }
    })