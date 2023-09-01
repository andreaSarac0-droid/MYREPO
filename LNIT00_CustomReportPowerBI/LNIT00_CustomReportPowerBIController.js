({
	doInit : function(component, event, helper){
       var recordId = component.get("v.recordId");
       var reportname = component.get("v.ReportName");
       helper.getReportUrl(component, helper,recordId,reportname);
      
    },
    
 
	openActionWindow : function(component, event, helper) {
		 window.open(component.get("v.reportURL"));
	}

})