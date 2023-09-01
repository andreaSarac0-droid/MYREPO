({
	/**
	 * Map of pre-chat field label to pre-chat field name (can be found in Setup)
	 */
	fieldLabelToName: {
        "First Name": "FirstName",
        "Last Name": "LastName",
        "Email": "Email",
        "Phone": "Phone",
        "Fax": "Fax",
        "Mobile": "MobilePhone",
        "Home Phone": "HomePhone",
        "Other Phone": "OtherPhone",
        "Asst. Phone": "AssistantPhone",
        "Title": "Title",
        "Lead Source": "LeadSource",
        "Assistant": "AssistantName",
        "Department": "Department",
        "Subject": "Subject",
        "Case Reason": "Reason",
        "Type": "Type",
        "Web Company": "SuppliedCompany",
        "Web Phone": "SuppliedPhone",
        "Priority": "Priority",
        "Web Name": "SuppliedName",
        "Web Email": "SuppliedEmail",
        "Company": "Company",
        "Industry": "Industry",
        "Rating": "Rating"
    },

	/**
	 * Event which fires the function to start a chat request (by accessing the chat API component)
	 *
	 * @param cmp - The component for this state.
	 */
    startChat: function(component, event, helper)
    {
        var fields = 
        [
            {
                label: 'Nome',
                name: 'FirstName',
                value: '-'
            },
            {
                label: 'Cognome',
                name: 'LastName',
                value: '-'
            },
            {
                label: 'Email',
                name: 'Email',
                value: component.get('v.leadEmail')
            },
            /*{
                label: 'Partita IVA',
                name: 'ER_VAT_Number__c',
                value: component.get('v.leadVAT')
            },
            {
                label: 'Ragione Sociale',
                name: 'Company',
                value: component.get('v.leadCompany')
            },*/
            {
                label: 'Telefono',
                name: 'Phone',
                value: component.get('v.leadPhone')
            }
        ]

        console.log(component.get('v.leadPrivacy'))

        if(component.get('v.leadPrivacy'))
        {
            console.log('Privacy True');
            if(component.find("prechatAPI").validateFields(fields).valid) 
            {
                var event = new CustomEvent(
                    "setCustomField",
                    {
                        detail: {
                            callback: component.find("prechatAPI").startChat.bind(this, fields),
                            customFields: fields
                        }
                    }
                );
                // Dispatch the event.
                document.dispatchEvent(event);
            }
            else 
            {
                console.warn("Prechat fields did not pass validation!");
            }
        }
        else
        {
            console.log('Privacy False')
        }
            
	},

	/**
	 * Create an array of field objects to start a chat from an array of pre-chat fields
	 * 
	 * @param fields - Array of pre-chat field Objects.
	 * @returns An array of field objects.
	 */
	createFieldsArray: function(fields) {
		if(fields.length) {
			return fields.map(function(fieldCmp) {
				return {
					label: fieldCmp.get("v.label"),
					value: fieldCmp.get("v.value"),
					name: this.fieldLabelToName[fieldCmp.get("v.label")]
				};
			}.bind(this));
		} else {
			return [];
		}
	},
    
    /**
     * Create an array in the format $A.createComponents expects
     * 
     * Example:
     * [["componentType", {attributeName: "attributeValue", ...}]]
     * 
	 * @param prechatFields - Array of pre-chat field Objects.
	 * @returns Array that can be passed to $A.createComponents
     */
    getPrechatFieldAttributesArray: function(prechatFields) {
        // $A.createComponents first parameter is an array of arrays. Each array contains the type of component being created, and an Object defining the attributes.
        var prechatFieldsInfoArray = [];

        // For each field, prepare the type and attributes to pass to $A.createComponents
        prechatFields.forEach(function(field) {
            var componentName = (field.type === "inputSplitName") ? "inputText" : field.type;
            var componentInfoArray = ["ui:" + componentName];
            var attributes = {
                "aura:id": "prechatField",
                required: field.required,
                label: field.label,
                disabled: field.readOnly,
                maxlength: field.maxLength,
                class: field.className,
                value: field.value
            };
            
            // Special handling for options for an input:select (picklist) component
            if(field.type === "inputSelect" && field.picklistOptions) attributes.options = field.picklistOptions;
            
            // Append the attributes Object containing the required attributes to render this pre-chat field
            componentInfoArray.push(attributes);
            
            // Append this componentInfoArray to the fieldAttributesArray
            prechatFieldsInfoArray.push(componentInfoArray);
        });

        return prechatFieldsInfoArray;
    }
});