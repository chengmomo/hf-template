(function($, doc) {
	$.init();
	//-----------------------------------------
	mui('form').on('change', '.num-checkbox', function() {
		var inputId = this.getAttribute("inputId");
		var num = Number(this.getAttribute("num"));
		var value = Number($('#' + inputId)[0].value);
		if(this.checked) {
			$('#' + inputId)[0].value = value + num;
		} else {
			$('#' + inputId)[0].value = value - num;
		}
	});

	mui('form').on('change', '.num-radio', function() {
		var inputId = this.getAttribute("inputId");
		var formId = this.form.id;
		var value = 0;
		radios = $("#" + formId + " input[type=radio][class='input-radio num-radio']:checked");
		radios.each(function() {
			var num = Number(this.getAttribute("num"));
			value = value + num;
		})
		$('#' + inputId)[0].value = value;
	});

	//-----------------------------------------
	var pickers = $('.timePicker');
	pickers.each(function(i, picker) {
		picker.addEventListener('tap', function() {
			timeChange(this)
		}, false)
	});

	function timeChange(time) {
		var date = new Date();
		var options = {
			"type": "date",
			"value": time.value,
			"beginDate": new Date(date.getFullYear() - 200, 00, 01), //设置开始日期 
			"endDate": date, //设置结束日期 
		};
		var optionsJson = time.getAttribute('data-options') || '{"type":"date","value":"1970-01-01"}';
		var json = JSON.parse(optionsJson);
		if(!json.value) {
			json.value = formatDateString()
		}
		for(var key in json) {
			options[key] = json[key];
		}
		var id = time.getAttribute('id');
		var picker = new $.DtPicker(options);
		picker.show(function(rs) {
			time.value = rs.text;
			picker.dispose();
		});
	}
	//-----------------------------------------	
	var cityPickers = $('.cityPicker');
	cityPickers.each(function(i, picker) {
		picker.addEventListener('tap', function() {
			var cityPicker = new $.PopPicker({
				layer: 3
			});
			cityPicker.setData(cityData3);
			setDefaultCity(picker.value, cityPicker);
			cityPicker.show(function(items) {
				picker.value = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
				//返回 false 可以阻止选择框的关闭
				//return false;
				cityPicker.dispose();
			});
		}, false)
	});

	function setDefaultCity(value, picker) {
		var cityArr = value.split(' ');
		var a = 0;
		var b = 0;
		var c = 0;
		for(var i in cityData3) {
			if(cityData3[i].text === cityArr[0]) {
				a = i;
				var children = cityData3[i].children;
				for(var j in children) {
					if(children[j].text === cityArr[1]) {
						b = j;
						var child = children[j].children;
						for(var k in child) {
							if(child[k].text === cityArr[2]) {
								c = k;
							}
						}
					}
				}
			}
		}
		picker.pickers[0].setSelectedIndex(a);
		picker.pickers[1].setSelectedIndex(b);
		picker.pickers[2].setSelectedIndex(c);
	}
	//-----------------------------------------	
	var ethnicPickers = $('.ethnicPicker');
	ethnicPickers.each(function(i, picker) {
		picker.addEventListener('tap', function() {
			var ethnicPicker = new $.PopPicker();
			ethnicPicker.setData(ethnicData);
			ethnicPicker.pickers[0].setSelectedValue(picker.value, 200);
			ethnicPicker.show(function(items) {
				picker.value = items[0].value;
				//返回 false 可以阻止选择框的关闭
				//return false;
				ethnicPicker.dispose();
			});
		}, false)
	});
	//-----------------------------------------		
	var checkboxs = $('.input-checkbox');
	checkboxs.each(function(i, checkbox) {
		var item = checkbox.nextElementSibling.nextElementSibling;
		if(item) {
			item.style.display = "none";
			checkbox.addEventListener('click', function() {
				if(checkbox.checked) {
					item.style.display = "";
				} else {
					item.style.display = "none";
					itemInputs = item.getElementsByTagName('input');
					for(var i in itemInputs) {
						itemInputs[i].value = '';
						if(itemInputs[i].type === 'checkbox' || itemInputs[i].type === 'radio') {
							itemInputs[i].checked = false;
						}
					}
				}
			}, false)
		}
	});
	//-----------------------------------------
	var displayRadios = $('.display-radio');
	displayRadios.each(function(i, radio) {
		var diaplayRadio = doc.getElementsByName(radio.name)[1];
		var noRadio = doc.getElementsByName(radio.name)[0];
		var item = radio.parentElement.nextElementSibling;
		if(item) {
			radio.addEventListener('click', function() {
				if(noRadio.checked) {
					item.style.display = "none";
				} else {
					item.style.display = "inline";
				}
			}, false)
		}
	});
	//-----------------------------------------
	var itemRadios = $('.item-radio');
	itemRadios.each(function(i, radio) {
		var name = radio.getAttribute('name');
		var item = radio.nextElementSibling.nextElementSibling;
		if(item) {
			item.style.display = "none";
		}
		radio.addEventListener('click', function() {
			$('input[name=' + name + ']').each(function() {
				var itemTemp = this.nextElementSibling.nextElementSibling;
				if(itemTemp) {
					itemTemp.style.display = "none";
				}
			})
			if(radio.checked) {
				if(item) {
					item.style.display = "";
				}
			}

		}, false)
	});
}(mui, document));

