({

    init: function (component, event, helper) {
       //INIT TO CALL STRADARIO GET PROVINCES
        console.log('IN' + component.get('v.flowRegionRef') + 'FLOW? ' +component.get('v.isFlow'));
        console.log('isInAuraComponent: ' + component.get('v.isInAuraComponent'));
        console.log('VISIBILITY: ' +component.get('v.setVisiblity'));
        console.log ('flowProvinceCode '+ component.get('v.flowProvinceCode'));
        var action = component.get('c.getProvincesStradario');
        helper.getCountries(component, event);
        action.setCallback(this, function(response) {
           
            if (response.getState() == "SUCCESS") {
                var stage = response.getReturnValue();
                //console.log('RESPONSE '+stage.toString());
                var returnMap = [];
                var response = JSON.parse(stage);
                var provinces = response.data;
                returnMap.push({'key' : '' , 'value' : '--Seleziona una Provincia--' , 'regionRef' : ''});
                provinces.forEach(function(element) {
                    //returnMap.push(element.province_ref , element.name_display);
                    returnMap.push({'key' : element.province_ref , 'value' : element.name , 'regionRef' : element.region_ref});
                });
                if(!component.get('v.isFlow')){
                    component.set('v.provinceMap' , returnMap);
                }
                //component.set('v.provinceMap' , returnMap);
                component.set('v.actualProvince' ,returnMap[1].key );
                
                //component.set('v.provinceKey' , component.get('v.flowProvinceCode'));
                console.log('MAPPASETTATA:: ' +returnMap[1].key + 'REGIONE: '+returnMap[1].regionRef);
                //component.set ('v.hmacString' ,stage.toString() );
                //***ADD PREPOPULATION***
                var recordId = component.get("v.recordId");
                var objName = component.get("v.sObjectName");
                if(component.get('v.isFlow')){
                   objName = 'ER_Financial_Center__c';
                }
                var action2 = component.get("c.fetchAddress");
                action2.setParams({
                   "recordId": recordId,
                   "sObjectName": objName
               })
               action2.setCallback(this, function(response2){
                console.log('TRY:: ');
                   if (response2.getState() == "SUCCESS") {
                       if(response2.getReturnValue() != null && response2.getReturnValue() != ''){
                           var record = JSON.parse(response2.getReturnValue());
                           console.log('RECORD ADDRESS:: '+response2.getReturnValue());
                       }
                       console.log('FLOW' + component.get('v.flowProvince'));
                       if(component.get('v.isFlow')){
                           console.log('ENTRATO FLOW BACK');
                           component.set('v.firstProvChange' , false);
                           component.set('v.CAP' , component.get('v.flowCAP'));
                           var hamletMap = [];
                           hamletMap.push({ 'key' : component.get('v.flowHamletCode'), 'value' : component.get('v.flowHamlet')});
                           hamletMap.push('');
                           component.set('v.hamletMap' , hamletMap);
                           component.set('v.toponym' , component.get('v.flowToponym'));
                           var flowStreet = component.get('v.flowStreet');
                           var civico;
                           var street;
                           if(flowStreet){
                              
                               
                               street = component.get('v.flowStreet').split(', ')[0];
                               civico = component.get('v.flowStreet').split(', ')[1];
                               
                               console.log ('STRADA '+ street);
                               console.log ('CIVICO '+ civico);
                           }
                           component.set('v.Civico' , civico);
                           component.set('v.streetWrap' , component.get('v.flowStreetCode') + '§' + street + '§' + component.get('v.flowToponym'));
                           component.set('v.streetInput' , component.get('v.flowToponym') + ' ' + street);
                           component.set('v.shortStreet' , street);
                           component.set('v.cityWrap' , component.get('v.flowCityCode') + '§' + component.get('v.flowCity'));
                           component.set('v.provinceWrap' , component.get('v.flowProvinceCode') + '§' + component.get('v.flowProvince') + '§' + component.get('v.flowRegionRef'));
                           component.set('v.provinceKey' , component.get('v.flowProvinceCode'));
                           component.set('v.regionDesc' , component.get('v.flowRegionDesc'));
                           component.set('v.regionRef' , component.get('v.flowRegionRef'));
                           component.set('v.cityKey' , component.get('v.flowCityCode'));
                           component.set('v.metRefX' , component.get("v.flowMetRefX"));
                           component.set('v.metRefY' , component.get("v.flowMetRefY"));
                           component.set('v.geoRefX' , component.get("v.flowGeoRefX"));
                           component.set('v.geoRefY' , component.get("v.flowGeoRefY"));
                           component.set('v.LocAgg' , component.get("v.flowLocAgg"));
                           component.set('v.geoQualita' , component.get("v.flowGeoQualita"));
                           component.set('v.esteroCity' , component.get('v.flowCity'));
                           component.set('v.esteroStreet' , street);
                           component.set('v.extraSpecs', component.get('v.flowExtraSpec'));
                           //component.find("provinceList").set("v.text", component.get('v.flowProvince'));
                           //component.find("provinceList").set("v.value", component.get('v.flowProvinceCode') + '§' + component.get('v.flowProvince') + '§' + component.get('v.flowRegionRef'));
                           component.find('provinceList').focus();
                           component.set('v.provinceMap' , returnMap);
                           console.log('TEST STRADE GIUGNO21 '+component.get("v.provinceWrap")+component.get("v.provinceKey")+component.get("v.streetWrap"));
                           provinces.forEach(function(element) {
                               //returnMap.push(element.province_ref , element.name_display);|| element.province_ref == record.IT_State_Code__c
                               if(element.province_ref == component.get('v.flowProvinceCode')){ //Essendo un indirizzo da 0 non ho nè region nè province code.l
                                   component.set('v.regionRef' , element.region_ref);
                                   component.set('v.provinceWrap' , component.get('v.flowProvinceCode') + '§' + component.get('v.flowProvince') + '§' +element.region_ref );
                                   console.log('REGION REF LOOP FOUND: '+element.region_ref + ' - ' + element.province_ref);
                                   
                               }
                               /*else if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                   }*/
                           });
                       }
                       else{
                           
                           if(objName == 'Account'){
                               
                               component.set('v.regionRef' , record.IT_Region_code__c);
                               component.set('v.CAP' , record.BillingPostalCode);
                               console.log('HAMLETS '+record.IT_Hamlet_Code__c + '§' + record.IT_Hamlet__c);
                               var hamletMap = [];
                               hamletMap.push({'key' : record.IT_Hamlet_Code__c , 'value' : record.IT_Hamlet__c});
                               hamletMap.push('');
                               component.set('v.hamletMap' , hamletMap);
                               component.set('v.toponym' , record.IT_Toponym__c);
                               component.set('v.Civico' , record.BillingStreet.split(', ')[1]);
                               component.set('v.streetWrap' ,  record.IT_Street_Code__c + '§' + record.BillingStreet.split(', ')[0] + '§' + record.IT_Toponym__c);
                               component.set('v.streetInput' , record.IT_Toponym__c + ' ' + record.BillingStreet.split(', ')[0]);
                               component.set('v.shortStreet' , record.BillingStreet.split(', ')[0]);
                               component.set('v.cityWrap' , record.IT_City_Code__c + '§' + record.BillingCity);
                               component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.BillingState + '§' +record.IT_Region_code__c);
                               component.set('v.provinceKey' , record.IT_State_Code__c);
                               component.set('v.cityKey' , record.IT_City_Code__c);
                               component.set('v.countryKey' , record.BillingCountry);
                               component.set('v.countryWrap' , record.IT_Country_Description__c + '§' + record.BillingCountry);
                               component.set('v.geoRefX' , record.BillingLongitude);
                               component.set('v.geoRefY' , record.BillingLatitude);
                               component.set('v.metRefX' , record.IT_MetRef_Loc_X__c);
                               component.set('v.metRefY' , record.IT_MetRef_Loc_Y__c);
                               component.set('v.LocAgg' , record.IT_Additional_Locality__c);
                               component.set('v.esteroCity' , record.BillingCity);
                               component.set('v.esteroStreet' , record.BillingStreet.split(', ')[0]);
                               component.set('v.extraSpecs', record.IT_Extra_Urban_Specifications__c);
                               component.set("v.geoQualita" , record.IT_GeoQualita__c);
                               component.find("provinceList").set("v.text", record.BillingState);
                               component.find("provinceList").set("v.value", record.IT_State_Code__c + '§' + record.BillingState + '§' +record.IT_Region_code__c);
                               provinces.forEach(function(element) {
                                   //returnMap.push(element.province_ref , element.name_display);|| element.province_ref == record.IT_State_Code__c
                                   if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                       component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.BillingState + '§' +element.region_ref );
                                       console.log('REGION REF LOOP FOUND ACCOUNT: '+element.region_ref + ' - ' + element.province_ref);
                                   }
                                   /*else if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                   }*/
                               });
                               
                           }
                           else if(objName == 'Lead'){
                               
                               component.set('v.regionRef' , record.IT_Region_code__c);
                               component.set('v.CAP' , record.PostalCode);
                               console.log('HAMLETS '+record.IT_Hamlet_Code__c + '§' + record.IT_Hamlet__c);
                               var hamletMap = [];
                               hamletMap.push({'key' : record.IT_Hamlet_Code__c , 'value' : record.IT_Hamlet__c});
                               hamletMap.push('');
                               component.set('v.hamletMap' , hamletMap);
                               component.set('v.toponym' , record.IT_Toponym__c);
                               component.set('v.Civico' , record.Street.split(', ')[1]);
                               component.set('v.streetWrap' ,  record.IT_Street_Code__c + '§' + record.Street.split(', ')[0] + '§' + record.IT_Toponym__c);
                               component.set('v.streetInput' , record.IT_Toponym__c + ' ' + record.Street.split(', ')[0]);
                               component.set('v.shortStreet' , record.Street.split(', ')[0]);
                               component.set('v.cityWrap' , record.IT_City_Code__c + '§' + record.City);
                               component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.State + '§' +record.IT_Region_code__c);
                               component.set('v.provinceKey' , record.IT_State_Code__c);
                               component.set('v.cityKey' , record.IT_City_Code__c);
                               component.set('v.countryKey' , record.Country);
                               component.set('v.countryWrap' , record.ER_Legal_Country__c + '§' + record.Country);
                               component.set('v.geoRefX' , record.Longitude);
                               component.set('v.geoRefY' , record.Latitude);
                               component.set('v.metRefX' , record.IT_MetRef_Loc_X__c);
                               component.set('v.metRefY' , record.IT_MetRef_Loc_Y__c);
                               component.set('v.LocAgg' , record.IT_Additional_Locality__c);
                               component.set('v.esteroCity' , record.City);
                               component.set('v.esteroStreet' , record.Street.split(', ')[0]);
                               component.set('v.extraSpecs', record.IT_Extra_Urban_Specifications__c);
                               component.find("provinceList").set("v.text", record.State);
                               component.find("provinceList").set("v.value", record.IT_State_Code__c + '§' + record.State + '§' +record.IT_Region_code__c);
                               provinces.forEach(function(element) {
                                   //returnMap.push(element.province_ref , element.name_display);|| element.province_ref == record.IT_State_Code__c
                                   if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                       component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.State + '§' +element.region_ref );
                                       console.log('REGION REF LOOP FOUND LEAD: '+element.region_ref + ' - ' + element.province_ref);
                                   }
                                   /*else if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                   }*/
                               });
                               
                           }
                           else if(objName == 'Opportunity'){
                               if(component.get('v.opportunityType') == 'Billing'){
                                   component.set('v.regionRef' , record.IT_Region_code__c);
                                   component.set('v.CAP' , record.IT_Zip_Code__c);
                                   console.log('HAMLETS '+record.IT_Hamlet_Code__c + '§' + record.IT_Hamlet__c);
                                   var hamletMap = [];
                                   hamletMap.push({'key' : record.IT_Hamlet_Code__c , 'value' : record.IT_Hamlet__c});
                                   hamletMap.push('');
                                   component.set('v.hamletMap' , hamletMap);
                                   component.set('v.toponym' , record.IT_Toponym__c);
                                   component.set('v.Civico' , record.IT_Street__c.split(', ')[1]);
                                   component.set('v.streetWrap' ,  record.IT_Street_Code__c + '§' + record.IT_Street__c.split(', ')[0] + '§' + record.IT_Toponym__c);
                                   component.set('v.streetInput' , record.IT_Toponym__c + ' ' + record.IT_Street__c.split(', ')[0]);
                                   component.set('v.shortStreet' , record.IT_Street__c.split(', ')[0]);
                                   component.set('v.cityWrap' , record.IT_City_Code__c + '§' + record.IT_City__c);
                                   component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.IT_State_Province__c + '§' +record.IT_Region_code__c);
                                   component.set('v.provinceKey' , record.IT_State_Code__c);
                                   component.set('v.cityKey' , record.IT_City_Code__c);
                                   component.set('v.geoRefX' , record.IT_GeoRef_Loc_X__c);
                                   component.set('v.geoRefY' , record.IT_GeoRef_Loc_Y__c);
                                   component.set('v.metRefX' , record.IT_MetRef_Loc_X__c);
                                   component.set('v.metRefY' , record.IT_MetRef_Loc_Y__c);
                                   component.set('v.LocAgg' , record.IT_Street_additionnal__c);
                                   component.set('v.esteroCity' , record.IT_City__c);
                                   component.set('v.esteroStreet' , record.IT_Street__c.split(', ')[0]);
                                   component.find("provinceList").set("v.text", record.IT_State_Province__c);
                                   component.find("provinceList").set("v.value", record.IT_State_Code__c + '§' + record.IT_State_Province__c + '§' +record.IT_Region_code__c);
                                   provinces.forEach(function(element) {
                                       //returnMap.push(element.province_ref , element.name_display);|| element.province_ref == record.IT_State_Code__c
                                       if(element.province_ref == record.IT_State_Code__c){
                                           component.set('v.regionRef' , element.region_ref);
                                           component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.IT_State_Province__c + '§' +element.region_ref );
                                           console.log('REGION REF LOOP FOUND LEAD: '+element.region_ref + ' - ' + element.province_ref);
                                       }
                                       /*else if(element.province_ref == record.IT_State_Code__c){
                                       component.set('v.regionRef' , element.region_ref);
                                   }*/
                               });
                               }
                               else{
                                   component.set('v.regionRef' , record.IT_Shipping_Region_code__c);
                                   component.set('v.CAP' , record.IT_shippingPostalCode__c);
                                   console.log('HAMLETS '+record.IT_Shipping_Hamlet_Code__c + '§' + record.IT_Shipping_Hamlet__c);
                                   var hamletMap = [];
                                   hamletMap.push({'key' : record.IT_Shipping_Hamlet_Code__c , 'value' : record.IT_Shipping_Hamlet__c});
                                   hamletMap.push('');
                                   component.set('v.hamletMap' , hamletMap);
                                   component.set('v.toponym' , record.IT_Shipping_Toponym__c);
                                   component.set('v.Civico' , record.IT_ShippingStreet__c.split(', ')[1]);
                                   component.set('v.streetWrap' ,  record.IT_Shipping_Street_Code__c + '§' + record.IT_ShippingStreet__c.split(', ')[0] + '§' + record.IT_Shipping_Toponym__c);
                                   component.set('v.streetInput' ,record.IT_Shipping_Toponym__c + ' ' + record.IT_ShippingStreet__c.split(', ')[0]);
                                   component.set('v.shortStreet' , record.IT_ShippingStreet__c.split(', ')[0]);
                                   component.set('v.cityWrap' , record.IT_Shipping_City_Code__c + '§' + record.IT_ShippingCity__c);
                                   component.set('v.provinceWrap' , record.IT_Shipping_State_Code__c + '§' + record.IT_ShippingState__c + '§' +record.IT_Shipping_Region_code__c);
                                   component.set('v.provinceKey' , record.IT_Shipping_State_Code__c);
                                   component.set('v.cityKey' , record.IT_Shipping_City_Code__c);
                                   component.set('v.geoRefX' , record.IT_ShippingLatitude__c);
                                   component.set('v.geoRefY' , record.IT_ShippingLongitude__c);
                                   component.set('v.metRefX' , record.IT_Shipping_MetRef_Loc_X__c);
                                   component.set('v.metRefY' , record.IT_Shipping_MetRef_Loc_Y__c);
                                   component.set('v.LocAgg' , record.IT_Shipping_Street_Additionnal__c);
                                   component.set('v.esteroCity' , record.IT_ShippingCity__c);
                                   component.set('v.esteroStreet' , record.IT_ShippingStreet__c.split(', ')[0]);
                                   component.find("provinceList").set("v.text", record.IT_ShippingState__c);
                                   component.find("provinceList").set("v.value", record.IT_Shipping_State_Code__c + '§' + record.IT_ShippingState__c + '§' +record.IT_Shipping_Region_code__c);
                                   provinces.forEach(function(element) {
                                       //returnMap.push(element.province_ref , element.name_display);|| element.province_ref == record.IT_Shipping_State_Code__c
                                       if(element.province_ref == record.IT_Shipping_State_Code__c){
                                           component.set('v.regionRef' , element.region_ref);
                                           component.set('v.provinceWrap' , record.IT_Shipping_State_Code__c + '§' + record.IT_ShippingState__c + '§' +element.region_ref );
                                           console.log('REGION REF LOOP FOUND OPPO: '+element.region_ref + ' - ' + element.province_ref);
                                       }
                                       /*else if(element.province_ref == record.IT_Shipping_State_Code__c){
        component.set('v.regionRef' , element.region_ref);
    }*/
                                   });
                               }

                               
                           }
                           else{
                               component.set('v.regionRef' , record.IT_Region_code__c);
                               component.set('v.CAP' , record.ER_Zip_Code__c);
                               component.set('v.toponym' , record.IT_Toponym__c);
                               component.set('v.Civico' , record.ER_Street__c.split(', ')[1]);
                               var hamletMap = [];
                               hamletMap.push({'key' : record.IT_Hamlet_Code__c , 'value' : record.IT_Hamlet__c});
                               hamletMap.push('');
                               component.set('v.hamletMap' , hamletMap);
                               //component.set('v.hamletMap' , record.IT_Hamlet_Code__c + '§' + record.IT_Hamlet__c);
                               component.set('v.streetWrap' ,  record.IT_Street_Code__c + '§' + record.ER_Street__c.split(', ')[0] + '§' + record.IT_Toponym__c);
                               //component.set('v.streetInput' , record.BillingStreet.split(', ')[0]);
                               component.set('v.cityWrap' , record.IT_City_Code__c + '§' + record.ER_City__c);
                               component.set('v.provinceWrap' , record.IT_State_Code__c + '§' + record.IT_Province__c + '§' +record.IT_Region_code__c);
                               component.set('v.metRefX' , record.IT_MetRef_Loc_X__c);
                               component.set('v.metRefY' , record.IT_MetRef_Loc_Y__c);
                               component.set('v.geoRefX' , record.IT_GeoRef_Loc_X__c);
                               component.set('v.geoRefY' , record.IT_GeoRef_Loc_Y__c);
                               component.set('v.esteroCity' , record.ER_City__c);
                               component.set('v.esteroStreet' , record.ER_Street__c.split(', ')[0]);
                               component.find("provinceList").set("v.text", record.IT_Province__c);
                               component.find("provinceList").set("v.value", record.IT_State_Code__c + '§' + record.IT_Province__c + '§' +record.IT_Region_code__c);
                               
                               if(objName == 'ER_Delivery_Site__c'){
                                   component.set('v.LocAgg' , record.ER_Street_additionnal__c);
                               }
                               else{
                                   component.set('v.LocAgg' , record.IT_Additional_Locality__c);
                               }
							

                           }
                           if(component.get('v.isFlow')){
                               component.find('provinceList').focus();
                               console.log('REGIONCODE: '+component.get('v.provinceWrap'));
                               console.log ('provinceKey '+ component.get('v.provinceKey'));

                           }
                               var action3 = component.get('c.provinceChangeStradario');
                               $A.enqueueAction(action3);
                       }
                       if(component.get('v.provinceKey') == '0'){
                           component.set('v.provinceWrap' , '0§ESTERO§0');
                       }
                       
                    
                   }
               });
                
               $A.enqueueAction(action2);
            }
        });
        $A.enqueueAction(action);
        
   },

       provinceChangeStradario: function (component, event, helper) {
           //when a value is selected, apex automatically populates the next picklist
           console.log('WRAPPROVINCESTART:: ' + event);
           component.set('v.municipalityMap' , null);
           console.log('municipalityMap ', component.get('v.municipalityMap'));
           var provinceRef = component.get('v.provinceWrap').split('§');
           console.log('PROVINCEREF SIZE:: '+provinceRef.length);
           //component.set('v.regionRef' , provinceRef[2]);
           console.log('WRAPPROVINCE:: '+provinceRef);
           if(provinceRef[0] === '0' && !component.get('v.firstProvChange')){
               component.set('v.hamletMap' , '');
               component.set('v.toponym' , '');
               component.set('v.Civico' , '');
               component.set('v.CAP' , '');
               component.set('v.streetWrap' , '');
               component.set('v.streetInput' , '');
               component.set('v.shortStreet' , '');
               component.set('v.metRefX' , '');
               component.set('v.metRefY' , '');
               component.set('v.geoRefX' , '');
               component.set('v.geoRefY' , '');
               component.set('v.LocAgg' , '');
               component.set('v.geoQualita' , '');
               component.set('v.regionRef' , provinceRef[2]);
               component.set('v.esteroCity', '');
               component.set('v.esteroStreet', '');
               component.set('v.esteroCAP', '');
               
               component.set('v.cityWrap' , '');
               console.log('v.cityWrap 1'+component.get('v.cityWrap'));
               component.set('v.cityKey','');
               console.log('v.cityKey'+component.get('v.cityKey'));
           }
           var action = component.get('c.getMunicipalitiesStradario');
           console.log('IN1');
           action.setParams({
               "provinceRef" : provinceRef[0]
           })
           action.setCallback(this, function(response) {
               console.log('IN');
               console.log('PROVINCE CODE: '+provinceRef);
               
               if (response.getState() == "SUCCESS") {
                   var stage = response.getReturnValue();
                   //console.log('RESPONSE '+stage.toString());
                   var returnMap = [];
                   var responso = JSON.parse(stage);
                   console.log('RESPONSE PARSATA');
                   //if(responso != null && responso != undefined && responso.length > 0){
                       var provinces = responso.data;
                       provinces.forEach(function(element) {
                           //returnMap.push(element.province_ref , element.name_display);
                           returnMap.push({'key' : element.municipality_ref , 'value' : element.name});  
                       });
                       component.set('v.municipalityMap' , returnMap);
                      
                   
                       console.log('MAPPASETTATA:: ' +returnMap[0].key);
                  
                       
                       
                       if(!component.get('v.firstProvChange')){
                           component.set('v.hamletMap' , '');
                           component.set('v.toponym' , '');
                           component.set('v.Civico' , '');
                           component.set('v.CAP' , '');
                           component.set('v.streetWrap' , '');
                           component.set('v.streetInput' , '');
                           component.set('v.shortStreet' , '');
                           component.set('v.metRefX' , '');
                           component.set('v.metRefY' , '');
                           component.set('v.geoRefX' , '');
                           component.set('v.geoRefY' , '');
                           component.set('v.LocAgg' , '');
                           component.set('v.geoQualita' , '');
                           component.set('v.regionRef' , component.get('v.provinceWrap').split('§')[2]);
                           component.set('v.esteroCity', '');
                           component.set('v.esteroStreet', '');
                           component.set('v.esteroCAP', '');
                           
                           component.set('v.cityWrap' , '');
                           console.log('v.cityWrap 1'+component.get('v.cityWrap'));
                           component.set('v.cityKey','');
                           console.log('v.cityKey'+component.get('v.cityKey'));
                           
                           
                       }
                       else if(component.get("v.sObjectName") == 'Account'){
                           component.set('v.regionRef' , component.get('v.provinceWrap').split('§')[2]);
                       }else{
                           component.set('v.regionRef' , component.get('v.provinceWrap').split('§')[2]);
                       }
                       component.set('v.firstProvChange' , false);
                       //component.set('v.cityKey' , returnMap[0].key);
                       //component.set('v.cityWrap' , returnMap[0].key + '§' +returnMap[0].value);
                       console.log('v.cityWrap 2'+component.get('v.cityWrap'));
                       console.log('REGIONREG '+component.get('v.regionRef'));
                       console.log('CITYREFOLD '+component.get('v.cityKey'));
                       console.log('CITY MAP '+returnMap[0].key+ '§' +returnMap[0].value);
                       
                       //component.set ('v.hmacString' ,stage.toString() );
                       //***ADD PREPOPULATION ONCE IT_ADDRESS IS GONE***
                   //}
                   
               }
               else if(state === 'ERROR'){
                   var errors = resp.getError();
                   for(var i = 0 ;i < errors.length;i++){
                       console.log(errors[i].message);
                   }
               }
           });
           $A.enqueueAction(action);
           
       },
   
   onPicklistChange: function (component, event, helper) {
       //when a value is selected, apex automatically populates the next picklist
       console.log('Entrato per Strade');

       var city = component.get("v.cityWrap").split("§")[0];
       var evntsource = event.getSource();
       var Value = evntsource.get("v.value");
       console.log('VALUEEVENT:: ' + evntsource.get("v.value"));
       //component.set('v.newAddress.IT_City__c', city);
       console.log('VALUESTRADE:: ' + city);
       component.set('v.hamletMap' , '');
       component.set('v.toponym' , '');
       component.set('v.Civico' , '');
       component.set('v.CAP' , '');
       component.set('v.streetWrap' , '');
       component.set('v.streetInput' , '');
       component.set('v.shortStreet' , '');
       component.set('v.metRefX' , '');
       component.set('v.metRefY' , '');
       component.set('v.geoRefX' , '');
       component.set('v.geoRefY' , '');
       component.set('v.LocAgg' , '');
       component.set('v.geoQualita' , '');
       component.set('v.cityKey' , city);
       /*var action = component.get('c.fetchStreets');
       action.setParams({
           "provincia": city
       })
       action.setCallback(this, function (response) {
           if (response.getState() == "SUCCESS") {
               var listaVie = response.getReturnValue();
               if (listaVie != null && listaVie != '') {
                   component.set("v.listaVie", listaVie);
                   //console.log('VIE PRESE::' + listaVie);
                   component.set('v.hamletMap' , null);
                   component.set('v.toponym' , '');
                   component.set('v.Civico' , '');
                   component.set('v.CAP' , '');
                   component.set('v.streetWrap' , '');
                   component.set('v.streetInput' , '');
                   component.set('v.metRefX' , '');
                   component.set('v.metRefY' , '');
                   component.set('v.geoRefX' , '');
                   component.set('v.geoRefY' , '');
                   component.set('v.LocAgg' , '');
                   
                   //component.set('v.firstStreetChange' , false);
               }
           }
       });
       $A.enqueueAction(action);*/

   },

   streetChange: function (component, event, helper) {
       //when a value is selected, apex automatically populates the next picklist
       console.log('Entrato in streetChange');
       var evntsource = event.getSource();
       var Value = evntsource.get("v.value");
       console.log('Valore:: ' + Value);
       //component.set('v.newAddress.IT_Street__c', Value);
       var action = component.get('c.fetchZipCode');
       action.setParams({
           "street": Value
       })
       action.setCallback(this, function (response) {
           if (response.getState() == "SUCCESS") {
               var CAP = response.getReturnValue();
               if (CAP != null && CAP != '') {
                   component.set("v.CAP", CAP);
                   console.log('CAP PRESO::' + CAP);
               }
           }
       });
       $A.enqueueAction(action);

       var action2 = component.get('c.fetchLocation');
       action2.setParams({
           "street": Value
       })
       action2.setCallback(this, function (response) {
           if (response.getState() == "SUCCESS") {
               var LOC = response.getReturnValue();
               if (LOC != null && LOC != '') {
                   component.set("v.LocAgg", LOC);
               }
           }
       });
       $A.enqueueAction(action2);


   },
    getForeignCities: function(component, event, helper){
        console.log("ESTERO");
        var input = component.get('v.esteroCity');
        console.log('input '+input);

        if (input != null && input != undefined && input.length > 1) {
            var action = component.get("c.getMunicipalitiesStradario");
            action.setParams({'provinceRef' : '0','cityPattern' : input});
            action.setCallback(this, function (response) {
                
                if (response.getState() == "SUCCESS") {
                    var LOC = response.getReturnValue();
                    console.log('loc' + LOC);
                    if(LOC != null && LOC != undefined && LOC != ''){
                        var responso = JSON.parse(LOC);
                        console.log('RESPONSE PARSATA'+LOC);
                        var returnMap = [];
                        //var cities = responso.data;
                        var cities = responso;
                        console.log('cities' + cities);
                        if(cities.length > 0){
                            cities.forEach(function(element) {
                                console.log('CITY NAME:: '+element.name);
                                console.log('CITY CODE:: '+element.municipality_ref);
                                
                                returnMap.push({'key' : element.municipality_ref , 'value' : element.name});
                            });
                            component.set('v.predictionsCityEstero' , returnMap);
                        }else{
                            component.set('v.predictionsCityEstero' , null);
                            component.set('v.cityWrap',input);
                        }
                        
                    }else{
                        component.set('v.predictionsCityEstero' , null);
                       	component.set('v.cityWrap',input);
                    }
                }else{
                    var LOC = response.getReturnValue();
                    var responso = JSON.parse(LOC);
                    console.log('RESPONSE PARSATA' + responso +LOC);
                }
            });
            $A.enqueueAction(action);
        }else {
            component.set('v.predictionsCityEstero', null);
            component.set('v.cityWrap',component.get('v.esteroCity'));
        }
    },
    getForeignStreets: function(component, event, helper){
        console.log("ESTERO");
        component.set('v.Civico' , '');
        component.set('v.CAP' , '00000');
        var input = component.get('v.esteroStreet');
        var cityRefVar;
        console.log('cityRefVar',component.get('v.cityWrap'));
        if(component.get('v.cityWrap').includes('§')){
            cityRefVar = component.get('v.cityWrap').split("§")[0];
        }

        console.log('cityRefVar',cityRefVar);
        console.log('input ',input);
        
        if (input.length > 1 && cityRefVar != '' && cityRefVar != null && cityRefVar != undefined) {
            var action = component.get("c.getSuggestions");
            action.setParams({'input' : input, 'cityRef' : cityRefVar});
            action.setCallback(this, function (response) {
               if (response.getState() == "SUCCESS") {
                   var LOC = response.getReturnValue();
                   console.log('response '+LOC);
                   if(LOC != null && LOC != undefined && LOC != ''){
                        var responso = JSON.parse(LOC);
                       console.log('RESPONSE PARSATA' + responso +LOC);
                       var streets = responso.data;
                       var returnMap = [];
                       streets.forEach(function(element) {
                           console.log('ELEMENT:: '+element.name);
                           console.log('ADDRESS CODE:: '+element.street_ref);
                           //console.log('TOPONYM:: '+element.toponym);
                           var realAddress = '';
                           var old_town = '';
                           if(element.toponym != null){
                               //realTopo = element.toponym;
                               realAddress = element.short_name;
                           }
                           else{
                               realAddress = element.short_name;
                           }
                           /*if(element.old_town != null){
                               realAddress += ' ('+element.old_town+') ';
                           }*/
                           //returnMap.push(element.province_ref , element.name_display);
                           returnMap.push({'key' : element.street_ref , 'value' : element.name});  
                       });
                       component.set('v.predictionsStreetEstero' , returnMap);
                   }else{
                       component.set('v.predictionsStreetEstero' , null);
                       component.set('v.streetWrap',input);
                   }
                  
                   
               }
           });
           $A.enqueueAction(action);
        }else {
            component.set('v.predictionsStreetEstero', null);
            component.set('v.streetWrap',input);
        }
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
       var cityName = component.get('v.cityWrap').split('§')[1];
       var provinceName = component.get('v.provinceWrap').split('§')[1];
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

   },
	
   //hidePredictions: function (component, event, helper) {component.set('v.predictions', null);},

    getForeignCityDetails: function (component, event, helper){
        console.log("SELECTED CITY ESTERO");
        var selectedItem = event.currentTarget;
        var placeid = selectedItem.dataset.placeid;
        console.log('placeid',JSON.stringify(placeid));
        var cityEstero = placeid.split('§')[1];
        
        console.log('cityEstero',cityEstero);
        
        component.set('v.esteroCity',cityEstero);
        component.set('v.cityWrap', placeid);
       	component.set('v.predictionsCityEstero', []);
    },
    getForeignStreetDetails: function (component, event, helper) {
       console.log("SELECTED STREET ESTERO");

       var selectedItem = event.currentTarget;
        console.log('selectedItem'+selectedItem);
       var placeid = selectedItem.dataset.placeid;
        console.log('placeid'+placeid);
       var streetInput = placeid.split('§')[1];
        console.log('streetInput'+streetInput);
       component.set('v.streetInput', streetInput);
       //placeid = placeid.replace(/ \([\s\S]*?\)/g, ""); FC 03/08/2021 modifica per indirizzi con frazione
        if(placeid.includes('(')){
            component.set('v.hamletRequired',true);
        }
       console.log('PLACEID'+placeid);
       component.set('v.streetWrap', placeid);
        component.set('v.esteroStreet', placeid.split('§')[1]);
       component.set('v.predictionsStreetEstero', []);
        //component.set('v.esteroCAP', '00000');
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
   civicoBlur2: function (component, event, helper) {
       var inputCmp;
       if(component.get('v.provinceWrap').split('§')[0] == '0') {
           inputCmp = component.find("civicoEstero");
       }else{
           inputCmp = component.find("civico");
       }
       var input = inputCmp.get("v.value");
       var civicoValid = true;
       // is input valid text?
       if(
           input.includes('À') ||
           input.includes('È') ||
           input.includes('Ì') ||
           input.includes('Ò') ||
           input.includes('Ù') ||
           input.includes('Á') ||
           input.includes('É') ||
           input.includes('Í') ||
           input.includes('Ó') ||
           input.includes('Ú') ||
           input.includes('Ä') ||
           input.includes('Ë') ||
           input.includes('Ï') ||
           input.includes('Ö') ||
           input.includes('Ü') ||
           input.includes('°') ||
           input.includes('€') ||
           input.includes('¿') ||
           input.includes('|') 
       ) {
           inputCmp.setCustomValidity("Caratteri speciali non ammessi nel Civico");
           component.set('v.civicoValid', false);
       } else {
           inputCmp.setCustomValidity(""); // if there was a custom error before, reset it
           component.set('v.civicoValid', true);
       }
       inputCmp.reportValidity(); // Tells lightning:input to show the error right away without needing interaction
       if (component.get("v.Civico") != null && civicoValid) {
           helper.addressNormalize(component , event);
       }
   },
   civicoBlur: function (component, event, helper) {
       if (component.get("v.Civico") != null) {
           helper.addressNormalize(component , event);
           var placeid = component.get('v.streetWrap');
           if (placeid != null) {
               var action = component.get('c.fetchZipCode');
               action.setParams({
                   "street": placeid
               })
               action.setCallback(this, function (response) {
                   if (response.getState() == "SUCCESS") {
                       var CAP = response.getReturnValue();
                       if (CAP != null && CAP != '') {
                           component.set("v.CAP", CAP);
                           console.log('CAP PRESO::' + CAP);
                       }
                   }
               });
               $A.enqueueAction(action);

               var action2 = component.get('c.fetchLocation');
               action2.setParams({
                   "street": placeid
               })
               action2.setCallback(this, function (response) {
                   if (response.getState() == "SUCCESS") {
                       var LOC = response.getReturnValue();
                       if (LOC != null && LOC != '') {
                           component.set("v.LocAgg", LOC);
                       }
                   }
               });
               $A.enqueueAction(action2);
           }
       }
   },
   
   invoke: function (component, event, helper) {
       //var workspaceAPI = component.find("workspace");
       //CALLED BY FLOW, ASSOCIATES ADDRESS TO ALL RECORDS SELECTED BY USER
       console.log('SUBMITTED');
       var cap = component.get('v.flowCAP');
       if(cap == undefined){
           cap = null;
       }
       var province = component.get('v.flowProvince');
       if(province == undefined){
           province = null;
       }
       var provinceCode = component.get('v.flowProvinceCode');
       if(provinceCode == undefined){
           provinceCode = null;
       }
       var city = component.get('v.flowCity');
       if(city == undefined){
           city = null;
       }
       var cityCode = component.get('v.flowCityCode');
       if(cityCode == undefined){
           cityCode = null;
       }
       var street = component.get('v.flowStreet');
       if(street == undefined){
           street = null;
       }
       var locagg = component.get('v.flowLocAgg');
       if(locagg == undefined){
           locagg = null;
       }
       var metRefX = component.get('v.flowMetRefX');
       if(metRefX == undefined){
           metRefX = null;
       }
       var metRefY = component.get('v.flowMetRefY');
       if(metRefY == undefined){
           metRefY = null;
       }
       var geoRefX = component.get('v.flowGeoRefX');
       if(geoRefX == undefined){
           geoRefX = null;
       }
       var geoRefY = component.get('v.flowGeoRefY');
       if(geoRefY == undefined){
           geoRefY = null;
       }
       var toponym = component.get('v.flowToponym');
       if(toponym == undefined){
           toponym = null;
       }
       var regionRef = component.get('v.flowRegionRef');
       if(regionRef == undefined){
           regionRef = null;
       }
       var streetCode = component.get('v.flowStreetCode');
       if(streetCode == undefined){
           streetCode = null;
       }
       var hamlet = component.get('v.flowHamlet');
       if(hamlet == undefined){
           hamlet = null;
       }
       var hamletRef = component.get('v.flowHamletRef');
       if(hamletRef == undefined){
           hamletRef = null;
       }
       var urbanSpecs = component.get('v.flowExtraSpec');
       if(urbanSpecs == undefined){
           urbanSpecs = null;
       }
       var geoQualita = component.get('v.flowGeoQualita');
       if(geoQualita == undefined){
           geoQualita = null;
       }
       console.log('Entrato in INVOKE');
       var childIds = component.get('v.updateIdString');
       console.log('Stringa Sospetta: ' + childIds);
       var action = component.get('c.associateAddress');
       console.log("INDIRIZZO AGGIORNATO CORRETTAMENTE" + childIds + cap + provinceCode + province);
       action.setParams({
           "childString": childIds,
           "cap" : cap ,
           "province" : province ,
           "provinceCode" : provinceCode ,
           "city" : city ,
           "cityCode" : cityCode ,
           "street" : street ,
           "streetCode" : streetCode,
           "locagg" : locagg,
           "metRefX": metRefX,
           "metRefY": metRefY,
           "geoRefX": geoRefX,
           "geoRefY": geoRefY,
           "toponym": toponym,
           "regionRef": regionRef,
           "hamlet": hamlet,
           "hamletRef": hamletRef,
           "urbanSpecs": urbanSpecs
       })
       
       return new Promise(function(resolve, reject) {
           action.setCallback(this, function (response) {
               if (response.getState() == "SUCCESS") {
                   console.log("SUCCESS");
                   console.log("INDIRIZZO AGGIORNATO CORRETTAMENTE");
                   resolve();
                   /* workspaceAPI.getFocusedTabInfo().then(function (response) {
                   var focusedTabId = response.tabId;
                   workspaceAPI.refreshTab({
                       tabId: focusedTabId,
                       includeAllSubtabs: true
                   });
               });*/
               } else {
                   var errors = response.getError();
                   reject(new Error(errors[0].pageErrors[0].message));
                   
               }
           });
           $A.enqueueAction(action);
       });

   },

   onButtonPressed: function(component, event, helper) {
       //CHECK IF FIIELDS ARE OK
       //gets address from component, populates its fields and sends it to apex. then refreshes the page.
       var actionClicked = event.getSource().getLocalId();
       if(actionClicked == 'BACK'){
           var navigate = component.get('v.navigateFlow');
           navigate(actionClicked);
       }
       else{
           var inputCmp = component.find("hamlet");
           //console.log('inputCmp',inputCmp.get("v.value"));
           var hamletReq = component.get("v.hamletRequired");
           console.log('hamletReq',hamletReq);
           try{
               if(hamletReq && inputCmp.get("v.value") == ''){
                   //inputCmp.setCustomValidity("La frazione è obbligatoria");
                   throw new Error("La frazione è obbligatoria");
               }
           
           
           var estero = false;
           if(component.get('v.provinceWrap') == '0§ESTERO§0'){
               estero = true;
           }
           if(!estero){
               helper.addressValidate(component , event);
               
           }
           if(component.get('v.validated')){
               console.log('SUBMITTED');
               component.set('v.flowCAP' , component.get("v.CAP"));
               //component.set('v.flowProvince' , component.get("v.provinceWrap").split('§')[1]);
               component.set('v.flowProvince' , component.get("v.shortProvince"));
               component.set('v.flowProvinceCode' , component.get("v.provinceWrap").split('§')[0]);
               component.set('v.flowCity' , component.get("v.cityWrap").split('§')[1]);
               component.set('v.flowCityCode' , component.get("v.cityWrap").split('§')[0]);
               component.set('v.flowStreet' , component.get("v.shortStreet") + ', ' + component.get("v.Civico").toUpperCase());
               component.set('v.flowStreetCode' , component.get("v.streetWrap").split('§')[0]);
               component.set('v.flowLocAgg' , component.get("v.LocAgg"));
               component.set('v.flowMetRefX' , component.get("v.metRefX"));
               component.set('v.flowMetRefY' , component.get("v.metRefY"));
               component.set('v.flowGeoRefX' , component.get("v.geoRefX"));
               component.set('v.flowGeoRefY' , component.get("v.geoRefY"));
               component.set('v.flowToponym', component.get('v.toponym'));
               component.set('v.flowRegionDesc' , component.get('v.regionDesc'));
               component.set('v.flowRegionRef' , component.get('v.provinceWrap').split('§')[2]);
               component.set('v.flowHamlet', component.get('v.hamlet').split('§')[1]);
               component.set('v.flowHamletCode', component.get('v.hamlet').split('§')[0]);
               component.set('v.flowExtraSpec', component.get('v.extraSpecs'));
               component.set('v.flowGeoQualita', component.get('v.geoQualita'));
               
               var str = component.get("v.Civico");
               var matches = [];
               matches = str.match(/\d+/g);
               if(matches != null && matches != undefined && matches.length > 0){
                   console.log(matches);
                   component.set('v.flowCivicoNumerico', parseInt(matches[0]));
               }else{
                   component.set('v.flowCivicoNumerico', 0);
               }
               
               //console.log('SUBMITTED PROV' + component.get("v.flowProvince"));
               console.log('SUBMITTED flowProvinceCode' + component.get("v.flowProvinceCode"));
               console.log('SUBMITTED STREET' + component.get("v.flowStreet"));
               console.log('SUBMITTED flowRegionDesc' + component.get("v.flowRegionDesc"));
               console.log('SUBMITTED flowRegionRef' + component.get("v.flowRegionRef"));
               var navigate = component.get('v.navigateFlow');
               navigate(actionClicked);
           }
           else if(estero){
               var metRefY = '0';
               var metRefX = '0';
               var geoRefY = '0';
               var geoRefX = '0';
               var geoQualita = '0';
               console.log('SUBMITTED');
               component.set('v.flowCAP' , "00000");
               //component.set('v.flowProvince' , component.get("v.provinceWrap").split('§')[1]);
               component.set('v.flowProvince' , '  ');
               component.set('v.flowProvinceCode' , '0');
               component.set('v.flowCity' , component.get("v.esteroCity"));
               component.set('v.flowCityCode' , component.get("v.cityWrap").split('§')[0]);
               component.set('v.flowStreet' , component.get("v.esteroStreet") + ', ' + component.get("v.Civico").toUpperCase());
               component.set('v.flowStreetCode' , component.get("v.streetWrap").split('§')[0]);
               component.set('v.flowLocAgg' , component.get("v.LocAgg"));
               if(component.get("v.metRefX")){
                   metRefX = component.get("v.metRefX");
               }
               component.set('v.flowMetRefX' , metRefX);
               if(component.get("v.metRefY")){
                   metRefY = component.get("v.metRefY");
               }
               component.set('v.flowMetRefY' , metRefY);
               if(component.get("v.geoRefX")){
                   geoRefX = component.get("v.geoRefX");
               }
               component.set('v.flowGeoRefX' , geoRefX);
               if(component.get("v.geoRefY")){
                   geoRefY = component.get("v.geoRefY");
               }
               component.set('v.flowGeoRefY' , geoRefY);
               component.set('v.flowToponym', null);//component.get('v.toponym'));
               component.set('v.flowRegionRef' , '0');
               component.set('v.flowRegionDesc' , '0');
               component.set('v.flowHamlet', null);
               component.set('v.flowHamletCode', null);
               component.set('v.flowExtraSpec', component.get('v.extraSpecs'));
               if(component.get("v.geoQualita")){
                   geoQualita = component.get("v.geoQualita");
               }
               component.set('v.flowGeoQualita', geoQualita);
               //component.set('v.flowCivicoNumerico', 0);
               var str = component.get("v.Civico");
               var matches = [];
               matches = str.match(/\d+/g);
               if(matches != null && matches != undefined && matches.length > 0){
                   console.log(matches);
                   component.set('v.flowCivicoNumerico', parseInt(matches[0]));
               }else{
                   component.set('v.flowCivicoNumerico', 0);
               }
               console.log('SUBMITTED' + component.get("v.flowProvince"));
               console.log('SUBMITTED' + component.get("v.flowStreet"));
               var navigate = component.get('v.navigateFlow');
               navigate(actionClicked);
           }
               }catch(e){
                   helper.alert(component, event, helper, 'error', '', e.message);
                   console.error("Error: " + e);
               
           }
       }
    },

    NewSubmitStradario: function (component, event, helper) {
       //gets address from component, populates its fields and sends it to apex. then refreshes the page.
        console.log('SUBMITTED');
        var estero = false;
        try{
            var inputCmp = component.find("hamlet");
           //console.log('inputCmp',inputCmp.get("v.value"));
           var hamletReq = component.get("v.hamletRequired");
           console.log('hamletReq',hamletReq);
            if(hamletReq && inputCmp.get("v.value") == ''){
                //inputCmp.setCustomValidity("La frazione è obbligatoria");
                throw new Error("La frazione è obbligatoria");
            }
            if(component.get('v.provinceWrap') == '0§ESTERO§0'){
                estero = true;
            }
            if(!estero){
                helper.addressValidate(component , event);
                
            }
            
            if(component.get('v.validated')){
                var recordId = component.get("v.recordId");
                var objName = component.get("v.sObjectName");
                var sObj = {'sobjectType':objName,'Id':recordId};
                console.log('SOBJECT' +sObj);
                var workspaceAPI = component.find("workspace");
                if(objName != 'Opportunity'){
                    if(objName == 'Account'){
                        var str = component.get("v.Civico");
                        var matches = [];
                        matches = str.match(/\d+/g);
                        
                        var civico = component.get("v.Civico").toUpperCase();
                        if(civico.includes('KM')){
                            
                            var newCivico = civico.replace('KM','').replace('.','').replaceAll(' ','');
                            sObj.IT_Street_Number__c = 'KM.'+newCivico;
                            sObj.IT_street_numeric_number__c = 0;
                            civico = 'SNC';
                            sObj.IT_Extra_Urban_Specifications__c = 'KM.'+newCivico;
                        }else{
                            sObj.IT_Street_Number__c = component.get("v.Civico").toUpperCase();
                            if(matches != null && matches != undefined && matches.length > 0){
                                console.log(matches);
                                sObj.IT_street_numeric_number__c = parseInt(matches[0]);
                            }else{
                                sObj.IT_street_numeric_number__c = 0;
                            }
                            sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                        }
                        sObj.BillingStreet = component.get('v.shortStreet') + ', ' + civico;
                        sObj.BillingState = component.get('v.shortProvince');
                        sObj.BillingPostalCode = component.get("v.CAP");
                        sObj.BillingCountry = '086';//Italy';
                        sObj.IT_Country_Description__c = 'ITALIA';
                        sObj.BillingCity = component.get('v.cityWrap').split('§')[1];
                        sObj.BillingLatitude = component.get('v.geoRefY');
                        sObj.BillingLongitude = component.get('v.geoRefX');
                        sObj.IT_Region__c = component.get('v.provinceWrap').split('§')[2];
                        
                        sObj.IT_GeoQualita__c = component.get("v.geoQualita");
                        
                        
                    }
                    if(objName == 'Lead'){
                        var str = component.get("v.Civico");
                        var matches = [];
                        matches = str.match(/\d+/g);
                        
                        var civico = component.get("v.Civico").toUpperCase();
                        if(civico.includes('KM')){
                            
                            var newCivico = civico.replace('KM','').replace('.','').replaceAll(' ','');
                            sObj.IT_Street_Number__c = 'KM.'+newCivico;
                            sObj.IT_Street_Number_Numeric__c = 0;
                            civico = 'SNC';
                            sObj.IT_Extra_Urban_Specifications__c = 'KM.'+newCivico;
                        }else{
                            sObj.IT_Street_Number__c = component.get("v.Civico").toUpperCase();
                            if(matches != null && matches != undefined && matches.length > 0){
                                console.log(matches);
                                sObj.IT_Street_Number_Numeric__c = parseInt(matches[0]);
                            }else{
                                sObj.IT_Street_Number_Numeric__c = 0;
                            }
                            sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                        }
                        sObj.Street = component.get('v.shortStreet') + ', ' + civico;
                        sObj.State = component.get('v.shortProvince');
                        sObj.PostalCode = component.get("v.CAP");
                        sObj.Country = '086';//'Italy';
                        sObj.ER_Legal_Country__c = 'ITALIA';
                        sObj.City = component.get('v.cityWrap').split('§')[1];
                        sObj.Latitude = component.get('v.geoRefY');
                        sObj.Longitude = component.get('v.geoRefX');
                        sObj.IT_GeoRef_Loc_Y__c = component.get('v.geoRefY').toString();
                        sObj.IT_GeoRef_Loc_X__c = component.get('v.geoRefX').toString();
                        sObj.IT_Region_Txt__c = component.get('v.regionDesc');
                        sObj.IT_Geo_Quality__c = component.get("v.geoQualita");
                        /*sObj.IT_Street_Number__c = component.get("v.Civico").toUpperCase();
                        
                        var matches = [];
                        matches = str.match(/\d+/g);
                        if(matches != null && matches != undefined && matches.length > 0){
                            console.log(matches);
                            sObj.IT_Street_Number_Numeric__c = parseInt(matches[0]);
                        }
                        else{
                            sObj.IT_Street_Number_Numeric__c = 0;
                        }*/
                    }
                    else{
                        sObj.ER_Street__c = component.get('v.shortStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_Province__c = component.get('v.shortProvince');
                        sObj.ER_Zip_Code__c = component.get("v.CAP");
                        sObj.ER_City__c = component.get('v.cityWrap').split('§')[1];
                        sObj.IT_GeoRef_Loc_Y__c = component.get('v.geoRefY').toString();
                        sObj.IT_GeoRef_Loc_X__c = component.get('v.geoRefX').toString();
                    }
                    if(component.get('v.hamlet') != null && component.get('v.hamlet') != ''){
                        sObj.IT_Hamlet__c = component.get('v.hamlet').split('§')[1];
                        sObj.IT_Hamlet_Code__c = component.get('v.hamlet').split('§')[0];
                    }
                    else{
                        sObj.IT_Hamlet__c = null;
                        sObj.IT_Hamlet_Code__c = null;
                    }
                    //sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                    sObj.IT_Toponym__c = component.get('v.toponym');
                    sObj.IT_MetRef_Loc_Y__c = component.get('v.metRefY').toString();
                    sObj.IT_MetRef_Loc_X__c = component.get('v.metRefX').toString();
                    sObj.IT_State_Code__c = component.get('v.provinceWrap').split('§')[0];
                    sObj.IT_City_Code__c = component.get('v.cityWrap').split('§')[0];
                    sObj.IT_Street_Code__c = component.get('v.streetWrap').split('§')[0];
                    sObj.IT_Region_code__c = component.get('v.provinceWrap').split('§')[2];
                    if(objName != 'Account'){
                        sObj.IT_Change_Address__c = true;  
                    }
                    if(objName == 'ER_Delivery_Site__c'){
                        sObj.ER_Street_additionnal__c = component.get('v.LocAgg'); 
                    }
                    else{
                        sObj.IT_Additional_Locality__c = component.get('v.LocAgg'); 
                    }
                }
                else{
                    if(component.get('v.opportunityType') == 'Billing'){
                        sObj.IT_State_Code__c = component.get('v.provinceWrap').split('§')[0];
                        sObj.IT_Billing_State_Description__c = '086';//'Italy';
                        sObj.IT_State_Province__c = component.get('v.shortProvince');
                        sObj.IT_City_Code__c = component.get('v.cityWrap').split('§')[0];
                        sObj.IT_City__c = component.get('v.cityWrap').split('§')[1];
                        if(component.get('v.hamlet') != null && component.get('v.hamlet') != ''){
                            sObj.IT_Hamlet__c = component.get('v.hamlet').split('§')[1];
                            sObj.IT_Hamlet_Code__c = component.get('v.hamlet').split('§')[0];
                        }
                        else{
                            sObj.IT_Hamlet__c = null;
                            sObj.IT_Hamlet_Code__c = null;
                        }
                        sObj.IT_Zip_Code__c = component.get("v.CAP");
                        sObj.IT_Street__c = component.get('v.shortStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_Billing_Address_Description__c = component.get('v.extraSpecs');
                        //sObj.IT_Billing_Geo_Quality__c = 
                        sObj.IT_GeoRef_Loc_X__c = component.get('v.geoRefX').toString();
                        sObj.IT_GeoRef_Loc_Y__c = component.get('v.geoRefY').toString();
                        sObj.IT_MetRef_Loc_X__c = component.get('v.metRefX').toString();
                        sObj.IT_MetRef_Loc_Y__c = component.get('v.metRefY').toString();
                        sObj.IT_Toponym__c = component.get('v.toponym');
                        sObj.IT_Region_Code__c = component.get('v.provinceWrap').split('§')[2];
                        sObj.IT_Street_Code__c = component.get('v.streetWrap').split('§')[0];
                    }
                    else{
                        sObj.IT_Shipping_State_Code__c = component.get('v.provinceWrap').split('§')[0];
                        sObj.IT_Shipping_State_Description__c = '086';//'Italy';
                        sObj.IT_ShippingState__c = component.get('v.shortProvince');
                        sObj.IT_Shipping_City_Code__c = component.get('v.cityWrap').split('§')[0];
                        sObj.IT_ShippingCity__c = component.get('v.cityWrap').split('§')[1];
                        if(component.get('v.hamlet') != null && component.get('v.hamlet') != ''){
                            sObj.IT_Shipping_Hamlet__c = component.get('v.hamlet').split('§')[1];
                            sObj.IT_shipping_Hamlet_Code__c = component.get('v.hamlet').split('§')[0];
                        }
                        else{
                            sObj.IT_Shipping_Hamlet__c = null;
                            sObj.IT_shipping_Hamlet_Code__c = null;
                        }
                        sObj.IT_shippingPostalCode__c = component.get("v.CAP");
                        sObj.IT_ShippingStreet__c = component.get('v.shortStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_Shipping_Address_Description__c = component.get('v.extraSpecs');
                        //sObj.IT_ShippingGeoCodeAccuracy__c = 
                        sObj.IT_ShippingLatitude__c = component.get('v.geoRefX').toString();
                        sObj.IT_ShippingLongitude__c = component.get('v.geoRefY').toString();
                        sObj.IT_Shipping_Toponym__c = component.get('v.toponym');
                        sObj.IT_Shipping_MetRef_Loc_X__c = component.get('v.metRefX').toString();
                        sObj.IT_Shipping_MetRef_Loc_Y__c = component.get('v.metRefY').toString();
                        sObj.IT_Shipping_Region_Code__c = component.get('v.provinceWrap').split('§')[2];
                        sObj.IT_Shipping_Street_Code__c = component.get('v.streetWrap').split('§')[0];
                    }
                }
                console.log('SUBMITTEDADDRESS:: '+JSON.stringify(sObj));
                var action = component.get("c.insertAndAssociateAddress");
                action.setParams({
                    "obj" : sObj
                })
                action.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        component.set('v.setVisiblity', false);
                        console.log('VISIBILITY');
                        console.log('SUCCESS');
                        var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "type":"success",
                                "title": "Salvato",
                                "message": "Salvataggio avvenuto con successo!"
                            });
                            toastEvent.fire();
    
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();
                    }
                    else{
                        var errors =response.getError();
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "type":"error",
                            "title": "Ops!",
                            "message": "Qualcosa è andato storto: "+errors[0].pageErrors[0].message
                        });
                        toastEvent.fire();
                    }
                });
                $A.enqueueAction(action);
            }
            
            // SOLO ESTERO //
            
            else if (estero){
                var recordId = component.get("v.recordId");
                var objName = component.get("v.sObjectName");
                var sObj = {'sobjectType':objName,'Id':recordId};
                console.log('SOBJECT' +sObj);
                var workspaceAPI = component.find("workspace");
                if(objName != 'Opportunity'){
                    if(objName == 'Account'){
                        sObj.BillingStreet = component.get('v.esteroStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.BillingState = '  ';
                        sObj.BillingPostalCode = "00000";
                        console.log('country ',component.get("v.countryWrap"));
                        sObj.BillingCountry = component.get("v.countryWrap").split('§')[1];
                        sObj.IT_Country_Description__c = component.get("v.countryWrap").split('§')[0];
                        sObj.BillingCity = component.get('v.esteroCity');
                        sObj.BillingLatitude = 0;
                        sObj.BillingLongitude = 0;
                        sObj.IT_GeoQualita__c = '0';
                        var str = component.get("v.Civico");
                        var matches = [];
                        matches = str.match(/\d+/g);
                        
                        var civico = component.get("v.Civico").toUpperCase();
                        if(civico.includes('KM')){
                            
                            var newCivico = civico.replace('KM','').replace('.','').replaceAll(' ','');
                            sObj.IT_Street_Number__c = 'KM.'+newCivico;
                            sObj.IT_street_numeric_number__c = 0;
                            civico = 'SNC';
                            sObj.IT_Extra_Urban_Specifications__c = 'KM.'+newCivico;
                        }else{
                            sObj.IT_Street_Number__c = component.get("v.Civico").toUpperCase();
                            if(matches != null && matches != undefined && matches.length > 0){
                                console.log(matches);
                                sObj.IT_street_numeric_number__c = parseInt(matches[0]);
                            }else{
                                sObj.IT_street_numeric_number__c = 0;
                            }
                            sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                        }
                        sObj.IT_Region__c = '';
                    }
                    if(objName == 'Lead'){
                        sObj.Street = component.get('v.esteroStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.State = '  ';
                        sObj.PostalCode = "00000";
                        sObj.Country = component.get("v.countryWrap").split('§')[1];
                        sObj.ER_Legal_Country__c = component.get("v.countryWrap").split('§')[0];
                        sObj.City = component.get('v.esteroCity');
                        sObj.Latitude = 0;
                        sObj.Longitude = 0;
                        sObj.IT_Geo_Quality__c = '0';
                        sObj.IT_Region_Txt__c = '0';
                        var str = component.get("v.Civico");
                        var matches = [];
                        matches = str.match(/\d+/g);
                        
                        var civico = component.get("v.Civico").toUpperCase();
                        if(civico.includes('KM')){
                            
                            var newCivico = civico.replace('KM','').replace('.','').replaceAll(' ','');
                            sObj.IT_Street_Number__c = 'KM.'+newCivico;
                            sObj.IT_Street_Number_Numeric__c = 0;
                            civico = 'SNC';
                            sObj.IT_Extra_Urban_Specifications__c = 'KM.'+newCivico;
                        }else{
                            sObj.IT_Street_Number__c = component.get("v.Civico").toUpperCase();
                            if(matches != null && matches != undefined && matches.length > 0){
                                console.log(matches);
                                sObj.IT_Street_Number_Numeric__c = parseInt(matches[0]);
                            }else{
                                sObj.IT_Street_Number_Numeric__c = 0;
                            }
                            sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                        }
                    }
                    else{
                        sObj.ER_Street__c = component.get('v.esteroStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_Province__c = '  ';
                        sObj.ER_Zip_Code__c = "00000";
                        sObj.ER_City__c = component.get('v.esteroCity');
                        sObj.IT_GeoRef_Loc_Y__c = '0';
                        sObj.IT_GeoRef_Loc_X__c = '0';
                    }
                    if(component.get('v.hamlet') != null && component.get('v.hamlet') != ''){
                        sObj.IT_Hamlet__c = null;
                        sObj.IT_Hamlet_Code__c = null;
                    }
                    else{
                        sObj.IT_Hamlet__c = null;
                        sObj.IT_Hamlet_Code__c = null;
                    }
                    sObj.IT_Extra_Urban_Specifications__c = component.get('v.extraSpecs');
                    sObj.IT_Toponym__c = null;
                    sObj.IT_MetRef_Loc_Y__c = component.get("v.metRefY").toString();
                    sObj.IT_MetRef_Loc_X__c = component.get("v.metRefX").toString();
                    sObj.IT_State_Code__c = '0';
                    sObj.IT_City_Code__c = component.get("v.cityWrap").split('§')[0];
                    sObj.IT_Street_Code__c = component.get("v.streetWrap").split('§')[0];
                    sObj.IT_Region_code__c = '0';
                    if(objName != 'Account'){
                        sObj.IT_Change_Address__c = true;  
                    }
                    if(objName == 'ER_Delivery_Site__c'){
                        sObj.ER_Street_additionnal__c = component.get('v.LocAgg'); 
                    }
                    else{
                        sObj.IT_Additional_Locality__c = component.get('v.LocAgg'); 
                    }
                }
                else{
                    if(component.get('v.opportunityType') == 'Billing'){
                        sObj.IT_State_Code__c = '0';
                        sObj.IT_Billing_State_Description__c = 'ESTERO';
                        sObj.IT_State_Province__c = '  ';
                        sObj.IT_City_Code__c = '0';
                        sObj.IT_City__c = component.get('v.esteroCity');
                        sObj.IT_Hamlet__c = null;
                        sObj.IT_Hamlet_Code__c = null;
                        sObj.IT_Zip_Code__c = "00000";
                        sObj.IT_Street__c = component.get('v.esteroStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_GeoRef_Loc_X__c = '0';
                        sObj.IT_GeoRef_Loc_Y__c = '0';
                        sObj.IT_MetRef_Loc_X__c = '0';
                        sObj.IT_MetRef_Loc_Y__c = '0';
                        sObj.IT_Toponym__c = component.get('v.toponym');
                        sObj.IT_Region_Code__c = '0';
                        sObj.IT_Street_Code__c = '0';
                    }
                    else{
                        sObj.IT_Shipping_State_Code__c = '0';
                        sObj.IT_Shipping_State_Description__c = 'ESTERO';
                        sObj.IT_ShippingState__c = '  ';
                        sObj.IT_Shipping_City_Code__c = '0';
                        sObj.IT_ShippingCity__c = component.get('v.esteroCity');
                        sObj.IT_Shipping_Hamlet__c = null;
                        sObj.IT_shipping_Hamlet_Code__c = null;
                        sObj.IT_shippingPostalCode__c = "00000";
                        sObj.IT_ShippingStreet__c = component.get('v.esteroStreet') + ', ' + component.get("v.Civico").toUpperCase();
                        sObj.IT_ShippingLatitude__c = '0';
                        sObj.IT_ShippingLongitude__c = '0';
                        sObj.IT_Shipping_Toponym__c = component.get('v.toponym');
                        sObj.IT_Shipping_MetRef_Loc_X__c = '0';
                        sObj.IT_Shipping_MetRef_Loc_Y__c = '0';
                        sObj.IT_Shipping_Region_Code__c = '0';
                        sObj.IT_Shipping_Street_Code__c = '0';
                    }
                }
                console.log('SUBMITTEDADDRESS:: '+JSON.stringify(sObj));
                var action = component.get("c.insertAndAssociateAddress");
                action.setParams({
                    "obj" : sObj
                })
                action.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        component.set('v.setVisiblity', false);
                        console.log('VISIBILITY');
                        console.log('SUCCESS');
                        var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "type":"success",
                                "title": "Salvato",
                                "message": "Salvataggio avvenuto con successo!"
                            });
                            toastEvent.fire();
    
                        $A.get("e.force:closeQuickAction").fire();
                        $A.get('e.force:refreshView').fire();
      
                    }
                    else{
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "type":"error",
                            "title": "Ops!",
                            "message": "Qualcosa è andato storto: "+JSON.stringify(response.getError())
                        });
                        toastEvent.fire();
                    }
                });
                $A.enqueueAction(action);
                
            }
            
        // SOLO ESTERO //
        	}catch(e){
                   helper.alert(component, event, helper, 'error', '', e.message);
                   console.error("Error: " + e);
               
           }
        
        
    },
   
   provinceChangeStradarioFOCUS: function (component, event, helper) {
       //when a value is selected, apex automatically populates the next picklist
       console.log('WRAPPROVINCESTART:: ' + event);
       var provinceRef = component.get('v.provinceWrap').split('§');
       console.log('PROVINCEREF SIZE:: '+provinceRef.length);
       //component.set('v.regionRef' , provinceRef[2]);
       console.log('WRAPPROVINCE:: '+provinceRef);
       var action = component.get('c.getMunicipalitiesStradario');
       console.log('IN1');
       action.setParams({
           "provinceRef" : provinceRef[0],
           "cityPattern" : ""
       })
       action.setCallback(this, function(response) {
           console.log('IN');
           console.log('PROVINCE CODE: '+provinceRef);
           if (response.getState() == "SUCCESS") {
               var stage = response.getReturnValue();
               //console.log('RESPONSE '+stage.toString());
               var returnMap = [];
               var responso = JSON.parse(stage);
               console.log('RESPONSE PARSATA');
               //if(responso != null && responso != undefined && responso.length > 0){
                  var provinces = responso.data;
                   if(provinces != null && provinces != undefined){
                        provinces.forEach(function(element) {
                            //returnMap.push(element.province_ref , element.name_display);
                            returnMap.push({'key' : element.municipality_ref , 'value' : element.name});  
                        });
                        component.set('v.municipalityMap' , returnMap);
                   } 
               //}
               
               //component.set ('v.hmacString' ,stage.toString() );
               //***ADD PREPOPULATION ONCE IT_ADDRESS IS GONE***
           }
           else if(state === 'ERROR'){
               var errors = resp.getError();
               for(var i = 0 ;i < errors.length;i++){
                   console.log(errors[i].message);
               }
           }
       });
       $A.enqueueAction(action);
       
   },
   
    aggiornaProvincia: function (component, event, helper) {
        //component.set('v.provinceKey' , '38000000093');
        component.set('v.cityKey' , '38000002611');
        /*component.set('v.provinceWrap' , component.get('v.flowProvinceCode') + '§' + component.get('v.flowProvince') + '§' + component.get('v.flowRegionRef'));
        component.find("provinceList").set("v.text", component.get('v.flowProvince'));
        component.find("provinceList").set("v.value", component.get('v.flowProvinceCode') + '§' + component.get('v.flowProvince') + '§' + component.get('v.flowRegionRef'));
        component.find('provinceList').focus();*/
    },
   
   timeoutStreets: function (component, event, helper) {
       window.setTimeout(function(){ component.set('v.streetBoolean' , true); }, 250);  
   },
    
})