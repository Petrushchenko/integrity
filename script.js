'use strict'
window.onload = function() {
	var arr = [
		{
			fullName: {
				firstName: 'Ivan',
				surName: 'Ivanov',
				middleName: 'Ivanovich'
			},
			birthDate: new Date(1998, 5, 10),
			dateOfPurchase:  new Date(2015, 5, 10),
			goods: [			
				{name: 'bike', quantity: 5, promotion: true},
				
				{name: 'glass', quantity: 100, promotion: false}
			],
			prepayment_payment: [[true, 250], [false, 500]]
		},
		{
			fullName: {
				firstName: 'Petr',
				surName: 'Petrov',
				middleName: 'Petrovich'
			},
			birthDate:  new Date(2000, 5, 10),
			dateOfPurchase:  new Date(2015, 5, 10),
			goods: [
				{name: 'bike', quantity: 2,  promotion: true},
				{name: 'chair', quantity: 10,  promotion: true}
			],
			prepayment_payment: [[true, 250], [true, 700]]
		},
		{
			fullName: {
				firstName: 'Sergey',
				surName: 'Sergeev',
				middleName: 'Ivanovich'
			},
			birthDate: new Date(1991, 5, 10),
			dateOfPurchase:  new Date(2017, 5, 10),
			goods: [			
				{name: 'plate', quantity: 50, promotion: true},
				
				{name: 'glass', quantity: 100, promotion: false}
			],
			prepayment_payment: [[true, 250], [false, 500]]
		}
	];
	var mark = {
		fullName: {
				firstName: false,
				surName: true,
				middleName: false
			},
		birthDate: true,
		dateOfPurchase:  true,
		goods: [
			{name: true, quantity: true, promotion: true},
			{name: true, quantity: true, promotion: true}
		],
		prepayment_payment: [[true, true], [true, true]]
	};

	var location = {
		"fullName.firstName": "Name",
		"fullName.surName" : "Surname",
		"fullName.middleName": "patronymic",
		"birthDate" : "date of birthday",
		"dateOfPurchase" : "date of purchase",
		"goods[0].name" : "products name",
		"goods[0].quantity" : "quantity",
		"goods[0].promotion" : "promotion",
		"prepayment_payment[0][0]" : "prepayment",
		"prepayment_payment[0][1]" : "sum",
		"prepayment_payment[1][0]":"payment"

	}
	
	var options = newArr(mark);

	var values = getValues(options, arr, location);	
	console.log(values);

}
function getValues(keys, data, localization) {
	var resArray = [];
	data.forEach(function(obj){	
		var resObj = {};
	
		keys.forEach(function(path){

			resObj[path] = objProperty();

			function objProperty () {
				path = ifContainPoint(path);
				var res = datasType (path, obj, 0);
				return res;
			};	
			
		});
		resArray.push(resObj);
		
	});
	console.log(resArray);
	return reslt(localization, resArray);
}

function reslt(obj, arr) {
	var resArray = [];
	
		for (var path in arr[0]) {
			if (path in obj) {
				var newOb = {
					name: obj[path]
					};
			} else {
				var newOb = {
					name: path
				}
			}
		var value = 1;
		arr.forEach(function(item) {	
			newOb['value'+ value] = item[path];
			
			value +=1;
		});
		resArray.push(newOb);	
		}
		
	return resArray;	
}

function dataIsArray (path, arr) {
	var res;
	for (var j = 0; j < arr.length; j++) {
		if (path[1] == j) {
			switch(typeof arr[j]) {
				case "boolean":
					if (arr[j]) {
					res = 'yes';
					
					} else {
						res = 'no';
					}
				break;
				case 'string':
				case 'number':
					res = arr[j];
				break;
				case 'object':
					var cls = getClass(rr[j]);
					switch(cls) {
						case 'Date': 
							res = transformDate(arr[j]) ;
						break;
						case 'Object': 
							res = datasType(pathArr, arr[j], j+1);
						break;
						case 'Array': 
							res =  dataIsArray (path, arr[j]);
						break;
					}
				break;
			}

		}	
	}
	return res;
}

