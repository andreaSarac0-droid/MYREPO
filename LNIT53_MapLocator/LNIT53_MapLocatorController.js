({
    init: function( component, event, helper ) {
        
            // Chiamata al metodo getProvincesStradario --- START
            var action = component.get('c.getProvincesStradario');
            //helper.getCountries(component, event);
            action.setCallback(this, function(response) {
                
                if (response.getState() == "SUCCESS") {
                    var stage = response.getReturnValue();
                    //console.log('RESPONSE '+stage.toString());
                    var returnMap = [];
                    var response = JSON.parse(stage);
                    var provinces = response.data;
                    returnMap.push({'key' : '' , 'name' : '--Seleziona una Provincia--'});
                    provinces.forEach(function(element) {
                        //returnMap.push(element.province_ref , element.name_display);
                        returnMap.push({'key' : element.province_ref , 'name' : element.name});
                    });
                    component.set('v.provinceMap' , returnMap);
                }
            });
            $A.enqueueAction(action); // Chiamata al metodo getProvincesStradario --- END
            // Chiamata al metodo getProvincesStradario --- END
            /*START 27/09*/
            var action = component.get("c.fetchUser");
            action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.userInfo", storeResponse);
                var userprovince = storeResponse.IT_User_Province__c;
                component.set('v.selectedProvincemd2',userprovince);
                //console.log('@33'+ component.get( 'v.provinceList'));
               }
            });
            $A.enqueueAction(action);
        
            /*END 27/09*/
            var provinces = [
            { value:'XX', label:	'--Seleziona una Provincia--'},    
            { value:'AG', label:	'AGRIGENTO'},
            { value:'AL', label:	'ALESSANDRIA'},
            { value:'AN', label:	'ANCONA'},
            { value:'AO', label:	'AOSTA'},
            { value:'AQ', label:	'L\'AQUILA'},
            { value:'AR', label:	'AREZZO'},
            { value:'AP', label:	'ASCOLI-PICENO'},
            { value:'AT', label:	'ASTI'},
            { value:'AV', label:	'AVELLINO'},
            { value:'BA', label:	'BARI'},
            { value:'BT', label:	'BARLETTA-ANDRIA-TRANI'},
            { value:'BL', label:	'BELLUNO'},
            { value:'BN', label:	'BENEVENTO'},
            { value:'BG', label:	'BERGAMO'},
            { value:'BI', label:	'BIELLA'},
            { value:'BO', label:	'BOLOGNA'},
            { value:'BZ', label:	'BOLZANO'},
            { value:'BS', label:	'BRESCIA'},
            { value:'BR', label:	'BRINDISI'},
            { value:'CA', label:	'CAGLIARI'},
            { value:'CL', label:	'CALTANISSETTA'},
            { value:'CB', label:	'CAMPOBASSO'},
            { value:'CI', label:	'CARBONIA IGLESIAS'},
            { value:'CE', label:	'CASERTA'},
            { value:'CT', label:	'CATANIA'},
            { value:'CZ', label:	'CATANZARO'},
            { value:'CH', label:	'CHIETI'},
            { value:'CO', label:	'COMO'},
            { value:'CS', label:	'COSENZA'},
            { value:'CR', label:	'CREMONA'},
            { value:'KR', label:	'CROTONE'},
            { value:'CN', label:	'CUNEO'},
            { value:'EN', label:	'ENNA'},
            { value:'FM', label:	'FERMO'},
            { value:'FE', label:	'FERRARA'},
            { value:'FI', label:	'FIRENZE'},
            { value:'FG', label:	'FOGGIA'},
            { value:'FC', label:	'FORLI-CESENA'},
            { value:'FR', label:	'FROSINONE'},
            { value:'GE', label:	'GENOVA'},
            { value:'GO', label:	'GORIZIA '},
            { value:'GR', label:	'GROSSETO'},
            { value:'IM', label:	'IMPERIA'},
            { value:'IS', label:	'ISERNIA'},
            { value:'SP', label:	'LA-SPEZIA'},
            { value:'LT', label:	'LATINA'},
            { value:'LE', label:	'LECCE'},
            { value:'LC', label:	'LECCO'},
            { value:'LI', label:	'LIVORNO'},
            { value:'LO', label:	'LODI'},
            { value:'LU', label:	'LUCCA'},
            { value:'MC', label:	'MACERATA'},
            { value:'MN', label:	'MANTOVA'},
            { value:'MS', label:	'MASSA-CARRARA'},
            { value:'MT', label:	'MATERA'},
            { value:'VS', label:	'MEDIO CAMPIDANO'},
            { value:'ME', label:	'MESSINA'},
            { value:'MI', label:	'MILANO'},
            { value:'MO', label:	'MODENA'},
            { value:'MB', label:	'MONZA-BRIANZA'},
            { value:'NA', label:	'NAPOLI'},
            { value:'NO', label:	'NOVARA'},
            { value:'NU', label:	'NUORO'},
            { value:'OG', label:	'OGLIASTRA'},
            { value:'OT', label:	'OLBIA TEMPIO'},
            { value:'OR', label:	'ORISTANO'},
            { value:'PD', label:	'PADOVA'},
            { value:'PA', label:	'PALERMO'},
            { value:'PR', label:	'PARMA'},
            { value:'PV', label:	'PAVIA'},
            { value:'PG', label:	'PERUGIA'},
            { value:'PU', label:	'PESARO-URBINO'},
            { value:'PE', label:	'PESCARA'},
            { value:'PC', label:	'PIACENZA'},
            { value:'PI', label:	'PISA'},
            { value:'PT', label:	'PISTOIA'},
            { value:'PN', label:	'PORDENONE '},
            { value:'PZ', label:	'POTENZA'},
            { value:'PO', label:	'PRATO'},
            { value:'RG', label:	'RAGUSA'},
            { value:'RA', label:	'RAVENNA'},
            { value:'RC', label:	'REGGIO-CALABRIA'},
            { value:'RE', label:	'REGGIO-EMILIA'},
            { value:'RI', label:	'RIETI'},
            { value:'RN', label:	'RIMINI'},
            { value:'RM', label:	'ROMA'},
            { value:'RO', label:	'ROVIGO'},
            { value:'SA', label:	'SALERNO'},
            { value:'SS', label:	'SASSARI'},
            { value:'SV', label:	'SAVONA'},
            { value:'SI', label:	'SIENA'},
            { value:'SR', label:	'SIRACUSA'},
            { value:'SO', label:	'SONDRIO'},
            { value:'TA', label:	'TARANTO'},
            { value:'TE', label:	'TERAMO'},
            { value:'TR', label:	'TERNI'},
            { value:'TO', label:	'TORINO'},
            { value:'TP', label:	'TRAPANI'},
            { value:'TN', label:	'TRENTO'},
            { value:'TV', label:	'TREVISO'},
            { value:'TS', label:	'TRIESTE'},
            { value:'UD', label:	'UDINE '},
            { value:'VA', label:	'VARESE'},
            { value:'VE', label:	'VENEZIA'},
            { value:'VB', label:	'VERBANIA'},
            { value:'VC', label:	'VERCELLI'},
            { value:'VR', label:	'VERONA'},
            { value:'VV', label:	'VIBO-VALENTIA'},
            { value:'VI', label:	'VICENZA'},
            { value:'VT', label:	'VITERBO'}
        ];
        component.set('v.provinceList',provinces);
        console.log('Sono prima di navigator.geolocation');
        
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            console.log('Test per coordinate ',latitude,longitude);
        if(latitude != null && latitude != undefined && longitude != null && longitude != undefined){
            component.set('v.center', {
                location: {
                    Latitude: latitude,
                    Longitude: longitude,
                },
            });         component.set( 'v.currentPosition', latitude+'§'+longitude );
                        console.log('@@@'+ component.get( 'v.currentPosition'));
            			component.set( 'v.myPosition', latitude+'§'+longitude );
            component.set( 'v.Startlat', latitude );
            component.set( 'v.Startlong', longitude );
            /*component.set( 'v.currentPosition', '41.9027835§12.4963655' );
                        console.log('@@@'+ component.get( 'v.currentPosition'));
            			component.set( 'v.myPosition', '41.9027835§12.4963655' );
            component.set( 'v.Startlat', '41.9027835' );
            component.set( 'v.Startlong', '12.4963655' );*/
            /*var mapMarkerPosition = []; 
            var marker1 = {
                'location': {
                    'Latitude': latitude,
                    'Longitude': longitude,
                },
                type: 'Circle',
                radius: 5000, 
                strokeColor: '#FFF000', 
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FFF000', 
                fillOpacity: 0.35,
            };
            mapMarkerPosition.push( marker1 );
            component.set( 'v.mapMarkers', mapMarkerPosition );*/
        }
        else{
            //helper.getUserPosition(component, event);
        }
        //helper.helperGetStores(component, event);
        });      
    },
    handleMarkerSelect: function (component, event, helper) {
        var marker = event.getParam("selectedMarkerValue");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": marker,
        });
        navEvt.fire();
        
    },
    handleLocationButton: function(component, event, helper) {
        component.set("v.isModalOpen", true);
        component.set("v.streetInput",'');
        //var prov = component.get('v.provinceName');
        //component.set('v.provinceName',prov);
    },
    
    finishSelect : function (component, event, helper) {
        component.set("v.isModalOpen", false);
        component.set("v.isManual", true);
        helper.getCoordinatesAndCenterMap(component, event,'scegli');
        helper.helperGetStores(component, event,'scegli');
        
    },
        
    finishSelectMiaPosizione : function (component, event, helper) {
        component.set("v.isModalOpen", false);
        component.set("v.isManual", true);
        helper.getCoordinatesAndCenterMap(component, event,'miaPosizione');
        helper.helperGetStores(component, event,'miaPosizione');
            
    },
            
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
        component.set("v.NumeroSchermata", "1");
    },
    next: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        if(component.get("v.posizioneBoolean") == true){
            component.set("v.NumeroSchermata", "2");
        }
        else{
            component.set("v.NumeroSchermata", "3");
        }
        
    },
    onBack: function(component, event, helper) {          
        component.set("v.NumeroSchermata", "1");
    },
    handleChange: function(component, event, helper) {          
        component.set("v.scegliBoolean", !component.get("v.posizioneBoolean"));
    },
    handleChange2: function(component, event, helper) {           
        component.set("v.posizioneBoolean", !component.get("v.scegliBoolean"));
    },   
    ProvinceChange: function(component, event, helper) {
      // Chiamata al metodo getProvincesStradario --- START
            var action = component.get('c.getMunicipalitiesStradario');
           action.setParams({
               "provinceRef" : component.get("v.selectedProvince").split('§')[0]
           })
            //helper.getCountries(component, event);
            action.setCallback(this, function(response) {
                
                if (response.getState() == "SUCCESS") {
                    var stage = response.getReturnValue();
                    //console.log('RESPONSE '+stage.toString());
                    var returnMap = [];
                    var response = JSON.parse(stage);
                    var provinces = response.data;
                    //returnMap.push({'key' : '' , 'name' : '--Seleziona una Provincia--'});
                    provinces.forEach(function(element) {
                        //returnMap.push(element.province_ref , element.name_display);
                        returnMap.push({'key' : element.municipality_ref , 'name' : element.name});
                    });
                    component.set('v.cittaMap' , returnMap);
                }
            });
            $A.enqueueAction(action); // Chiamata al metodo getProvincesStradario --- END   
    },
    getStreetDetails: function (component, event, helper) {
        console.log("SELECTED CITY");
 
        var selectedItem = event.currentTarget;
        var placeid = selectedItem.dataset.placeid;
        var streetInput = placeid.split('§')[1];
        component.set('v.streetInput', streetInput);
        component.set('v.toponym', placeid.split('§')[2]);
         if(placeid.includes('(')){
             console.log('placeid dentro ',placeid);
             component.set('v.hamletRequired',true);
         } 
        
        //placeid = placeid.replace(/ \([\s\S]*?\)/g, ""); FC 03/08/2021 modifica per indirizzi con frazione
        console.log('PLACEID'+placeid);
        component.set('v.streetWrap', placeid);
        component.set('v.predictions', []);
    },

    getStreets: function (component, event, helper) {
        /*if(component.get('v.streetBoolean')){
        component.set('v.streetBoolean',false);
        this.timeoutStreets(component, event, helper);*/
        console.log("GET CITIES");
        component.set('v.Civico' , '');
        component.set('v.CAP' , '');
        var input = component.get('v.streetInput');
        input=input.replace(/(\s+)/g, "+");
        var cityName = component.get('v.selectedCitta');
        console.log('v.selectedCitta' + cityName);
        var provinceName = component.get('v.selectedProvince').split('§')[1];
        //var cityName = component.get('v.selectedProvince');
        //var provinceName = component.get('v.selectedCitta');
        var autocompleteRequest = {"address" : input, "town" : cityName , "province" : provinceName, "region" : "null"};
        console.log('REQUEST AUTOCOMPLETE' + JSON.stringify(autocompleteRequest));
        if (input.length > 1) {
            
            var action = component.get("c.callAutocomplete");
            action.setParams({'jsonToSend' : JSON.stringify(autocompleteRequest)});
            action.setCallback(this, function (response) {
                if (response.getState() == "SUCCESS") {
                    var LOC = response.getReturnValue();
                    var responso = JSON.parse(LOC);
                    console.log('RESPONSE AUTOCOMPLETE' + LOC );
                    var streets = responso.data;
                    var returnMap = [];
                    streets.forEach(function(element) {
                        console.log('ELEMENT:: '+element.completed_address);
                        console.log('ADDRESS CODE:: '+element.address_ref);
                        console.log('TOPONYM:: '+element.toponym);
                        var realTopo = '';
                        var realAddress = '';
                        var old_town = '';
                        if(element.toponym != null){
                            //realTopo = element.toponym;
                            realAddress = element.completed_address;
                        }
                        else{
                            realAddress = element.completed_address;
                        }
                        if(element.old_town != null){
                            realAddress += ' ('+element.old_town+') ';
                        }
                        //returnMap.push(element.province_ref , element.name_display);
                        returnMap.push({'key' : element.address_ref , 'value' : realAddress , 'toponym' : realTopo});  
                    });
                    component.set('v.predictions' , returnMap);
                }
            });
            $A.enqueueAction(action);
        } else {
            component.set('v.predictions', null);
        }
 
    }
})