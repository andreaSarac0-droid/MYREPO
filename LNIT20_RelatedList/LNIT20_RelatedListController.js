({  
      
    fetchRecords : function(component, event, helper) {  
          
               component.set('v.columns', [
                   {label: component.get("v.label1"), fieldName:component.get("v.field1"), type: 'text'},
            {label: component.get("v.label2"), fieldName: component.get("v.field2"), type: 'text'},
            {label: component.get("v.label3"), fieldName: component.get("v.field3"), type: 'text'},
            {label: component.get("v.label4"), fieldName: component.get("v.field4"), type: 'text'},
            {label: component.get("v.label5"), fieldName: component.get("v.field5"), type: 'text'},
            {label: component.get("v.label6"), fieldName: component.get("v.field6"), type: 'text'},
            {label: component.get("v.label7"), fieldName: component.get("v.field7"), type: 'text'},
            {label: component.get("v.label8"), fieldName: component.get("v.field8"), type: 'text'},
            {label: component.get("v.label9"), fieldName: component.get("v.field9"), type: 'text'}
           // {label: component.get("v.label10"), fieldName: component.get("v.field10"), type: 'text'},

        ]);
        var temObjName = component.get( "v.sobjectName" );  
        component.set( "v.ObjectName", temObjName.replace( "__c", "" ).replace( "_", " " ) );  
        var action = component.get( "c.fetchRecs" );  
        action.setParams({  
            recId: component.get( "v.recordId" ),  
            sObjName: temObjName,  
            parentFldNam: component.get( "v.parentFieldName" ),  
            strCriteria: component.get( "v.criteria" )  ,
            AccountHierarchy:component.get( "v.AccountHierarchy" ),
            field1:component.get( "v.field1" ),
            field2:component.get( "v.field2" ),
            field3:component.get( "v.field3" ),
            field4:component.get( "v.field4" ),
            field5:component.get( "v.field5" ),
            field6:component.get( "v.field6" ),
            field7:component.get( "v.field7" ),
            field8:component.get( "v.field8" ),
            field9:component.get( "v.field9" ),
        });  
        action.setCallback(this, function(response) {  
            var state = response.getState();  
            if ( state === "SUCCESS" ) {  
                  
                var tempTitle = component.get( "v.title" );  
                component.set( "v.listRecords", response.getReturnValue().listsObject );  
                component.set( "v.title", tempTitle + response.getReturnValue().strTitle );  
                  
            }  
        });  
        $A.enqueueAction(action);  
          
    },  
      
    viewRelatedList: function (component, event, helper) {  
          
        var navEvt = $A.get("e.force:navigateToRelatedList");  
        navEvt.setParams({  
            "relatedListId": component.get( "v.childRelName" ),  
            "parentRecordId": component.get( "v.recordId" )  
        });  
        navEvt.fire();  
    },  
      
    viewRecord: function (component, event, helper) {  
          
        var navEvt = $A.get("e.force:navigateToSObject");  
        var recId = event.getSource().get( "v.value" )  
        navEvt.setParams({  
            "recordId": recId  
        });  
        navEvt.fire();  
          
    }  
      
})