function initFormData(FORM_DATA) {
	for(var key in FORM_DATA) {
		var formKey = key.split('_')[0];
		var id = '#' + formKey + '_TYPE';
		var length = $(id)[0].childElementCount;
		var arr = $("#FORM_" + formKey).serializeArray();
		var $radio = $('input[type=radio],input[type=checkbox]', $("#FORM_" + formKey));
		var temp = {};
		$.each($radio, function() {
			if(!temp.hasOwnProperty(this.name)) {
				if($("input[name='" + this.name + "']:checked").length == 0) {
					temp[this.name] = "";
					arr.push({
						name: this.name,
						value: ""
					});
				}
			}
		});
		var item = {};
		for(var i in arr) {
			var name = arr[i].name;
			if(name.indexOf('_TYPE') == -1 && name.indexOf('_DISPLAY') == -1) {
				item[name] = arr[i].value;
			}
		}
		for(var i = 0; i < length; i++) {
			FORM_DATA[key].push(item);
		}
	}
}

function setData(FORM_DATA, formData) {
	for(var key in formData) {
		if(key.indexOf("_DATA") != -1) {
			var formKey = key.split('_')[0]; //ABCD
			var index = formData[formKey + '_TYPE'] - 1;
			FORM_DATA[key] = formData[key];
			setData(FORM_DATA, formData[key][index]);
		} else {
			if(document.getElementsByName(key).length > 0) {
				var obj = document.getElementsByName(key);
				if(obj[0].type === 'checkbox') {
					var arr = formData[key];
					for(var i = 0; i < obj.length; i++) {
						var val = (i + 1).toString();
						var itemTemp = obj[i].nextElementSibling.nextElementSibling;
						if(arr.indexOf(val) > -1) {
							obj[i].checked = true;
							if(itemTemp) {
								itemTemp.style.display = '';
							}
						} else {
							obj[i].checked = false;
							if(itemTemp) {
								itemTemp.style.display = 'none';
							}
						}
					}
				} else if(obj[0].type === 'radio') {
					if(formData[key]) {
						var index = formData[key] - 1;
						var radio = document.getElementsByName(key)[index];
						radio.checked = true;
						if(radio.className.indexOf('display-radio') != -1) {
							var item = radio.parentElement.nextElementSibling;
							if(item) {
								if(formData[key] == '1') {
									item.style.display = 'none';
								}
							}
						} else if(radio.className.indexOf('item-radio') != -1) {
							var item = radio.nextElementSibling.nextElementSibling;
							if(item) {
								item.style.display = '';
							}
						}
					} else {
						for(var i = 0; i < obj.length; i++) {
							obj[i].checked = false;
						}
					}
				} else {
					if(key === 'sex'&&formData[key]!=='1'&&formData[key]!=='2') {
						if(formData[key]==='0'){
							formData[key] = '2';
						}else{
							formData[key] = '1';
						}
					}
					document.getElementById(key).value = formData[key];
					if(obj[0].type === 'textarea') {
						var ele = document.getElementById(key);
						ele.style.height = ele.scrollHeight + 'px';
					}
				}
			}
		}
	}
}

$.fn.serializeForm = function(FORM_DATA, DATA_KEY) {
	var formObj = {};
	var data = {};
	var index;
	var obj = this.serializeObject();
	for(var key in obj) {
		if(key.indexOf('_DISPLAY') != -1) {
			formObj[key] = obj[key] || '';
		} else if(key.indexOf('_TYPE') != -1) {
			formObj[key] = obj[key] || '';
			index = obj[key] - 1;
		} else {
			data[key] = obj[key] || '';
		}
	}
	FORM_DATA[DATA_KEY][index] = data;
	formObj[DATA_KEY] = FORM_DATA[DATA_KEY];
	return formObj;
}
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	var $radio = $('input[type=radio],input[type=checkbox]', this);
	var temp = {};
	$.each($radio, function() {
		if(!temp.hasOwnProperty(this.name)) {
			if($("input[name='" + this.name + "']:checked").length == 0) {
				temp[this.name] = "";
				a.push({
					name: this.name,
					value: ""
				});
			}
		}
	});
	$.each(a, function() {
		if(o[this.name]) {
			if(!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

//$.fn.setForm = function(jsonValue) {
//	var obj = this;
//	$.each(jsonValue, function(name, ival) {
//		var $oinput = obj.find("input:[name=" + name + "]");
//		if($oinput.attr("type") == "radio" || $oinput.attr("type") == "checkbox") {
//			$oinput.each(function() {
//				if($(this).val() == ival)
//					$(this).attr("checked", "checked");
//			});
//		} else {
//			obj.find("[name=" + name + "]").val(ival);
//		}
//	});
//};

function formatDateString() {
	var date = new Date();
	var year = date.getFullYear();
	var month = parseInt(date.getMonth()) + 1;
	var day = date.getDate();
	return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
}

function formatTimeString() {
	const date = new Date();
	const year = date.getFullYear();
	const month = parseInt(date.getMonth()) + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) +
		' ' + hour + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
};

function sendData(data) {
	if(window.originalPostMessage) {
		window.postMessage(data);
		// 发送给iframe
		// document.getElementsByTagName('iframe')[0].contentWindow.postMessage(data);
	} else {
		throw Error('postMessage接口还未注入');
	}
}

//window.postMessage = function(data) {
//	__REACT_WEB_VIEW_BRIDGE.postMessage(data);
//};