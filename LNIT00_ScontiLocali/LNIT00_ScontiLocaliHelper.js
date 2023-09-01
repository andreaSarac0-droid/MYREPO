({
    invokeGetSconti: function(component, event, helper, recordId, gruppo) {
        var dataPast = [];
        var dataPresent = [];
        var dataFuture = [];
        var gruppoBase = [];
        var gruppoNonBase = [];
        var toElaborate = [];
        var service = [];
        var today = new Date() //.toJSON().slice(0,10);
        let flgInz = false;
        let flgFind = false;
        var newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0, 0);
        var isoDate = newDate.toISOString();
        console.log('today: ', isoDate);

        const action = component.get("c.getSconti");

        action.setParams({ recordId });
        action.setCallback(this, (response) => {
            const state = response.getState();
            console.log('state', state);
            if (state === 'SUCCESS') {
                console.log('response', response);

                var scontiLocali = response.getReturnValue();
                if (scontiLocali) {
                    var parsed = JSON.parse(scontiLocali).data;
                    console.log('sconti', parsed);
                    component.set("v.data", (JSON.parse(scontiLocali)).data);
                    //Group by economic_group_ref BASE / not BASE
                    parsed.forEach(d => {
                        if (d.economic_group_ref === '000000') {
                            gruppoBase.push(d);
                        } else {
                            gruppoNonBase.push(d);
                        }
                    });
                    if (gruppo) {
                        parsed = gruppoBase;
                    } else {
                        parsed = gruppoNonBase;
                    }
                    // Group by dates:
                    // less than today > data past
                    // greater than today > data future
                    // the most recent among past dates for each type of service > data present      
                    for (let i = 0; i < parsed.length; i++) {
                        if (parsed[i].effective_date > isoDate) {
                            dataFuture.push(parsed[i]);
                        } else {
                            toElaborate.push(parsed[i]);
                        }
                    }
                    console.log("toElaborate ", toElaborate); //ttt
                    toElaborate.forEach(tt => {
                        console.log(tt.service_ref, tt.economic_group_desc, tt.service_desc, tt.effective_date);
                    });

                    if (toElaborate.length > 0) {
                        for (let i = 0; i < toElaborate.length; i++) {
                            if (!service.includes(toElaborate[i].service_ref)) {
                                service.push(toElaborate[i].service_ref);
                            }
                        }
                        service.sort();
                        // console.log("***service ", service);
                        for (let i = 0; i < service.length; i++) {
                            console.log("***Service elab ", service[i]);
                            var sameService = [];
                            for (let j = 0; j < toElaborate.length; j++) {
                                if (service[i] == toElaborate[j].service_ref) {
                                    console.log(j, toElaborate[j].effective_date, toElaborate[j].service_desc,
                                        toElaborate[j].economic_group_desc, toElaborate[j].service_ref);
                                    sameService.push(toElaborate[j]);
                                }
                            }
                            let tmp = sameService.sort(function(a, b) { //sort by date
                                var keyA = new Date(a.effective_date),
                                    keyB = new Date(b.effective_date);
                                // Compare the 2 dates
                                if (keyA > keyB) return -1;
                                if (keyA < keyB) return 1;
                                return 0;
                            });

                            if (!flgInz) {
                                dataPresent.push(tmp[0]);
                                tmp.shift();
                                flgInz = true;
                            }
                            for (let t = 0; t < tmp.length; t++) {
                                // console.log('tmp for5 ', t, tmp[t].service_ref, tmp[t].economic_group_desc, tmp[t].service_desc, tmp[t].economic_group_ref, tmp[t].effective_date);
                                flgFind = false;
                                for (let pp = 0; pp < dataPresent.length; pp++) {
                                    // console.log('pres for5 ', pp, dataPresent[pp].service_ref, dataPresent[pp].economic_group_desc, dataPresent[pp].economic_group_ref, dataPresent[pp].effective_date);
                                    if (dataPresent[pp].service_ref == tmp[t].service_ref && dataPresent[pp].economic_group_desc == tmp[t].economic_group_desc) {
                                        flgFind = true;
                                        break;
                                    }
                                }
                                if (flgFind) {
                                    // console.log('dataPast.push ', tmp[t]);
                                    dataPast.push(tmp[t]);
                                } else {
                                    // console.log('dataPresent.push ', tmp[t]);
                                    dataPresent.push(tmp[t]);
                                }
                            }
                        }
                    }
                    // console.log('Data Past', dataPast);
                    // console.log('Data Present', dataPresent);
                    // console.log('Data Future', dataFuture);

                    component.set("v.data_past", dataPast);
                    component.set("v.data_present", dataPresent);
                    component.set("v.data_future", dataFuture);
                }

            } else {
                var errors = response.getError();
                let message = 'Error: '; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message += errors[0].message;
                }
                console.error('errors', message);
            }
        });

        $A.enqueueAction(action);
    },
    sortData_past: function(cmp, fieldName, sortDirection) {
        console.error('sortData_past'); //ttt
        var dataToSort = cmp.get("v.data_past");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.data_past", dataToSort);
    },
    sortData_present: function(cmp, fieldName, sortDirection) {
        console.error('sortData_present'); //ttt
        var dataToSort = cmp.get("v.data_present");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.data_present", dataToSort);
    },
    sortData_future: function(cmp, fieldName, sortDirection) {
        var dataToSort = cmp.get("v.data_future");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        dataToSort.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.data_future", dataToSort);
    },
    sortBy: function(field, reverse, primer) {
        var key = primer ? function(x) { return primer(x[field]) } : function(x) { return x[field] };
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function(a, b) {
            return a = key(a) ? key(a) : '', b = key(b) ? key(b) : '', reverse * ((a > b) - (b > a));
        }
    },

    getDocument: function(component, event, helper) {
        var row = event.getParam("row");
        var barcodeRow = row.barcode_contract;
        console.log(barcodeRow);
        var action = component.get("c.getDocumentFromBarcode");
        action.setParams({ barcode: barcodeRow });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var docId = action.getReturnValue();
                console.log("Il tuo docId vale:" + docId);
                if (docId == null) {
                    component.set("v.isModalOpen", true);
                    console.log("Documento non trovato");
                    //alert("Non è stato trovato nessun documento associato a questo barcode:  "+ cmp.get("v.recordBarcode"));
                }
                if (docId != null) {
                    window.open("/lightning/r/" + docId + "/view", "_self");
                    console.log("Document retrieved!");
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                        //component.set("v.isModalOpen",true);
                        //alert("Non è stato trovato nessun documento associato a questo barcode:  "+ cmp.get("v.recordBarcode"));
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})