({
	doInit : function(component, event, helper) {
		console.log('loaded');
        const recordId = component.get('v.recordId');
        console.log('recordId',recordId);
		
		component._set = function(value){
			for(let index in value) this.set(`v.${index}`, value[index]);
		}

		const urlTemplates = $A.get("{!$Resource.kamEngineTemplates}");
		helper.kam = new window.$K();
		
		const rows = component.get('v.rows');
		const columns = component.get('v.columns');

		helper.kam.hook({
			baseUrl: `${window.location.origin}${urlTemplates}`,
			renderArea: {
				rows,
				columns
			}
		});

		const template = component.get('v.template');

		helper.kam.loadExcel(template).then((workbook) => {
			return helper.updateContext(component, helper);
		}).then((response)=>{
			const result = response.getReturnValue();
			if(!result.isSuccess) throw new Error(result.errorMessage);

			helper.applyContext(component, helper, result.sObjectData);
		}).finally(()=>{
			component._set({spinner: false})
		})
			

		console.log(helper.kam);
    	helper.invokeCheckExcel(component,helper,recordId);
	},
	onGeneratePdf: function(component, event, helper){
		const recordId = component.get('v.recordId');
		
		const formData = component.get('v.form');
		helper.kam.applyForm(formData.fields);
		
		const templateData = helper.kam.getTemplateData();
		console.log('templateData', templateData);

		component._set({spinner: true})
		helper.applyMiddle(component, helper).then(()=>{
			return helper.invokeGenerateContext(component, helper, templateData, recordId);
		}).then((response)=>{
			const result = response.getReturnValue();
			if(!result.isSuccess) throw new Error(result.errorMessage);
			console.log(result);

			const attachmentId = result.attachmentTempId;
            if(component.get('v.createExcel')){
            	return helper.invokeGenerateExcel(component, helper, recordId, attachmentId);
        	}else{
                return helper.invokeGeneratePdf(component, helper, recordId, attachmentId);
            }
			
		}).then((response)=>{
			const result = response.getReturnValue();
			if(!result.isSuccess) throw new Error(result.errorMessage);

			console.log(result);
			
            if(!component.get('v.createExcel')){
                window.open('/apex/VFIT00_KamPdf?id=' + result.attachmentTempId);
            }
			
		}).finally(()=>{
			component._set({spinner: false})
		})
	},
	onDebug: function(component, event, helper){
		const templateData = helper.kam.getTemplateData(36, 5);
		
		const formData = component.get('v.form');
		helper.kam.applyForm(formData.fields);

		helper.applyMiddle(component, helper).then(()=>{
			const source = helper.kam.sourceData;

			component._set({
				debugJson: JSON.stringify({source}, null, 2),
				showDebug: true
			});
		});
	},
	onUpload: function (component, event, helper) {
		const auraElement = component.find("uploadFile");

		if(auraElement.elements.length > 0){
			const domElement = auraElement.elements[0];
			domElement.click();
		}

	},
	onChangeFile: function (component, event, helper) {
		if(event.currentTarget.files.length > 0){
			const file = event.currentTarget.files[0];
			event.currentTarget.value = '';

			component._set({spinner: true})

			helper.kam.loadExcelBlob(file).then((workbook)=>{
				return helper.updateContext(component, helper);
			}).then((response)=>{
				const result = response.getReturnValue();
				if(!result.isSuccess) throw new Error(result.errorMessage);

				helper.applyContext(component, helper, result.sObjectData);
			}).finally(()=>{
				component._set({spinner: false})
			});
		}
	},
	onPreview: function(component, event, helper) {
		component._set({showPreview: true});

		setTimeout(()=>{
			const auraElement = component.find("preview");

			if(auraElement && auraElement.elements.length > 0){
				const domElement = auraElement.elements[0];

				const formData = component.get('v.form');
				helper.kam.applyForm(formData.fields);

				helper.applyMiddle(component, helper).then(()=>{
					helper.kam.hookPreview(domElement);
				});
			}
		}, 200);
	},
	onClose: function (component, event, helper) {
		component._set({showDebug: false, showPreview: false});
	}
})