var app = angular.module('myApp',['ngRoute', 'ui.bootstrap', 'ngMaterial', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',  function($routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/',{
        templateUrl: '../views/loginpage.html',
        controller: 'loginCtrl',
        reloadOnSearch: false
    })
    .otherwise({
        redirectTo: "/"
    })

}]);

app.run(function($rootScope, $location, $window, $route){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		console.log("routeChangeStart fired.");
		if($window.localStorage.getItem('token') === null) {
    	    console.log("token not found.");
    	    if(next.templateUrl !== "../views/loginpage.html" ) {
          		console.log("redirect to login page.");
          		$location.replace();
          		$location.url( "/" );
        	}
      	}
      	else{
      		console.log("token found.");
      		console.log(next.templateUrl);
      		if(next.templateUrl === "../views/loginpage.html"){
      			console.log("already logged in. redirect to dashboard.");
      			$location.replace();
      			$location.url("/home");
      		}
      		/*else if(next.templateUrl === "../views/home.html" && JSON.stringify(next.params) === "{}"){
                console.log("home page with no params");
                $location.replace();
                $location.search('allTransPage', 1);
            }*/
      	}
    });

    $rootScope.$on('$routeUpdate', function(event, next){
        console.log("routeUpdate fired");
        if($window.localStorage.getItem('token') === null) {
            console.log("token not found.");
            console.log("redirect to login page.");
            $location.replace();
            $location.url( "/" );
        }
        else{
            $route.reload();
        }
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

})

app.directive('arrowNavigation', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.outletDropdownShow){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_' + $rootScope.outletArr.length).focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('row_' + $rootScope.outletArr.length).focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        console.log(document.activeElement.id);
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index++;
                            if(index > $rootScope.outletArr.length){
                                document.getElementById('row_0').focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            })
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}])

app.directive('profileArrowNav', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.showNavDropdown){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_2').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('navLink_2').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index++;
                            if(index > 2){
                                document.getElementById('navLink_0').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            })
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}])

/*app.directive("scroll", function () {
    return {
        link: function(scope, element, attrs) {
            element.on("wheel", function() {
                console.log('Scrolled below header.');
                if(document.getElementById('transactionDialog').scrollTop > 0){
                    document.getElementById('transDialogCross').style.boxShadow = "#888888 0px -2px 12px -4px";
                }
                else{
                    document.getElementById('transDialogCross').style.boxShadow = "none";
                }
            });
        }
    }
})*/

app.factory('commonDataFactory', function(){
    let commonDataFactory = {};
    console.log("inside commonDataFactory.");
    // Object containing all the stored data. To be emptied upon logout.
    commonDataFactory.storedDataObj = {};

    commonDataFactory.declareVariablesFunc = function(){
        console.log("Variable declaration function called inside commonDataFactory.");

        commonDataFactory.storedDataObj.allTrans = {};
        commonDataFactory.storedDataObj.allTrans.transList = [];
        commonDataFactory.storedDataObj.allTrans.totalItems = -1;
        commonDataFactory.storedDataObj.allTrans.firstTimeAt = "";
        commonDataFactory.storedDataObj.allTrans.outlets = {};

        commonDataFactory.storedDataObj.pendingTrans = {};
        commonDataFactory.storedDataObj.pendingTrans.transList = [];
        commonDataFactory.storedDataObj.pendingTrans.totalItems = -1;
        commonDataFactory.storedDataObj.pendingTrans.firstTimeAt = "";
        commonDataFactory.storedDataObj.pendingTrans.outlets = {};

        commonDataFactory.storedDataObj.settledTrans = {};
        commonDataFactory.storedDataObj.settledTrans.transList = [];
        commonDataFactory.storedDataObj.settledTrans.totalItems = -1;
        commonDataFactory.storedDataObj.settledTrans.firstTimeAt = "";
        commonDataFactory.storedDataObj.settledTrans.outlets = {};
    }

    commonDataFactory.declareVariablesFunc();

    return commonDataFactory;
})

app.factory('apiCall', function($http, $window, $location, commonDataFactory){
    let apiCall = {};

    apiCall.catchResponseError = function(error, catchResponseErrorCallback){
        if(error.status === 401){
            console.log("Not logged in.");
            commonDataFactory.storedDataObj = {};
            $window.localStorage.clear();
            $location.url('/');
        }
        else{
            catchResponseErrorCallback(error);
        }
    }

    apiCall.addHeader = function(){
        return {headers: {"X-Auth-Token": $window.localStorage.getItem('token')}};
    }

    apiCall.login = function(loginApiCallObj, loginApiCallback){
        console.log("inside login API call.");
        return $http.post('/login', loginApiCallObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            loginApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            loginApiCallback(error);
        })
    }

    apiCall.logout = function(logoutApiCallObj, logoutApiCallback){
        console.log("inside logout API call.");
        let logoutHeaderObj = apiCall.addHeader();
        return $http.post('/logout', logoutApiCallObj, logoutHeaderObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            logoutApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            apiCall.catchResponseError(error, logoutApiCallback);
        })
    }

    apiCall.changePass = function(changePassApiCallObj, changePassApiCallback){
        console.log("inside changePass API call.");
        let changePassHeaderObj = apiCall.addHeader();
        return $http.post('/merch_change_pass', changePassApiCallObj, changePassHeaderObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            changePassApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            apiCall.catchResponseError(error, changePassApiCallback);
        })
    }

    apiCall.fetchTrans = function(fetchTransObj, fetchTransApiCallback){
        console.log("inside fetchTrans API call.");
        let fetchTransHeaderObj = apiCall.addHeader();
        return $http.post('web/merch/trans', fetchTransObj, fetchTransHeaderObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            fetchTransApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            apiCall.catchResponseError(error, fetchTransApiCallback);
        })
    }

    apiCall.fetchOutletList = function(fetchOutletListApiCallback){
        console.log("inside fetchOutletList API call.");
        let fetchOutletListHeaderObj = apiCall.addHeader();
        return $http.post('merch/outls', {}, fetchOutletListHeaderObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            fetchOutletListApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            apiCall.catchResponseError(error, fetchOutletListApiCallback);
        })
    }

    return apiCall;
})

