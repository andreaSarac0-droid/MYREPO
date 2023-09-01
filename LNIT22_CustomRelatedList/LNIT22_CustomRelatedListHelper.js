({  
	showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },

    /* 
     * reload data table
     * */
    reloadDataTable : function(){
    var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent){
            refreshEvent.fire();
        }
    },
    init : function(cmp,event,helper){
        let nomeObj = cmp.get('v.NomeOggetto');
        let nomeLookup = cmp.get('v.CampoLookup');
        let orderBy = cmp.get('v.OrderBy');
        let orderDirection = cmp.get('v.OrderDirection');
        let recId = cmp.get('v.recordId');
		let whereCondition =  cmp.get('v.whereCondition') === undefined || cmp.get('v.whereCondition')=== '' ? ' ' : 'AND '+ cmp.get('v.whereCondition');
		let altralookup = cmp.get('v.AltraLookup');
        var vas = false;
        console.log('nomeObj '+nomeObj);
        console.log('recId '+recId);
        if(nomeObj === 'zqu__QuoteRatePlanCharge__c'){
            var vasQuote = cmp.get('c.getVas');
            vasQuote.setParams({
                'recId':recId
            });
            console.log('params');
            vasQuote.setCallback(this, (response)=>{
				let state = response.getState();
                console.log('state '+state);
                if (state == 'SUCCESS') {
                	vas = response.getReturnValue();
                 	console.log('vas '+vas);
                	let listData;
                     let doList = cmp.get('c.doList');
                        doList.setParams({
                            'NomeOggetto':nomeObj,
                            'NomeLookup':nomeLookup, 
                            'recId':recId, 
                            'limite': cmp.get('v.NumeroColonne'), 
                            'whereCondition':whereCondition,
                            'altraLookup':altralookup,
                            'vas':vas
                        });
                        doList.setCallback(this, (response)=> { 
                            let state = response.getState();
                            console.log(state);
                            if (state == 'SUCCESS') { 
                                let data = response.getReturnValue();
                                
                                listData = data;
                                console.log('DATA:: '+JSON.stringify(data));
                                cmp.set('v.data',listData);
                                if(orderBy != ''){
                                    cmp.set("v.sortedBy", orderBy);
                                    helper.sortData(cmp,cmp.get("v.sortedBy"),orderDirection);
                                    console.log('ordina per',cmp.get("v.sortedBy"));
                                }
                            } 
                                          
                         }); 
                        
                       $A.enqueueAction(doList);  
                   let listColumns;
                   let actions = [{ label: 'View', name: 'view'}]; 
                   let doColumns = cmp.get('c.doColumns');
                    doColumns.setParams({'NomeOggetto':nomeObj,'limite': cmp.get('v.NumeroColonne'),'ReadOnly':cmp.get('v.ReadOnly'),'vas':vas});
                    doColumns.setCallback(this, (response)=> { 
                        let state = response.getState();
                        console.log(state);
                        if (state == 'SUCCESS') { 
                            let columns = response.getReturnValue();
                                
                            console.log(JSON.stringify(columns));
                        
                            listColumns = columns;
            
                            console.log(cmp.get('v.BottoneOFreccetta'));
                    		console.log(JSON.stringify(columns));
                            if(cmp.get('v.BottoneOFreccetta')=== false){listColumns.push({ type: 'action', typeAttributes: { rowActions: actions }})}
                                cmp.set('v.columns',listColumns);
                            }                        
                     }); 
                   $A.enqueueAction(doColumns);
            
                    let action = cmp.get('c.getTypes');
                    action.setParams({'NomeOggetto':nomeObj,'limite':cmp.get('v.NumeroColonne')});
                    
                    action.setCallback(this, (response)=> { 
                        let state = response.getState();
                        console.log(state);
                        if (state == 'SUCCESS') { 
                            var resp = response.getReturnValue();
                            
                            cmp.set('v.columnTypes',resp);
                        }
                        else{
                            console.error(JSON.stringify(response.getError()));
                                   
                        }
                     }); 
                   $A.enqueueAction(action);
            	}
                
			});            
			$A.enqueueAction(vasQuote);
        }else{
            let listData;
            let doList = cmp.get('c.doList');
            doList.setParams({
                'NomeOggetto':nomeObj,
                'NomeLookup':nomeLookup, 
                'recId':recId, 
                'limite': cmp.get('v.NumeroColonne'), 
                'whereCondition':whereCondition,
                'altraLookup':altralookup,
                'vas':vas
            });
            doList.setCallback(this, (response)=> { 
                let state = response.getState();
                console.log(state);
                if (state == 'SUCCESS') { 
                let data = response.getReturnValue();
                
                listData = data;
                console.log('DATA:: '+JSON.stringify(data));
                cmp.set('v.data',listData);
                if(orderBy != ''){
                    cmp.set("v.sortedBy", orderBy);
                    helper.sortData(cmp,cmp.get("v.sortedBy"),orderDirection);
                    console.log('ordina per',cmp.get("v.sortedBy"));
            	}
             } 
                               
            }); 
            
            $A.enqueueAction(doList);  
           let listColumns;
           let actions = [{ label: 'View', name: 'view'}]; 
           let doColumns = cmp.get('c.doColumns');
            doColumns.setParams({'NomeOggetto':nomeObj,'limite': cmp.get('v.NumeroColonne'),'ReadOnly':cmp.get('v.ReadOnly'),'vas':vas});
            doColumns.setCallback(this, (response)=> { 
                let state = response.getState();
                console.log(state);
                if (state == 'SUCCESS') { 
                    let columns = response.getReturnValue();
                        
                    console.log(JSON.stringify(columns));
                
                    listColumns = columns;
    
                    console.log(cmp.get('v.BottoneOFreccetta'));
            console.log(JSON.stringify(columns));
                    if(cmp.get('v.BottoneOFreccetta')=== false){listColumns.push({ type: 'action', typeAttributes: { rowActions: actions }})}
                        cmp.set('v.columns',listColumns);
                    }                        
             }); 
           	$A.enqueueAction(doColumns);
    
            let action = cmp.get('c.getTypes');
            action.setParams({'NomeOggetto':nomeObj,'limite':cmp.get('v.NumeroColonne')});
            
            action.setCallback(this, (response)=> { 
                let state = response.getState();
                console.log(state);
                if (state == 'SUCCESS') { 
                    var resp = response.getReturnValue();
                    
                    cmp.set('v.columnTypes',resp);
                }
                else{
                    console.error(JSON.stringify(response.getError()));
                           
                }
             }); 
           $A.enqueueAction(action);
        }
      
       	
    } ,
    doListMethod : function(cmp,event,nomeObj,nomeLookup,recId,whereCondition,altralookup,orderBy,orderDirection,vas){ 
        console.log('doListMethod');
    		let listData;
            let doList = cmp.get('c.doList');
            doList.setParams({
                'NomeOggetto':nomeObj,
                'NomeLookup':nomeLookup, 
                'recId':recId, 
                'limite': cmp.get('v.NumeroColonne'), 
                'whereCondition':whereCondition,
                'altraLookup':altralookup,
                'vas':vas
            });
            doList.setCallback(this, (response)=> { 
                let state = response.getState();
                console.log(state);
                if (state == 'SUCCESS') { 
                    let data = response.getReturnValue();
                	
                    listData = data;
                	console.log('DATA:: '+JSON.stringify(data));
                    cmp.set('v.data',listData);
                    if(orderBy != ''){
                		cmp.set("v.sortedBy", orderBy);
                        helper.sortData(cmp,cmp.get("v.sortedBy"),orderDirection);
                        console.log('ordina per',cmp.get("v.sortedBy"));
                    }
                } 
                              
             }); 
            
           $A.enqueueAction(doList);  
    },
    doColumnsMethod : function(cmp,event,nomeObj,vas){ 
        console.log('doColumns');
        var listColumns;
        var doColumns = cmp.get('c.doColumns');
        doColumns.setParams({'NomeOggetto':nomeObj,'limite': cmp.get('v.NumeroColonne'),'ReadOnly':cmp.get('v.ReadOnly'),'vas':vas});
        console.log('doColumns '+doColumns);
        
        doColumns.setCallback(this, (response)=> { 
            console.log('state doColumns 1' +response.getState());
            var state = response.getState();
            console.log('state doColumns ' +state);
            if (state == 'SUCCESS') { 
                var columns = response.getReturnValue();
                	
            	console.log('columns '+JSON.stringify(columns));
            
            	listColumns = columns;

        		console.log(cmp.get('v.BottoneOFreccetta'));
        		//console.log(JSON.stringify(columns));
            	if(cmp.get('v.BottoneOFreccetta')=== false){
            		listColumns.push({ type: 'action', typeAttributes: { rowActions: actions }})
    			}
					
                cmp.set('v.columns',listColumns);
                console.log('listColumns ' +cmp.get('v.columns'));
        	}   
            console.log('listColumns ' +cmp.get('v.columns'));
         }); 
       $A.enqueueAction(doColumns);
    },
    sortData: function (cmp, fieldName, sortDirection) {
         var dataToSort = cmp.get("v.data");
        console.log('dataToSort',JSON.stringify(dataToSort));
         var reverse = sortDirection !== 'asc';
         //sorts the rows based on the column header that's clicked
         dataToSort.sort(this.sortBy(fieldName, reverse))
         console.log('data sorted',JSON.stringify(dataToSort));
         cmp.set("v.data", dataToSort);
     },
 	sortBy: function (field, reverse, primer) {
         var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
         //checks if the two rows should switch places
         reverse = !reverse ? 1 : -1;
         return function (a, b) {
             return a = key(a)?key(a):'', b = key(b)?key(b):'', reverse * ((a > b) - (b > a));
     	}
    }
    
})