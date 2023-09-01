({
    /**
     * On initialization of this component, set the prechatFields attribute and render pre-chat fields.
     * 
     * @param cmp - The component for this state.
     * @param evt - The Aura event.
     * @param hlp - The helper for this state.
     */
	onInit: function(cmp, evt, hlp) {
        // Get pre-chat fields defined in setup using the prechatAPI component
		var prechatFields = cmp.find("prechatAPI").getPrechatFields();
        // Get pre-chat field types and attributes to be rendered
        var prechatFieldComponentsArray = hlp.getPrechatFieldAttributesArray(prechatFields);

        const url = window.location.href;

        console.log(url);

        let anchorLink;


        switch(url)
        {
            /*case 'https://acquista.edenred.it/ticketrestaurant/':
                anchorLink = 'https://repo.edenred.it/Informativa/Informativa_acquista.ticketrestaurant.pdf';
                break;

            case 'https://testacquista.edenred.it/':
                anchorLink = 'https://repo.edenred.it/Informativa/Informativa_acquista.ticketrestaurant.pdf';
                break;

            case 'https://acquista.ticketrestaurant.it/':
                anchorLink = 'https://repo.edenred.it/Informativa/Informativa_eshop_.pdf';
                break;

            case 'https://testacquista.ticketrestaurant.it/':
                anchorLink = 'https://repo.edenred.it/Informativa/Informativa_eshop_.pdf';
                break;*/

            default:
                anchorLink = 'https://www.edenred.it/area-legale-e-privacy/'
                break;
        }

        cmp.set('v.anchorLink', anchorLink)
        
        // Make asynchronous Aura call to create pre-chat field components
        $A.createComponents(
            prechatFieldComponentsArray,
            function(components, status, errorMessage) {
                if(status === "SUCCESS") {
                    cmp.set("v.prechatFieldComponents", components);
                }
            }
        );
    },

    VATNumberChangedHandler: function(component, event, helper)
    {
        let inputField = component.find('ER_VAT_Number__c');
        let value = inputField.get('v.value');
        if(value.length != 11 || isNaN(value))
        {
            inputField.setCustomValidity("La partita IVA deve essere 11 caratteri numerici");
            inputField.reportValidity();
        }
        else
        {
            inputField.setCustomValidity("");
            inputField.reportValidity();
        }
    },

    EmailChangedHandler: function(component, event, helper)
    {
        let inputField = component.find('Email');
        let value = inputField.get('v.value');

        if(!RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').test(value))
        {
            console.log('boh')
            inputField.setCustomValidity("Inserire un indirizzo email valido");
            inputField.reportValidity();
        }
        else
        {
            inputField.setCustomValidity("");
            inputField.reportValidity();
        }
    },

    PhoneChangedHandler: function(component, event, helper)
    {
        let inputField = component.find('Phone');
        let value = inputField.get('v.value');

        /*
            console.log(!(8 <= value.length && value.length <= 18))
            console.log(isNaN(parseInt(value)))


            console.log(!(8 <= value.length && value.length <= 18) || isNaN(parseInt(value)));

            console.log('-----------------------------------');
        */
       
        if(!(8 <= value.length && value.length <= 18) || isNaN(value))
        {
            inputField.setCustomValidity("Inserire un numero di telefono valido");
            inputField.reportValidity();
        }
        else
        {
            inputField.setCustomValidity("");
            inputField.reportValidity();
        }
    },
    
    onChangeHandled: function(component, event, helper)
    {
        let valid = 
        (component.find('Phone').get('v.validity').valid && component.find('Phone').get('v.value'))
        &&
        (component.find('Email').get('v.validity').valid && component.find('Email').get('v.value'))
        &&
        component.get('v.leadPrivacy');

        component.set('v.disabledAttr', !valid);
    },

    /**
     * Event which fires when start button is clicked in pre-chat
     * 
     * @param cmp - The component for this state.
     * @param evt - The Aura event.
     * @param hlp - The helper for this state.
     */
    onStartButtonClick: function(component, event, helper) {
        //handling errors

        helper.startChat(component, event, helper);
    }
});