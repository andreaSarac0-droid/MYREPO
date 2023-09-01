({
    handleClick : function(component, event, helper) {
        console.log('--'+window.location.href);
        console.log('--'+window.location.protocol+'//'+window.location.host  );
        let urltemp =window.location.protocol+'//'+window.location.host ;
        urltemp = urltemp.replace(".lightning.force.com",".my.salesforce.com");
        console.log('--->'+urltemp);
        var workspaceAPI = component.find("workspace");
        var RecordId = component.get("v.AccountId");
        var urlRedirect = "https://er-italy--dev002.lightning.force.com/lightning/o/Contact/new?defaultFieldValues=AccountId%3D0015r00000H9cZ3AAJ";
        var urlString = window.location.href;
        console.log('URLSTRING:: ' + urlString);
        var baseURL = urlString.substring(0, urlString.indexOf("/r/"));
        console.log('BASEURL::: ' + baseURL);
        component.set("v.cbaseURL", baseURL);
        let UrlForRedirect = baseURL+"/o/Contact/new?defaultFieldValues=AccountId%3D"+RecordId;
        console.log('URLFORREDIRECT:::  ' +UrlForRedirect);
        window.open(UrlForRedirect,"_self");
    }
})