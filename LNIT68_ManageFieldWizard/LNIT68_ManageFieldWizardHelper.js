({ 
	// come first init
	callAgreementsAffi: function (component, objId, objName) {
		console.log('SONO IN callAgreementsAffi');
		var inputStringId = objId;
		var inputStringName = objName;

		var action = component.get("c.RetriveInfo");
		action.setParams({
			"idObject": inputStringId,
			"nameObject": inputStringName
		})
		action.setCallback(this, function (response) {
			// console.log('SONO IN setCallback');

			if (response.getState() == "SUCCESS") {
				// console.log('response.getState():: ' + response.getState());
				component.set('v.loaded', true);
				var responseListContact = response.getReturnValue();
				// console.log('responseListContact:: ' + JSON.stringify(responseListContact));
				var responseListData = responseListContact.data;
				// console.log('responseListData:: ' + JSON.stringify(responseListData));
				const wrapperTemp = JSON.parse(JSON.stringify(responseListData));
				// console.log('wrapperTemp:: ' + JSON.stringify(wrapperTemp[0]));

				const tuttoZero = [];
				var lenwrapperTemp = wrapperTemp.length;
				if (lenwrapperTemp == 2) {
					console.log('SONO NEL 2:: ');
					component.set('v.dataFirst', wrapperTemp[0]);
					component.set('v.dataLast', wrapperTemp[1]);

					console.log('dataFirst:: ' + JSON.stringify(wrapperTemp[0]));
					console.log('dataLast:: ' + JSON.stringify(wrapperTemp[1]));

				} else if (lenwrapperTemp == 3) {
					console.log('SONO NEL 3');
					wrapperTemp[0].above_threshold_fee = '';
					wrapperTemp[0].below_threshold_fee = '';
					wrapperTemp[0].above_threshold_fee_percentage = '';
					wrapperTemp[0].below_threshold_fee_percentage = '';
					wrapperTemp[0].threshold = '';
					tuttoZero.above_threshold_fee = '-';
					tuttoZero.below_threshold_fee = '-';
					tuttoZero.above_threshold_fee_percentage = '-';
					tuttoZero.below_threshold_fee_percentage = '-';
					tuttoZero.threshold = '-';
					component.set('v.dataFirst', tuttoZero);
					component.set('v.dataLast', wrapperTemp[0]);
				} else {
					console.log('SONO NELL ELSE');
					component.set('v.dataFirst', responseListData);
					console.log('responseListData else::', responseListData);
					wrapperTemp[0].above_threshold_fee = '';
					wrapperTemp[0].below_threshold_fee = '';
					wrapperTemp[0].above_threshold_fee_percentage = '';
					wrapperTemp[0].below_threshold_fee_percentage = '';
					wrapperTemp[0].threshold = '';
					component.set('v.dataLast', wrapperTemp);
				}

				// console.log("callAgreementsAffi Option1 2: " + component.get('v.Option1True') + ' *** ' + component.get('v.Option2True'));
				// console.log("********::" +
				// 	wrapperTemp[1].threshold + wrapperTemp[1].below_threshold_fee + wrapperTemp[1].below_threshold_fee_percentage )
				
				// test op dflt
				if (wrapperTemp[1].threshold || wrapperTemp[1].below_threshold_fee || wrapperTemp[1].below_threshold_fee_percentage){
					component.set('v.value', 'option2');
					// console.log("********:22:" )
					component.set("v.Option1True", false);
					component.set("v.Option2True", true);
				}

				// 	console.log("***:prima:" )
				// testfieldBlank(component);
				// 	console.log("***:dopo" )
				
			}
		})

		$A.enqueueAction(action);
	},

	// come button Default
	callDefaultField: function (component, objId) {

		var inputStringId = objId;
		var inputOption = component.get("v.Option2True");
		var action = component.get("c.CreateCallAgreementsMetadata");
		action.setParams({
			"idObject": inputStringId,
			"iOption": inputOption
		})
		action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
				console.log('response.getState():: '+response.getState());

				component.set('v.loaded', true);
				var responseListContact = response.getReturnValue();
				var responseListData = responseListContact.data;

				// console.log('responseListDataLAST:11: ' + JSON.stringify(responseListData));
				// console.log('callDefaultField:1:' + component.get("v.Option1True") + component.get("v.Option2True") + component.get("v.value") );
				if (component.get("v.value") == 'option1' ) {
					delete responseListData[0].threshold;
					delete responseListData[0].below_threshold_fee;
					delete responseListData[0].below_threshold_fee_percentage;

					var cmpTarget3 = component.find('lname3');
					$A.util.removeClass(cmpTarget3, 'sp_inpBgYel');
					var cmpTarget4 = component.find('lname4');
					$A.util.removeClass(cmpTarget4, 'sp_inpBgYel');
					var cmpTarget5 = component.find('lname5');
					$A.util.removeClass(cmpTarget5, 'sp_inpBgYel');

				}
				component.set('v.dataLast', responseListData);
				// console.log('responseListDataLAST:22: ' + JSON.stringify(responseListData));
				
				component.set("v.managerDflt", false);
				component.set("v.manager2Dflt", true);

				if (component.get("v.value") == 'option2' ) {
					component.set("v.manager2Dflt", false);
				}

				const wrapperTemp = JSON.parse(JSON.stringify(responseListData));
				var lenwrapperTemp = wrapperTemp.length;

				console.log('wrapperTemp::333: ' + JSON.stringify(wrapperTemp) + '***' + lenwrapperTemp + '**');
				if (wrapperTemp != null && lenwrapperTemp > 0) {
						console.log('callDefaultField:5a: ');
					populateFlowsVariables(component, wrapperTemp[0], 'New');
						console.log('callDefaultField:5b: ');
				}

			}
		})

		// component.set("v.warning", component.get("v.msgWar01"));
		component.set("v.error", null);
		component.set("v.FlagError", true);
		component.set("v.SaveTrue", false);
		component.set("v.fieldBlank", false);

		console.log('callDefaultField:9a: ');
		
		$A.enqueueAction(action);
	},


	// come button Save
	updateLineItem: function (component, objId, newList, oldList) {
		
		if (component.get("v.value") == 'option1') {
			delete newList[0].threshold;
			delete newList[0].below_threshold_fee;
			delete newList[0].below_threshold_fee_percentage;
		}
		var inputStringnewList = JSON.stringify(newList);
		var inputStringoldList = JSON.stringify(oldList);
		var inputStringId = objId;
		console.log('SAVE inputStringNEWList: ' + inputStringnewList);
		console.log('SAVE inputStringOLDList: ' + inputStringoldList);
		console.log('SAVE value: ' + component.get("v.value"));

		var action = component.get("c.saveInfoOpportunityLine");
		action.setParams({
			"ListOld": inputStringoldList,
			"ListNew": inputStringnewList,
			"idOpportunity": inputStringId,
			"option": component.get("v.value")
		})
		action.setCallback(this, function (response) {

			if (response.getState() == "SUCCESS") {
				// console.log('in udtlineitem::1:');
				console.log('***response.getState():: ' + response.getState());

				component.set('v.loaded', false);
				var responseListContact = response.getReturnValue();
				console.log('***saveInfoOpportunityLine:: ' + response.getReturnValue());
				console.log('responseListContact:: ' + responseListContact);

				var state = response.getState();
				if (state === "SUCCESS") {
					// console.log('in udtlineitem::2');
					if (responseListContact != 'Update success') {
						// console.log('in udtlineitem::3');
						component.set("v.error", responseListContact);
						component.set("v.FlagError", true);
					} else {
						// console.log('in udtlineitem::4');
						component.set("v.error", null);
						component.set("v.FlagError", false);
						component.set('v.FlagChg', [false, false, false, false, false]);
						component.set("v.SaveTrue", true);
			
						//todo .fare ciclo for
						component.set("v.managerDflt", true);
						component.set("v.manager2Dflt", true);
						var cmpTarget = component.find('lname1');
						$A.util.removeClass(cmpTarget, 'sp_inpBgYel');
						var cmpTarget2 = component.find('lname2');
						$A.util.removeClass(cmpTarget2, 'sp_inpBgYel');
						var cmpTarget3 = component.find('lname3');
						$A.util.removeClass(cmpTarget3, 'sp_inpBgYel');
						var cmpTarget4 = component.find('lname4');
						$A.util.removeClass(cmpTarget4, 'sp_inpBgYel');
						var cmpTarget5 = component.find('lname5');
						$A.util.removeClass(cmpTarget5, 'sp_inpBgYel');
						var cmpTarget6 = component.find('lname6');
						$A.util.removeClass(cmpTarget6, 'sp_inpBgYel');
						var cmpTarget7 = component.find('lname7');
						$A.util.removeClass(cmpTarget7, 'sp_inpBgYel');

						// console.log('in udtlineitem::5');
					}
				} else if (state === "ERROR") {
					// console.log('in udtlineitem::6');

					var errors = response.getError();
					if (errors) {
						if (errors[0] && errors[0].message) {
							// console.log("Error message: " + errors[0].message);
							component.set("v.error", errors[0].message);
							component.set("v.FlagError", true);
						}
					}
				}
			}

			component.set('v.loaded', true);
		})

		$A.enqueueAction(action);
	},

	//TODO nn funz
	// come button Default / exec callDefaultField: /
	populateFlowsVariables: function (component, listInnerClass, typeList) {

		console.log('populateFlowsVariables:1:' + component.get("v.Option1True") + component.get("v.Option2True") + component.get("v.value") );

		if (typeList == 'New') {
			console.log("typeList populateFlowsVariables if: " + typeList);

			component.set('v.Above_Threshold_New', listInnerClass.above_threshold_fee);
			component.set('v.Above_Percentage_New', listInnerClass.above_threshold_fee_percentage);
			if (true == component.get("v.Option2True")) {
			component.set('v.Threshold_New', listInnerClass.threshold);
			component.set('v.Below_Threshold_New', listInnerClass.below_threshold_fee);
			component.set('v.Below_Percentage_New', listInnerClass.below_threshold_fee_percentage);
			}

		} else {
			console.log("typeList populateFlowsVariables else: " + typeList);

			component.set('v.Above_Threshold_Old', listInnerClass.above_threshold_fee);
			component.set('v.Above_Percentage_Old', listInnerClass.above_threshold_fee_percentage);
			if (true == component.get("v.Option2True")) {
			component.set('v.Threshold_Old', listInnerClass.threshold);
			component.set('v.Below_Threshold_Old', listInnerClass.below_threshold_fee);
			component.set('v.Below_Percentage_Old', listInnerClass.below_threshold_fee_percentage);
			}
		}
		console.log('populateFlowsVariables:2: ');
	},

	// come second init
	controlloContrattoIniz: function (component, objId) {
		var inputStringId = objId;
		var action = component.get("c.controlloContratto");
		action.setParams({
			"idObject": inputStringId
		})
		action.setCallback(this, function (response) {
			if (response.getState() == "SUCCESS") {
				// console.log('INIT response.getState():: ' + response.getState());
				// console.log('INIT getReturnValue():: ' + response.getReturnValue());

				component.set("v.FlagContratto", response.getReturnValue());
				console.log('INIT FlagContratto:: ' + component.get("v.FlagContratto"));

			}
		})

		$A.enqueueAction(action);
	},

	//TODO
	// test stato fieldBlank
	testfieldBlank: function (component) {
		console.log('***testfieldBlank:1: con ' + component.get("v.fieldBlank") );

		let dataLast = component.get("v.dataLast");
		component.set("v.fieldBlank", false);
		if (
			(!dataLast[0].hasOwnProperty('above_threshold_fee') || dataLast[0].above_threshold_fee == 0) &&
			(!dataLast[0].hasOwnProperty('above_threshold_fee_percentage') || dataLast[0].above_threshold_fee_percentage == 0) &&
			(!dataLast[0].hasOwnProperty('threshold') || dataLast[0].threshold == 0) &&
			(!dataLast[0].hasOwnProperty('below_threshold_fee') || dataLast[0].below_threshold_fee == 0) &&
			(!dataLast[0].hasOwnProperty('below_threshold_fee_percentage') || dataLast[0].below_threshold_fee_percentage == 0)) {
			component.set("v.fieldBlank", true);
			console.log('***testfieldBlank:2:');
		}
		console.log('***testfieldBlank:3: uscito con ' + component.get("v.fieldBlank") );
	},

	//change attr campi input
	chgClr: function (component, event, sp_nFlg, cmpInp) {
		// console.log('chgClr:1:' + sp_nFlg + ' *** ' + event.target.value);
		var flgchg = component.get("v.FlagChg");
		if (event.target.value > 0) {
			flgchg[sp_nFlg] = true;
		} else {
			flgchg[sp_nFlg] = false;
			// component.set("v.warning", component.get("v.msgWar01"));
			component.set("v.FlagError", true);
		}
		component.set('v.FlagChg', flgchg);

		var cmpTarget = component.find(cmpInp);
		$A.util.addClass(cmpTarget, 'sp_inpBgYel');

		var cmpTarget = component.find('btnSav');
		$A.util.addClass(cmpTarget, 'sp_shdBtn');
	},

	chgClrSub2: function (component, cmpInp) {
		var cmpTarget = component.find(cmpInp);
		$A.util.addClass(cmpTarget, 'sp_inpBgYel');

		var cmpTarget = component.find('btnSav');
		$A.util.addClass(cmpTarget, 'sp_shdBtn');
	},

	daOnFocus: function (component, auraid) {
		// console.log('wpOnFcs:6: ' + auraid);
		var cmpTarget = component.find(auraid);
		$A.util.addClass(cmpTarget, 'sp_onFcs');
	},

	daOnBlur: function (component, auraid) {
		// console.log('daOnBlur:8: ');
		var cmpTarget = component.find(auraid);
		$A.util.removeClass(cmpTarget, 'sp_onFcs');
	},


	// rpsVAT22: function (component, auraid) {
	// 	console.log('rpsVAT22:33: ');
	// 	// var cmpTarget = component.find(auraid);
	// 	// $A.util.removeClass(cmpTarget, 'sp_onFcs');
	// },


})