app.factory('bankData', function(){
    let bankData = {};

    let bankList = {
        "APMC": ["607051", "A P Mahesh Bank"],
        "ABPB": ["607397", "Aditya Birla Idea Payments Bank"],
        "AIRP": ["990288", "Airtel Payments Bank"],
        "ALLA": ["607117", "Allahabad Bank"],
        "AUGX": ["607091", "Allahabad UP Gramin Bank"],
        "ANDB": ["607170", "Andhra Bank"],
        "APGX": ["607198", "Andhra Pradesh Grameena Vikas Bank"],
        "APGB": ["607121", "Andhra Pragathi Grameena Bank"],
        "ASBL": ["607101", "Apna Sahakari Bank Ltd."],
        "AGVX": ["607064", "Assam Gramin Vikash Bank"],
        "UTIB": ["607153", "Axis Bank Ltd."],
        "BDBL": ["508753", "Bandhan Bank"],
        "BARB": ["606985", "Bank of Baroda"],
        "BKID": ["508505", "Bank of India"],
        "MAHB": ["607387", "Bank of Maharashtra"],
        "BGGX": ["606995", "Baroda Gujarat Gramin Bank"],
        "BRGX": ["607280", "Baroda Rajasthan Kshetriya Gramin Bank"],
        "BUGX": ["606993", "Baroda UP Gramin Bank"],
        "BACB": ["508512", "Bassein Catholic Co-operative Bank"],
        "BGBX": ["607377", "Bihar Gramin Bank"],
        "CNRB": ["508532", "Canara Bank"],
        "CSBK": ["607442", "Catholic Syrian Bank"],
        "CBIN": ["607115", "Central Bank Of India"],
        "CGGX": ["607080", "Chaitanya Godavari Grameena Bank"],
        "CGBX": ["607214", "CHATISGARH R G BANK"],
        "CITI": ["607485", "Citibank"],
        "CIUB": ["607324", "City Union Bank"],
        "CORP": ["607184", "Corporation Bank"],
        "COSB": ["607090", "Cosmos Bank"],
        "DBSS": ["199641", "DBS BANK LTD"],
        "DCBL": ["607290", "DCB Bank Ltd"],
        "BKDN": ["508547", "Dena Bank"],
        "DEGX": ["607099", "Dena Gujarat Gramin Bank"],
        "DLXB": ["508528", "Dhanlaxmi Bank Ltd"],
        "DNSB": ["607055", "Dombivali Nagri Sahakari Bank"],
        "ESFB": ["508998", "Equitas Bank"],
        "FDRL": ["607165", "Federal Bank"],
        "FINO": ["608001", "Fino Payments Bank"],
        "PJSB": ["607273", "GP PARSIK BANK"],
        "HDFC": ["607152", "HDFC BANK LTD"],
        "HSBC": ["999999", "HSBC"],
        "ICIC": ["508534", "ICICI Bank"],
        "IBKL": ["607095", "IDBI Bank Limited"],
        "IDFB": ["608117", "IDFC Bank"],
        "IDBI": ["607105", "Indian Bank"],
        "IOBA": ["508541", "Indian Overseas Bank"],
        "INDB": ["607189", "INDUSIND BANK"],
        "JJSB": ["607158", "Jalgaon Janata Sahkari Bank Ltd Jalgaon"],
        "JAKA": ["607440", "Jammu and Kashmir Bank"],
        "JSBP": ["607276", "Janata Sahakari Bank Ltd. Pune"],
        "JIOP": ["607884", "Jio Payments Bank"],
        "KAIJ": ["607249", "KAIJSB- Ichalkaranji"],
        "KARB": ["607270", "Karnataka Bank"],
        "KVGB": ["607122", "Karnataka Vikas Grameena Bank"],
        "KVBL": ["607100", "Karur Vysya Bank"],
        "KGSX": ["607365", "Kashi Gomati Samyut Grameen Bank"],
        "KGBX": ["607308", "Kaveri Grameena Bank"],
        "KLGB": ["607476", "Kerala Gramin Bank"],
        "KKBK": ["607420", "Kotak Mahindra Bank"],
        "LAVB": ["607058", "Lakshmi Vilas Bank"],
        "LDRX": ["607202", "Langpi Dehangi Rural Bank"],
        "MGBX": ["607000", "Maharashtra Gramin Bank"],
        "MGRB": ["607241", "Malwa Gramin Bank"],
        "MRBX": ["607062", "Manipur Rural Bank"],
        "MERX": ["607206", "Meghalaya Rural Bank"],
        "MZRX": ["607230", "Mizoram Rural Bank"],
        "NKGS": ["607104", "NKGSB Bank"],
        "ORBC": ["508585", "Oriental Bank of Commerce"],
        "PYTM": ["608032", "Paytm Payments Bank"],
        "PGBX": ["607389", "Pragathi Krishna Gramin Bank"],
        "PRTH": ["607124", "Prathama Bank"],
        "PMCB": ["607057", "Punjab and Maharashtra Cooperative Bank"],
        "PSIB": ["607087", "Punjab and Sind Bank"],
        "PUNB": ["508568", "Punjab National Bank"],
        "PURX": ["607212", "Purvanchal Bank"],
        "MDGX": ["607509", "Rajasthan Marudhara Gramin Bank"],
        "RNSB": ["607354", "Rajkot Nagrik Sahakari Bank Ltd."],
        "RATN": ["607393", "RBL"],
        "SRCB": ["652150", "Saraswat Bank"],
        "SAGX": ["607200", "Saurashtra Gramin Bank"],
        "SIBL": ["607167", "South Indian BanK"],
        "SCBL": ["607394", "Standard Chartered"],
        "SBIN": ["508548", "State Bank Of India"],
        "SPCB": ["607146", "Surat People Cooperative Bank"],
        "SVCB": ["607258", "Svc co-operative bank ltd"],
        "SYNB": ["508508", "Syndicate Bank"],
        "TMBL": ["607187", "Tamilnad Mercantile Bank"],
        "DGBX": ["607195", "Telangana Grameena bank"],
        "TBSB": ["607291", "Thane Bharat Sahakari Bank Ltd"],
        "GSCB": ["607689", "The Gujarat State Cooperative Bank"],
        "HCBX": ["607621", "The Hasti Co-operative Bank Ltd"],
        "KJSB": ["607506", "The Kalyan Janata Sahakari Bank Ltd."],
        "MCBL": ["607320", "The Mahanagar Co.Op. Bank Ltd."],
        "MSNU": ["508517", "The Mehsana Urban Co-Operative Bank Ltd."],
        "SUTB": ["607962", "The Sutex Co.op.Bank Ltd."],
        "VSBL": ["607103", "The Vishweshwar Sahakari Bank Ltd. Pune (Multi-State)"],
        "TJSB": ["607130", "TJSB"],
        "TGBX": ["607065", "Tripura Gramin Bank"],
        "UCBA": ["607066", "UCO Bank"],
        "USBF": ["508991", "Ujjivan Small Finance Bank"],
        "UBIN": ["508500", "Union Bank of India"],
        "UTBI": ["607028", "United Bank of India"],
        "UTGX": ["607197", "Uttarakhand Gramin Bank"],
        "VGBX": ["607210", "Vananchal Gramin Bank"],
        "VVSB": ["607544", "Vasai Vikas Sahakari Bank Ltd"],
        "VIJB": ["607075", "Vijaya Bank"],
        "YESB": ["607223", "Yes Bank Ltd"]
    };

    bankData.getBankName = function(ifsc){
        console.log("inside bankData.getBankName function.");
        if(bankList[ifsc] !== undefined){
            return bankList[ifsc][1];
        }
        else{
            return "Bank not found";
        }
    }

    bankData.getBankIcon = function(ifsc){
        console.log("inside bankData.getBankIcon function.");
        let code = bankList[ifsc][0];
        let url = "https://storage.googleapis.com/khaalijeb_app_icons_bucket/bank_icons/bank" + code + ".svg";
        return url;
    }

    return bankData;
})

app.factory('alertsAndDialogs', function($mdDialog){

let alertsAndDialogs = {};

    alertsAndDialogs.alert = function(parentContainer, title, text, ariaLabel, btn){
        $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector(parentContainer)))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(text)
        .ariaLabel(ariaLabel)
        .ok(btn)
        .targetEvent()
        );
    }

return alertsAndDialogs;

})

