({
    addressNormalize : function(component , event ) {
        //IF ALL FIELDS ARE NOT NULL?
        //console.log('STREET ' + component.get('v.streetWrap'));
        var address;
        var city;
        var cityName;
        var street;
        var province = component.get('v.provinceWrap').split('§')[0];
        var provinceName = component.get('v.provinceWrap').split('§')[1];
        var regionVar = component.get('v.regionRef');
        var streetNumber = component.get ('v.Civico');
        
        if(component.get('v.streetWrap').includes('§')){
            if(province == '0'){
                address = component.get('v.streetWrap').split('§')[1];
            }else{
                address = component.get('v.streetWrap').split('§')[2] +' '+component.get('v.streetWrap').split('§')[1];
            }
        }else{
            address = component.get('v.streetWrap');
        }
        if(component.get('v.cityWrap').includes('§')){
            city = component.get('v.cityWrap').split('§')[0];
            cityName = component.get('v.cityWrap').split('§')[1];
        }else{
            //city = '0000000';//0';
            cityName = component.get('v.cityWrap');
        }
        console.log('city '+ city + ' - ' + cityName);
        console.log('street '+ component.get('v.streetWrap'));
        if(component.get('v.streetWrap').includes('§')){
            street = component.get('v.streetWrap').split('§')[0];
        }else{
            //street = '0000000';
        }
        
        if(regionVar == null || regionVar == undefined || regionVar == ''){
            regionVar= component.get('v.provinceWrap').split('§')[2];
        }
        
        if(address && /*city && */province && /*street && */streetNumber){
            /*console.log("IN AUTOCOMPLETE");
            var action3 = component.get('c.callAutocomplete');
            var autocompleteRequest = {"address" : address, "town" : cityName , "province" : provinceName, "region" : "null"};
            console.log('autocompleteRequest: '+JSON.stringify(autocompleteRequest));
            action3.setParams({
                'jsonToSend' : JSON.stringify(autocompleteRequest)
            });
            action3.setCallback(this, function (response3) {
                if (response3.getState() == "SUCCESS") {
                    var returnedAutoComplete = response3.getReturnValue();
                    var autoCompleted = JSON.parse(returnedAutoComplete);
                    console.log('AUTOCOMPLETE: '+returnedAutoComplete);
                    var completedAddress = autoCompleted.data[0];
                    console.log('COMPLETED:: '+completedAddress.completed_address);
                    console.log('POSTAL CODE:: '+completedAddress.post_code);*/
                    //var addressName = component.get('v.toponym').split('§')[0] + ' ' +component.get('v.streetWrap').split('§')[1]; 
                    //var postCode = completedAddress.post_code;
            		var requestObject;
            		if(component.get('v.provinceWrap').split('§')[0] == '0'){
                        //var addressName = component.get('v.streetWrap').split('§')[1]; 
                        requestObject = {"address" : address, /*"postal_code" : "null",*/ "municipality_ref" : city , "municipality_name" : cityName, "street_ref" : street,"street_number" : streetNumber}; //"street_ref" : street,
                    }else{
                        var addressName = /*component.get('v.toponym').split('§')[0] + ' ' +*/component.get('v.streetWrap').split('§')[1];
                        console.log('ADDRESS '+addressName);
                        requestObject = {"country" : "IT", "address" : addressName, "municipality_ref" : city , "province_ref" : province, "region_ref" : regionVar, "street_ref" : street, "street_number" : streetNumber};
                    }
                    var requestString = JSON.stringify(requestObject).replace(/\\n/g, "\\n");
                    console.log('JSON: '+requestString)
                    var action = component.get('c.callNormalize');
                    action.setParams({
                        'jsonToSend' : requestString
                    });
                    action.setCallback(this, function (response) {
                        if (response.getState() == "SUCCESS") {
                            console.log("SUCCESS");
                            var returnedstring = response.getReturnValue();
                            console.log('NORMALIZED: '+returnedstring);
                            var fullAddress = JSON.parse(returnedstring);
                            console.log('FULLADDRESS: '+returnedstring);
                            if(fullAddress.meta.status == 'succeeded'){

                            var address = fullAddress.data.address;
                            var geolocation = fullAddress.data.geolocation;
                            console.log('address: '+address);
                            console.log('geolocation: '+geolocation);
                            component.set('v.fullAddress' , address);
                            component.set('v.CAP' , address.post_code);
                            //GEOLOC
                            component.set('v.geoQualita' , geolocation.coordinates_quality);
                            component.set('v.geoRefY' , geolocation.latitude_degrees);
                            component.set('v.geoRefX' , geolocation.longitude_degrees);
                            component.set('v.metRefY' , geolocation.latitude_meters);
                            component.set('v.metRefX' , geolocation.longitude_meters);
                            //END GEOLOC
                            console.log('PROVINCE ABBREVIATION:: '+address.province_abbreviation);
                            console.log('METREF:: '+geolocation.longitude_meters);
                            component.set('v.shortProvince' , address.province_abbreviation);
                            //component.set('v.toponym' , address.town_planning_name);
                            if(address.town_planning_name != null){
                                component.set('v.toponym' , address.town_planning_name);
                            }
                            else{
                                component.set('v.toponym','');
                            }
                            component.set('v.shortStreet' , address.address);
                            component.set('v.extraSpecs' , address.suburban_specification);
                           	component.set('v.regionDesc' , address.region);

                            if(component.get('v.provinceWrap').split('§')[0] != '0'){
                                var action2 = component.get('c.fetchHamlets');
                                action2.setParams({
                                    "municipRef": city
                                });
                                action2.setCallback(this, function (response) {
                                    if (response.getState() == "SUCCESS") {
                                        var fullresp = response.getReturnValue();
                                        console.log('FULLRESP:: '+fullresp);
                                        var hamlet = JSON.parse(fullresp).data;
                                        var returnMap = [];
                                        if(hamlet != null && hamlet.length > 0){
                                            hamlet.forEach(function(element) {
                                                //returnMap.push(element.province_ref , element.name_display);
                                                returnMap.push({'key' : element.hamlet_ref , 'value' : element.name_display});  
                                            });
                                            returnMap.push('');
                                            component.set('v.hamletMap' , returnMap);
                                            component.set('v.hamlet' , '');
                                            component.set('v.locAggReadOnly' , false);
                                            
                                        }
                                        else{
                                            component.set('v.hamletMap' , null);
                                        }
                                        //component.set('v.LocAgg' , hamlet[0].name_display);//JUST TO TEST, WILL BE CHANGED
                                    }
                                    else{
                                        console.log('ERROR:: '+response.getError());
                                    }
                                });
                                $A.enqueueAction(action2);
                            }else{
                                component.set('v.cityWrap', address.town_ref + '§' + address.town);
                            	component.set('v.streetWrap', address.address_ref + '§' + address.address);
                            }
                        }
                        else{
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "type":"error",
                                "title": "Attenzione!",
                                "message": fullAddress.meta.messages[0].text
                            });
                            toastEvent.fire();
                        }
                        } 
                        else {
                            console.log(response.getError());
                        }
                    });
                    $A.enqueueAction(action);
                    
               /* }
            });
            $A.enqueueAction(action3);*/
            
            
        }
        else{
            console.log('ERROR::: Province : '+province +' , provinceName : '+provinceName+'REGION: '+region+'CITY: '+city+'STREET: '+street);
        console.log('ERROR::: Province : '+component.get('v.provinceWrap'));
        }
        
    },
    
    addressValidate : function(component , event , selectedAction ) {
        var address = component.get('v.streetWrap').split('§')[2] +' '+component.get('v.streetWrap').split('§')[1];
        var address2 = component.get('v.streetInput');
        var cityName = component.get('v.cityWrap').split('§')[1];
        var provinceName = component.get('v.provinceWrap').split('§')[1];
        var streetNumber = component.get ('v.Civico');
        var CAP = component.get ('v.CAP');
        console.log('ERROR::: streetNumber : '+streetNumber +' , provinceName : '+provinceName+'cityName: '+cityName + address2 + address+'provincewrap:: '+ component.get('v.provinceWrap') );
        if(address2 != null && CAP != null && address != null && cityName != null && provinceName != null && streetNumber != null && address != '' && cityName != '' && provinceName != '' && address2 != '' && CAP != '' &&  streetNumber != ''){
            component.set('v.validated' , true);
        }
        else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type":"error",
                "title": "Attenzione!",
                "message": "Compilare tutti i campi obbligatori."
            });
            toastEvent.fire();
        }
        
    },
    getCountries: function(component, event){
        console.log("Countries");
        
        var action = component.get("c.getCountriesAura");
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                var retVal = response.getReturnValue();
                console.log("retVal",retVal);
                /*var resp = JSON.parse(retVal);
                console.log('RESPONSE PARSATA' + resp);
                var returnMap = [];
                var countries = resp;
                console.log('countries' + countries);
                
                countries.forEach(function(element) {
                    console.log('element',element);
                    returnMap.push({'key' : element.key , 'value' : element.value});
                });*/
                component.set('v.countryMap' , retVal);
            }else{
                var LOC = response.getReturnValue();
                var responso = JSON.parse(LOC);
                console.log('RESPONSE PARSATA' + responso +LOC);
            }
        });
        $A.enqueueAction(action);
    },
    alert: function(component, event, helper, variant, title, message){
        component.find('notifLib').showToast({
            "variant": variant,
            "title": title,
            "message": message,
            "mode" : "sticky"/*,
            "duration": 7000*/
        });
    }
})