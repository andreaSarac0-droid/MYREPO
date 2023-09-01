({
	init: function (component, event, helper){
        component.set('v.loaded', false);
        var objId = component.get("v.recordId");
        var objName = component.get("v.sObjectName");
        var objType = component.get("v.FiletrType");
        console.log('objType:: '+objType);
        helper.objectFilter(component, objId, objName, objType);     
    }, 

    createRecord : function (component, event, helper) {
        var RecordId = component.get("v.recordId");
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact",
                "defaultFieldValues": {
                'AccountId' : RecordId
            }
        });
        createRecordEvent.fire();
        /*var urlString = window.location.href;
        var baseURL = urlString.substring(0, urlString.indexOf("/r/"));
        console.log('BASEURL::: ' + baseURL);
        component.set("v.cbaseURL", baseURL);
        let UrlForRedirect = baseURL+"/o/Contact/new?defaultFieldValues=AccountId%3D"+RecordId;
        console.log('URLFORREDIRECT:::  ' +UrlForRedirect);
        window.open(UrlForRedirect,"_self");*/
    },

    handleSort: function(component, event, helper) {
       // helper.handleSort(component, event);
       var fieldName = event.getParam('fieldName');
       console.log('fieldName: ' + fieldName);
       var sortDirection = event.getParam('sortDirection');
       //var sortDirection = component.get("v.sortDirection") == 'asc' ? 'desc' : 'asc';  
       console.log('sortDirection: ' + sortDirection);
       // assign the latest attribute with the sorted column fieldName and sorted direction
       component.set("v.sortedBy", fieldName);
       component.set("v.sortDirection", sortDirection);
       //helper.sortData(component, fieldName, sortDirection);
       var data = component.get("v.data");
       var reverse = sortDirection !== 'desc';
       console.log('reverse: ' + reverse);
       //sorts the rows based on the column header that's clicked
       data.sort(helper.sortBy(fieldName, reverse))
       component.set("v.data", data);
       //component.set("v.sortDirection", sortDirection);
       //helper.handleSort(component, event);
    },

    handleRowAction : function(component,event,helper){ 
        var action = event.getParam('action').name;
        var row = event.getParam('row');
        var idRecord = '';
        console.log('ACTION::::: '+action);
        console.log('row.linkContact::::: '+row.linkContact);
        
        var contactIdReferenceTemp = row.linkContact.replace("/lightning/r/Contact/", "");
        var contactIdReference = contactIdReferenceTemp.replace("/view", "");
        console.log('contactIdReference::::: '+contactIdReference);
        if(action == 'Edit'){
            var editRecordEvent = $A.get("e.force:editRecord");
            editRecordEvent.setParams({
                "recordId": contactIdReference
            });
            editRecordEvent.fire();       
        }
    }
})