app.factory('commonFunctions', function($location, bankData){

    let commonFunctions = {};

    commonFunctions.convertTime = function(responseTime){
        let time = "";
        let hour = Math.floor(responseTime / 3600);
        let remainderAfterHours = responseTime % 3600;
        let minute = Math.floor(remainderAfterHours / 60);
        let second = remainderAfterHours % 60;
        if(hour !== 0){
            time += " " + hour + " hr"
        }
        if(minute !== 0){
            time += " " + minute + " min"
        }
        if(second !== 0){
            time += " " + second + " sec"
        }
        return time;
    }

    commonFunctions.isEqual = function(val1, val2){
        let type = Object.prototype.toString.call(val1);
        if(type !== Object.prototype.toString.call(val2)){
            return false;
        }
        let val1length = type === '[object Array]' ? val1.length : Object.keys(val1).length;
        let val2length = type === '[object Array]' ? val2.length : Object.keys(val2).length;
        if(val1length !== val2length){
            return false;
        }

        let compare = function(item1, item2){
            let itemType = Object.prototype.toString.call(item1);
            if(['[object Array]', '[object Object]'].indexOf(itemType) > -1){
                if(!commonFunctions.isEqual(item1, item2)){
                    return false;
                }
            }
            else{
                if(item1 !== item2){
                    return false;
                }
            }
        }

        if(type === '[object Array]'){
            for(let i = 0; i < val1.length; i++){
                if(compare(val1[i], val2[i]) === false){
                    return false;
                }
            }
        }
        else{
            for(let key in val1){
                if(val1.hasOwnProperty(key)){
                    if(compare(val1[key], val2[key]) === false){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    commonFunctions.addDays = function(date, days){
        let due_date = new Date(date);
        due_date.setDate(due_date.getDate() + days);
        return due_date;
    }

    commonFunctions.fetchBankDetls = function(merchDetlsObj){
        if(merchDetlsObj.bankName === undefined){
            // pending transactions in allTrans won't have bank details.
            if(merchDetlsObj.mIfsc !== undefined){
                let ifsc = merchDetlsObj.mIfsc.substring(0, 4);
                ifsc = ifsc.toUpperCase();
                merchDetlsObj.bankName = bankData.getBankName(ifsc);
                merchDetlsObj.bankIcon = bankData.getBankIcon(ifsc);
            }
        }
    }

    commonFunctions.calculateTotalCharges = function(merchDetlsObj){
        // gst and comsn usually comes in all the trans detls. this is just a safety check
        if(merchDetlsObj.comsn !== null && merchDetlsObj.gst !== null && merchDetlsObj.comsn !== undefined && merchDetlsObj.gst !== undefined){
            let fees = new Big(merchDetlsObj.comsn);
            let gst = new Big(merchDetlsObj.gst);
            // toFixed() adds zero(s) to the right. Used when a specific number of decimal places are needed.
            merchDetlsObj.totalCharges = fees.plus(gst).round(2).toFixed(2);
            let amount = new Big(merchDetlsObj.amount);
            merchDetlsObj.settledAmount = amount.minus(merchDetlsObj.totalCharges).round(2).toFixed(2);
        }
    }

    commonFunctions.openTransDialog = function(currentTransArr){
        if($location.search().transDialog !== undefined){
            if($location.search().transId !== undefined){
                for(let i = 0; i < currentTransArr.length; i++){
                    if(currentTransArr[i].trans_id === $location.search().transId){
                        let viewSettlementDetlsMerch = currentTransArr[i];
                        commonFunctions.fetchBankDetls(viewSettlementDetlsMerch);
                        if(viewSettlementDetlsMerch.settld === 0){
                            viewSettlementDetlsMerch.dueDate = commonFunctions.addDays(viewSettlementDetlsMerch.dateTime, 3);
                        }
                        commonFunctions.calculateTotalCharges(viewSettlementDetlsMerch);
                        return viewSettlementDetlsMerch
                    }
                    if(i === currentTransArr.length - 1){
                        return false;
                    }
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    return commonFunctions;

})

app.controller('indexCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', '$mdDialog', '$mdMenu', 'apiCall', 'commonDataFactory', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, $mdDialog, $mdMenu, apiCall, commonDataFactory, commonFunctions) {
    console.log("Inside indexCtrl.");
    // API call to fetch outlet list if logged in with parent account
    if($window.localStorage.getItem('token') !== null){
        if($window.localStorage.getItem('parType') !== null){
            apiCall.fetchOutletList(function(response){
                console.log("fetchOutletList API call response.");
                if(response.status !== 200){
                    console.log("Sorry, there was an error. Please try again.");
                }
                else{
                    if(response.data.success === 1){
                        console.log("Outlet data fetched.");
                        let currentOutlArr = JSON.parse($window.localStorage.getItem('merchsArr'));
                        let newOutlArr = response.data.merchs;
                        if(!commonFunctions.isEqual(currentOutlArr, newOutlArr)){
                            $window.localStorage.setItem('merchsArr', JSON.stringify(response.data.merchs));
                            $rootScope.outletArr = JSON.parse($window.localStorage.getItem('merchsArr'));
                            for(let i = 0; i < $rootScope.outletArr.length; i++) {
                                if($rootScope.outletArr[i].area2 !== null && $rootScope.outletArr[i].area2 !== undefined && $rootScope.outletArr[i].area2 !== ""){
                                    $rootScope.outletArr[i].address = $rootScope.outletArr[i].area2 + ", " + $rootScope.outletArr[i].area1;
                                }
                                else{
                                    $rootScope.outletArr[i].address = $rootScope.outletArr[i].area1;
                                }
                            }
                        }
                    }
                    else{
                        console.log("Error: " + response.data.message);
                    }
                }
            })
        }
    }

}]);

app.controller('loginCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside loginCtrl.");
    $scope.loginVariablesObj = {};
    $scope.loginVariablesObj.loginButtonDisabled = false;
    $scope.loginVariablesObj.loginErrorMsg = false;
    $scope.loginFrm = {};
    $scope.login = function(userId, pass){
        console.log(userId);
        console.log(pass);
        $scope.loginVariablesObj.loginButtonDisabled = true;
        let loginObj = {
            merch_id: userId,
            reg_id: "",
            password: pass
        }
        apiCall.login(loginObj, function(response){
            $scope.loginVariablesObj.loginButtonDisabled = false;
            if(response.status !== 200){
                if(response.status === -1){
                    console.log("Not connected to internet.");
                    $scope.loginVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    $timeout(function(){
                        $scope.loginVariablesObj.loginErrorMsg = false;
                    }, 5000)
                }
                else{
                    console.log("Sorry, there was an error. Please try again.");
                    $scope.loginVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                }
            }
            else{
                if(response.data.success === 1){
                    console.log("Login Successful.");
                    $window.localStorage.setItem('token', response.data.token);
                    $window.localStorage.setItem('merchName', response.data.shop_name);
                    if(response.data.parent === 0 || (response.data.parent === 1 && response.data.par_type === 2)){
                        if(response.data.address.area2 !== null && response.data.address.area2 !== undefined && response.data.address.area2 !== ""){
                            $window.localStorage.setItem('merchAddress', response.data.address.area2 + ", " + response.data.address.area1);
                        }
                        else{
                            $window.localStorage.setItem('merchAddress', response.data.address.area1);
                        }
                    }
                    if(response.data.parent === 1){
                        $window.localStorage.setItem('parType', response.data.par_type.toString());
                        $window.localStorage.setItem('merchsArr', JSON.stringify(response.data.merchs));
                    }
                    $location.url('/home');
                }
                else{
                    console.log("Error: " + response.data.message);
                    if(response.data.success === -1){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Wrong Password.";
                    }
                    else if(response.data.success === -2){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Merchant not registered. Please Signup.";
                    }
                    else if(response.data.success === -10){
                        let time = commonFunctions.convertTime(response.data.time);
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Attempts exceeded. Please retry after" + time + ".";
                    }
                    else{
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                    }
                }
            }
        });
    }

    $scope.loginVariablesObj.showPassword = false;

    $scope.togglePassword = function(){
        $scope.loginVariablesObj.showPassword = !$scope.loginVariablesObj.showPassword;
    }

    // validation for email/mobile number input field
    $scope.loginFormInputValidation = (function(){
        console.log("loginFormInputValidation");
        let emailRegex = /^([a-zA-Z0-9_$#&*%@!^\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/;
        let mobileRegex = /^[1-9]{1}[0-9]{9}$/;
        return {
            test: function(value) {
                let check1 = emailRegex.test(value);
                let check2 = mobileRegex.test(value);
                return check1 || check2;
            }
        }
    })();

}]);

app.controller('homeCtrl', ['$scope', '$location', '$window', '$mdDialog', '$rootScope', '$timeout', 'apiCall', 'commonDataFactory', 'bankData', 'commonFunctions', 'alertsAndDialogs', function($scope, $location, $window, $mdDialog, $rootScope, $timeout, apiCall, commonDataFactory, bankData, commonFunctions, alertsAndDialogs){
    console.log("Inside homeCtrl.");
    $scope.homeVariablesObj = {};

    // change css when selecting menu bar links portion
    $scope.homeVariablesObj.hoverAllTrans = false;
    $scope.homeVariablesObj.hoverPendingTrans = false;
    $scope.homeVariablesObj.hoverSettledTrans = false;

    //navbar open and close portion
    $scope.homeVariablesObj.showNavDropdown = false;
    $scope.homeVariablesObj.outletDropdownShow = false;


    $scope.navbarDropdownOpen = function(){
        console.log("show dropdown");
        $scope.homeVariablesObj.showNavDropdown = true;
    }

    $scope.navbarDropdownHide = function(){
        console.log("hide dropdown");
        $scope.homeVariablesObj.showNavDropdown = false;
    }

    $scope.outletDropdownToggle = function(){
        console.log("outlet dropdown toggled.");
        if($scope.homeVariablesObj.outletDropdownShow === false){
            $scope.homeVariablesObj.outletDropdownShow = true;
        }
        else{
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
    }
    // add condition for keyboard clicks as well
    $window.onclick = function(event){
        let isNavbarClick = event.target.id === "profileIcon";
        let isOutletListClick = event.target.id === "outletListToggle";
        let isOutletListIconClick = event.target.id === "outletListToggleIcon";

        if(isOutletListClick || isOutletListIconClick){
            $scope.homeVariablesObj.showNavDropdown = false;
        }
        else if(isNavbarClick){
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
        else{
            $scope.homeVariablesObj.showNavDropdown = false;
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
        $scope.$apply();
    }

    // logout portion
    $scope.homeVariablesObj.logoutDisabled = false;

    $scope.logout = function(){
        let logoutObj = {
            reg_id: ""
        }
        if($scope.homeVariablesObj.logoutDisabled === false){
            $scope.homeVariablesObj.logoutDisabled = true;
            apiCall.logout(logoutObj, function(response){
                $scope.homeVariablesObj.logoutDisabled = false;
                if(response.status !== 200){
                    console.log("Sorry, there was an error. Please try again.");
                    if(response.status === -1){
                        console.log("Error connecting. Check Internet & Retry.");
                        alertsAndDialogs.alert("alertContainer", "No Internet Connection", "Error connecting. Check Internet & Retry.", "No Internet Connection Alert", "OK");
                    }
                    else{
                        alertsAndDialogs.alert("alertContainer", "Error", "Sorry, there was an error. Please try again.", "Error Alert", "OK");
                    }
                }
                else{
                    if(response.data.success === 1){
                        console.log("Logout Successful.");
                        commonDataFactory.storedDataObj = {};
                        $window.localStorage.clear();
                        $location.url('/');
                    }
                    else{
                        console.log("Error: " + response.data.message);
                        alertsAndDialogs.alert("alertContainer", "Error", "Sorry, there was an error. Please try again.", "Error Alert", "OK");
                    }
                }
            });
        }
    }

    // change password portion
    $scope.openChangePassDialog = function(){
        console.log("inside openChangePassDialog function.");
        $scope.changePass = {};
        $scope.homeVariablesObj.changePassShowErr = false;
        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/changePassDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeChangePassDialog = function(){
        console.log("inside closeChangePassDialog function.");
        $mdDialog.hide();
    }
    // change password show/hide toggle
    $scope.homeVariablesObj.showPassword = false;
    $scope.homeVariablesObj.disableChangePass = false;

    $scope.toggleChangePasswordShow = function(){
        $scope.homeVariablesObj.showPassword = !$scope.homeVariablesObj.showPassword;
    }

    $scope.changePassConfirm = function(oldPass, newPass, confirmPass){
        console.log(oldPass);
        console.log(newPass);
        console.log(confirmPass);
        if(newPass !== confirmPass){
            console.log("Password mismatch.");
            $scope.homeVariablesObj.changePassShowErr = true;
            document.getElementById('changePassFormErrorMsg').innerHTML = "Password mismatch.";
        }
        else{
            let changePassObj = {
                new_pass: newPass,
                old_pass: oldPass,
                reg_id: ""
            }
            $scope.homeVariablesObj.disableChangePass = true;
            apiCall.changePass(changePassObj, function(response){
                $scope.homeVariablesObj.disableChangePass = false;
                if(response.status !== 200){
                    if(response.status === -1){
                        $scope.homeVariablesObj.changePassShowErr = true;
                        document.getElementById('changePassFormErrorMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    }
                    else{
                        console.log("Sorry, there was an error. Please try again.");
                        $scope.homeVariablesObj.changePassShowErr = true;
                        document.getElementById('changePassFormErrorMsg').innerHTML = "Sorry, there was an error. Please try again.";
                    }
                }
                else{
                    if(response.data.success === 1){
                        console.log("password changed successfully.");
                        $mdDialog.hide();
                    }
                    else{
                        console.log("Error: " + response.data.message);
                        if(response.data.success === -1){
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Incorrect Current Password.";
                        }
                        else if(response.data.success === -10){
                            let time = commonFunctions.convertTime(response.data.time);
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Attempts exceeded. Please retry after" + time + ".";
                        }
                        else{
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                    }
                }
            });
        }
    }

    $scope.openContactDialog = function(){
        console.log("contact us dialog opened");
        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/contactUsDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeContactDialog = function(){
        console.log("close contact us dialog");
        $mdDialog.hide();
    }

    // check if the data factory variables have been declared.
    if(commonDataFactory.storedDataObj.allTrans === undefined){
        console.log("Variables not declared.");
        commonDataFactory.declareVariablesFunc();
    }

    // get all the values stored in localStorage (eg. merch name, address, outlets, etc.)
    $rootScope.loggedInMerchantName = $window.localStorage.getItem('merchName');
    // to reset the value upon logout.
    $rootScope.loggedInMerchantAddress = undefined;
    if($window.localStorage.getItem('merchAddress') !== null){
        $rootScope.loggedInMerchantAddress = $window.localStorage.getItem('merchAddress');
    }
    // to reset the value upon logout.
    $rootScope.loggedInMerchantParType = undefined;
    if($window.localStorage.getItem('parType') !== null){
        $rootScope.loggedInMerchantParType = Number($window.localStorage.getItem('parType'));
    }
    $rootScope.outletArr = [];
    if($window.localStorage.getItem('merchsArr') !== null){
        $rootScope.outletArr = JSON.parse($window.localStorage.getItem('merchsArr'));
        for(let i = 0; i < $rootScope.outletArr.length; i++) {
            if($rootScope.outletArr[i].area2 !== null && $rootScope.outletArr[i].area2 !== undefined && $rootScope.outletArr[i].area2 !== ""){
                $rootScope.outletArr[i].address = $rootScope.outletArr[i].area2 + ", " + $rootScope.outletArr[i].area1;
            }
            else{
                $rootScope.outletArr[i].address = $rootScope.outletArr[i].area1;
            }
        }
    }

    // menu button click functions
    $scope.getAllTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'all', 'page': 1});
        }
        else{
            $location.search({'allTransPage': 1});
        }
    }

    $scope.getPendingTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'pending', 'page': 1});
        }
        else{
            $location.search({'pendingTransPage': 1});
        }
    }

    $scope.getSettledTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'settled', 'page': 1});
        }
        else{
            $location.search({'settledTransPage': 1});
        }
    }

    //URL parameter conditionals
    if(JSON.stringify($location.search()) === "{}"){
        $scope.homeVariablesObj.selectedMer = "All Outlets";
    }

    else if($location.search().allTransPage !== undefined){
        if($location.search().allTransPage === true || $location.search().allTransPage === ""){
            $location.search({'allTransPage': 1});
        }
        else{
            console.log("In homeCtrl getAllTrans called.");
            $scope.homeVariablesObj.getAllTrans = true;
            $scope.homeVariablesObj.getPendingTrans = false;
            $scope.homeVariablesObj.getSettledTrans = false;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().pendingTransPage !== undefined){
        if($location.search().pendingTransPage === true || $location.search().pendingTransPage === ""){
            $location.search({'pendingTransPage': 1});
        }
        else{
            console.log("In homeCtrl getPendingTrans called.");
            $scope.homeVariablesObj.getAllTrans = false;
            $scope.homeVariablesObj.getPendingTrans = true;
            $scope.homeVariablesObj.getSettledTrans = false;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().settledTransPage !== undefined){
        if($location.search().settledTransPage === true || $location.search().settledTransPage === ""){
            $location.search({'settledTransPage': 1});
        }
        else{
            console.log("In homeCtrl getSettledTrans called.");
            $scope.homeVariablesObj.getAllTrans = false;
            $scope.homeVariablesObj.getPendingTrans = false;
            $scope.homeVariablesObj.getSettledTrans = true;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().outlId !== undefined && $location.search().transType === undefined){
        $scope.homeVariablesObj.selectedMerId = $location.search().outlId;
        for(let i = 0; i < $rootScope.outletArr.length; i++){
            if($rootScope.outletArr[i].merId === $scope.homeVariablesObj.selectedMerId){
                if($rootScope.loggedInMerchantParType === 1){
                    $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].address;
                }
                else{
                    $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].shop_name;
                }
                break;
            }
            if(i === $rootScope.outletArr.length - 1){
                $scope.homeVariablesObj.selectedMer = "No merchant found";
            }
        }
    }

    else if($location.search().outlId !== undefined && $location.search().transType !== undefined){
        if($location.search().page === undefined || $location.search().page === true || $location.search().page === ""){
            $location.search("page", 1);
        }
        else{
            $scope.homeVariablesObj.selectedMerId = $location.search().outlId;
            for(let i = 0; i < $rootScope.outletArr.length; i++){
                if($rootScope.outletArr[i].merId === $scope.homeVariablesObj.selectedMerId){
                    if($rootScope.loggedInMerchantParType === 1){
                        $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].address;
                    }
                    else{
                        $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].shop_name;
                    }
                    break;
                }
                if(i === $rootScope.outletArr.length - 1){
                    $scope.homeVariablesObj.selectedMer = "No merchant found";
                }
            }
            console.log($location.search());
            if($location.search().transType === "all"){
                console.log("In homeCtrl getAllTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = true;
                $scope.homeVariablesObj.getPendingTrans = false;
                $scope.homeVariablesObj.getSettledTrans = false;
            }
            else if($location.search().transType === "pending"){
                console.log("In homeCtrl getPendingTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = false;
                $scope.homeVariablesObj.getPendingTrans = true;
                $scope.homeVariablesObj.getSettledTrans = false;
            }
            else if($location.search().transType === "settled"){
                console.log("In homeCtrl getSettledTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = false;
                $scope.homeVariablesObj.getPendingTrans = false;
                $scope.homeVariablesObj.getSettledTrans = true;
            }
            else{
                let params = $location.search();
                $location.search({outlId: params.outlId});
            }
        }
    }

    else{
        $location.search({});
    }

    $scope.getOutletTrans = function(merId){
        console.log("Outlet selected");
        let params = $location.search();
        if(JSON.stringify(params) === "{}" || (params.hasOwnProperty('outlId') && !params.hasOwnProperty('transType'))){
            if(merId === "allOutlets"){
                $location.search({});
            }
            else{
                console.log("selected outlet in homePage.");
                $location.search({'outlId': merId});
            }
        }
        else if(params.hasOwnProperty('allTransPage') || (params.hasOwnProperty('transType') && params.transType === "all")){
            if(merId === "allOutlets"){
                $location.search({'allTransPage': 1});
            }
            else{
                console.log("selected outlet in allTransPage.");
                $location.search({'outlId': merId, 'transType': 'all', 'page': 1});
            }
        }
        else if(params.hasOwnProperty('pendingTransPage') || (params.hasOwnProperty('transType') && params.transType === "pending")){
            if(merId === "allOutlets"){
                $location.search({'pendingTransPage': 1});
            }
            else{
                console.log("selected outlet in pendingTransPage.");
                $location.search({'outlId': merId, 'transType': 'pending', 'page': 1});
            }
        }
        else if(params.hasOwnProperty('settledTransPage') || (params.hasOwnProperty('transType') && params.transType === "settled")){
            if(merId === "allOutlets"){
                $location.search({'settledTransPage': 1});
            }
            else{
                console.log("selected outlet in settledTransPage.");
                $location.search({'outlId': merId, 'transType': 'settled', 'page': 1});
            }
        }
    }

    $scope.$on("openTransDialog", function(event, transDetls){
        console.log("catching emitted signal");
        $scope.openMobSizeDialog(transDetls);
    });

    $scope.openMobSizeDialog = function(transDetls){
        $scope.viewSettlementDetlsMerch = transDetls;
        console.log($scope.viewSettlementDetlsMerch);
        $mdDialog.show ({
            /*clickOutsideToClose: true,*/
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/transDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeMobSizeDialog = function(){
        console.log("close dialog");
        $mdDialog.hide();
        $location.search('transDialog', null);
    }

    $scope.displayTransDialogFunc = function(){
        console.log("displayTransDialogFunc called.");
        $location.search('transDialog', true);
    }

}]);



app.controller('allTransCtrl', ['$scope', '$location', '$window', '$rootScope', '$timeout', 'apiCall', 'commonDataFactory', 'commonFunctions', function($scope, $location, $window, $rootScope, $timeout, apiCall, commonDataFactory, commonFunctions){
    console.log("Inside allTransCtrl.");
    $scope.allTransList = [];
    $scope.currentPageAllTransList = [];
    $scope.allTransVariablesObj = {};
    $scope.allTransVariablesObj.displayLoader = false;
    $scope.allTransVariablesObj.pageSize = 5;

    $scope.getAllTransFunc = function(){
        console.log($location.search().allTransPage);
        $scope.allTransList = commonDataFactory.storedDataObj.allTrans.transList;
        $scope.allTransVariablesObj.totalItems = commonDataFactory.storedDataObj.allTrans.totalItems;
        $scope.allTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.allTrans.firstTimeAt;
        console.log($scope.allTransList);
        $scope.allTransVariablesObj.currentPage = $location.search().allTransPage;
        if($scope.allTransList[($scope.allTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.allTransVariablesObj.displayLoader = true;
            let getAllTransObj = {
                page: $location.search().allTransPage - 1,
                trans_type: -1
            }
            if($scope.allTransVariablesObj.totalItems === -1){
                getAllTransObj.fetchTotTrans = 1;
            }
            if($scope.allTransVariablesObj.firstTimeAt !== ""){
                getAllTransObj.firstTimeAt = $scope.allTransVariablesObj.firstTimeAt;
            }
            console.log(getAllTransObj);
            apiCall.fetchTrans(getAllTransObj, function(response){
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.allTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.allTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch All Transactions Successful.");
                            if($scope.allTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.allTrans.totalItems = $scope.allTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.allTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.allTrans.firstTimeAt = $scope.allTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                // to ensure all the amount values have two decimal places
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                $scope.allTransList[(($scope.allTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.allTransList);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().allTransPage == getAllTransObj.page + 1){
                                $scope.currentPageAllTransList = $scope.allTransList.slice(($scope.allTransVariablesObj.currentPage - 1) * 5, (($scope.allTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPageAllTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPageAllTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.allTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.allTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.allTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPageAllTransList = $scope.allTransList.slice(($scope.allTransVariablesObj.currentPage - 1) * 5, (($scope.allTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPageAllTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPageAllTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls)
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().allTransPage !== undefined){
        $scope.getAllTransFunc();
    }

    // pagination function
    $scope.allTransPageChanged = function(pageNum){
        console.log(pageNum);
        if($location.search().hasOwnProperty('allTransPage')){
            console.log("allTransPage changed");
            $location.search('allTransPage', pageNum);
        }
        else{
            console.log("outlet page changed.");
            $location.search('page', pageNum);
        }
    }

    $scope.outletGetAllTransFunc = function(merId, pageNum){
        console.log(merId);
        console.log(pageNum);
        if(commonDataFactory.storedDataObj.allTrans.outlets[merId] === undefined){
            commonDataFactory.storedDataObj.allTrans.outlets[merId] = {};
            commonDataFactory.storedDataObj.allTrans.outlets[merId].transList = [];
            commonDataFactory.storedDataObj.allTrans.outlets[merId].totalItems = -1;
            commonDataFactory.storedDataObj.allTrans.outlets[merId].firstTimeAt = "";
        }
        $scope.allTransList = commonDataFactory.storedDataObj.allTrans.outlets[merId].transList;
        $scope.allTransVariablesObj.totalItems = commonDataFactory.storedDataObj.allTrans.outlets[merId].totalItems;
        $scope.allTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.allTrans.outlets[merId].firstTimeAt;
        console.log(commonDataFactory.storedDataObj.allTrans.outlets[merId]);
        $scope.allTransVariablesObj.currentPage = pageNum;
        if($scope.allTransList[($scope.allTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.allTransVariablesObj.displayLoader = true;
            let outletGetAllTransObj = {
                page: pageNum - 1,
                trans_type: -1,
                outlId: merId
            }
            if($scope.allTransVariablesObj.totalItems === -1){
                outletGetAllTransObj.fetchTotTrans = 1;
            }
            if($scope.allTransVariablesObj.firstTimeAt !== ""){
                outletGetAllTransObj.firstTimeAt = $scope.allTransVariablesObj.firstTimeAt;
            }
            console.log(outletGetAllTransObj);
            apiCall.fetchTrans(outletGetAllTransObj, function(response){
                console.log("API call for allTrans of outlet.");
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.allTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.allTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch All Transactions Successful.");
                            if($scope.allTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.allTrans.outlets[merId].totalItems = $scope.allTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.allTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.allTrans.outlets[merId].firstTimeAt = $scope.allTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                // $scope.allTransVariablesObj.currentPage can be used since the if condition after the API call response ensures that the current response belongs to the latest API call.
                                $scope.allTransList[(($scope.allTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.allTransVariablesObj.currentPage);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().page == outletGetAllTransObj.page + 1){
                                $scope.currentPageAllTransList = $scope.allTransList.slice(($scope.allTransVariablesObj.currentPage - 1) * 5, (($scope.allTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPageAllTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPageAllTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.allTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.allTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.allTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPageAllTransList = $scope.allTransList.slice(($scope.allTransVariablesObj.currentPage - 1) * 5, (($scope.allTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPageAllTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPageAllTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls);
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().outlId !== undefined){
        let outlId = $location.search().outlId;
        let page = $location.search().page;
        $scope.outletGetAllTransFunc(outlId, page);
    }

    $scope.allTransVariablesObj.currentRow = "";

    $scope.allTransSelectTrans = function(transId){
        $scope.allTransVariablesObj.currentRow = transId;
    }

    $scope.allTransToggleRow = function(transId){
        if($location.search().transId === transId){
            $location.search("transId", null);
        }
        else{
            $location.search("transId", transId);
        }
    }

    if($location.search().transId !== undefined){
        console.log("transId found in URL.")
        $scope.allTransSelectTrans($location.search().transId);
    }

}]);


app.controller('pendingTransCtrl', ['$scope', '$location', '$window', '$rootScope', '$timeout', 'apiCall', 'commonDataFactory', 'commonFunctions', function($scope, $location, $window, $rootScope, $timeout, apiCall, commonDataFactory, commonFunctions){
    console.log("Inside pendingTransCtrl.");
    $scope.pendingTransList = [];
    $scope.currentPagePendingTransList = [];
    $scope.pendingTransVariablesObj = {};
    $scope.pendingTransVariablesObj.displayLoader = false;
    $scope.pendingTransVariablesObj.pageSize = 5;

    $scope.getPendingTransFunc = function(){
        console.log($location.search().pendingTransPage);
        $scope.pendingTransList = commonDataFactory.storedDataObj.pendingTrans.transList;
        $scope.pendingTransVariablesObj.totalItems = commonDataFactory.storedDataObj.pendingTrans.totalItems;
        $scope.pendingTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.pendingTrans.firstTimeAt;
        console.log($scope.pendingTransList);
        $scope.pendingTransVariablesObj.currentPage = $location.search().pendingTransPage;
        if($scope.pendingTransList[($scope.pendingTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.pendingTransVariablesObj.displayLoader = true;
            let getPendingTransObj = {
                page: $location.search().pendingTransPage - 1,
                trans_type: 0
            }
            if($scope.pendingTransVariablesObj.totalItems === -1){
                getPendingTransObj.fetchTotTrans = 1
            }
            if($scope.pendingTransVariablesObj.firstTimeAt !== ""){
                getPendingTransObj.firstTimeAt = $scope.pendingTransVariablesObj.firstTimeAt;
            }
            console.log(getPendingTransObj);

            apiCall.fetchTrans(getPendingTransObj, function(response){
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.pendingTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.pendingTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch Pending Transactions Successful.");
                            if($scope.pendingTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.pendingTrans.totalItems = $scope.pendingTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.pendingTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.pendingTrans.firstTimeAt = $scope.pendingTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                // to ensure all the amount values have two decimal places
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                $scope.pendingTransList[(($scope.pendingTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.pendingTransList);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().pendingTransPage == getPendingTransObj.page + 1){
                                $scope.currentPagePendingTransList = $scope.pendingTransList.slice(($scope.pendingTransVariablesObj.currentPage - 1) * 5, (($scope.pendingTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPagePendingTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPagePendingTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.pendingTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.pendingTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.pendingTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPagePendingTransList = $scope.pendingTransList.slice(($scope.pendingTransVariablesObj.currentPage - 1) * 5, (($scope.pendingTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPagePendingTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPagePendingTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls);
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().pendingTransPage !== undefined){
        $scope.getPendingTransFunc();
    }

    // pagination function
    $scope.pendingTransPageChanged = function(pageNum){
        console.log(pageNum);
        if($location.search().hasOwnProperty('pendingTransPage')){
            console.log("pendingTransPage changed");
            $location.search('pendingTransPage', pageNum);
        }
        else{
            console.log("outlet page changed.");
            $location.search('page', pageNum);
        }
    }

    $scope.outletGetPendingTransFunc = function(merId, pageNum){
        console.log(merId);
        console.log(pageNum);
        if(commonDataFactory.storedDataObj.pendingTrans.outlets[merId] === undefined){
            commonDataFactory.storedDataObj.pendingTrans.outlets[merId] = {};
            commonDataFactory.storedDataObj.pendingTrans.outlets[merId].transList = [];
            commonDataFactory.storedDataObj.pendingTrans.outlets[merId].totalItems = -1;
            commonDataFactory.storedDataObj.pendingTrans.outlets[merId].firstTimeAt = "";
        }
        $scope.pendingTransList = commonDataFactory.storedDataObj.pendingTrans.outlets[merId].transList;
        $scope.pendingTransVariablesObj.totalItems = commonDataFactory.storedDataObj.pendingTrans.outlets[merId].totalItems;
        $scope.pendingTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.pendingTrans.outlets[merId].firstTimeAt;
        console.log(commonDataFactory.storedDataObj.pendingTrans.outlets[merId]);
        $scope.pendingTransVariablesObj.currentPage = pageNum;
        if($scope.pendingTransList[($scope.pendingTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.pendingTransVariablesObj.displayLoader = true;
            let outletGetPendingTransObj = {
                page: pageNum - 1,
                trans_type: 0,
                outlId: merId
            }
            if($scope.pendingTransVariablesObj.totalItems === -1){
                outletGetPendingTransObj.fetchTotTrans = 1;
            }
            if($scope.pendingTransVariablesObj.firstTimeAt !== ""){
                outletGetPendingTransObj.firstTimeAt = $scope.pendingTransVariablesObj.firstTimeAt;
            }
            console.log(outletGetPendingTransObj);
            apiCall.fetchTrans(outletGetPendingTransObj, function(response){
                console.log("API call for pendingTrans of outlet.");
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.pendingTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.pendingTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch Pending Transactions Successful.");
                            if($scope.pendingTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.pendingTrans.outlets[merId].totalItems = $scope.pendingTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.pendingTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.pendingTrans.outlets[merId].firstTimeAt = $scope.pendingTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                // $scope.allTransVariablesObj.currentPage can be used since the if condition after the API call response ensures that the current response belongs to the latest API call.
                                $scope.pendingTransList[(($scope.pendingTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.pendingTransVariablesObj.currentPage);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().page == outletGetPendingTransObj.page + 1){
                                $scope.currentPagePendingTransList = $scope.pendingTransList.slice(($scope.pendingTransVariablesObj.currentPage - 1) * 5, (($scope.pendingTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPagePendingTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPagePendingTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.pendingTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.pendingTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.pendingTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPagePendingTransList = $scope.pendingTransList.slice(($scope.pendingTransVariablesObj.currentPage - 1) * 5, (($scope.pendingTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPagePendingTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPagePendingTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls);
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().outlId !== undefined){
        let outlId = $location.search().outlId;
        let page = $location.search().page;
        $scope.outletGetPendingTransFunc(outlId, page);
    }

    $scope.pendingTransVariablesObj.currentRow = "";

    $scope.pendingTransSelectTrans = function(transId){
        $scope.pendingTransVariablesObj.currentRow = transId;
    }

    $scope.pendingTransToggleRow = function(transId){
        if($location.search().transId === transId){
            $location.search("transId", null);
        }
        else{
            $location.search("transId", transId);
        }
    }

    if($location.search().transId !== undefined){
        console.log("transId found in URL.")
        $scope.pendingTransSelectTrans($location.search().transId);
    }

}]);


app.controller('settledTransCtrl', ['$scope', '$location', '$window', '$rootScope', '$timeout', 'apiCall', 'commonDataFactory', 'commonFunctions', function($scope, $location, $window, $rootScope, $timeout, apiCall, commonDataFactory, commonFunctions){
    console.log("Inside settledTransCtrl.");
    $scope.settledTransList = [];
    $scope.currentPageSettledTransList = [];
    $scope.settledTransVariablesObj = {};
    $scope.settledTransVariablesObj.displayLoader = false;
    $scope.settledTransVariablesObj.pageSize = 5;

    $scope.getSettledTransFunc = function(){
        console.log($location.search().settledTransPage);
        $scope.settledTransList = commonDataFactory.storedDataObj.settledTrans.transList;
        $scope.settledTransVariablesObj.totalItems = commonDataFactory.storedDataObj.settledTrans.totalItems;
        $scope.settledTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.settledTrans.firstTimeAt;
        console.log($scope.settledTransList);
        $scope.settledTransVariablesObj.currentPage = $location.search().settledTransPage;
        if($scope.settledTransList[($scope.settledTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.settledTransVariablesObj.displayLoader = true;
            let getSettledTransObj = {
                page: $location.search().settledTransPage - 1,
                trans_type: 1
            }
            if($scope.settledTransVariablesObj.totalItems === -1){
                getSettledTransObj.fetchTotTrans = 1
            }
            if($scope.settledTransVariablesObj.firstTimeAt !== ""){
                getSettledTransObj.firstTimeAt = $scope.settledTransVariablesObj.firstTimeAt;
            }
            console.log(getSettledTransObj);

            apiCall.fetchTrans(getSettledTransObj, function(response){
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.settledTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.settledTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch Settled Transactions Successful.");
                            if($scope.settledTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.settledTrans.totalItems = $scope.settledTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.settledTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.settledTrans.firstTimeAt = $scope.settledTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                // to ensure all the amount values have two decimal places
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                $scope.settledTransList[(($scope.settledTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.settledTransList);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().settledTransPage == getSettledTransObj.page + 1){
                                $scope.currentPageSettledTransList = $scope.settledTransList.slice(($scope.settledTransVariablesObj.currentPage - 1) * 5, (($scope.settledTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPageSettledTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPageSettledTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.settledTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.settledTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.settledTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPageSettledTransList = $scope.settledTransList.slice(($scope.settledTransVariablesObj.currentPage - 1) * 5, (($scope.settledTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPageSettledTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPageSettledTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls);
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().settledTransPage !== undefined){
        $scope.getSettledTransFunc();
    }

    // pagination function
    $scope.settledTransPageChanged = function(pageNum){
        console.log(pageNum);
        if($location.search().hasOwnProperty('settledTransPage')){
            console.log("settledTransPage changed");
            $location.search('settledTransPage', pageNum);
        }
        else{
            console.log("outlet page changed.");
            $location.search('page', pageNum);
        }
    }

    $scope.outletGetSettledTransFunc = function(merId, pageNum){
        console.log(merId);
        console.log(pageNum);
        if(commonDataFactory.storedDataObj.settledTrans.outlets[merId] === undefined){
            commonDataFactory.storedDataObj.settledTrans.outlets[merId] = {};
            commonDataFactory.storedDataObj.settledTrans.outlets[merId].transList = [];
            commonDataFactory.storedDataObj.settledTrans.outlets[merId].totalItems = -1;
            commonDataFactory.storedDataObj.settledTrans.outlets[merId].firstTimeAt = "";
        }
        $scope.settledTransList = commonDataFactory.storedDataObj.settledTrans.outlets[merId].transList;
        $scope.settledTransVariablesObj.totalItems = commonDataFactory.storedDataObj.settledTrans.outlets[merId].totalItems;
        $scope.settledTransVariablesObj.firstTimeAt = commonDataFactory.storedDataObj.settledTrans.outlets[merId].firstTimeAt;
        console.log(commonDataFactory.storedDataObj.settledTrans.outlets[merId]);
        $scope.settledTransVariablesObj.currentPage = pageNum;
        if($scope.settledTransList[($scope.settledTransVariablesObj.currentPage - 1) * 5] === undefined){
            $scope.settledTransVariablesObj.displayLoader = true;
            let outletGetSettledTransObj = {
                page: pageNum - 1,
                trans_type: 1,
                outlId: merId
            }
            if($scope.settledTransVariablesObj.totalItems === -1){
                outletGetSettledTransObj.fetchTotTrans = 1;
            }
            if($scope.settledTransVariablesObj.firstTimeAt !== ""){
                outletGetSettledTransObj.firstTimeAt = $scope.settledTransVariablesObj.firstTimeAt;
            }
            console.log(outletGetSettledTransObj);
            apiCall.fetchTrans(outletGetSettledTransObj, function(response){
                console.log("API call for settled Trans of outlet.");
                $timeout(function(){
                    if(response.status !== 200){
                        if(response.status === -1){
                            console.log("Internet Disconnected");
                            $scope.settledTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                        }
                        else{
                            $scope.settledTransVariablesObj.showErrorMsg = true;
                            document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                        console.log("Sorry, there was an error. Please try again.");
                    }
                    else{
                        if(response.data.success === 1){
                            console.log("Fetch Settled Transactions Successful.");
                            if($scope.settledTransVariablesObj.totalItems === -1){
                                commonDataFactory.storedDataObj.settledTrans.outlets[merId].totalItems = $scope.settledTransVariablesObj.totalItems = response.data.total_trans;
                            }
                            if($scope.settledTransVariablesObj.firstTimeAt === ""){
                                commonDataFactory.storedDataObj.settledTrans.outlets[merId].firstTimeAt = $scope.settledTransVariablesObj.firstTimeAt = response.data.firstTimeAt;
                            }
                            for(let i = 0; i < response.data.transactions.length; i++){
                                response.data.transactions[i].amount = parseFloat(response.data.transactions[i].amount).toFixed(2);
                                response.data.transactions[i].disc = parseFloat(response.data.transactions[i].disc).toFixed(2);
                                let amount = new Big(response.data.transactions[i].amount);
                                let discount = new Big(response.data.transactions[i].disc);
                                response.data.transactions[i].totalBillAmount = amount.plus(discount).round(2).toFixed(2);
                                // $scope.allTransVariablesObj.currentPage can be used since the if condition after the API call response ensures that the current response belongs to the latest API call.
                                $scope.settledTransList[(($scope.settledTransVariablesObj.currentPage - 1) * 5) + i] = response.data.transactions[i];
                            }
                            console.log($scope.settledTransVariablesObj.currentPage);
                            // Do not equate with three '=' signs coz the $location.search() value is a string.
                            if($location.search().page == outletGetSettledTransObj.page + 1){
                                $scope.currentPageSettledTransList = $scope.settledTransList.slice(($scope.settledTransVariablesObj.currentPage - 1) * 5, (($scope.settledTransVariablesObj.currentPage - 1) * 5) + 5);
                                console.log($scope.currentPageSettledTransList);
                                let showTransDetls = commonFunctions.openTransDialog($scope.currentPageSettledTransList);
                                if(showTransDetls !== false){
                                    $scope.$emit("openTransDialog", showTransDetls);
                                }
                                else{
                                    if($location.search().transDialog !== undefined){
                                        $location.search('transDialog', null);
                                    }
                                }
                            }
                        }
                        else{
                            if(response.data.success === -1){
                                console.log("You have no payments.");
                                $scope.settledTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "You have no payments.";
                            }
                            else{
                                $scope.settledTransVariablesObj.showErrorMsg = true;
                                document.getElementById('errMsg').innerHTML = "Sorry, there was an error. Please try again.";
                            }
                            console.log("Error: " + response.data.message);
                        }
                    }
                    $scope.settledTransVariablesObj.displayLoader = false;
                }, 500);
            });
        }
        else{
            console.log("Data already present.");
            $scope.currentPageSettledTransList = $scope.settledTransList.slice(($scope.settledTransVariablesObj.currentPage - 1) * 5, (($scope.settledTransVariablesObj.currentPage - 1) * 5) + 5);
            console.log($scope.currentPageSettledTransList);
            let showTransDetls = commonFunctions.openTransDialog($scope.currentPageSettledTransList);
            if(showTransDetls !== false){
                $scope.$emit("openTransDialog", showTransDetls);
            }
            else{
                if($location.search().transDialog !== undefined){
                    $location.search('transDialog', null);
                }
            }
        }
    }

    if($location.search().outlId !== undefined){
        let outlId = $location.search().outlId;
        let page = $location.search().page;
        $scope.outletGetSettledTransFunc(outlId, page);
    }

    $scope.settledTransVariablesObj.currentRow = "";

    $scope.settledTransSelectTrans = function(transId){
        $scope.settledTransVariablesObj.currentRow = transId;
    }

    $scope.settledTransToggleRow = function(transId){
        if($location.search().transId === transId){
            $location.search("transId", null);
        }
        else{
            $location.search("transId", transId);
        }
    }

    if($location.search().transId !== undefined){
        console.log("transId found in URL.")
        $scope.settledTransSelectTrans($location.search().transId);
    }

}]);



























