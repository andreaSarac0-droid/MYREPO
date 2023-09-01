({
    doInit: function(component, event, helper){
        if(component.get('v.sObjectName') == 'Opportunity'){
            component.set('v.phase', 0);  
            console.log('OPPO');
        }
        component.set('v.setVisiblity', (visility)=>{
            component.set('v.show', visility);
        });
            
        },
            closeModal:function(component,event,helper){    
                component.set('v.show', false);
                if(component.get('v.sObjectName') == 'Opportunity'){
                    component.set('v.phase', 0);  
                }
            },
            openmodal: function(component,event,helper) {
                component.set('v.show', true); 
            },
            
            handleClick: function(component,event,helper) {
                component.set('v.phase', 1); 
            }
        })