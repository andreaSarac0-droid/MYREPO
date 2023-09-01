({ 
    //  doInit : function(component, event, helper) {
    // var newlbl = component.get("v.label");
    // console.log("newlbl "+newlbl+newlbl.length );
    //     // if (newlbl.length < 5) {
    //         newlbl= " &nbsp; .sss &nbsp; "+newlbl+" &nbsp; &nbsp; ";
    //         component.set("v.label", newlbl);        
    //         console.log("newlbl2aaa "+newlbl);
    //     // }
    // console.log("newlbl2 "+newlbl);
    // },
    handleChangeButton : function(component, event, helper) {
        // When an option is selected, navigate to the next screen
        var response = event.getSource().getLocalId();
        //component.set("v.value", response);
        var navigate = component.get("v.navigateFlow");
    console.log("direction "+component.get("v.direction"));
        if (component.get("v.direction") == "FINISH"){
            navigate("FINISH");
        } else if (component.get("v.direction") == "NEXT") {
            navigate("NEXT");
        } else if (component.get("v.direction") == "PREVIOUS") {
            navigate("PREVIOUS");
        } else navigate("NEXT");
        component.set("v.flgClick",true); 
    }
})