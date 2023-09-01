({
    handleChangeButton : function(component, event, helper) {
        // When an option is selected, navigate to the next screen
        var response = event.getSource().getLocalId();
        //component.set("v.value", response);
        var navigate = component.get("v.navigateFlow");
        navigate("NEXT");
        }
})