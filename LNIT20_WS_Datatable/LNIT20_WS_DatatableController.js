({
    doInit : function(cmp, event, helper) {
        //set columns
        helper.getColumns( cmp, event );
        helper.updateTable( cmp, event );
        
        /*var fetchData = [{
            cod_cli: "234536",
            num_ord : "1",
            num_fatt : "1",
            data_emiss : new Date(),
            date_from : new Date()
        },
		{
            cod_cli: "763446",
            num_ord : "2",
            num_fatt : "2",
            data_emiss : new Date(),
            date_from : new Date()
        },
		{
            cod_cli: "938575",
            num_ord : "3",
            num_fatt : "3",
            data_emiss : new Date(),
            date_from : new Date()
        },
		{
            cod_cli: "323435",
            num_ord : "4",
            num_fatt : "4",
            data_emiss : new Date(),
            date_from : new Date()
        }];
        
        cmp.set("v.data", fetchData );*/
        
    },
    
    refreshTable : function(cmp, event, helper) {
        helper.updateTable( cmp, event );
    },
    
    getBarcode :function(cmp,event,helper){
		helper.getDocument(cmp,event,helper);
    },
    
    exitModal : function(cmp,event,helper){
        cmp.set("v.isModalOpen",false);
    }
    
    
    
})