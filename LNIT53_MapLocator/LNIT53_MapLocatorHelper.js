({ 
	helperGetStores : function(component, event,type) {
		var currentPosition = component.get( "v.currentPosition" );
        var selectedProvince = component.get( "v.provinceName" );
        console.log('selectedProvince: ' + selectedProvince);
        //var selectedProvince = component.get( "v.provinceName" );
        if(type == 'miaPosizione'){
            currentPosition = component.get( "v.myPosition" );
            selectedProvince = component.get( "v.selectedProvincemd2" );
            console.log('selectedProvincemd2: ' + selectedProvince);
        }
        var radius = component.get( "v.distance" );
        var isManual = component.get( "v.isManual" );
        var selectedCitta = component.get( "v.cityName" );
        console.log('selectedCitta: ' + selectedCitta);
        //var selectedCitta = component.get( "v.cityName" );
        console.log('selectedProvince ' + selectedProvince);
        var provinceSigla = '';
        if(type == 'scegli'){
            var provinceName = selectedProvince.split('§')[1];
            selectedProvince = selectedProvince.split('§')[0];
            console.log('provinceName ' + provinceName);
            component.get('v.provinceList').forEach(function(element) {
                console.log('elemento ' + element);
                if(element.label == provinceName){
                    console.log('trovato ' + element);
                    provinceSigla = element.value;
                }
            });
        }        
        var cap = component.get( "v.cap" );
        var isPos = component.get( "v.isPos" );
        var isScontiPoste = component.get( "v.isScontiPoste" );
        var isInactive = component.get( "v.isInactive" );
        var isProspect = component.get( "v.isProspect" );
        var isActive = component.get( "v.isActive" );
        var status = '';
        var status2 = '';
        var status3 = '';
        console.log('@@222'+ isInactive);
        if (isActive){
            status = 'Active'
        } if (isInactive){
            status2 = 'Inactive'
        } if (isProspect){
            status3 = 'Prospect'
        }
        var provinciaNome = component.get('v.provinceName').split('§')[0];
        var cittaNome = component.get('v.cityName').split('§')[0];
        var indirizzo = component.get('v.streetInput').split('§')[1];
        if(indirizzo == null){
            console.log('Indirizzo null');
            indirizzo = '';
        }
        console.log('provinciaNome: ' + provinciaNome);
        console.log('cittaNome: ' + cittaNome);
        selectedCitta = cittaNome;
        selectedProvince = provinciaNome;
        console.log('indirizzo: ' + indirizzo);
        //indirizzo = 'PIAZZA MADAMA CRISTINA';
        if(type == 'miaPosizione'){
        var action = component.get( "c.searchonlyStores" );
        selectedProvince = component.get( "v.selectedProvincemd2" );
        }
        else
        {
        var action = component.get( "c.searchStoresnoradius" );
        console.log('c.selectedProvince');        
        }
        
        
        action.setParams({
            currentPosition: currentPosition,
            radius: radius,
            selectedCitta : selectedCitta,
            selectedProvince : selectedProvince,
            cap : cap,
            status : status,
            status2 : status2,
            status3 : status3,
            isPos : isPos,
            isScontiPoste : isScontiPoste,
            type : type,
            provinceSigla : provinceSigla,
            IndirizzoStore : indirizzo
        });
        action.setCallback( this, function( response ) {
            console.log('Qui ci arriviamo');
            var stores = response.getReturnValue();
            console.log('stores: '+JSON.stringify(stores));
            var mapMarkers = [];
            
            
            if(stores != null && stores != undefined && stores.length > 0){
                for ( var i = 0; i < stores.length; i++ ) {
                    var store = stores[i];
                    var posString = ', NO POS';
                    if(store.IT_POS_Equipped__c){
                        posString = ', POS'                                               
                    }
                    var voltemp = store.IT_Issue_Volume_FC__c;
                        if (voltemp == undefined){
                        voltemp = '';
                    }
                    var marker = {
                        /* 'location': {
                            'Street': store.IT_Toponym__c + ' ' + store.ER_Street__c,
                            'City': store.ER_City__c,
                            'PostalCode': store.ER_Zip_Code__c,
                            'Latitude' : store.IT_GeoRef_Loc_Y_numeric__c,
                            'Longitude' : store.IT_GeoRef_Loc_X_numeric__c
                        },*/
                        'location': {
                            'Latitude' : store.IT_GeoRef_Loc_Y__c,
                            'Longitude' : store.IT_GeoRef_Loc_X__c,
                            'Street': store.IT_Toponym__c + ' ' + store.ER_Street__c

                            
                        },
                        'value': store.Id,
                        'title': store.Name +posString+ ', ' + store.IT_Commercial_License__c + ', ' +store.ER_Status__c+ ', ' +voltemp,
                        'description': (
                            posString + ' ' +
                            ' ' +
                            store.IT_Commercial_License__c +
                            ' ' +
                            store.ER_Status__c +
                            ' ' +
                            voltemp 
                        ),
                        'icon': 'standard:location',
                    };
                    mapMarkers.push( marker );
                }
            }
            //currentPosition = component.get( "v.currentPosition" );
            console.log('currentPosition '+currentPosition);
           if(type != 'scegli'){
            var marker1 = {
                'location': {
                    'Latitude': currentPosition.split('§')[0],
                    'Longitude': currentPosition.split('§')[1],
                },
                type: 'Circle',
                radius: radius*1000, 
                strokeColor: '#FFF000', 
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FFF000', 
                fillOpacity: 0.35,              
            };
           } else {
               var marker1 = {
                'location': {
                    'Latitude': currentPosition.split('§')[0],
                    'Longitude': currentPosition.split('§')[1],
                },
                type: 'Circle',
                radius: radius*1000, 
                strokeColor: 'transparent' , 
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'transparent' , 
                fillOpacity: 0.35,   
            };
           }
            mapMarkers.push( marker1 );
            component.set( 'v.mapMarkers', mapMarkers );
            component.set( 'v.NumeroSchermata', '1' );
            //component.set( 'v.selectedCitta', null );
            //component.set( 'v.cap', null );  
                     
        });           
        $A.enqueueAction( action );       
	},
    getCoordinatesAndCenterMap: function(component, event, type) {
        //var province = component.get( "v.selectedProvince" );
        var province = component.get('v.provinceName');
        
         if(type == 'miaPosizione'){
            province = component.get( "v.selectedProvincemd2" );
        }
        if(province.length != 2){
            var provinceName = province.split('§')[1];
            component.get('v.provinceList').forEach(function(element) {
                if(element.label == provinceName){
                    province = element.value;
                }
            });
        }
        var action = component.get( "c.getCoordinates" );       
        action.setParams({
            province: province
        });
        action.setCallback( this, function( response ) {       
            var longtemp = component.get('v.Startlong');
            var lattemp = component.get('v.Startlat');
            var coordinates = response.getReturnValue();
            var latitude = coordinates.split('§')[0];
        	var longitude = coordinates.split('§')[1];
            var number = parseInt('' + (latitude * 100)) / 100;
            //Sostituir
            /*console.log('@@1 ' + Math.round(number));
            console.log('@@2 latitude' + Math.round(longitude));
            console.log('@@2 longitude' + Math.round(longitude));
            console.log('@@3 lattemp' + Math.round(lattemp));
            console.log('@@4 longTemp ' + Math.round(longtemp));*/
            console.log('longitude ' + longitude);
            console.log('latitude ' + latitude);
            console.log('longitude utente: ' + longtemp);
            console.log('latitude utente: ' + lattemp);
            console.log('Diff tra latitudine: ' + Math.abs(latitude - lattemp));
            console.log('Diff tra longitudine: ' + Math.abs(longitude - longtemp));
            //if (type == 'miaPosizione' && (Math.round(latitude) != Math.round(lattemp) ||  Math.round(longitude) != Math.round(longtemp)) ){
            if (type == 'miaPosizione' && (Math.abs(latitude - lattemp) > 0.1 || Math.abs(longitude - longtemp) > 0.1)){
            //component.set( 'v.currentPosition', latitude+'§'+longitude );
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
               "type" : "warning",
               "message": "La tua posizione non è corretta!"
            });
            toastEvent.fire(); 
            }
            component.set('v.center', {
                location: {
                    Latitude: latitude,
                    Longitude: longitude,
                },
            }); 
                      
            component.set( 'v.currentPosition', latitude+'§'+longitude );
            console.log('posizione settata '+latitude+'§'+longitude);
        });
        $A.enqueueAction( action );
        
        
    },
    getUserPosition: function(component, event) {
        var action = component.get( "c.getUserCoordinates" );
        action.setCallback( this, function( response ) {
            var coordinates = response.getReturnValue();
            var latitude = coordinates.split('§')[0];
        	var longitude = coordinates.split('§')[1];
            component.set('v.center', {
                location: {
                    Latitude: latitude,
                    Longitude: longitude,
                },
            });            
            component.set( 'v.currentPosition', latitude+'§'+longitude );

        });
        $A.enqueueAction( action );
    },
})