function datasType (pathArr, data, i) {	
	data = data[pathArr[i]];
	var res;
	if (typeof data == "object") {
		var cls = getClass(data);
		switch(cls) {
			case 'Date': 
				res = transformDate(data) ;
			break;
			case 'Object': 
				res = datasType(pathArr, data, i+1);

			break;
			case 'Array': 
				for (var j = 0; j < data.length; j++) {
					if (pathArr[i+1] == 2) {
						res = dataIsArray(pathArr, data);

					} else {
						if (pathArr[i+1] == j) {
							res = datasType(pathArr, data[j], i+2);	
						}	
					}
					
				}
						
			break;
		};
	} else {
		if (typeof data == "boolean") {
			if (data) {
				res = 'yes';
			} else {
				res = 'no';
			}
		} else {
			res = data;
			
		}
	}	
	return res;
}
function ifContainPoint(str) {

	if(~str.indexOf('.')){
		var arr = str.split('.');
		var newAr = [];
		arr.forEach(function(item) {

			item = ifContainBrackets(item);
			newAr = newAr.concat(item)
		});
		arr = newAr;
	}
	else {
		var arr = ifContainBrackets(str);		
	}
	return arr;

}
function ifContainBrackets(str) {
	if(~str.indexOf('[')){
		var arr = str.split('[');
		for (var i = 1; i < arr.length; i++) {
			arr[i] = arr[i].split(']').splice(0, 1).join('');
		}
		
	}
	else {
		var arr = [].concat(str);
	}
	return arr;
}
function newArr(obj) {
	var newAr = [];
	var path_g = Object.getOwnPropertyNames(obj); // array of keys Object.getOwnPropertyNames(mark)
	for (var i = 0; i < path_g.length; i++) {

		if (typeof obj[path_g[i]] == 'boolean') {
			if (obj[path_g[i]]) {
				newAr.push(path_g[i]);
			}
		} else {	
			newAr = arrayOrObject(obj[path_g[i]], path_g[i], newAr);
		}
	}
	
	return newAr;
}

function chooseAr(ar, parent, res) {
	var path = '';
	res = [];
	for (var i = 0; i < ar.length; i++) {
		if (typeof ar[i] !== "boolean"){
			res = arrayOrObject(ar[i], parent +'['+i+']', res);

		} else {
			if (ar[i]) {
				if (parent) {
					path = parent +'['+i+']' ; //[1, true, {}, []]
					res.push(path );

				}	
			}
		}
	}
	return res;
}

function checkObject(obj, parent, res) {
	var path = '';
	res = [];
	for (var k in obj) {	
		if (typeof obj[k] !== "boolean") {

			res = arrayOrObject(obj[k], k, res);
					
		} else {
			if (obj[k]) {
				if (parent) {
					path = parent + '.' + k;
				}
				else {
					path = k;	
				};
				res.push(path);

			}	
		}
	}
	return res;
}
		
function arrayOrObject(obj, parent, res){
	var cls = getClass(obj);

	if (cls === 'Object') {

		res = res.concat(checkObject(obj, parent, res));

	} else { 
		res = res.concat(chooseAr(obj, parent, res));	
	}
	return res;
}	

function transformDate(date) {
	var a = [];
	a.push(date.getDate());
	a.push(date.getMonth());
	a.push(date.getFullYear());
	 for (var i = 0; i < a.length; i++) {
	 	a[i] = a[i].toString();
	 }
	if (a[0].length < 2) {
			a[0] = '0' + a[0];
			console.log(a[0]);
		}
		if (a[1].length < 2) {
			a[1] = '0'+ a[1];
	}
	a = a.join('.');
	return a;
};


function getClass(obj) {
 		return {}.toString.call(obj).slice(8, -1);
	
}


