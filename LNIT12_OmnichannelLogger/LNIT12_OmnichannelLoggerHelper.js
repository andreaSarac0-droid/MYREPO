({
   LoginUser: function(cmp, evt, hlp) {
        var omniAPI = cmp.find("omniToolkit");
        omniAPI.login({statusId: "0N51t000000g1yq"}).then(function(result) {
            if (result) {
                console.log("Login successful");
            } else {
                console.log("Login failed");
            }
        }).catch(function(error) {
            console.log(error);
        });
    }

})